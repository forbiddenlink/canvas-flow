# Next Steps for PixelForge Development

## Quick Start for Next Session

```bash
# Option 1: Use the init script (recommended)
./init.sh

# Option 2: Manual setup
npm install
cp .env.example .env
# Edit .env file with your configuration
npm run db:generate
npm run db:push
npm run dev
```

## Immediate Priorities (Session 2)

### 1. Environment Setup & Verification ⚡
- [ ] Install dependencies with `npm install`
- [ ] Create `.env` file from `.env.example`
- [ ] Configure DATABASE_URL (SQLite: `file:./dev.db` for quick start)
- [ ] Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Add REPLICATE_API_KEY from `/tmp/api-key`
- [ ] Run database migrations
- [ ] Test dev server starts successfully
- [ ] **Mark first 5 features in feature_list.json as passing**

### 2. Core UI Layout (Priority: HIGH) 🎨
**Implements:** Features #3-4 in feature_list.json

Create the main editor layout:
- [ ] Create `/src/app/editor/page.tsx` - Main editor page
- [ ] Create `/src/app/editor/layout.tsx` - Editor-specific layout
- [ ] Build three-panel layout component:
  - Left sidebar (tools)
  - Center canvas area
  - Right sidebar (layers, history)
- [ ] Add top toolbar
- [ ] Add bottom status bar
- [ ] Make panels resizable
- [ ] Add collapsible functionality
- [ ] Test responsive behavior

**Files to create:**
```
src/app/editor/
  ├── page.tsx
  ├── layout.tsx
src/components/editor/
  ├── EditorLayout.tsx
  ├── LeftSidebar.tsx
  ├── CanvasArea.tsx
  ├── RightSidebar.tsx
  ├── TopToolbar.tsx
  └── StatusBar.tsx
```

### 3. Canvas Integration (Priority: HIGH) 🖼️
**Implements:** Features #9-13 in feature_list.json

Initialize Fabric.js canvas:
- [ ] Install Fabric.js (already in package.json)
- [ ] Create canvas component wrapper
- [ ] Initialize Fabric.js canvas with transparent grid
- [ ] Implement zoom controls (in/out/fit)
- [ ] Implement pan functionality
- [ ] Add canvas state management with Zustand
- [ ] Test canvas renders without errors

**Files to create:**
```
src/components/canvas/
  ├── Canvas.tsx
  ├── CanvasWrapper.tsx
  ├── ZoomControls.tsx
  └── CanvasGrid.tsx
src/store/
  └── canvasStore.ts
src/lib/canvas/
  └── fabricUtils.ts
```

### 4. Layer Management UI (Priority: HIGH) 📑
**Implements:** Features #33-44 in feature_list.json

Build the layers panel:
- [ ] Create layers panel component
- [ ] Display layer list with thumbnails
- [ ] Add visibility toggle (eye icon)
- [ ] Add lock toggle
- [ ] Add opacity slider
- [ ] Implement drag-and-drop reordering
- [ ] Add layer controls (add, delete, duplicate)
- [ ] Test layer operations

**Files to create:**
```
src/components/canvas/
  ├── LayersPanel.tsx
  ├── LayerItem.tsx
  └── LayerControls.tsx
```

## Feature Implementation Order

Based on `feature_list.json`, implement in this order:

### Phase 1: Foundation (Features 1-20)
✅ Project setup & config
⬜ UI layout & navigation
⬜ Canvas core functionality
⬜ Theme system
⬜ Basic authentication

### Phase 2: AI Generation (Features 14-32)
⬜ Generation modal UI
⬜ Replicate API integration
⬜ Text-to-image generation
⬜ Model selection
⬜ Parameter controls
⬜ Progress tracking
⬜ Result preview

### Phase 3: Layer System (Features 33-44)
⬜ Layer creation/deletion
⬜ Layer reordering
⬜ Layer visibility/lock
⬜ Opacity & blend modes
⬜ Layer groups

### Phase 4: Tools (Features 45-70)
⬜ Selection tools
⬜ Transform tools
⬜ Drawing tools
⬜ Text tool
⬜ Shape tools

### Phase 5: AI Enhancements (Features 71-82)
⬜ Background removal
⬜ Upscaling
⬜ Face restoration
⬜ Style transfer
⬜ Smart enhance

### Phase 6: Filters & Adjustments (Features 83-93)
⬜ Basic adjustments
⬜ Curves & levels
⬜ Preset filters
⬜ Custom filters

### Phase 7: Projects & Export (Features 94-120)
⬜ Project save/load
⬜ Auto-save
⬜ Project management
⬜ Export functionality

## Testing Workflow

For each feature implemented:

1. **Implement** the feature following the spec
2. **Test manually** using the steps in feature_list.json
3. **Update feature_list.json**: Change `"passes": false` to `"passes": true`
4. **Commit** with descriptive message
5. **Move to next feature**

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma Client
npm run db:push         # Push schema to database
npm run db:studio       # Open Prisma Studio

# Testing
npm run lint            # Run ESLint

# Git
git status              # Check status
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git log --oneline       # View commit history
```

## Key Files Reference

- **feature_list.json** - All 200 test cases (source of truth)
- **app_spec.txt** - Full specification (reference)
- **claude-progress.txt** - Session progress tracking
- **README.md** - Project documentation
- **init.sh** - Quick setup script

## Important Notes

⚠️ **Never remove or edit features in feature_list.json** - Only mark as passing
✅ **Commit frequently** - After each feature or logical group
📝 **Update claude-progress.txt** - At end of each session
🎯 **Focus on quality** - Production-ready code, strict TypeScript
🔐 **Security first** - Never expose API keys client-side

## Session Goals

**Minimum for Session 2:**
- Environment fully set up and working
- Dev server running successfully
- Three-panel layout rendered
- Canvas initialized with Fabric.js
- At least 10 features marked as passing

**Stretch goals:**
- Layers panel functional
- Basic zoom/pan working
- Theme toggle working
- First AI generation test

---

Ready to build! 🚀
