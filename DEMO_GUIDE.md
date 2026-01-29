# PixelForge Demo Guide

## 🚀 Quick Start: Testing Code Export

The code export feature allows you to convert your canvas designs into production-ready code (HTML/CSS, React, Vue).

### Step 1: Load Demo Content

1. Open the editor: http://localhost:3003/editor
2. Click the **"Load Demo"** button in the canvas toolbar (sparkle icon ✨)
3. This will populate your canvas with sample UI elements (cards, buttons, header, features)

### Step 2: Explore Code Export Options

There are **3 ways** to access code export:

#### Method 1: Keyboard Shortcut (Fastest)
- Press `Cmd + Shift + E` (Mac) or `Ctrl + Shift + E` (Windows/Linux)

#### Method 2: Canvas Toolbar
- Click the **"Export Code"** button in the toolbar (next to "Load Demo")

#### Method 3: Top Navigation
- Click the **"Export Code"** button in the top nav bar

### Step 3: Configure Export Settings

The Code Export Modal has 3 main sections:

#### 1. **Format Selection**
- **HTML + CSS**: Generates semantic HTML with responsive CSS
- **React Component**: Creates TypeScript/JavaScript React components
- **Vue Component**: Generates Vue 3 components (coming soon)

#### 2. **Options Panel**

**HTML Options:**
- ✅ Use semantic tags (header, nav, section vs all divs)
- ✅ Clean IDs (remove special characters)
- ✅ Include data attributes (helpful for testing)

**CSS Options:**
- **Format**: 
  - `classes` - Traditional CSS classes
  - `css-modules` - CSS Modules for React
  - `inline` - Inline styles
- ✅ Include responsive styles (media queries)
- ✅ Mobile-first (min-width) vs Desktop-first (max-width)

**React Options:**
- ✅ Use TypeScript
- **Framework**: React or Next.js
- **Style Format**: Tailwind CSS, CSS Modules, or Inline styles

#### 3. **Code Preview**
- Live preview with syntax highlighting
- **Copy** button to copy code to clipboard
- **Download** button to save as files

### Step 4: Test Different Formats

Try exporting the demo content in different formats to see the output:

1. **HTML + CSS (Default)**
   ```html
   <div class="container">
     <header class="header">
       <h1>Welcome to PixelForge</h1>
     </header>
     <!-- ... -->
   </div>
   ```

2. **React with TypeScript + Tailwind**
   ```tsx
   export default function Component() {
     return (
       <div className="flex flex-col gap-4">
         <div className="bg-blue-500 rounded-lg p-4">
           <h1 className="text-white text-3xl">Welcome to PixelForge</h1>
         </div>
       </div>
     );
   }
   ```

3. **React with CSS Modules**
   - Component code in one tab
   - CSS Module styles in another tab

## 🎨 Design Tokens

### Accessing the Tokens Panel
1. Look for the **"Tokens"** tab in the right sidebar (next to Properties, Layers, etc.)
2. Click on it to open the Design Tokens Panel

### Adding Color Tokens
1. Go to the **Colors** tab
2. Click **"Add Color"**
3. Enter:
   - Name: `primary-blue`
   - Value: `#3b82f6`
4. Click **"Add"**

Your color tokens will be available for reuse across your designs.

### Adding Text Styles
1. Go to the **Typography** tab
2. Click **"Add Text Style"**
3. Configure:
   - Name: `heading-large`
   - Font: `Arial`
   - Size: `32px`
   - Weight: `bold`
   - Line Height: `1.2`
4. Click **"Add"**

## 📋 Keyboard Shortcuts Reference

Press `?` to open the full shortcuts modal, or use these key combinations:

### File Operations
- `Cmd/Ctrl + S` - Save project
- `Cmd/Ctrl + E` - Export image (PNG/JPG)
- `Cmd/Ctrl + Shift + E` - **Export to code** (HTML/React/Vue)

### Tools
- `V` - Select/Move tool
- `B` - Brush tool
- `E` - Eraser tool
- `P` - Pencil tool
- `T` - Text tool
- `C` - Crop tool

### Components
- `Cmd/Ctrl + K` - Create component from selection
- `Cmd/Ctrl + G` - Open AI generation modal

### History
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo

### View
- `Cmd/Ctrl + +` - Zoom in
- `Cmd/Ctrl + -` - Zoom out
- `Cmd/Ctrl + 0` - Fit to screen

### Help
- `?` - Show keyboard shortcuts

## 🧪 Test Workflow

### End-to-End Code Export Test

1. **Create Design**
   - Click "Load Demo" to populate canvas with sample content
   - OR manually create elements (rectangles, text, images)

2. **Switch Breakpoints** (optional)
   - Use the breakpoint toolbar to test responsive layouts
   - Available breakpoints: Mobile (375px), Tablet (768px), Desktop (1024px), Wide (1440px)

3. **Export to HTML + CSS**
   - Press `Cmd + Shift + E`
   - Select "HTML + CSS"
   - Enable "Use semantic tags" and "Include responsive styles"
   - Click "Generate"
   - Review the HTML tab and CSS tab
   - Click "Copy" or "Download"

4. **Export to React**
   - Click "Generate" again
   - Select "React Component"
   - Choose TypeScript + Tailwind CSS
   - Click "Generate"
   - Review the Component tab
   - Copy and paste into your React project

5. **Verify Output**
   - Create a test HTML file with the exported code
   - Open in browser to verify it renders correctly
   - Check responsive behavior at different screen sizes

## 🐛 Troubleshooting

### Export Modal Not Opening
- Check browser console for errors
- Verify you're on the editor page (`/editor`)
- Try the keyboard shortcut `Cmd + Shift + E`

### Code Preview Shows Errors
- Ensure canvas has content (click "Load Demo" first)
- Check that Prettier is installed (`pnpm install`)
- Review browser console for detailed error messages

### Keyboard Shortcuts Not Working
- Make sure you're not focused in an input field
- Check if the shortcuts modal opens with `?`
- Verify the correct modifier keys (Cmd on Mac, Ctrl on Windows/Linux)

## 🎯 Next Steps

1. **Try Creating Your Own Design**
   - Use the toolbar to add shapes, text, and images
   - Export to code and use in your projects

2. **Explore Component System**
   - Select multiple elements
   - Press `Cmd + K` to create a reusable component
   - Browse components in the Component Library Panel

3. **Test Responsive Design**
   - Switch between breakpoints
   - See how your design adapts
   - Export responsive CSS

4. **Use Design Tokens**
   - Define color palette in Tokens panel
   - Create typography styles
   - Maintain consistency across designs

## 📚 Additional Resources

- See [README.md](README.md) for project setup and architecture
- Check keyboard shortcuts with `?` key
- Explore all panels: Layers, History, Properties, Adjustments, Components, Tokens

---

**Note**: The code export feature uses Prettier for code formatting and supports semantic HTML, responsive CSS with media queries, and modern React patterns. All exported code is production-ready and follows best practices.
