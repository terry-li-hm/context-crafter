# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev      # Development build with watch mode (auto-rebuilds on changes)
npm run build    # Production build with TypeScript type checking
```

Output is `main.js` in the root directory, loaded by Obsidian.

For hot-reload during development, create a `.hotreload` file in the plugin directory and install the Obsidian Hot-Reload plugin.

## Architecture

This is an Obsidian plugin that collects notes within N hops of links/backlinks from the current note, presents them in a selection modal, and copies formatted markdown to clipboard.

### Data Flow

1. **LinkCollector** performs BFS traversal from active note, following forward links and backlinks up to `linkDepth` hops
2. **MetadataExtractor** extracts frontmatter, tags, dates, and link relationships from each note using Obsidian's metadataCache
3. **SelectionModal** presents notes grouped by depth with checkboxes, filter search, and bulk actions
4. **MarkdownFormatter** formats selected notes with metadata headers
5. **copyToClipboard** writes to system clipboard

### Key Types

- `NoteContext`: Core data structure containing file, content, metadata, depth, and relationship type
- `ContextCrafterSettings.savedExclusions`: Per-note exclusion storage (`Record<notePath, excludedPaths[]>`)

### Obsidian APIs Used

- `metadataCache.getFileCache(file)` - Get frontmatter, tags, links
- `metadataCache.getBacklinksForFile(file)` - Get notes linking TO this file
- `metadataCache.getFirstLinkpathDest(linkPath, sourcePath)` - Resolve link text to TFile
- `vault.cachedRead(file)` - Read file content

### Modal Styling

CSS classes must be applied to `modalEl` (not `contentEl`) for width/sizing to work properly.
