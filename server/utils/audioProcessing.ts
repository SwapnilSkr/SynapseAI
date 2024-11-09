import { AssemblyAI } from "assemblyai";
import { AssemblyAIKey } from "./keys";

const client = new AssemblyAI({
  apiKey: AssemblyAIKey,
});

export const audioTranscription = async (filePath: string) => {
  const FILE_URL = filePath;
  const data = {
    audio: FILE_URL,
  };
  const transcript = await client.transcripts.transcribe(data);
  return transcript.text;
};
