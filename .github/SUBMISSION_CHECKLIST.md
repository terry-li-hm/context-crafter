# Obsidian Community Plugin Submission Checklist

This checklist ensures Context Crafter is ready for submission to the Obsidian community plugins directory.

## ✅ Repository Files

- [x] **LICENSE** - MIT license file created
- [x] **README.md** - Comprehensive documentation with:
  - Clear description
  - Feature list
  - Installation instructions
  - Usage guide
  - Settings documentation
  - Use cases
  - Support information
- [x] **manifest.json** - Contains all required fields:
  - id: `context-crafter`
  - name: `Context Crafter`
  - version: `1.0.0`
  - minAppVersion: `1.5.0`
  - description: Clear, concise description
  - author: `Terry Li`
  - authorUrl: `https://github.com/terry-li-hm`
  - isDesktopOnly: `false`
- [x] **versions.json** - Version compatibility mapping
- [x] **main.js** - Production build (33KB)
- [x] **styles.css** - Plugin styles (9KB)
- [x] **.gitignore** - Excludes node_modules, build artifacts

## ✅ Code Quality

- [x] No TODOs, FIXMEs, or HACK comments
- [x] Production-ready code
- [x] TypeScript compilation passes
- [x] Clean architecture with proper separation of concerns
- [x] Error handling in place
- [x] Safety limits implemented (max 500 notes)
- [x] Mobile responsive design
- [x] No hardcoded API keys or sensitive data
- [x] Console logs are appropriate (load/unload messages, warnings only)

## ✅ Release Preparation

Before creating a GitHub release:

### 1. Final Code Review
- [ ] Test the plugin in a real Obsidian vault
- [ ] Test on both desktop and mobile
- [ ] Test with different vault sizes
- [ ] Verify all settings work correctly
- [ ] Test both commands:
  - "Craft context from current note"
  - "Quick copy (skip selection)"

### 2. Create GitHub Release

**IMPORTANT**: The Git tag must **exactly match** the version in manifest.json (e.g., `1.0.0`, NOT `v1.0.0`)

```bash
# Create and push the release tag
git tag 1.0.0
git push origin 1.0.0
```

Then create a GitHub release with:
- Tag: `1.0.0` (must match manifest.json version exactly)
- Title: `Context Crafter 1.0.0 - Initial Release`
- Description: Release notes highlighting features
- Assets: The build process will automatically create these files:
  - `main.js`
  - `manifest.json`
  - `styles.css`

**Note**: Obsidian will download these three files from your GitHub release automatically.

### 3. Submit to Community Plugins

1. Fork the [obsidian-releases](https://github.com/obsidianmd/obsidian-releases) repository
2. Add your plugin entry to `community-plugins.json` at the **end** of the file:

```json
{
  "id": "context-crafter",
  "name": "Context Crafter",
  "author": "Terry Li",
  "description": "Gather note context with metadata for AI/LLM prompts. Supports linked notes, manual selection, and smart auto-detection.",
  "repo": "terry-li-hm/context-crafter"
}
```

3. Create a pull request with:
   - Title: `Add Context Crafter plugin`
   - Description: Brief overview of what the plugin does
   - Link to your repository

4. Wait for the automated validation to pass
5. Wait for review from Obsidian team

### 4. Post-Submission

- [ ] Monitor the PR for feedback
- [ ] Respond to any review comments
- [ ] Update documentation if needed
- [ ] Plan for future updates and bug fixes

## 📋 Validation Checklist

The obsidian-releases repository has automated validation that will check:

- ✅ Plugin ID is unique
- ✅ All required fields are present
- ✅ Repository exists and is public
- ✅ Release with matching version tag exists
- ✅ Release contains main.js, manifest.json, and styles.css
- ✅ Git tag matches version exactly (no 'v' prefix)

## 🎯 Current Status

**All preparation tasks completed!** ✨

The plugin is ready for release. Next steps:

1. Test thoroughly in a real vault
2. Create GitHub release with tag `1.0.0`
3. Submit to community plugins directory

## 📚 Resources

- [Obsidian Plugin Submission Guidelines](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin)
- [Obsidian Releases Repository](https://github.com/obsidianmd/obsidian-releases)
- [Plugin Developer Documentation](https://docs.obsidian.md/)

## 🔄 For Future Releases

When releasing version updates:

1. Update version in both `manifest.json` and `package.json`
2. Add entry to `versions.json`: `"X.Y.Z": "minimum-obsidian-version"`
3. Run `npm run build` to create production build
4. Create git tag matching the new version
5. Create GitHub release with the tag
6. Obsidian will automatically detect and offer the update to users

No need to submit PR for updates - only the initial submission requires PR to obsidian-releases!
