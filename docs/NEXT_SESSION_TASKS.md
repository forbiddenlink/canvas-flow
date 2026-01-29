# Next Session Tasks - Quick Start Guide
**Session 27 Focus:** Image Adjustments Panel Completion  
**Estimated Time:** 3-4 hours  
**Target:** 83-85 tests passing (from current 79)

## 🎯 Goal
Implement temperature, exposure, shadows, and highlights controls in the adjustments panel.

## 📋 Step-by-Step Implementation

### Phase 1: Add Temperature Control (30-45 min)
**What it does:** Shifts colors warmer (orange/yellow) or cooler (blue)

1. Open `src/components/adjustments/adjustments-panel.tsx`
2. Add temperature slider:
   ```tsx
   <div className="space-y-2">
     <Label>Temperature</Label>
     <Slider
       value={[temperature]}
       onValueChange={([v]) => setTemperature(v)}
       min={-100}
       max={100}
       step={1}
     />
     <span className="text-xs text-muted-foreground">{temperature}</span>
   </div>
   ```

3. Create temperature adjustment function in `src/lib/canvas/image-adjustments.ts`:
   ```typescript
   export function applyTemperature(image: fabric.Image, value: number) {
     const filters = image.filters || [];
     
     // Remove existing temperature filter
     const newFilters = filters.filter(f => f.type !== 'Temperature');
     
     if (value !== 0) {
       // Add new temperature filter
       newFilters.push(new fabric.Image.filters.ColorMatrix({
         matrix: getTemperatureMatrix(value)
       }));
     }
     
     image.filters = newFilters;
     image.applyFilters();
   }
   
   function getTemperatureMatrix(value: number): number[] {
     // Warm (positive): boost reds/yellows, reduce blues
     // Cool (negative): boost blues, reduce reds/yellows
     const amount = value / 100;
     
     if (amount > 0) {
       // Warm
       return [
         1 + amount * 0.3, 0, 0, 0, 0,
         0, 1, 0, 0, 0,
         0, 0, 1 - amount * 0.3, 0, 0,
         0, 0, 0, 1, 0
       ];
     } else {
       // Cool
       const absAmount = Math.abs(amount);
       return [
         1 - absAmount * 0.3, 0, 0, 0, 0,
         0, 1, 0, 0, 0,
         0, 0, 1 + absAmount * 0.3, 0, 0,
         0, 0, 0, 1, 0
       ];
     }
   }
   ```

4. Test:
   - Open image in editor
   - Open adjustments panel
   - Slide temperature to +50 → should look warmer/orange
   - Slide to -50 → should look cooler/blue
   - Reset to 0 → back to original

**Tests to verify:**
- Find in feature_list.json: "Temperature control"
- Mark as `"passes": true` after testing

---

### Phase 2: Add Exposure Control (30-45 min)
**What it does:** Brightens/darkens the overall image

1. Add exposure slider to adjustments panel
2. Create exposure function:
   ```typescript
   export function applyExposure(image: fabric.Image, value: number) {
     // value: -2 to +2 (EV stops)
     const multiplier = Math.pow(2, value);
     
     const filter = new fabric.Image.filters.Brightness({
       brightness: (multiplier - 1)
     });
     
     // Apply filter...
   }
   ```

3. Test with various values (-2, -1, 0, +1, +2)

---

### Phase 3: Add Shadows/Highlights (45-60 min)
**What it does:** Independently adjust dark and bright areas

1. Add two sliders: Shadows (-100 to +100), Highlights (-100 to +100)
2. Implement advanced algorithm:
   ```typescript
   export function applyShadowsHighlights(
     image: fabric.Image, 
     shadows: number, 
     highlights: number
   ) {
     // This requires analyzing pixel luminance
     // and applying different adjustments based on brightness
     // More complex - see implementation details in roadmap
   }
   ```

---

### Phase 4: Auto White Balance (30-45 min)
**What it does:** Automatically corrects color temperature

1. Add "Auto White Balance" button
2. Analyze image histogram
3. Calculate correction values
4. Apply automatically

---

## 🧪 Testing Checklist

After implementation, verify these tests pass:
- [ ] Temperature control works (-100 to +100)
- [ ] Exposure control works (-2 to +2 EV)
- [ ] Shadows slider lifts shadows without affecting highlights
- [ ] Highlights slider recovers highlights
- [ ] Auto white balance detects and corrects color cast
- [ ] Comparison slider shows before/after
- [ ] All adjustments are non-destructive
- [ ] Undo/redo works for all adjustments

## 📦 Files to Create/Modify

**Create:**
- `src/lib/canvas/image-adjustments.ts` ← Main adjustment functions

**Modify:**
- `src/components/adjustments/adjustments-panel.tsx` ← Add UI controls
- `src/store/canvas-store.ts` ← Add adjustment state if needed

## 🎨 UI Design Reference

The panel should look like:
```
┌─ Adjustments ──────────────┐
│                             │
│ Temperature   [-100 ←  0 → +100] │
│ Exposure      [ -2  ←  0 →  +2 ] │
│ Shadows       [-100 ←  0 → +100] │
│ Highlights    [-100 ←  0 → +100] │
│                             │
│ [Auto White Balance]        │
│ [Reset All]                 │
│                             │
└─────────────────────────────┘
```

## ⚠️ Common Pitfalls

1. **Fabric.js filter types** - Make sure to check available filters
2. **Performance** - Apply filters on mouseup, not during dragging
3. **State management** - Store adjustment values in state
4. **Undo/redo** - Save state before applying adjustments
5. **TypeScript types** - Don't use `any`, properly type fabric.Image

## ✅ Definition of Done

- [ ] All 4 controls implemented and functional
- [ ] UI matches design system (dark mode compatible)
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] feature_list.json updated with passing tests
- [ ] Git commit with clear message
- [ ] Manual testing confirms all features work
- [ ] Build succeeds (`npm run build`)

## 🚀 After This Session

Next session will focus on **Filter Effects** (blur, sharpen, vignette).  
This is a separate system from adjustments - filters are effects, adjustments are corrections.

---

**Good luck! Remember:**
- Take breaks every hour
- Test incrementally
- Commit after each major feature
- Update feature_list.json as you go
- Keep build passing at all times
