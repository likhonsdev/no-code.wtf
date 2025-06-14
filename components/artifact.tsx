import { Artifact } from "@/components/create-artifact";
import { customArtifact } from "@/artifacts/custom/client";
import { geminiArtifact } from "@/artifacts/gemini/client";

export const artifactDefinitions = [
  customArtifact,
  geminiArtifact,
] as const;

export type ArtifactKind = typeof artifactDefinitions[number]["kind"];
