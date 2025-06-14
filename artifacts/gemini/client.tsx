import { Artifact } from "@/components/create-artifact";
import { toast } from "sonner";

interface GeminiArtifactMetadata {
  info: string;
}

export const geminiArtifact = new Artifact<"gemini", GeminiArtifactMetadata>({
  kind: "gemini",
  description: "Work with Gemini AI to generate creative and helpful content",
  initialize: async ({ documentId, setMetadata }) => {
    setMetadata({
      info: `Document ${documentId} initialized with Gemini AI`,
    });
  },
  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    if (streamPart.type === "info-update") {
      setMetadata((metadata) => ({
        ...metadata,
        info: streamPart.content as string,
      }));
    }
    if (streamPart.type === "content-update") {
      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: draftArtifact.content + (streamPart.content as string),
        status: "streaming",
      }));
    }
  },
  content: ({
    mode,
    status,
    content,
    isCurrentVersion,
    currentVersionIndex,
    onSaveContent,
    getDocumentContentById,
    isLoading,
    metadata,
  }) => {
    if (isLoading) {
      return <div>Loading Gemini AI response...</div>;
    }

    if (mode === "diff") {
      const oldContent = getDocumentContentById(currentVersionIndex - 1);
      const newContent = getDocumentContentById(currentVersionIndex);
      return (
        <div>
          <h3>Changes in Response</h3>
          <pre className="whitespace-pre-wrap">{oldContent}</pre>
          <pre className="whitespace-pre-wrap">{newContent}</pre>
        </div>
      );
    }

    return (
      <div className="gemini-artifact">
        <div className="prose dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => {
            navigator.clipboard.writeText(content);
            toast.success("Content copied to clipboard!");
          }}
        >
          Copy Response
        </button>
      </div>
    );
  },
  actions: [
    {
      icon: <span>⟳</span>,
      description: "Regenerate response",
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: "user",
          content: "Please regenerate the response.",
        });
      },
    },
  ],
});
