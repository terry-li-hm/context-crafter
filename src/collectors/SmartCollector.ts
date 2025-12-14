import { TFile } from "obsidian";
import { BaseCollector } from "./BaseCollector";
import { CollectionResult, NoteMetadata } from "../types";
import { SimilarityCalculator } from "../utils/similarity";

interface ScoredFile {
  file: TFile;
  score: number;
}

export class SmartCollector extends BaseCollector {
  private similarityCalculator: SimilarityCalculator;

  async collect(): Promise<CollectionResult> {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      throw new Error("No active file open");
    }

    this.similarityCalculator = new SimilarityCalculator();

    const activeContent = await this.app.vault.cachedRead(activeFile);
    const activeMeta = this.metadataExtractor.extract(activeFile);

    // Get all markdown files except active and excluded
    const candidates = this.app.vault.getMarkdownFiles().filter(
      (f) => f.path !== activeFile.path && !this.isExcluded(f)
    );

    // Calculate similarity scores
    const scored: ScoredFile[] = await Promise.all(
      candidates.map(async (file) => {
        const content = await this.app.vault.cachedRead(file);
        const meta = this.metadataExtractor.extract(file);

        const score = this.calculateRelevanceScore(
          activeContent,
          activeMeta,
          content,
          meta
        );

        return { file, score };
      })
    );

    // Filter by threshold and limit results
    const relevant = scored
      .filter((s) => s.score >= this.settings.similarityThreshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.settings.maxSmartResults);

    // Build results (active file first, then similar)
    const results = [
      await this.buildNoteContext(activeFile, 0, "root"),
      ...(await Promise.all(
        relevant.map(({ file }) => this.buildNoteContext(file, 1, "smart"))
      )),
    ];

    return this.buildResult(results);
  }

  private calculateRelevanceScore(
    content1: string,
    meta1: NoteMetadata,
    content2: string,
    meta2: NoteMetadata
  ): number {
    // Weighted scoring:
    // 40% - Shared tags
    // 30% - Content similarity (keyword overlap)
    // 20% - Link relationship
    // 10% - Temporal proximity

    const tagScore = this.similarityCalculator.calculateTagOverlap(
      meta1.tags,
      meta2.tags
    );
    const contentScore = this.similarityCalculator.calculate(content1, content2);
    const linkScore = this.calculateLinkRelationship(meta1, meta2);
    const timeScore = this.calculateTemporalProximity(meta1, meta2);

    return (
      tagScore * 0.4 + contentScore * 0.3 + linkScore * 0.2 + timeScore * 0.1
    );
  }

  private calculateLinkRelationship(
    meta1: NoteMetadata,
    meta2: NoteMetadata
  ): number {
    // Check if either file links to the other
    const file1LinksToFile2 = meta1.outgoingLinks.some((link) =>
      meta2.incomingLinks.some((incoming) => incoming.includes(link))
    );
    const file2LinksToFile1 = meta2.outgoingLinks.some((link) =>
      meta1.incomingLinks.some((incoming) => incoming.includes(link))
    );

    if (file1LinksToFile2 && file2LinksToFile1) return 1.0; // Bidirectional
    if (file1LinksToFile2 || file2LinksToFile1) return 0.5; // Unidirectional
    return 0;
  }

  private calculateTemporalProximity(
    meta1: NoteMetadata,
    meta2: NoteMetadata
  ): number {
    const timeDiff = Math.abs(meta1.modifiedDate - meta2.modifiedDate);
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    // Score decreases as time difference increases
    // 0 days = 1.0, 7 days = 0.5, 30+ days = ~0
    return Math.max(0, 1 - daysDiff / 30);
  }
}
