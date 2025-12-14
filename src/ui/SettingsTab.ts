import { App, PluginSettingTab, Setting } from "obsidian";
import ContextCrafterPlugin from "../main";

export class ContextCrafterSettingsTab extends PluginSettingTab {
  plugin: ContextCrafterPlugin;

  constructor(app: App, plugin: ContextCrafterPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Context Crafter Settings" });

    // === Collection Settings ===
    containerEl.createEl("h3", { text: "Collection" });

    new Setting(containerEl)
      .setName("Link depth")
      .setDesc("How many levels of links to follow (1-3)")
      .addSlider((slider) =>
        slider
          .setLimits(1, 3, 1)
          .setValue(this.plugin.settings.linkDepth)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.linkDepth = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Include forward links")
      .setDesc("Include notes that the current note links to")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.includeForwardLinks)
          .onChange(async (value) => {
            this.plugin.settings.includeForwardLinks = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Include backlinks")
      .setDesc("Include notes that link TO the current note")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.includeBacklinks)
          .onChange(async (value) => {
            this.plugin.settings.includeBacklinks = value;
            await this.plugin.saveSettings();
          })
      );

    // === Metadata Settings ===
    containerEl.createEl("h3", { text: "Metadata" });

    new Setting(containerEl)
      .setName("Include frontmatter")
      .setDesc("Include YAML frontmatter in output")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.includeFrontmatter)
          .onChange(async (value) => {
            this.plugin.settings.includeFrontmatter = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Include tags")
      .setDesc("Include tags in output")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.includeTags)
          .onChange(async (value) => {
            this.plugin.settings.includeTags = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Include created date")
      .setDesc("Show file creation date")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.includeCreatedDate)
          .onChange(async (value) => {
            this.plugin.settings.includeCreatedDate = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Include modified date")
      .setDesc("Show last modified date")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.includeModifiedDate)
          .onChange(async (value) => {
            this.plugin.settings.includeModifiedDate = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Include link context")
      .setDesc("Show outgoing and incoming links for each note")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.includeLinkContext)
          .onChange(async (value) => {
            this.plugin.settings.includeLinkContext = value;
            await this.plugin.saveSettings();
          })
      );

    // === Output Settings ===
    containerEl.createEl("h3", { text: "Output" });

    new Setting(containerEl)
      .setName("Include file paths")
      .setDesc("Show full file paths instead of just names")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.includeFilePaths)
          .onChange(async (value) => {
            this.plugin.settings.includeFilePaths = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Exclude folders")
      .setDesc("Comma-separated list of folders to exclude from collection")
      .addText((text) =>
        text
          .setPlaceholder("templates, archive, attachments")
          .setValue(this.plugin.settings.excludeFolders.join(", "))
          .onChange(async (value) => {
            this.plugin.settings.excludeFolders = value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            await this.plugin.saveSettings();
          })
      );
  }
}
