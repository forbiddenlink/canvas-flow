# CanvasFlow - Professional Web Design Tool with AI & Code Export

![CanvasFlow](https://img.shields.io/badge/Status-In%20Development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

A professional-grade web design tool that combines AI image generation with comprehensive canvas-based editing tools and production-ready code export. Think Figma + Midjourney + Builder.io.

## 🚀 Features

### 🎨 Design to Code (NEW!)
- **HTML + CSS Export**: Semantic HTML with responsive CSS
- **React Components**: TypeScript components with Tailwind CSS or CSS Modules
- **Vue Components**: (Coming Soon) Vue 3 with Composition API
- **Auto-Layout Detection**: Automatically infers flexbox layouts from design
- **Code Formatting**: Beautiful output with Prettier
- **Multiple Styling Options**: Tailwind, CSS Modules, or inline styles
- **Responsive Export**: Media queries for mobile, tablet, desktop
- **Keyboard Shortcut**: `Cmd/Ctrl + Shift + E` for instant export

### 🧩 Component System
- **Create Components**: Convert selections to reusable components (`Cmd/Ctrl + K`)
- **Component Library**: Browse, search, and manage your component library
- **Component Instances**: Use and customize component instances
- **Export/Import**: Share components across projects

### 🎨 Design Tokens
- **Color Tokens**: Define and manage color palettes
- **Typography**: Text styles with font, size, weight, line-height
- **Effects**: Shadow and blur effect tokens
- **Consistency**: Maintain design system across all projects

### 📱 Responsive Design
- **Breakpoint System**: Mobile (375px), Tablet (768px), Desktop (1024px), Wide (1440px)
- **Breakpoint Toolbar**: Switch between breakpoints to test layouts
- **Responsive Properties**: Define different values per breakpoint
- **Mobile-First or Desktop-First**: Choose your approach

### AI Image Generation
- **Multi-Model Support**: Flux Pro, Flux Dev, SDXL, Stable Diffusion 3
- **Advanced Controls**: Style presets, aspect ratios, negative prompts, seed control
- **Batch Generation**: Generate 2-4 variations at once
- **Image-to-Image**: Transform existing images with AI
- **Smart Queue**: Manage multiple generation requests efficiently

### Professional Canvas Editor
- **Layer Management**: Full layer system with opacity, blend modes, groups
- **Drawing Tools**: Brush, eraser, shapes, gradients, text
- **Selection Tools**: Rectangle, ellipse, lasso, magic wand
- **Transform Tools**: Move, scale, rotate, flip, crop
- **Non-Destructive Editing**: 50+ step undo/redo history

### AI Enhancement Tools
- **Background Removal**: One-click background removal with edge refinement
- **AI Upscaling**: 2x/4x upscaling with Real-ESRGAN
- **Face Restoration**: Enhance low-quality faces
- **Object Removal**: Inpainting to remove unwanted objects
- **Style Transfer**: Apply artistic styles to images
- **Smart Enhance**: Auto color correction and sharpening
- **AI Expand**: Extend image borders naturally (outpainting)

### Filters & Adjustments
- **Basic Adjustments**: Brightness, contrast, saturation, hue, temperature
- **Advanced**: Curves editor, levels, HSL/color mixer, split toning
- **Effects**: Blur (Gaussian, motion, radial), sharpen, vignette, noise
- **Preset Filters**: Vintage, cinematic, B&W, HDR, and more
- **Custom Filters**: Create and save your own filter combinations

### Project Management
- **Auto-Save**: Automatic saving every 30 seconds
- **Version History**: Create snapshots and restore previous versions
- **Templates**: Social media, posters, thumbnails, business cards
- **Asset Library**: Upload and manage custom assets, fonts, shapes
- **Search & Organize**: Find projects quickly with search and filters

### Export & Sharing
- **Multiple Formats**: PNG, JPEG, WebP, SVG, AVIF
- **Custom Resolution**: Export at any size while maintaining quality
- **Batch Export**: Export multiple layers or variations at once
- **Code Export**: HTML/CSS, React, Vue components (production-ready)
- **Share Links**: Create temporary public links with analytics
- **Metadata**: Embed prompts and settings in exported files

## 🛠️ Technology Stack

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript (Strict Mode)
- Tailwind CSS + shadcn/ui
- Fabric.js (Canvas)
- Zustand (State Management)
- React Query (Server State)
- Framer Motion (Animations)

**Backend:**
- Next.js Server Actions & API Routes
- PostgreSQL + Prisma ORM
- NextAuth.js (Authentication)
- Sharp (Image Processing)

**Code Generation:**
- Prettier (Code Formatting)
- js-beautify (HTML/CSS Formatting)
- Custom AST Generators (HTML, CSS, React, Vue)

**AI Providers:**
- Replicate API (Primary)
- fal.ai (Fallback)
- Stability AI (Optional)
- @imgly/background-removal (Client-side fallback)

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL database (or SQLite for development)
- API keys for AI providers (can use keys at `/tmp/api-key` for testing)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/forbiddenlink/canvas-flow.git
cd canvas-flow

# Run the initialization script
./init.sh
```

The `init.sh` script will:
- Check Node.js version
- Install dependencies
- Set up environment variables
- Configure the database
- Start the development server

### 2. Manual Setup (Alternative)

If you prefer manual setup:

```bash
# Install dependencies
npm install
# or
pnpm install

# Copy environment variables
cp .env.example .env

# Configure your .env file (see below)

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### 3. Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Try Code Export (New!)

1. **Navigate to the editor**: Go to `/editor`
2. **Load demo content**: Click the "Load Demo" button (✨ sparkle icon) in the toolbar
3. **Export to code**: Press `Cmd/Ctrl + Shift + E` or click "Export Code"
4. **Choose format**: Select HTML/CSS, React, or Vue
5. **Configure options**: 
   - HTML: Semantic tags, responsive CSS
   - React: TypeScript, Tailwind CSS, Next.js
6. **Generate & Copy**: Click "Generate", then "Copy" or "Download"

**See [DEMO_GUIDE.md](DEMO_GUIDE.md) for detailed instructions and examples.**

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database (required)
DATABASE_URL="postgresql://user:password@localhost:5432/canvasflow"
# For development, you can use SQLite:
# DATABASE_URL="file:./dev.db"

# Authentication (required)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# AI API Keys (required for generation features)
REPLICATE_API_KEY="your_replicate_api_key"
# Optional fallback providers:
FAL_AI_API_KEY="your_fal_ai_key"
STABILITY_API_KEY="your_stability_key"

# Storage (optional for development)
STORAGE_ACCESS_KEY="your_storage_access_key"
STORAGE_SECRET_KEY="your_storage_secret_key"
STORAGE_BUCKET="canvasflow-images"
STORAGE_ENDPOINT="https://your-storage-endpoint"

# Rate Limiting (optional for development)
UPSTASH_REDIS_URL="your_redis_url"
UPSTASH_REDIS_TOKEN="your_redis_token"

# Analytics (optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your_analytics_id"
SENTRY_DSN="your_sentry_dsn"
```

### Getting API Keys

- **Replicate**: Sign up at [replicate.com](https://replicate.com) and get your API key
- **Database**: Use PostgreSQL for production or SQLite (`file:./dev.db`) for development
- **NextAuth Secret**: Generate a secure random string for `NEXTAUTH_SECRET`

## 📁 Project Structure

```
canvas-flow/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── canvas/      # Canvas editor components
│   │   ├── generation/  # AI generation components
│   │   └── shared/      # Shared components
│   ├── lib/             # Utility functions
│   │   ├── ai/         # AI provider integrations
│   │   ├── canvas/     # Canvas utilities
│   │   └── db/         # Database utilities
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand stores
│   ├── types/           # TypeScript types
│   └── styles/          # Global styles
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static assets
├── feature_list.json    # Comprehensive test cases (200+)
├── init.sh             # Quick setup script
└── README.md           # This file
```

## 🧪 Testing

The project uses `feature_list.json` which contains 200+ detailed test cases covering:
- Functional features (generation, editing, export)
- Style and UI requirements
- Integration workflows
- Performance benchmarks
- Security requirements

Each test case includes:
- Clear description
- Step-by-step testing instructions
- Pass/fail status

## ⌨️ Keyboard Shortcuts

### File Operations
| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + S` | Save project |
| `Cmd/Ctrl + E` | Export image |
| `Cmd/Ctrl + Shift + E` | **Export to code** (HTML/React/Vue) |

### Tools
| Shortcut | Action |
|----------|--------|
| `V` | Move/Select tool |
| `B` | Brush tool |
| `E` | Eraser tool |
| `P` | Pencil tool |
| `T` | Text tool |
| `C` | Crop tool |

### Components & AI
| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Create component from selection |
| `Cmd/Ctrl + G` | Generate AI image |

### History & View
| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Cmd/Ctrl + +` | Zoom in |
| `Cmd/Ctrl + -` | Zoom out |
| `Cmd/Ctrl + 0` | Fit to screen |
| `Space + Drag` | Pan canvas |

### Other
| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + D` | Duplicate layer |
| `Cmd/Ctrl + T` | Transform mode |
| `Delete` | Delete layer |
| `?` | Show all keyboard shortcuts |

## 🎨 Design System

- **Primary Colors**: Purple/Blue gradient (#6366F1 to #8B5CF6)
- **Secondary**: Teal/Cyan (#14B8A6)
- **Dark Mode**: #0F0F0F background, #1A1A1A panels (default)
- **Light Mode**: #FFFFFF background, #F9FAFB panels
- **Typography**: Inter (primary), JetBrains Mono (code)
- **Icons**: Lucide React (consistent 2px stroke)

## 📈 Development Progress

Track development progress in `feature_list.json`. As features are implemented and tested:
1. Test the feature according to the steps
2. Update `"passes": false` to `"passes": true`
3. Commit the changes

**Important**: Never remove or edit features from the list. Only mark them as passing.

## 🤝 Contributing

This is an autonomous development project. Each coding session:
1. Review `feature_list.json` for next priorities
2. Implement features from highest priority first
3. Test thoroughly before marking as passing
4. Commit progress with clear messages
5. Update `claude-progress.txt` before session ends

## 📝 Development Notes

- **Production Ready**: Focus on quality over speed
- **Type Safety**: Strict TypeScript, no `any` types
- **Error Handling**: Comprehensive error handling throughout
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: 60fps canvas, handles 4K images
- **Security**: API keys never exposed client-side

## 🚢 Deployment

Ready for deployment to:
- **Vercel** (recommended for Next.js)
- **AWS**
- **Digital Ocean**
- Any Node.js hosting platform

See deployment documentation for production setup.

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues, questions, or suggestions:
- Check the keyboard shortcuts reference (`?` key in app)
- Review `feature_list.json` for expected behavior
- Consult the inline documentation in code

---

**Status**: In active development | **Current Phase**: Initial setup and foundation

Built with ❤️ using Next.js, TypeScript, and AI
