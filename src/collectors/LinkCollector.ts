import { App, TFile } from "obsidian";
import {
  CollectionResult,
  CollectionStats,
  ContextCrafterSettings,
  NoteContext,
  RelationshipType,
} from "../types";
import { MetadataExtractor } from "../metadata/MetadataExtractor";
import { LinkResolver } from "../metadata/LinkResolver";

interface QueueItem {
  file: TFile;
  depth: number;
  type: RelationshipType;
}

// Safety limits
const MAX_NODES = 500;
const MAX_DEPTH = 3;

export class LinkCollector {
  private app: App;
  private settings: ContextCrafterSettings;
  private metadataExtractor: MetadataExtractor;
  private linkResolver: LinkResolver;

  constructor(app: App, settings: ContextCrafterSettings) {
    this.app = app;
    this.settings = settings;
    this.metadataExtractor = new MetadataExtractor(app);
    this.linkResolver = new LinkResolver(app);
  }

  async collect(): Promise<CollectionResult> {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      throw new Error("No active file open");
    }

    // Clamp depth to safe range
    const maxDepth = Math.min(Math.max(1, this.settings.linkDepth), MAX_DEPTH);

    const visited = new Set<string>();
    const queue: QueueItem[] = [];
    const results: NoteContext[] = [];

    // Start with current note
    queue.push({ file: activeFile, depth: 0, type: "root" });
    let truncated = false;

    while (queue.length > 0) {
      // Safety cap to prevent runaway collection in dense vaults
      if (results.length >= MAX_NODES) {
        console.warn(`Context Crafter: Hit max node limit (${MAX_NODES}), stopping collection`);
        truncated = true;
        break;
      }

      const { file, depth, type } = queue.shift()!;

      // Skip non-markdown files (images, PDFs, etc.)
      if (!this.isMarkdown(file)) {
        continue;
      }

      // Skip if already visited or excluded
      if (visited.has(file.path) || this.isExcluded(file)) {
        continue;
      }

      // Skip if beyond max depth (but still process root)
      if (depth > maxDepth) {
        continue;
      }

      visited.add(file.path);
      results.push(await this.buildNoteContext(file, depth, type));

      // Only traverse links if not at max depth
      if (depth < maxDepth) {
        // Add forward links
        if (this.settings.includeForwardLinks) {
          const forwardLinks = this.linkResolver.getForwardLinks(file);
          for (const linkedFile of forwardLinks) {
            if (!visited.has(linkedFile.path)) {
              queue.push({
                file: linkedFile,
                depth: depth + 1,
                type: "forward-link",
              });
            }
          }
        }

        // Add backlinks
        if (this.settings.includeBacklinks) {
          const backlinks = this.linkResolver.getBacklinks(file);
          for (const linkedFile of backlinks) {
            if (!visited.has(linkedFile.path)) {
              queue.push({
                file: linkedFile,
                depth: depth + 1,
                type: "backlink",
              });
            }
          }
        }
      }
    }

    return this.buildResult(results, truncated);
  }

  private async buildNoteContext(
    file: TFile,
    depth: number,
    relationshipType: RelationshipType
  ): Promise<NoteContext> {
    const content = await this.app.vault.cachedRead(file);
    const metadata = this.metadataExtractor.extract(file);
    return { file, content, metadata, depth, relationshipType };
  }

  private isMarkdown(file: TFile): boolean {
    return file.extension === "md";
  }

  private isExcluded(file: TFile): boolean {
    const fileFolders = file.path.split("/").slice(0, -1);
    return this.settings.excludeFolders.some((folder) => {
      const trimmed = folder.trim();
      return trimmed && fileFolders.includes(trimmed);
    });
  }

  private buildResult(notes: NoteContext[], truncated: boolean): CollectionResult {
    const stats = this.calculateStats(notes);
    return { notes, stats, truncated };
  }

  private calculateStats(notes: NoteContext[]): CollectionStats {
    const depthDistribution: Record<number, number> = {};
    let totalChars = 0;

    for (const note of notes) {
      depthDistribution[note.depth] = (depthDistribution[note.depth] || 0) + 1;
      totalChars += note.content.length;
    }

    return {
      totalNotes: notes.length,
      totalTokensEstimate: Math.ceil(totalChars / 4),
      depthDistribution,
    };
  }
}
