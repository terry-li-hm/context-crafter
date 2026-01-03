# Quick Release Guide for Context Crafter v1.0.0

## Current Status

✅ **All code is ready**:
- LICENSE is in the repository root (visible on GitHub)
- README.md, manifest.json, styles.css are all committed
- main.js can be built locally (33KB)

⚠️ **What's needed**: Create a GitHub Release with the three required assets

## Step-by-Step Instructions

### 1. Build the Plugin Locally

```bash
cd /home/user/context-crafter
npm install    # If dependencies aren't installed
npm run build  # Creates main.js in the root directory
```

This creates `main.js` (33KB) in the repository root.

### 2. Verify Files Are Ready

```bash
ls -lh main.js manifest.json styles.css
```

You should see:
- `main.js` (~33KB)
- `manifest.json` (349 bytes)
- `styles.css` (~9KB)

### 3. Create GitHub Release (Manual)

1. **Go to releases page**:
   - Visit: https://github.com/terry-li-hm/context-crafter/releases
   - Click: **"Draft a new release"** button

2. **Configure the release**:
   - **Choose a tag**: Click dropdown, type `1.0.0` (NO "v" prefix!)
   - Click **"Create new tag: 1.0.0 on publish"**
   - **Release title**: `1.0.0`
   - **Description**: Copy the release notes below

3. **Upload assets**:
   - Drag and drop (or use file picker) to upload these 3 files:
     - `main.js`
     - `manifest.json`
     - `styles.css`
   - All three must be individual files attached to the release

4. **Publish**:
   - Click **"Publish release"** (NOT "Save draft")

⚠️ **CRITICAL REQUIREMENTS**:
- Tag must be exactly `1.0.0` (not v1.0.0, not 1.0.0-beta, etc.)
- All three files must be attached as release assets
- Release must be published (not draft)

### 4. Verify Release

After publishing, check:
- https://github.com/terry-li-hm/context-crafter/releases should show "1.0.0"
- The release should have 3 assets listed
- Click each asset link to verify they download correctly

## Release Notes Template

```markdown
## Context Crafter 1.0.0 - Initial Release

An Obsidian plugin that intelligently gathers context from your notes for use with AI assistants and LLMs.

### ✨ Features

**🔗 Smart Link Traversal**
- Automatically discovers notes within configurable link depth (1-3 hops)
- Follows both forward links and backlinks
- BFS traversal ensures closest notes are prioritized

**🎯 Interactive Selection**
- Review and select notes before copying
- Visual grouping by depth from current note
- Real-time search/filter
- Bulk select/deselect by depth level
- Save selection preferences per note

**📝 Rich Metadata**
- Frontmatter/YAML properties
- Tags (both inline and frontmatter)
- Creation and modification dates
- File paths (optional)
- Link relationship context (optional)

**📱 Mobile Friendly**
- Responsive design works on desktop and mobile
- Touch-optimized controls
- Collapsible sections for small screens

### 📦 Installation

**From Obsidian** (once approved):
1. Open Settings → Community plugins
2. Search for "Context Crafter"
3. Click Install, then Enable

**Manual Installation**:
1. Download `main.js`, `manifest.json`, and `styles.css` from this release
2. Create folder `{vault}/.obsidian/plugins/context-crafter/`
3. Copy the three files into the folder
4. Reload Obsidian
5. Enable the plugin in Settings → Community plugins

### 📖 Documentation

- [Full README](https://github.com/terry-li-hm/context-crafter#readme)
- [Report Issues](https://github.com/terry-li-hm/context-crafter/issues)
- [Discussions](https://github.com/terry-li-hm/context-crafter/discussions)

### 🙏 Support

If Context Crafter helps your workflow:
- ⭐ Star the repository
- 💬 Share feedback in Discussions
- 🐛 Report bugs in Issues
```

## After Release is Published

### Submit to Obsidian Community Plugins

1. **Fork obsidian-releases**:
   - Go to: https://github.com/obsidianmd/obsidian-releases
   - Click "Fork"

2. **Edit community-plugins.json**:
   - Open `community-plugins.json` in your fork
   - Scroll to the **very bottom** (before the closing `]`)
   - Add a comma after the last entry, then add:

```json
{
  "id": "context-crafter",
  "name": "Context Crafter",
  "author": "Terry Li",
  "description": "Gather note context with metadata for AI/LLM prompts. Supports linked notes, manual selection, and smart auto-detection.",
  "repo": "terry-li-hm/context-crafter"
}
```

3. **Create Pull Request**:
   - Commit the change in your fork
   - Create PR to obsidianmd/obsidian-releases
   - Title: `Add Context Crafter plugin`
   - Description:

```markdown
## Plugin Submission: Context Crafter

An Obsidian plugin that intelligently gathers context from your notes for use with AI assistants and LLMs.

**Repository**: https://github.com/terry-li-hm/context-crafter
**Release**: https://github.com/terry-li-hm/context-crafter/releases/tag/1.0.0

### Checklist
- [x] LICENSE file (MIT)
- [x] Comprehensive README.md
- [x] Release 1.0.0 with main.js, manifest.json, styles.css as assets
- [x] Tag exactly matches version (1.0.0, no 'v' prefix)
- [x] Mobile supported (isDesktopOnly: false)
- [x] manifest.json contains only valid fields
```

4. **Wait for validation**:
   - Automated bot will validate your submission
   - Obsidian team will review
   - Respond to any feedback

## Common Issues

### "Tag must match version exactly"
- Ensure tag is `1.0.0` not `v1.0.0`
- Check manifest.json shows `"version": "1.0.0"`

### "Missing required files"
- All three files (main.js, manifest.json, styles.css) must be attached as release assets
- They must be individual files, not in a ZIP

### "Invalid manifest field"
- manifest.json should NOT have a `"main"` field
- Only use supported fields per [Obsidian manifest schema](https://docs.obsidian.md/Reference/Manifest)

## Resources

- [Managing releases - GitHub Docs](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
- [Obsidian Plugin Submission Guide](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin)
- [Manifest Schema](https://docs.obsidian.md/Reference/Manifest)

---

**Next Action**: Follow Step 3 above to create the GitHub release manually through the web interface.
