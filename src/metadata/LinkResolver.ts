import { App, TFile } from "obsidian";

export class LinkResolver {
  private app: App;

  constructor(app: App) {
    this.app = app;
  }

  getForwardLinks(file: TFile): TFile[] {
    const cache = this.app.metadataCache.getFileCache(file);
    if (!cache?.links) return [];

    const linkedFiles: TFile[] = [];
    for (const link of cache.links) {
      const linkedFile = this.app.metadataCache.getFirstLinkpathDest(
        link.link,
        file.path
      );
      if (linkedFile instanceof TFile) {
        linkedFiles.push(linkedFile);
      }
    }

    return linkedFiles;
  }

  getBacklinks(file: TFile): TFile[] {
    // Get backlinks using metadataCache
    const backlinks = (
      this.app.metadataCache as unknown as {
        getBacklinksForFile: (
          file: TFile
        ) => { data: Record<string, unknown> } | null;
      }
    ).getBacklinksForFile(file);

    if (!backlinks?.data) return [];

    const linkedFiles: TFile[] = [];
    for (const path of Object.keys(backlinks.data)) {
      const linkedFile = this.app.vault.getAbstractFileByPath(path);
      if (linkedFile instanceof TFile) {
        linkedFiles.push(linkedFile);
      }
    }

    return linkedFiles;
  }
}
