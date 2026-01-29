# PixelForge Enhancement Roadmap
**Created:** December 13, 2025  
**Current Status:** 79/213 tests passing (37.1%)  
**Build Status:** ✅ PASSING (zero errors, zero warnings)

## 🎯 Immediate Priorities (Next 3-5 Sessions)

### Session Goals
Target: 95-105 tests passing (45-50% completion rate)

---

## 🔥 HIGH PRIORITY - Quick Wins (Can be done without API keys)

### 1. Image Adjustments Panel Completion ⭐⭐⭐
**Estimated Tests:** 8-10 tests  
**Complexity:** Medium  
**Time:** 3-4 hours

**Current Status:**
- ✅ Basic panel structure exists
- ✅ Comparison slider implemented
- ❌ Temperature control missing
- ❌ Exposure control missing
- ❌ Shadows/Highlights missing
- ❌ Auto white balance missing

**Implementation Tasks:**
1. Add temperature slider (-100 to +100)
   - Warm: shift towards orange/yellow
   - Cool: shift towards blue
2. Add exposure slider (-2 to +2 EV)
   - Adjust overall brightness with proper curve
3. Add shadows slider (-100 to +100)
   - Lift shadows without affecting midtones/highlights
4. Add highlights slider (-100 to +100)
   - Recover/reduce highlights
5. Add auto white balance button
   - Analyze image histogram
   - Calculate correction values
6. Add comparison toggle (before/after)

**Files to modify:**
- `src/components/adjustments/adjustments-panel.tsx`
- `src/lib/canvas/image-adjustments.ts` (create if not exists)

**Test Cases (from feature_list.json):**
- "Exposure compensation - Adjust overall exposure"
- "Shadows and highlights - Independent adjustment"
- "Auto white balance - Correct color temperature automatically"
- "Split toning - Different colors for shadows/highlights"

---

### 2. Filter Effects System ⭐⭐⭐
**Estimated Tests:** 6-8 tests  
**Complexity:** Medium-High  
**Time:** 4-5 hours

**Implementation Tasks:**
1. Create filter infrastructure:
   ```typescript
   // src/lib/canvas/filters.ts
   interface Filter {
     id: string;
     name: string;
     apply: (canvas: fabric.Canvas) => void;
     strength: number; // 0-100
   }
   ```

2. Implement core filters:
   - **Gaussian Blur** (WebGL for performance)
     - Use fabric.Image.filters.Blur
     - Add radius control (0-50px)
   - **Sharpen**
     - Use fabric.Image.filters.Convolute
     - Sharpen matrix kernel
   - **Vignette**
     - Radial gradient overlay
     - Control size and strength
   - **Motion Blur**
     - Directional blur effect
     - Angle and distance controls

3. Create preset filters:
   - Vintage (sepia + contrast + vignette)
   - B&W (desaturate + contrast boost)
   - Cinematic (slight desat + teal shadows + orange highlights)
   - HDR (local contrast + saturation boost)

4. Filter strength control:
   - Global strength slider (0-100%)
   - Blend original with filtered result

5. Custom filter saving:
   - Save filter combinations to localStorage
   - Load/apply saved filters

**Files to create/modify:**
- `src/lib/canvas/filters.ts` (create)
- `src/components/filters/filter-panel.tsx` (create)
- `src/components/filters/preset-filters.tsx` (create)
- `src/store/filter-store.ts` (create)

**Test Cases:**
- "Preset filters - Vintage filter applies correctly"
- "Filter strength control - Adjust filter intensity"
- "Custom filter saving - Save custom filter settings"
- "Motion blur effect - Apply motion blur"

---

### 3. Selection Tool - Visual Drawing ⭐⭐
**Estimated Tests:** 4-5 tests  
**Complexity:** Medium  
**Time:** 3-4 hours

**Current Status:**
- ✅ Selection tool UI exists
- ✅ Rectangle/Ellipse mode toggles
- ❌ No visual selection marquee drawn on canvas
- ❌ Cannot delete within selection
- ❌ Cannot move selection

**Implementation Tasks:**
1. Draw selection marquee:
   ```typescript
   // Animated dashed border ("marching ants")
   const selection = new fabric.Rect({
     fill: 'transparent',
     stroke: '#000',
     strokeWidth: 1,
     strokeDashArray: [5, 5],
     selectable: false,
     evented: false
   });
   ```

