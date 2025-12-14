import { App, Modal, TFile } from "obsidian";
import { NoteContext, RelationshipType } from "../types";

type SortOption = "name" | "size" | "modified";

export interface SelectionResult {
  selectedNotes: NoteContext[];
  cancelled: boolean;
}

export interface SelectionModalOptions {
  notes: NoteContext[];
  excludedPaths: string[];
  hasSavedSelection: boolean;
  truncated: boolean;
  onSubmit: (result: SelectionResult) => void;
  onSave: (excludedPaths: string[]) => void;
  onClearSaved: () => void;
}

export class SelectionModal extends Modal {
  private notes: NoteContext[];
  private selectedNotes: Set<NoteContext>;
  private options: SelectionModalOptions;
  private listContainer: HTMLElement;
  private statsEl: HTMLElement;
  private filterQuery: string = "";
  private filterInput: HTMLInputElement;
  private saveBtn: HTMLButtonElement;
  private clearBtn: HTMLButtonElement;
  private sortOption: SortOption = "name";
  private keydownHandler: (e: KeyboardEvent) => void;

  constructor(app: App, options: SelectionModalOptions) {
    super(app);
    this.notes = options.notes;
    this.options = options;

    // Initialize selection - exclude previously saved paths
    this.selectedNotes = new Set(
      options.notes.filter(
        (note) => !options.excludedPaths.includes(note.file.path)
      )
    );

    // Always include root note
    const rootNote = options.notes.find((n) => n.depth === 0);
    if (rootNote) {
      this.selectedNotes.add(rootNote);
    }
  }

