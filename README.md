# Context Crafter

An Obsidian plugin that intelligently gathers context from your notes for use with AI assistants and LLMs. Context Crafter collects linked notes, presents them in an interactive selection interface, and copies formatted markdown with rich metadata to your clipboard.

## Features

### 🔗 Smart Link Traversal
- Automatically discovers notes within configurable link depth (1-3 hops)
- Follows both forward links and backlinks
- BFS (breadth-first search) traversal ensures closest notes are prioritized
- Safety limit prevents runaway collection (max 500 notes)

### 🎯 Interactive Selection
- Review all discovered notes before copying
- Visual grouping by depth from current note
- Real-time search/filter to find specific notes
- Bulk select/deselect by depth level
- Save your selection preferences per note
- Quick copy mode to skip selection dialog

### 📝 Rich Metadata
Includes comprehensive metadata for each note:
- Frontmatter/YAML properties
- Tags (both inline and frontmatter)
- Creation and modification dates
- File paths (optional)
- Link relationship context (optional)

### ⚙️ Flexible Configuration
- Adjustable link depth (1-3 hops)
- Toggle backlinks and forward links independently
- Customize metadata inclusion
- Exclude specific folders from collection
- Per-note saved selections for repeated workflows

### 📱 Mobile Friendly
- Responsive design works on desktop and mobile
- Touch-optimized controls
- Collapsible sections for small screens

## Installation

### From Obsidian Community Plugins (Recommended)
1. Open Settings → Community plugins
2. Disable Safe mode if needed
3. Click Browse and search for "Context Crafter"
4. Click Install, then Enable

### Manual Installation
1. Download the latest release from [GitHub Releases](https://github.com/terry-li-hm/context-crafter/releases)
2. Extract the files to `{vault}/.obsidian/plugins/context-crafter/`
3. Reload Obsidian
4. Enable the plugin in Settings → Community plugins

## Usage

### Basic Workflow

1. **Open a note** you want to gather context around
2. **Run the command** "Craft context from current note"
   - Use Command Palette (Ctrl/Cmd + P)
   - Or assign a hotkey in Settings → Hotkeys
3. **Review the selection** in the modal
   - Notes are grouped by depth (0 = current note, 1 = direct links, etc.)
   - Use the search box to filter notes
   - Deselect any notes you don't want included
4. **Copy to clipboard**
   - Click "Copy to clipboard" to format and copy
   - Or "Save & Copy" to remember your selection for next time

### Commands

**Craft context from current note**
- Opens the selection modal
- Shows all discovered notes
- Applies saved exclusions if available

**Quick copy (skip selection)**
- Copies immediately using saved selection
- Falls back to all notes if no saved selection exists
- Perfect for repeated workflows

### Settings

**Collection Settings**
- **Link depth**: How many hops to follow (1-3)
- **Include backlinks**: Follow notes linking TO current note
- **Include forward links**: Follow notes linked FROM current note

**Metadata Settings**
- **Include frontmatter**: Add YAML properties
- **Include tags**: Add tags from frontmatter and inline
- **Include dates**: Add created/modified timestamps
- **Include link context**: Show relationship type (linked/backlink)

**Output Settings**
- **Include file paths**: Show vault path for each note
- **Exclude folders**: Skip specific folders during collection

## Use Cases

### AI Assistant Prompts
Gather related notes to provide context when chatting with AI assistants like Claude, ChatGPT, or other LLMs.

### Project Documentation
Collect all notes related to a project to review scope, generate summaries, or export documentation.

### Research Synthesis
Pull together research notes and their connections for analysis or writing.

### Knowledge Review
Periodically review and refresh your understanding of connected topics.

### Content Creation
Gather source material from your vault to inform blog posts, articles, or presentations.

## Output Format

The plugin generates formatted markdown with:

```markdown
# Context: {Note Title}

**Total notes:** {count}
**Estimated tokens:** ~{count}

---

## {Note Title}
**Path:** {vault/path/to/note.md}
**Tags:** #tag1 #tag2
**Created:** YYYY-MM-DD
**Modified:** YYYY-MM-DD

{Note content}

---

## {Next Note}
...
```

## Tips

- **Save selections** for notes you frequently use with AI to avoid re-selecting
- **Use folder exclusions** to skip archive, template, or attachment folders
- **Adjust link depth** based on vault size (lower depth = faster, more focused)
- **Quick copy** is perfect for notes with stable contexts you use regularly
- **Search in modal** helps find specific notes in large collections

## Performance

- Collection stops at 500 notes for safety
- BFS ensures closest notes are found first
- Async/await prevents UI blocking
- Efficient metadata caching via Obsidian API

## Support

- **Issues & Feature Requests**: [GitHub Issues](https://github.com/terry-li-hm/context-crafter/issues)
- **Discussions**: [GitHub Discussions](https://github.com/terry-li-hm/context-crafter/discussions)

## Development

```bash
npm install          # Install dependencies
npm run dev          # Development build with watch mode
npm run build        # Production build with type checking
```

See [CLAUDE.md](CLAUDE.md) for architecture details.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Credits

Developed by [Terry Li](https://github.com/terry-li-hm)

---

If Context Crafter helps your workflow, please consider:
- ⭐ Starring the [GitHub repository](https://github.com/terry-li-hm/context-crafter)
- 📢 Sharing it with others who use AI assistants with Obsidian
- 💡 Contributing ideas or improvements