2. Animate selection border:
   - Use requestAnimationFrame
   - Offset strokeDashArray over time
   - Classic "marching ants" effect

3. Selection operations:
   - Delete content within selection
   - Move selection rectangle
   - Invert selection
   - Clear selection (Cmd+D)

4. Integration with other tools:
   - Apply filters to selection only
   - Copy/paste within selection
   - Transform selection contents

**Files to modify:**
- `src/components/canvas/fabric-canvas.tsx`
- `src/lib/canvas/selection-utils.ts` (create)
- `src/store/canvas-store.ts`

---

### 4. Enhanced Export Options ⭐⭐
**Estimated Tests:** 4-5 tests  
**Complexity:** Low-Medium  
**Time:** 2-3 hours

**Current Status:**
- ✅ Basic PNG export works
- ❌ Cannot export current layer only
- ❌ Cannot batch export layers
- ❌ No metadata embedding

**Implementation Tasks:**
1. Export current layer only:
   ```typescript
   async function exportCurrentLayer() {
     const layer = getCurrentLayer();
     const tempCanvas = new fabric.Canvas();
     tempCanvas.add(layer.clone());
     return tempCanvas.toDataURL();
   }
   ```

2. Batch export all layers:
   - Export each layer as separate file
   - ZIP files together using JSZip
   - Download as "project-name-layers.zip"

3. Metadata embedding:
   - Add text chunks to PNG (tEXt)
   - Include: creation date, dimensions, layer count
   - Include generation prompts if AI-generated

4. Export presets:
   - Social media sizes (Instagram, Twitter, etc.)
   - Quick export buttons for common formats
   - Remember last export settings

**Files to modify:**
- `src/components/export/export-modal.tsx`
- `src/lib/canvas/export-utils.ts` (create)

**Test Cases:**
- "Batch export layers - Export all layers individually"
- "Export metadata - Embed project info in exports"

---

## 🔧 MEDIUM PRIORITY - Foundation Improvements

### 5. Performance Optimizations ⭐
**Estimated Tests:** 2-3 tests  
**Time:** 2-3 hours

**Issues to Address:**
1. Canvas rendering performance:
   - Implement object caching
   - Use renderOnAddRemove: false
   - Manual render calls only when needed

2. Large image handling:
   - Downsample preview at high zoom out
   - Progressive loading for large files

3. Undo/redo optimization:
   - Don't store full canvas JSON
   - Store only deltas/changes
   - Limit to 50 steps (currently unlimited)

**Files to modify:**
- `src/lib/canvas/performance.ts` (create)
- `src/store/canvas-store.ts`
- `src/store/history-store.ts`

---

### 6. TypeScript Type Safety Improvements ⭐
**Current Issues:** 49 occurrences of `any` type  
**Time:** 4-6 hours

**Priority Files:**
1. `src/store/canvas-store.ts`
   - Replace `canvas: any` with `canvas: fabric.Canvas | null`
   
2. `src/components/canvas/fabric-canvas.tsx`
   - Properly type fabric.js globals
   
3. `src/app/api/generate/route.ts`
   - Add Replicate API types

**Files to modify:**
- Create `src/types/fabric.d.ts`
- Update all stores with proper types
- Add `@types/replicate` if available

---

## 📊 TESTING & QUALITY

### 7. Add Unit Tests ⭐⭐
**Time:** 4-5 hours

**Test Coverage Needed:**
1. Filter utilities
2. Image adjustment calculations
3. Export functions
4. Canvas utility functions

**Setup:**
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

**Create:**
- `vitest.config.ts`
- `src/__tests__/filters.test.ts`
- `src/__tests__/adjustments.test.ts`
- `src/__tests__/export.test.ts`

---

## 🎨 UI/UX ENHANCEMENTS

### 8. Keyboard Shortcuts Expansion
**Time:** 1-2 hours

**Add shortcuts for:**
- `Cmd+Shift+E` - Export current layer
- `Cmd+I` - Invert selection
- `Cmd+Shift+I` - Invert image colors
- `Cmd+L` - Levels/Curves panel
- `Cmd+U` - Hue/Saturation panel
- `Cmd+B` - Brightness/Contrast panel

