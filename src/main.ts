import { Notice, Plugin } from "obsidian";
import { ContextCrafterSettings, NoteContext } from "./types";
import { DEFAULT_SETTINGS } from "./settings";
import { LinkCollector } from "./collectors/LinkCollector";
import { MarkdownFormatter } from "./formatters/MarkdownFormatter";
import { SelectionModal } from "./ui/SelectionModal";
import { ContextCrafterSettingsTab } from "./ui/SettingsTab";
import { copyToClipboard } from "./utils/clipboard";

export default class ContextCrafterPlugin extends Plugin {
  settings: ContextCrafterSettings;
  private formatter: MarkdownFormatter;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.formatter = new MarkdownFormatter();

    // Register commands
    this.registerCommands();

    // Add settings tab
    this.addSettingTab(new ContextCrafterSettingsTab(this.app, this));

    console.log("Context Crafter loaded");
  }

  onunload(): void {
    console.log("Context Crafter unloaded");
  }

  private registerCommands(): void {
    // Main command: Craft context (collect, select, copy)
    this.addCommand({
      id: "craft-context",
      name: "Craft context from current note",
      callback: async () => {
        await this.craftContext();
      },
    });

    // Quick copy (skip selection modal)
    this.addCommand({
      id: "quick-copy",
      name: "Quick copy (skip selection)",
      callback: async () => {
        await this.craftContext(true);
      },
    });
  }

  private async craftContext(skipSelection = false): Promise<void> {
    try {
      const activeFile = this.app.workspace.getActiveFile();
      if (!activeFile) {
        new Notice("No active file");
        return;
      }

      // Collect notes using link traversal
      const collector = new LinkCollector(this.app, this.settings);
      const result = await collector.collect();

      if (result.notes.length === 0) {
        new Notice("No notes found");
        return;
      }

      // Warn if collection was truncated
      if (result.truncated) {
        new Notice("Warning: Collection truncated at 500 notes. Some linked notes may be missing.", 5000);
      }

      // Get saved exclusions for this note
      const currentNotePath = activeFile.path;
      const savedExclusions = this.settings.savedExclusions[currentNotePath] || [];
      const hasSavedSelection = savedExclusions.length > 0;

      if (skipSelection) {
        // Apply saved exclusions and copy directly
        const selectedNotes = result.notes.filter(
          (note) => note.depth === 0 || !savedExclusions.includes(note.file.path)
        );
        await this.formatAndCopy(selectedNotes, result.truncated);
      } else {
        // Show selection modal
        new SelectionModal(this.app, {
          notes: result.notes,
          excludedPaths: savedExclusions,
          hasSavedSelection,
          truncated: result.truncated,
          onSubmit: async (selectionResult) => {
            if (selectionResult.cancelled) {
              return;
            }
            if (selectionResult.selectedNotes.length === 0) {
              new Notice("No notes selected");
              return;
            }
            await this.formatAndCopy(selectionResult.selectedNotes);
          },
          onSave: async (excludedPaths) => {
            await this.saveExclusions(currentNotePath, excludedPaths);
          },
          onClearSaved: async () => {
            await this.clearExclusions(currentNotePath);
          },
        }).open();
      }
    } catch (error) {
      console.error("Context Crafter error:", error);
      new Notice(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private async saveExclusions(notePath: string, excludedPaths: string[]): Promise<void> {
    if (excludedPaths.length === 0) {
      // Remove entry if no exclusions
      delete this.settings.savedExclusions[notePath];
    } else {
      this.settings.savedExclusions[notePath] = excludedPaths;
    }
    await this.saveSettings();
    new Notice("Selection saved");
  }

  private async clearExclusions(notePath: string): Promise<void> {
    delete this.settings.savedExclusions[notePath];
    await this.saveSettings();
    new Notice("Saved selection cleared");
  }

  private async formatAndCopy(notes: NoteContext[], truncated = false): Promise<void> {
    // Rebuild stats for selected notes
    const stats = {
      totalNotes: notes.length,
      totalTokensEstimate: Math.ceil(
        notes.reduce((sum, n) => sum + n.content.length, 0) / 4
      ),
      depthDistribution: notes.reduce((acc, n) => {
        acc[n.depth] = (acc[n.depth] || 0) + 1;
        return acc;
      }, {} as Record<number, number>),
    };

    const formatted = this.formatter.format({ notes, stats, truncated }, this.settings);
    const success = await copyToClipboard(formatted);

    if (success) {
      new Notice(
        `Copied ${notes.length} note(s) to clipboard (~${stats.totalTokensEstimate.toLocaleString()} tokens)`
      );
    } else {
      new Notice("Failed to copy to clipboard");
    }
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    // Clamp linkDepth to safe range (1-3) in case of manual edits to data.json
    this.settings.linkDepth = Math.min(Math.max(1, this.settings.linkDepth), 3);
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}
