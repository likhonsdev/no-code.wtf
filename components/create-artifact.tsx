import { ReactNode } from "react";

interface ArtifactBase<K extends string, M = any> {
  kind: K;
  description: string;
  initialize?: (params: {
    documentId: string;
    setMetadata: (metadata: M) => void;
  }) => Promise<void>;
  onStreamPart?: (params: {
    streamPart: { type: string; content: unknown };
    setMetadata: (updater: (metadata: M) => M) => void;
    setArtifact: (updater: (artifact: any) => any) => void;
  }) => void;
  content: (params: {
    mode: "view" | "diff";
    status: "ready" | "streaming";
    content: string;
    isCurrentVersion: boolean;
    currentVersionIndex: number;
    onSaveContent: (content: string) => void;
    getDocumentContentById: (id: number) => string | undefined;
    isLoading: boolean;
    metadata: M;
  }) => ReactNode;
  actions?: Array<{
    icon: ReactNode;
    description: string;
    onClick: (params: { appendMessage: (message: any) => void }) => void;
  }>;
  toolbar?: Array<{
    icon: ReactNode;
    description: string;
    onClick: (params: { appendMessage: (message: any) => void }) => void;
  }>;
}

export class Artifact<K extends string, M = any> implements ArtifactBase<K, M> {
  kind: K;
  description: string;
  initialize?: (params: { documentId: string; setMetadata: (metadata: M) => void }) => Promise<void>;
  onStreamPart?: (params: {
    streamPart: { type: string; content: unknown };
    setMetadata: (updater: (metadata: M) => M) => void;
    setArtifact: (updater: (artifact: any) => any) => void;
  }) => void;
  content: (params: {
    mode: "view" | "diff";
    status: "ready" | "streaming";
    content: string;
    isCurrentVersion: boolean;
    currentVersionIndex: number;
    onSaveContent: (content: string) => void;
    getDocumentContentById: (id: number) => string | undefined;
    isLoading: boolean;
    metadata: M;
  }) => ReactNode;
  actions?: Array<{
    icon: ReactNode;
    description: string;
    onClick: (params: { appendMessage: (message: any) => void }) => void;
  }>;
  toolbar?: Array<{
    icon: ReactNode;
    description: string;
    onClick: (params: { appendMessage: (message: any) => void }) => void;
  }>;

  constructor(config: ArtifactBase<K, M>) {
    this.kind = config.kind;
    this.description = config.description;
    this.initialize = config.initialize;
    this.onStreamPart = config.onStreamPart;
    this.content = config.content;
    this.actions = config.actions;
    this.toolbar = config.toolbar;
  }
}