**Files to modify:**
- `src/hooks/use-keyboard-shortcuts.ts`
- `src/components/keyboard-shortcuts-modal.tsx`

---

### 9. Context Menus
**Time:** 2-3 hours

**Add right-click menus for:**
- Canvas (New layer, Paste, etc.)
- Layers (Duplicate, Delete, Merge, etc.)
- Objects (Transform, Filters, Adjustments)

**Implementation:**
```typescript
// Use @radix-ui/react-context-menu
<ContextMenu>
  <ContextMenuTrigger>
    <Canvas />
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>New Layer</ContextMenuItem>
    <ContextMenuItem>Paste</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

---

## 🚀 FUTURE ENHANCEMENTS (After 100+ tests passing)

### 10. Advanced Features
- **Layer Effects:**
  - Drop shadow
  - Inner/outer glow
  - Stroke overlay
  - Gradient overlay

- **Smart Tools:**
  - Content-aware fill (without AI)
  - Clone stamp tool
  - Healing brush (simple algorithm)

- **Collaboration:**
  - Share projects with view-only links
  - Export/import project files
  - Template marketplace

---

## 📈 Progress Tracking

### Current Metrics
- **Tests Passing:** 79/213 (37.1%)
- **Build Status:** ✅ PASSING
- **Lint Status:** ✅ ZERO WARNINGS
- **TypeScript Strict:** ✅ ENABLED

### Target Metrics (After Priority 1-4)
- **Tests Passing:** 95-105/213 (45-50%)
- **Code Quality:** Remove all `any` types
- **Performance:** 60fps canvas operations
- **Test Coverage:** 40%+ unit test coverage

---

## 💡 Implementation Strategy

### Session-by-Session Plan

**Session 27:** Image Adjustments (Temperature, Exposure, Shadows/Highlights)
- Goal: 83-85 tests passing
- Time: 3-4 hours

**Session 28:** Filter Effects (Blur, Sharpen, Vignette)
- Goal: 88-91 tests passing
- Time: 4-5 hours

**Session 29:** Preset Filters & Filter Strength Control
- Goal: 93-95 tests passing
- Time: 3-4 hours

**Session 30:** Selection Tool Drawing & Operations
- Goal: 97-100 tests passing
- Time: 3-4 hours

**Session 31:** Enhanced Export Options
- Goal: 102-105 tests passing
- Time: 2-3 hours

---

## ✅ Success Criteria

Each feature is considered complete when:
1. ✅ Implementation matches specification
2. ✅ All related tests in feature_list.json pass
3. ✅ Build passes with zero errors/warnings
4. ✅ TypeScript strict mode compliance
5. ✅ No new `any` types introduced
6. ✅ Documented in code comments
7. ✅ Git commit with clear message
8. ✅ feature_list.json updated with passing status

---

## 🔍 Code Quality Checklist

Before marking any feature as complete:
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] No `any` types (use proper fabric.Canvas types)
- [ ] No console.log (use proper error handling)
- [ ] Proper error boundaries
- [ ] Loading states for async operations
- [ ] Accessible (keyboard navigation works)
- [ ] Responsive UI (works on different screen sizes)
- [ ] Dark mode compatible
- [ ] Proper cleanup (useEffect cleanup functions)

---

## 📚 Resources

### Fabric.js Documentation
- Filters: http://fabricjs.com/fabric-filters
- Image manipulation: http://fabricjs.com/docs/fabric.Image.html

### Design References
- Photopea: https://www.photopea.com
- Canva: https://www.canva.com

### Libraries to Consider
- `jszip` - For batch export
- `sharp` - Server-side image processing
- `fabric-history` - Better undo/redo

---

## 🎯 North Star Goal

**Get to 150+ tests passing (70%+ completion) with production-ready code quality**

This means:
- All non-AI features fully implemented
- Comprehensive error handling
- Full TypeScript type safety
- Good performance (60fps)
- Professional UI/UX
- Ready for user testing

---

**Last Updated:** December 13, 2025  
**Autonomous Agent:** Claude Sonnet 4.5  
**Project:** PixelForge - AI Image Editor
