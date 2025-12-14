import { App, TFile } from "obsidian";
import { BaseCollector } from "./BaseCollector";
import { CollectionResult, ContextCrafterSettings } from "../types";
import { NoteSelectorModal } from "../ui/NoteSelectorModal";

export class ManualCollector extends BaseCollector {
  constructor(app: App, settings: ContextCrafterSettings) {
    super(app, settings);
  }

  async collect(): Promise<CollectionResult> {
    const selectedFiles = await this.openSelectionModal();

    if (selectedFiles.length === 0) {
      return this.buildResult([]);
    }

    const results = await Promise.all(
      selectedFiles.map((file) => this.buildNoteContext(file, 0, "manual"))
    );

    return this.buildResult(results);
  }

  private openSelectionModal(): Promise<TFile[]> {
    return new Promise((resolve) => {
      const modal = new NoteSelectorModal(this.app, (files) => {
        resolve(files);
      });
      modal.open();
    });
  }
}
