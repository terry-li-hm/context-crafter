import { TFile } from "obsidian";

export interface ContextCrafterSettings {
  // Collection settings
  linkDepth: number;
  includeBacklinks: boolean;
  includeForwardLinks: boolean;

  // Metadata settings
  includeFrontmatter: boolean;
  includeTags: boolean;
  includeCreatedDate: boolean;
  includeModifiedDate: boolean;
  includeLinkContext: boolean;

  // Output settings
  includeFilePaths: boolean;
  excludeFolders: string[];

  // Per-note saved exclusions (notePath -> excluded note paths)
  savedExclusions: Record<string, string[]>;
}

export interface NoteMetadata {
  frontmatter: Record<string, unknown> | null;
  tags: string[];
  createdDate: number | null;
  modifiedDate: number;
  outgoingLinks: string[];
  incomingLinks: string[];
}

export type RelationshipType =
  | "root"
  | "forward-link"
  | "backlink";

export interface NoteContext {
  file: TFile;
  content: string;
  metadata: NoteMetadata;
  depth: number;
  relationshipType: RelationshipType;
}

export interface CollectionResult {
  notes: NoteContext[];
  stats: CollectionStats;
}

export interface CollectionStats {
  totalNotes: number;
  totalTokensEstimate: number;
  depthDistribution: Record<number, number>;
}
