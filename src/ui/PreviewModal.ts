import { Modal, App } from "obsidian";
import { CollectionStats } from "../types";

export class PreviewModal extends Modal {
  private content: string;
  private stats: CollectionStats;
  private onConfirm: () => void;

  constructor(
    app: App,
    content: string,
    stats: CollectionStats,
    onConfirm: () => void
  ) {
    super(app);
    this.content = content;
    this.stats = stats;
    this.onConfirm = onConfirm;
  }

  onOpen(): void {
    const { contentEl } = this;

    contentEl.addClass("context-crafter-preview-modal");

    // Header
    contentEl.createEl("h2", { text: "Context Preview" });

    // Stats summary
    const statsEl = contentEl.createDiv({ cls: "context-crafter-stats" });
    statsEl.createEl("span", {
      text: `Notes: ${this.stats.totalNotes}`,
    });
    statsEl.createEl("span", { text: " | " });
    statsEl.createEl("span", {
      text: `Est. Tokens: ~${this.stats.totalTokensEstimate}`,
    });
    statsEl.createEl("span", { text: " | " });
    statsEl.createEl("span", {
      text: `Characters: ${this.content.length.toLocaleString()}`,
    });

    // Scrollable preview
    const previewContainer = contentEl.createDiv({
      cls: "context-crafter-preview-container",
    });
    const previewEl = previewContainer.createEl("pre", {
      cls: "context-crafter-preview-content",
    });

    // Show truncated preview for performance
    const maxPreviewLength = 10000;
    if (this.content.length > maxPreviewLength) {
      previewEl.setText(this.content.slice(0, maxPreviewLength));
      previewContainer.createDiv({
        cls: "context-crafter-truncated",
        text: `... (${(this.content.length - maxPreviewLength).toLocaleString()} more characters)`,
      });
    } else {
      previewEl.setText(this.content);
    }

    // Action buttons
    const buttonContainer = contentEl.createDiv({
      cls: "context-crafter-button-container",
    });

    const copyButton = buttonContainer.createEl("button", {
      text: "Copy to Clipboard",
      cls: "mod-cta",
    });
    copyButton.addEventListener("click", () => {
      this.onConfirm();
      this.close();
    });

    const cancelButton = buttonContainer.createEl("button", {
      text: "Cancel",
    });
    cancelButton.addEventListener("click", () => this.close());
  }

  onClose(): void {
    this.contentEl.empty();
  }
}
