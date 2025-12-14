import { ContextCrafterSettings } from "./types";

export const DEFAULT_SETTINGS: ContextCrafterSettings = {
  // Collection settings
  linkDepth: 3,
  includeBacklinks: true,
  includeForwardLinks: true,

  // Metadata settings
  includeFrontmatter: true,
  includeTags: true,
  includeCreatedDate: true,
  includeModifiedDate: true,
  includeLinkContext: false,

  // Smart mode settings
  similarityThreshold: 0.5,
  maxSmartResults: 10,

  // Output settings
  includeFilePaths: true,
  excludeFolders: [],

  // Per-note saved exclusions
  savedExclusions: {},
};
