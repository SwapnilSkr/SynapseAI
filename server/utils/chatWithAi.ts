import { PromptTemplate } from "@langchain/core/prompts";
import { llm } from "./keys";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { combineDocs } from "./helpers";

const formatConvoHistory = (chats: any) => {
  return chats
    .map(
      (chat: any) =>
        `Human: ${chat.human || "No message"}\nAI: ${chat.ai || "No response"}`
    )
    .join("\n\n");
};

const translationQuestionTemplate = `Given a conversation history (if any) and a question, translate the following question into English if it is in Japanese, otherwise correct its punctuation. 
  question : {question}
  translatedQuestion : 
  `;

const compactQuestionTemplate = `Convert the following question into a compact format. 
  question : {translatedQuestion} 
  compactedQuestion :
  `;

const answerTemplateWithVector = `
 You are a friendly and enthusiastic AI agent who responds politely to both questions and casual conversation. 

 If the user doesn't ask a question, provide a friendly, engaging response to keep the conversation going.

 If the user asks a question, try to find the answer from the provided context, conversation history, or the chat file provided by the user. When interpreting the user's instructions, if there are spelling or phrasing mistakes, try to understand the intended meaning based on the context, conversation history, or chat file. If the information isn’t available or the user's intent is unclear, politely say: "I don't have that information right now."

 Always ensure that your responses are helpful, positive, and maintain a warm tone.

 Answer accordingly to the context, user instructions (adjusting for any possible spelling mistakes), question, and conversation history (if any), and also introduce yourself as the name given to you if you haven't already in the conversation history as mentioned below.

 Your name: {agentName}  
 Context: {context}  
 User instructions (interpreted): {userInstructions}  
 Chat file: {chatFile}  
 Conversation history: {convo_history}  
 Question: {transQuestion}  
 Answer:

  `;

const answerTemplateWithoutVector = `
 You are a friendly and enthusiastic AI agent who responds politely to both questions and casual conversation. 

 If the user doesn't ask a question, provide a friendly, engaging response to keep the conversation going.

 If the user asks a question, try to find the answer from the conversation history or the chat file provided by the user. When interpreting the user's instructions, if there are spelling or phrasing mistakes, try to understand the intended meaning based on the conversation history or chat file. If the information isn’t available or the user's intent is unclear, politely say: "I don't have that information right now."

 Always ensure that your responses are helpful, positive, and maintain a warm tone.

 Answer accordingly to the user instructions (adjusting for any possible spelling mistakes), question, and conversation history (if any), and also introduce yourself as the name given to you if you haven't already in the conversation history as mentioned below.

 Your name: {agentName}  
 User instructions (interpreted): {userInstructions}  
 Chat file: {chatFile}  
 Conversation history: {convo_history}  
 Question: {transQuestion}  
 Answer:

  `;

const languageDetectorTemplate = ` Detect the language of the question given below (English or Japanese).
  question : {question}
  language : 
  `;

const translatedAnswerTemplate = `
  If the language mentioned below is Japanese, translate the answer into Japanese, but do not translate your own name ({agentName}), whether it appears in English or Japanese. 
  If the language mentioned below is English, just output the answer as it is without any translation at all

  Your name: {agentName}
  Language: {language}
  answer : {answer}
  Translated Answer: 
`;

const translationChain = PromptTemplate.fromTemplate(
  translationQuestionTemplate
)
  .pipe(llm)
  .pipe(new StringOutputParser());

const compactChain = PromptTemplate.fromTemplate(compactQuestionTemplate)
  .pipe(llm)
  .pipe(new StringOutputParser());

const answerChainWithVector = PromptTemplate.fromTemplate(
  answerTemplateWithVector
)
  .pipe(llm)
  .pipe(new StringOutputParser());

const answerChainWithoutVector = PromptTemplate.fromTemplate(
  answerTemplateWithoutVector
)
  .pipe(llm)
  .pipe(new StringOutputParser());

const languageDetectorChain = PromptTemplate.fromTemplate(
  languageDetectorTemplate
)
  .pipe(llm)
  .pipe(new StringOutputParser());

const translatedAnswerChain = PromptTemplate.fromTemplate(
  translatedAnswerTemplate
)
  .pipe(llm)
  .pipe(new StringOutputParser());

export const chatWithAIWithVectorRetrieval = async (
  text: string,
  agentName: string,
  retriever: VectorStoreRetriever<SupabaseVectorStore>,
  context: string,
  prevChats: {
    human?: string;
    ai?: string;
  }[],
  chatFileData?: string[]
) => {
  const retrieverChain = RunnableSequence.from([
    (prevRes) => prevRes.compactQuestion,
    retriever,
    combineDocs,
  ]);

  const chain = RunnableSequence.from([
    {
      translatedQuestion: translationChain,
      originalQuestionLang: new RunnablePassthrough(),
    },
    {
      compactQuestion: compactChain,
      compactInput: new RunnablePassthrough(),
    },
    {
      agentName: ({ compactInput }) =>
        compactInput?.originalQuestionLang?.agentName,
      context: retrieverChain,
      userInstructions: ({ compactInput }) =>
        compactInput?.originalQuestionLang?.userInstructions,
      chatFile: () => chatFileData,
      convo_history: () => {
        return formatConvoHistory(prevChats);
      },
      transQuestion: ({ compactInput }) => compactInput?.translatedQuestion,
    },
    {
      answer: answerChainWithVector,
      retrieverOutput: new RunnablePassthrough(),
    },
    {
      question: () => text,
      answerOutput: new RunnablePassthrough(),
    },
    {
      agentName: ({ answerOutput }) => answerOutput?.retrieverOutput?.agentName,
      language: languageDetectorChain,
      answer: ({ answerOutput }) => answerOutput?.answer,
    },
    translatedAnswerChain,
  ]);

  const response = await chain.invoke({
    question: text,
    userInstructions: context,
    convo_history: formatConvoHistory(prevChats),
    agentName,
  });

  return response;
};

export const chatWithAiWithOutVectorRetrieval = async (
  text: string,
  agentName: string,
  context: string,
  prevChats: {
    human?: string;
    ai?: string;
  }[],
  chatFileData?: string[]
) => {
  const chain = RunnableSequence.from([
    {
      translatedQuestion: translationChain,
      originalQuestionLang: new RunnablePassthrough(),
    },
    {
      compactQuestion: compactChain,
      compactInput: new RunnablePassthrough(),
    },
    {
      agentName: ({ compactInput }) =>
        compactInput?.originalQuestionLang?.agentName,
      userInstructions: ({ compactInput }) =>
        compactInput?.originalQuestionLang?.userInstructions,
      chatFile: () => chatFileData,
      convo_history: () => {
        return formatConvoHistory(prevChats);
      },
      transQuestion: ({ compactInput }) => compactInput?.translatedQuestion,
    },
    {
      answer: answerChainWithoutVector,
      retrieverOutput: new RunnablePassthrough(),
    },
    {
      question: () => text,
      answerOutput: new RunnablePassthrough(),
    },
    {
      agentName: ({ answerOutput }) => answerOutput?.retrieverOutput?.agentName,
      language: languageDetectorChain,
      answer: ({ answerOutput }) => answerOutput?.answer,
    },
    translatedAnswerChain,
  ]);

  const response = await chain.invoke({
    question: text,
    userInstructions: context,
    convo_history: formatConvoHistory(prevChats),
    agentName,
  });

  return response;
};
