import { PromptTemplate } from "@langchain/core/prompts";
import { llm } from "./keys";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const voiceSummary = async (transcribedText: string) => {
  const chatNameTemplate = `Provide a clean summary of the transcribed text generated from an audio. 
  transcribed text : {transcribedText}
  cleaned summary : 
  `;

  const chatNameChain = PromptTemplate.fromTemplate(chatNameTemplate)
    .pipe(llm)
    .pipe(new StringOutputParser());

  const response = await chatNameChain.invoke({
    transcribedText,
  });

  return response;
};
