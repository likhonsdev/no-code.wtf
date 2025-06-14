import { Artifact } from "@/components/create-artifact";
import { toast } from "sonner";

interface CustomArtifactMetadata {
  info: string;
}

export const customArtifact = new Artifact<"custom", CustomArtifactMetadata>({
  kind: "custom",
  description: "A custom artifact for demonstrating custom functionality.",
  
  initialize: async ({ documentId, setMetadata }) => {
    setMetadata({
      info: `Document ${documentId} initialized.`,
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
      return <div>Loading custom artifact...</div>;
    }

    if (mode === "diff") {
      const oldContent = getDocumentContentById(currentVersionIndex - 1);
      const newContent = getDocumentContentById(currentVersionIndex);
      return (
        <div>
          <h3>Diff View</h3>
          <pre>{oldContent}</pre>
          <pre>{newContent}</pre>
        </div>
      );
    }

    return (
      <div className="custom-artifact">
        <div>
          <textarea
            className="w-full h-64 p-2 border rounded"
            value={content}
            onChange={(e) => onSaveContent(e.target.value)}
            disabled={!isCurrentVersion}
          />
        </div>
        <button
          className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          onClick={() => {
            navigator.clipboard.writeText(content);
            toast.success("Content copied to clipboard!");
          }}
        >
          Copy
        </button>
      </div>
    );
  },

  actions: [
    {
      icon: <span>⟳</span>,
      description: "Refresh artifact info",
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: "user",
          content: "Please refresh the info for my custom artifact.",
        });
      },
    },
  ],

  toolbar: [
    {
      icon: <span>✎</span>,
      description: "Edit custom artifact",
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: "user",
          content: "Edit the custom artifact content.",
        });
      },
    },
  ],
});
