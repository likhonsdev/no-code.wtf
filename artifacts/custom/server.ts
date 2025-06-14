import { smoothStream, streamText } from "ai";
import { createDocumentHandler } from "@/lib/artifacts/server";
import { updateDocumentPrompt } from "@/lib/ai/prompts";

export const customDocumentHandler = createDocumentHandler<"custom">({
  kind: "custom",
  
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";
    const { fullStream } = streamText({
      model: "gemini-2.5-flash-preview-04-17",
      system:
        "Generate a creative piece based on the title. Markdown is supported.",
      experimental_transform: smoothStream({ chunking: "word" }),
      prompt: title,
    });

    for await (const delta of fullStream) {
      if (delta.type === "text-delta") {
        draftContent += delta.textDelta;
        dataStream.writeData({
          type: "content-update",
          content: delta.textDelta,
        });
      }
    }

    return draftContent;
  },

  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = "";
    const { fullStream } = streamText({
      model: "gemini-2.5-flash-preview-04-17",
      system: updateDocumentPrompt(document.content, "custom"),
      experimental_transform: smoothStream({ chunking: "word" }),
      prompt: description,
      experimental_providerMetadata: {
        prediction: {
          type: "content",
          content: document.content,
        },
      },
    });

    for await (const delta of fullStream) {
      if (delta.type === "text-delta") {
        draftContent += delta.textDelta;
        dataStream.writeData({
          type: "content-update",
          content: delta.textDelta,
        });
      }
    }

    return draftContent;
  },
});
