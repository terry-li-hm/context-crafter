# Context Crafter - Obsidian Plugin Submission Instructions

## ✅ Submission Readiness Checklist

All required files and preparation work have been completed:

- ✅ **LICENSE** - MIT license
- ✅ **README.md** - Comprehensive documentation
- ✅ **manifest.json** - All required fields validated
- ✅ **versions.json** - Version compatibility mapping (1.0.0 → minAppVersion 1.5.0)
- ✅ **main.js** - Production build created (33KB)
- ✅ **styles.css** - Plugin styles (9KB)
- ✅ **Code quality** - Production-ready, no TODOs/FIXMEs
- ✅ **Mobile support** - Responsive design implemented

## 📋 Plugin Information

```json
{
  "id": "context-crafter",
  "name": "Context Crafter",
  "author": "Terry Li",
  "description": "Gather note context with metadata for AI/LLM prompts. Supports linked notes, manual selection, and smart auto-detection.",
  "repo": "terry-li-hm/context-crafter",
  "version": "1.0.0"
}
```

## 🚀 Steps to Submit

### Step 1: Create GitHub Release

1. **Build the plugin** (already done - main.js is in the repository root):
   ```bash
   npm run build
   ```

2. **Create and push the release tag**:
   ```bash
   git tag 1.0.0
   git push origin 1.0.0
   ```

   ⚠️ **CRITICAL**: The tag must be exactly `1.0.0` (NOT `v1.0.0`) to match the version in manifest.json

3. **Create GitHub Release**:
   - Go to https://github.com/terry-li-hm/context-crafter/releases/new
   - Set tag: `1.0.0`
   - Set title: `1.0.0`
   - Add release notes (example below)
   - Upload these three files as release assets:
     - `main.js` (from repository root)
     - `manifest.json` (from repository root)
     - `styles.css` (from repository root)
   - Publish the release

#### Suggested Release Notes Template:

```markdown
## Context Crafter 1.0.0 - Initial Release

An Obsidian plugin that intelligently gathers context from your notes for use with AI assistants and LLMs.

### Features

🔗 **Smart Link Traversal**
- Automatically discovers notes within configurable link depth (1-3 hops)
- Follows both forward links and backlinks
- BFS traversal ensures closest notes are prioritized

🎯 **Interactive Selection**
- Review and select notes before copying
- Visual grouping by depth
- Real-time search/filter
- Save selection preferences per note

📝 **Rich Metadata**
- Frontmatter/YAML properties
- Tags (inline and frontmatter)
- Creation and modification dates
- Link relationship context

📱 **Mobile Friendly**
- Responsive design for desktop and mobile
- Touch-optimized controls
- Collapsible sections

### Installation

Install from Obsidian's Community Plugins directory, or manually:
1. Download `main.js`, `manifest.json`, and `styles.css`
2. Create folder `{vault}/.obsidian/plugins/context-crafter/`
3. Place files in the folder
4. Reload Obsidian and enable the plugin

### Support

- [Documentation](https://github.com/terry-li-hm/context-crafter#readme)
- [Issues](https://github.com/terry-li-hm/context-crafter/issues)
- [Discussions](https://github.com/terry-li-hm/context-crafter/discussions)
```

### Step 2: Submit to Obsidian Community Plugins

1. **Fork the obsidian-releases repository**:
   - Go to https://github.com/obsidianmd/obsidian-releases
   - Click "Fork" in the top right

2. **Edit community-plugins.json**:
   - In your fork, open `community-plugins.json`
   - Scroll to the **bottom** of the file
   - Add this entry **before the closing bracket `]`**:

   ```json
   ,
   {
     "id": "context-crafter",
     "name": "Context Crafter",
     "author": "Terry Li",
     "description": "Gather note context with metadata for AI/LLM prompts. Supports linked notes, manual selection, and smart auto-detection.",
     "repo": "terry-li-hm/context-crafter"
   }
   ```

   Note: Make sure to add a comma after the previous entry and ensure proper JSON formatting.

3. **Create Pull Request**:
   - Commit the change to your fork
   - Create a pull request to the main obsidian-releases repository
   - Title: `Add Context Crafter plugin`
   - Description:

   ```markdown
   ## Plugin Submission: Context Crafter

   **Description**: An Obsidian plugin that intelligently gathers context from your notes for use with AI assistants and LLMs.

   **Repository**: https://github.com/terry-li-hm/context-crafter
   **Release**: https://github.com/terry-li-hm/context-crafter/releases/tag/1.0.0

   ### Features
   - Smart link traversal with configurable depth
   - Interactive note selection interface
   - Rich metadata extraction
   - Mobile responsive design
   - Save selection preferences

   ### Checklist
   - [x] LICENSE file present (MIT)
   - [x] README.md with comprehensive documentation
   - [x] Release 1.0.0 created with main.js, manifest.json, styles.css
   - [x] Git tag matches version exactly (1.0.0, not v1.0.0)
   - [x] isDesktopOnly: false (mobile supported)
   - [x] No sensitive data or API keys in code

   This plugin helps users gather contextual information from their Obsidian vault to use with AI assistants like Claude, ChatGPT, and other LLMs.
   ```

4. **Wait for automated validation**:
   - The obsidian-releases repository has automated checks that will validate:
     - Plugin ID is unique
     - Repository exists and is public
     - Release with matching version exists
     - Release contains required files (main.js, manifest.json, styles.css)
     - manifest.json fields match your submission

5. **Review process**:
   - Obsidian team will review your submission
   - Respond promptly to any feedback or change requests
   - Once approved, your plugin will be added to the community plugins directory

## 🔍 Automated Validation

The pull request will be automatically validated for:

- ✅ Unique plugin ID (`context-crafter`)
- ✅ Repository is public and accessible
- ✅ GitHub release tagged `1.0.0` exists
- ✅ Release includes `main.js`, `manifest.json`, `styles.css`
- ✅ Fields in community-plugins.json match manifest.json exactly
- ✅ No 'v' prefix on version tag

## ⏱️ Timeline

- **Initial validation**: Automated (within minutes)
- **Review process**: Typically 1-2 weeks
- **Updates**: Can be discussed in the PR comments

## 📚 Resources

- [Official Submission Guide](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin)
- [Plugin Guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)
- [Submission Requirements](https://docs.obsidian.md/Plugins/Releasing/Submission+requirements+for+plugins)
- [obsidian-releases Repository](https://github.com/obsidianmd/obsidian-releases)

## 🔄 After Submission

Once your plugin is approved and merged:

1. It will appear in Obsidian's Community Plugins directory
2. Users can install it directly from Obsidian
3. Future updates only require creating new GitHub releases (no PR needed)
4. Update process:
   - Bump version in manifest.json
   - Add entry to versions.json
   - Run `npm run build`
   - Create new GitHub release with the new version tag

## 📞 Support

If you encounter issues during submission:

- Check the [Obsidian Developer Discord](https://discord.gg/obsidianmd)
- Review [common submission issues](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin#Common+issues)
- Ask in the PR comments if validation fails

---

**Current Status**: ✅ Ready for submission!

All preparation work is complete. Follow Steps 1 and 2 above to create the release and submit to Obsidian.
