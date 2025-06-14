import { customDocumentHandler } from "@/artifacts/custom/server";
import { geminiDocumentHandler } from "@/artifacts/gemini/server";

export const documentHandlersByArtifactKind = [
  customDocumentHandler,
  geminiDocumentHandler,
] as const;

export const artifactKinds = ["custom", "gemini"] as const;

export const createDocumentHandler = <K extends string>(config: {
  kind: K;
  onCreateDocument: (params: {
    title: string;
    dataStream: {
      writeData: (data: { type: string; content: any }) => void;
    };
  }) => Promise<string>;
  onUpdateDocument: (params: {
    document: { content: string };
    description: string;
    dataStream: {
      writeData: (data: { type: string; content: any }) => void;
    };
  }) => Promise<string>;
}) => config;
