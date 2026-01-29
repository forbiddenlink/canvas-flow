import Link from "next/link";
import { Sparkles, Paintbrush, Wand2, Layers, Download, Share2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            PixelForge
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Creation Platform</span>
          </div>

          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            PixelForge
          </h1>

          <p className="text-2xl text-muted-foreground mb-4">
            Professional AI Image Generation & Editing Platform
          </p>

          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Create stunning images with AI and edit them with professional-grade tools.
            Combine the power of Midjourney with the flexibility of Photoshop.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/editor"
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:-translate-y-1"
            >
              Launch Editor
            </Link>
            <Link
              href="/gallery"
              className="px-8 py-4 border-2 border-border rounded-lg font-semibold hover:bg-muted transition-all"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="AI Image Generation"
            description="Generate stunning images with Flux Pro, SDXL, and Stable Diffusion. Multiple models, style presets, and advanced controls."
          />

          <FeatureCard
            icon={<Paintbrush className="w-8 h-8" />}
            title="Professional Canvas"
            description="Full-featured canvas editor with layers, blend modes, brushes, and all the tools you need for professional editing."
          />

          <FeatureCard
            icon={<Wand2 className="w-8 h-8" />}
            title="AI Enhancement"
            description="Background removal, upscaling, face restoration, object removal, and style transfer with cutting-edge AI."
          />

          <FeatureCard
            icon={<Layers className="w-8 h-8" />}
            title="Layer Management"
            description="Organize your work with a powerful layer system. Group, blend, lock, and control every aspect of your composition."
          />

          <FeatureCard
            icon={<Download className="w-8 h-8" />}
            title="Export Anywhere"
            description="Export to PNG, JPEG, WebP, SVG, and more. Custom resolutions, batch export, and metadata preservation."
          />

          <FeatureCard
            icon={<Share2 className="w-8 h-8" />}
            title="Share & Collaborate"
            description="Create shareable links, export history, and manage your creative projects with ease."
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>Built with Next.js, TypeScript, and AI • PixelForge © 2024</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
