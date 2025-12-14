import {
  CollectionResult,
  ContextCrafterSettings,
  NoteContext,
  RelationshipType,
} from "../types";

export class MarkdownFormatter {
  format(result: CollectionResult, settings: ContextCrafterSettings): string {
    const sections: string[] = [];

    // Header with stats
    sections.push(this.formatHeader(result));

    // Each note
    for (const note of result.notes) {
      sections.push(this.formatNote(note, settings));
    }

    return sections.join("\n\n---\n\n");
  }

  private formatHeader(result: CollectionResult): string {
    const truncatedNote = result.truncated ? " (truncated at 500)" : "";
    const lines = [
      "# Context Bundle",
      "",
      `**Notes**: ${result.stats.totalNotes}${truncatedNote} | **Est. Tokens**: ~${result.stats.totalTokensEstimate}`,
      `**Generated**: ${new Date().toISOString().split("T")[0]}`,
    ];
    return lines.join("\n");
  }

  private formatNote(
    note: NoteContext,
    settings: ContextCrafterSettings
  ): string {
    const parts: string[] = [];

    // Note heading with depth indicator
    const depthPrefix = note.depth > 0 ? `[Depth ${note.depth}] ` : "";
    const typeIndicator = this.getTypeIndicator(note.relationshipType);

    if (settings.includeFilePaths) {
      parts.push(`## ${depthPrefix}${note.file.path} ${typeIndicator}`);
    } else {
      parts.push(`## ${depthPrefix}${note.file.basename} ${typeIndicator}`);
    }

    // Metadata block
    const metaLines: string[] = [];

    if (settings.includeFrontmatter && note.metadata.frontmatter) {
      metaLines.push("**Frontmatter**:");
      metaLines.push("```yaml");
      metaLines.push(this.formatYAML(note.metadata.frontmatter));
      metaLines.push("```");
    }

    if (settings.includeTags && note.metadata.tags.length > 0) {
      metaLines.push(
        `**Tags**: ${note.metadata.tags.map((t) => `#${t}`).join(", ")}`
      );
    }

    if (settings.includeCreatedDate && note.metadata.createdDate) {
      metaLines.push(`**Created**: ${this.formatDate(note.metadata.createdDate)}`);
    }

    if (settings.includeModifiedDate) {
      metaLines.push(
        `**Modified**: ${this.formatDate(note.metadata.modifiedDate)}`
      );
    }

    if (settings.includeLinkContext) {
      if (note.metadata.outgoingLinks.length > 0) {
        metaLines.push(
          `**Links to**: ${note.metadata.outgoingLinks.slice(0, 10).join(", ")}${note.metadata.outgoingLinks.length > 10 ? "..." : ""}`
        );
      }
      if (note.metadata.incomingLinks.length > 0) {
        metaLines.push(
          `**Linked from**: ${note.metadata.incomingLinks.slice(0, 10).join(", ")}${note.metadata.incomingLinks.length > 10 ? "..." : ""}`
        );
      }
    }

    if (metaLines.length > 0) {
      parts.push(metaLines.join("\n"));
    }

    // Content (stripped of frontmatter)
    parts.push("### Content");
    parts.push(this.stripFrontmatter(note.content));

    return parts.join("\n\n");
  }

  private getTypeIndicator(type: RelationshipType): string {
    const indicators: Record<RelationshipType, string> = {
      root: "(Current)",
      "forward-link": "(Linked)",
      backlink: "(Backlink)",
    };
    return indicators[type] || "";
  }

  private stripFrontmatter(content: string): string {
    const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
    return content.replace(frontmatterRegex, "").trim();
  }

  private formatYAML(obj: Record<string, unknown>): string {
    return Object.entries(obj)
      .filter(([key]) => key !== "position")
      .map(([key, value]) => `${key}: ${this.formatValue(value)}`)
      .join("\n");
  }

  private formatValue(value: unknown): string {
    if (Array.isArray(value)) {
      return `[${value.join(", ")}]`;
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  }

  private formatDate(timestamp: number): string {
    return new Date(timestamp).toISOString().split("T")[0];
  }
}
