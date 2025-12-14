import { App, FuzzyMatch, FuzzySuggestModal, TFile } from "obsidian";

export class NoteSelectorModal extends FuzzySuggestModal<TFile> {
  private selectedFiles: Set<TFile> = new Set();
  private onSubmit: (files: TFile[]) => void;

  constructor(app: App, onSubmit: (files: TFile[]) => void) {
    super(app);
    this.onSubmit = onSubmit;
    this.setPlaceholder(
      "Search notes... (Click to toggle, Enter on selected to finish)"
    );
    this.setInstructions([
      { command: "Click", purpose: "Toggle selection" },
      { command: "Enter", purpose: "Finish selection" },
      { command: "Esc", purpose: "Cancel" },
    ]);
  }

  getItems(): TFile[] {
    return this.app.vault.getMarkdownFiles();
  }

  getItemText(item: TFile): string {
    return item.path;
  }

  renderSuggestion(match: FuzzyMatch<TFile>, el: HTMLElement): void {
    const item = match.item;
    const isSelected = this.selectedFiles.has(item);

    const container = el.createDiv({ cls: "context-crafter-suggestion" });

    // Selection indicator
    const indicator = container.createSpan({
      cls: "context-crafter-indicator",
    });
    indicator.setText(isSelected ? "✓" : "○");

    // File info
    const info = container.createDiv({ cls: "context-crafter-file-info" });
    info.createDiv({
      cls: "context-crafter-filename",
      text: item.basename,
    });
    info.createDiv({
      cls: "context-crafter-filepath",
      text: item.parent?.path || "/",
    });

    if (isSelected) {
      el.addClass("is-selected");
    }
  }

  onChooseItem(item: TFile): void {
    // Toggle selection
    if (this.selectedFiles.has(item)) {
      this.selectedFiles.delete(item);
    } else {
      this.selectedFiles.add(item);
    }

    // If we have selections, show count in placeholder
    const count = this.selectedFiles.size;
    if (count > 0) {
      this.setPlaceholder(`${count} note(s) selected - Enter to confirm`);
    } else {
      this.setPlaceholder("Search notes... (Click to toggle)");
    }
  }

  onClose(): void {
    // Submit selected files when modal closes
    this.onSubmit(Array.from(this.selectedFiles));
  }
}
