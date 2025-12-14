import { TFile } from "obsidian";
import { BaseCollector } from "./BaseCollector";
import { CollectionResult, NoteContext, RelationshipType } from "../types";

interface QueueItem {
  file: TFile;
  depth: number;
  type: RelationshipType;
}

export class LinkCollector extends BaseCollector {
  async collect(): Promise<CollectionResult> {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      throw new Error("No active file open");
    }

    const visited = new Set<string>();
    const queue: QueueItem[] = [];
    const results: NoteContext[] = [];

    // Start with current note
    queue.push({ file: activeFile, depth: 0, type: "root" });

    while (queue.length > 0) {
      const { file, depth, type } = queue.shift()!;

      // Skip if already visited or excluded
      if (visited.has(file.path) || this.isExcluded(file)) {
        continue;
      }

      // Skip if beyond max depth (but still process root)
      if (depth > this.settings.linkDepth) {
        continue;
      }

      visited.add(file.path);
      results.push(await this.buildNoteContext(file, depth, type));

      // Only traverse links if not at max depth
      if (depth < this.settings.linkDepth) {
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

    return this.buildResult(results);
  }
}
