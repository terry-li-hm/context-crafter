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

export abstract class BaseCollector {
  protected app: App;
  protected settings: ContextCrafterSettings;
  protected metadataExtractor: MetadataExtractor;
  protected linkResolver: LinkResolver;

  constructor(app: App, settings: ContextCrafterSettings) {
    this.app = app;
    this.settings = settings;
    this.metadataExtractor = new MetadataExtractor(app);
    this.linkResolver = new LinkResolver(app);
  }

  abstract collect(): Promise<CollectionResult>;

  protected async buildNoteContext(
    file: TFile,
    depth: number,
    relationshipType: RelationshipType
  ): Promise<NoteContext> {
    const content = await this.app.vault.cachedRead(file);
    const metadata = this.metadataExtractor.extract(file);
    return { file, content, metadata, depth, relationshipType };
  }

  protected isExcluded(file: TFile): boolean {
    return this.settings.excludeFolders.some((folder) =>
      file.path.startsWith(folder)
    );
  }

  protected buildResult(notes: NoteContext[]): CollectionResult {
    const stats = this.calculateStats(notes);
    return { notes, stats };
  }

  protected calculateStats(notes: NoteContext[]): CollectionStats {
    const depthDistribution: Record<number, number> = {};
    let totalChars = 0;

    for (const note of notes) {
      depthDistribution[note.depth] = (depthDistribution[note.depth] || 0) + 1;
      totalChars += note.content.length;
    }

    return {
      totalNotes: notes.length,
      totalTokensEstimate: Math.ceil(totalChars / 4), // ~4 chars per token
      depthDistribution,
    };
  }
}
