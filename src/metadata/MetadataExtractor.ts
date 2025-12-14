import { App, CachedMetadata, TFile } from "obsidian";
import { NoteMetadata } from "../types";

export class MetadataExtractor {
  private app: App;

  constructor(app: App) {
    this.app = app;
  }

  extract(file: TFile): NoteMetadata {
    const cache = this.app.metadataCache.getFileCache(file);

    return {
      frontmatter: this.extractFrontmatter(cache),
      tags: this.extractTags(cache),
      createdDate: file.stat.ctime,
      modifiedDate: file.stat.mtime,
      outgoingLinks: this.extractOutgoingLinks(cache),
      incomingLinks: this.extractIncomingLinks(file),
    };
  }

  private extractFrontmatter(
    cache: CachedMetadata | null
  ): Record<string, unknown> | null {
    if (!cache?.frontmatter) return null;

    // Clone and remove position metadata
    const fm = { ...cache.frontmatter };
    delete (fm as Record<string, unknown>).position;
    return fm;
  }

  private extractTags(cache: CachedMetadata | null): string[] {
    const tags: string[] = [];

    // Frontmatter tags
    if (cache?.frontmatter?.tags) {
      const fmTags = cache.frontmatter.tags;
      if (Array.isArray(fmTags)) {
        tags.push(...fmTags.map((t: string) => String(t)));
      } else if (typeof fmTags === "string") {
        tags.push(fmTags);
      }
    }

    // Inline tags
    if (cache?.tags) {
      tags.push(...cache.tags.map((t) => t.tag.replace("#", "")));
    }

    return [...new Set(tags)]; // Deduplicate
  }

  private extractOutgoingLinks(cache: CachedMetadata | null): string[] {
    if (!cache?.links) return [];
    return cache.links.map((link) => link.link);
  }

  private extractIncomingLinks(file: TFile): string[] {
    // Get backlinks using metadataCache
    const backlinks = (
      this.app.metadataCache as unknown as {
        getBacklinksForFile: (
          file: TFile
        ) => { data: Record<string, unknown> } | null;
      }
    ).getBacklinksForFile(file);

    if (!backlinks?.data) return [];
    return Object.keys(backlinks.data);
  }
}