  onOpen(): void {
    const { contentEl, modalEl } = this;
    modalEl.addClass("context-crafter-selection-modal");

    // Keyboard shortcuts
    this.keydownHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        this.submitSelection();
      }
    };
    document.addEventListener("keydown", this.keydownHandler);

    // Header
    contentEl.createEl("h2", { text: "Select Notes for Context" });

    // Stats bar
    this.statsEl = contentEl.createDiv({ cls: "context-crafter-stats" });
    this.updateStats();

    // Search/filter bar
    const searchContainer = contentEl.createDiv({ cls: "context-crafter-search" });
    this.filterInput = searchContainer.createEl("input", {
      type: "text",
      placeholder: "Filter notes by name, path, or tags...",
      cls: "context-crafter-search-input",
    });
    this.filterInput.addEventListener("input", () => {
      this.filterQuery = this.filterInput.value.toLowerCase();
      this.renderNoteList();
    });

    // Bulk actions
    const actionsEl = contentEl.createDiv({ cls: "context-crafter-bulk-actions" });

    const selectAllBtn = actionsEl.createEl("button", { text: "Select All" });
    selectAllBtn.addEventListener("click", () => this.selectAll());

    const deselectAllBtn = actionsEl.createEl("button", { text: "Deselect All" });
    deselectAllBtn.addEventListener("click", () => this.deselectAll());

    // Depth filter buttons
    const depths = [...new Set(this.notes.map((n) => n.depth))].sort();
    if (depths.length > 1) {
      actionsEl.createSpan({ text: " | Deselect depth: ", cls: "context-crafter-separator" });
      for (const depth of depths) {
        if (depth === 0) continue; // Don't allow deselecting root
        const btn = actionsEl.createEl("button", {
          text: `${depth}`,
          cls: "context-crafter-depth-btn"
        });
        btn.addEventListener("click", () => this.deselectByDepth(depth));
      }
    }

    // Save/Clear selection buttons
    actionsEl.createSpan({ text: " | ", cls: "context-crafter-separator" });

    this.saveBtn = actionsEl.createEl("button", {
      text: "Save Selection",
      cls: "context-crafter-save-btn",
    });
    this.saveBtn.addEventListener("click", () => this.saveSelection());

    if (this.options.hasSavedSelection) {
      this.clearBtn = actionsEl.createEl("button", {
        text: "Clear Saved",
        cls: "context-crafter-clear-btn",
      });
      this.clearBtn.addEventListener("click", () => this.clearSavedSelection());
    }

    // Sort options
    actionsEl.createSpan({ text: " | Sort: ", cls: "context-crafter-separator" });
    const sortSelect = actionsEl.createEl("select", { cls: "context-crafter-sort-select" });
    const sortOptions: { value: SortOption; label: string }[] = [
      { value: "name", label: "Name" },
      { value: "size", label: "Size" },
      { value: "modified", label: "Modified" },
    ];
    for (const opt of sortOptions) {
      const optionEl = sortSelect.createEl("option", { value: opt.value, text: opt.label });
      if (opt.value === this.sortOption) {
        optionEl.selected = true;
      }
    }
    sortSelect.addEventListener("change", () => {
      this.sortOption = sortSelect.value as SortOption;
      this.renderNoteList();
    });

    // Notes list
    this.listContainer = contentEl.createDiv({ cls: "context-crafter-note-list" });
    this.renderNoteList();

    // Action buttons
    const buttonContainer = contentEl.createDiv({
      cls: "context-crafter-button-container",
    });

    const copyButton = buttonContainer.createEl("button", {
      text: "Copy to Clipboard",
      cls: "mod-cta",
      title: "Cmd/Ctrl+Enter",
    });
    copyButton.addEventListener("click", () => this.submitSelection());

    const cancelButton = buttonContainer.createEl("button", { text: "Cancel" });
    cancelButton.addEventListener("click", () => {
      this.options.onSubmit({ selectedNotes: [], cancelled: true });
      this.close();
    });

    // Focus search input
    this.filterInput.focus();
  }

  private submitSelection(): void {
    this.options.onSubmit({
      selectedNotes: Array.from(this.selectedNotes),
      cancelled: false,
    });
    this.close();
  }

  private saveSelection(): void {
    // Get paths of deselected notes (excluding root)
    const excludedPaths = this.notes
      .filter((note) => !this.selectedNotes.has(note) && note.depth !== 0)
      .map((note) => note.file.path);

    this.options.onSave(excludedPaths);
    this.saveBtn.setText("Saved ✓");
    setTimeout(() => this.saveBtn.setText("Save Selection"), 1500);
  }

  private clearSavedSelection(): void {
    this.options.onClearSaved();
    // Re-select all notes
    this.selectedNotes = new Set(this.notes);
    this.renderNoteList();
    this.updateStats();
    if (this.clearBtn) {
      this.clearBtn.remove();
    }
  }

  private getFilteredNotes(): NoteContext[] {
    if (!this.filterQuery) {
      return this.notes;
    }

    return this.notes.filter((note) => {
      const searchText = [
        note.file.basename,
        note.file.path,
        ...note.metadata.tags,
      ]
        .join(" ")
        .toLowerCase();

      return searchText.includes(this.filterQuery);
    });
  }

  private sortNotes(notes: NoteContext[]): NoteContext[] {
    return [...notes].sort((a, b) => {
      switch (this.sortOption) {
        case "name":
          return a.file.basename.localeCompare(b.file.basename);
        case "size":
          return b.content.length - a.content.length; // Largest first
        case "modified":
          return b.metadata.modifiedDate - a.metadata.modifiedDate; // Most recent first
        default:
          return 0;
      }
    });
  }

  private renderNoteList(): void {
    this.listContainer.empty();

    const filteredNotes = this.getFilteredNotes();

    if (filteredNotes.length === 0) {
      const emptyMsg = this.listContainer.createDiv({ cls: "context-crafter-empty" });
      emptyMsg.setText(this.filterQuery ? "No notes match your filter" : "No notes found");
      return;
    }

    // Group by depth
    const byDepth = new Map<number, NoteContext[]>();
    for (const note of filteredNotes) {
      const group = byDepth.get(note.depth) || [];
      group.push(note);
      byDepth.set(note.depth, group);
    }

    // Render each depth group
    const sortedDepths = [...byDepth.keys()].sort();
    for (const depth of sortedDepths) {
      const group = this.sortNotes(byDepth.get(depth)!);

      // Depth header
      const header = this.listContainer.createDiv({ cls: "context-crafter-depth-header" });
      const depthLabel = depth === 0 ? "Current Note" : `Depth ${depth}`;
      header.createSpan({ text: depthLabel });
      header.createSpan({
        text: ` (${group.length} note${group.length > 1 ? "s" : ""})`,
        cls: "context-crafter-count"
      });

      // Notes in this depth
      for (const note of group) {
        this.renderNoteItem(note);
      }
    }
  }

  private renderNoteItem(note: NoteContext): void {
    const isSelected = this.selectedNotes.has(note);
    const isRoot = note.depth === 0;

    const item = this.listContainer.createDiv({
      cls: `context-crafter-note-item ${isSelected ? "is-selected" : ""} ${isRoot ? "is-root" : ""}`,
    });

    // Checkbox
    const checkbox = item.createEl("input", { type: "checkbox" });
    checkbox.checked = isSelected;
    checkbox.disabled = isRoot; // Can't deselect root note
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        this.selectedNotes.add(note);
      } else {
        this.selectedNotes.delete(note);
      }
      item.toggleClass("is-selected", checkbox.checked);
      this.updateStats();
    });

    // Note info
    const info = item.createDiv({ cls: "context-crafter-note-info" });

    // First line: name and type
    const titleLine = info.createDiv({ cls: "context-crafter-title-line" });
    const nameEl = titleLine.createSpan({
      text: note.file.basename,
      cls: "context-crafter-note-name context-crafter-clickable",
      title: "Click to preview",
    });
    nameEl.addEventListener("click", (e) => {
      e.stopPropagation();
      this.previewNote(note.file);
    });
    titleLine.createSpan({
      text: this.getTypeLabel(note.relationshipType),
      cls: `context-crafter-type context-crafter-type-${note.relationshipType}`,
    });

    // Second line: path and metadata
    const metaLine = info.createDiv({ cls: "context-crafter-meta-line" });
    metaLine.createSpan({
      text: note.file.parent?.path || "/",
      cls: "context-crafter-path",
    });

    const wordCount = this.estimateWords(note.content);
    metaLine.createSpan({
      text: `${wordCount.toLocaleString()} words`,
      cls: "context-crafter-words",
    });

    if (note.metadata.tags.length > 0) {
      metaLine.createSpan({
        text: note.metadata.tags.slice(0, 3).map(t => `#${t}`).join(" "),
        cls: "context-crafter-tags",
      });
    }
  }

  private getTypeLabel(type: RelationshipType): string {
    const labels: Record<RelationshipType, string> = {
      root: "current",
      "forward-link": "linked",
      backlink: "backlink",
    };
    return labels[type];
  }

  private estimateWords(content: string): number {
    return content.split(/\s+/).filter(w => w.length > 0).length;
  }

  private previewNote(file: TFile): void {
    // Open in a new leaf without closing the modal
    const leaf = this.app.workspace.getLeaf("tab");
    leaf.openFile(file);
  }

  private updateStats(): void {
    const selected = this.selectedNotes.size;
    const total = this.notes.length;
    const totalChars = Array.from(this.selectedNotes)
      .reduce((sum, n) => sum + n.content.length, 0);
    const estimatedTokens = Math.ceil(totalChars / 4);

    this.statsEl.empty();
    this.statsEl.createSpan({ text: `${selected}/${total} notes selected` });
    this.statsEl.createSpan({ text: " | " });
    this.statsEl.createSpan({ text: `~${estimatedTokens.toLocaleString()} tokens` });

    if (this.options.truncated) {
      this.statsEl.createSpan({ text: " | " });
      this.statsEl.createSpan({ text: "Truncated at 500", cls: "context-crafter-truncated-indicator" });
    }

    if (this.options.hasSavedSelection) {
      this.statsEl.createSpan({ text: " | " });
      this.statsEl.createSpan({ text: "Has saved selection", cls: "context-crafter-saved-indicator" });
    }
  }

  private selectAll(): void {
    // Select all currently filtered notes
    const filtered = this.getFilteredNotes();
    for (const note of filtered) {
      this.selectedNotes.add(note);
    }
    this.renderNoteList();
    this.updateStats();
  }

  private deselectAll(): void {
    // Deselect all currently filtered notes (except root)
    const filtered = this.getFilteredNotes();
    for (const note of filtered) {
      if (note.depth !== 0) {
        this.selectedNotes.delete(note);
      }
    }
    this.renderNoteList();
    this.updateStats();
  }

  private deselectByDepth(depth: number): void {
    for (const note of this.notes) {
      if (note.depth === depth) {
        this.selectedNotes.delete(note);
      }
    }
    this.renderNoteList();
    this.updateStats();
  }

  onClose(): void {
    document.removeEventListener("keydown", this.keydownHandler);
    this.contentEl.empty();
  }
}
