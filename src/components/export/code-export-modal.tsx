/**
 * Code Export Modal
 * UI for exporting designs to code (HTML, React, CSS)
 */

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, Copy, Download, FileCode } from 'lucide-react';
import { useCanvasStore } from '@/store/canvas-store';
import { HTMLGenerator } from '@/lib/export/html-generator';
import { CSSGenerator } from '@/lib/export/css-generator';
import { ReactGenerator } from '@/lib/export/react-generator';
import { CanvasConverter } from '@/lib/canvas/canvas-converter';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CodeExportModal({ isOpen, onClose }: CodeExportModalProps) {
  const { webElements, canvas, currentBreakpoint } = useCanvasStore();
  const [exportFormat, setExportFormat] = useState<'html' | 'react' | 'vue'>('html');
  const [generatedCode, setGeneratedCode] = useState<{
    html?: string;
    css?: string;
    component?: string;
  }>({});
  
  // HTML options
  const [htmlOptions, setHtmlOptions] = useState({
    semantic: true,
    cleanId: true,
    withDataAttrs: false,
    prettify: true,
  });
  
  // CSS options
  const [cssOptions, setCssOptions] = useState({
    format: 'classes' as 'inline' | 'classes' | 'css-modules',
    includeResponsive: true,
    mobileFirst: true,
    prettify: true,
  });
  
  // React options
  const [reactOptions, setReactOptions] = useState({
    typescript: true,
    framework: 'next' as 'react' | 'next',
    styleFormat: 'tailwind' as 'inline' | 'css-modules' | 'tailwind',
    prettify: true,
  });
  
  const handleGenerate = async () => {
    // Convert canvas to WebElements if webElements is empty
    let elementsToExport = webElements;
    let rootElement = Array.from(webElements.values())[0];
    
    if (!rootElement && canvas) {
      // Convert Fabric canvas to WebElements
      const converter = new CanvasConverter(currentBreakpoint);
      const { root, elements } = converter.convertCanvas(canvas);
      elementsToExport = elements;
      rootElement = root;
    }
    
    if (!rootElement) {
      console.error('No elements to export');
      return;
    }
    
    try {
      if (exportFormat === 'html') {
        // Generate HTML
        const htmlGen = new HTMLGenerator(htmlOptions);
        const html = await htmlGen.generate(rootElement, elementsToExport);
        
        // Generate CSS
        const cssGen = new CSSGenerator(cssOptions);
        const css = await cssGen.generate(rootElement, elementsToExport);
        
        setGeneratedCode({ html, css });
      } else if (exportFormat === 'react') {
        // Generate React component
        const reactGen = new ReactGenerator(reactOptions);
        const result = await reactGen.generate(rootElement, elementsToExport, 'Component');
        
        // Also generate CSS if not using Tailwind
        let css: string | undefined;
        if (reactOptions.styleFormat !== 'tailwind') {
          const cssGen = new CSSGenerator({
            ...cssOptions,
            format: reactOptions.styleFormat === 'css-modules' ? 'css-modules' : 'classes',
          });
          css = await cssGen.generate(rootElement, elementsToExport);
        }
        
        setGeneratedCode({ component: result.component, css });
      }
    } catch (error) {
      console.error('Export generation error:', error);
    }
  };
  
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };
  
  const handleDownload = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5" />
            Export to Code
          </DialogTitle>
          <DialogDescription>
            Generate production-ready code from your design
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Options Panel */}
          <div className="w-64 border-r pr-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Format Selection */}
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="html">HTML + CSS</SelectItem>
                    <SelectItem value="react">React Component</SelectItem>
                    <SelectItem value="vue">Vue Component</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* HTML Options */}
              {exportFormat === 'html' && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-medium text-sm">HTML Options</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="semantic" className="text-sm">Semantic tags</Label>
                    <Switch
                      id="semantic"
                      checked={htmlOptions.semantic}
                      onCheckedChange={(checked) => 
                        setHtmlOptions(prev => ({ ...prev, semantic: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cleanId" className="text-sm">Clean IDs</Label>
                    <Switch
                      id="cleanId"
                      checked={htmlOptions.cleanId}
                      onCheckedChange={(checked) => 
                        setHtmlOptions(prev => ({ ...prev, cleanId: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dataAttrs" className="text-sm">Data attributes</Label>
                    <Switch
                      id="dataAttrs"
                      checked={htmlOptions.withDataAttrs}
                      onCheckedChange={(checked) => 
                        setHtmlOptions(prev => ({ ...prev, withDataAttrs: checked }))
                      }
                    />
                  </div>
                  
                  <h3 className="font-medium text-sm pt-2">CSS Options</h3>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Format</Label>
                    <Select 
                      value={cssOptions.format} 
                      onValueChange={(v) => setCssOptions(prev => ({ ...prev, format: v as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classes">CSS Classes</SelectItem>
                        <SelectItem value="inline">Inline Styles</SelectItem>
                        <SelectItem value="css-modules">CSS Modules</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="responsive" className="text-sm">Media queries</Label>
                    <Switch
                      id="responsive"
                      checked={cssOptions.includeResponsive}
                      onCheckedChange={(checked) => 
                        setCssOptions(prev => ({ ...prev, includeResponsive: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mobileFirst" className="text-sm">Mobile-first</Label>
                    <Switch
                      id="mobileFirst"
                      checked={cssOptions.mobileFirst}
                      onCheckedChange={(checked) => 
                        setCssOptions(prev => ({ ...prev, mobileFirst: checked }))
                      }
                    />
                  </div>
                </div>
              )}
              
              {/* React Options */}
              {exportFormat === 'react' && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-medium text-sm">React Options</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="typescript" className="text-sm">TypeScript</Label>
                    <Switch
                      id="typescript"
                      checked={reactOptions.typescript}
                      onCheckedChange={(checked) => 
                        setReactOptions(prev => ({ ...prev, typescript: checked }))
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Framework</Label>
                    <Select 
                      value={reactOptions.framework} 
                      onValueChange={(v) => setReactOptions(prev => ({ ...prev, framework: v as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="next">Next.js</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Styling</Label>
                    <Select 
                      value={reactOptions.styleFormat} 
                      onValueChange={(v) => setReactOptions(prev => ({ ...prev, styleFormat: v as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                        <SelectItem value="css-modules">CSS Modules</SelectItem>
                        <SelectItem value="inline">Inline Styles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              <Button onClick={handleGenerate} className="w-full mt-4">
                <Code className="w-4 h-4 mr-2" />
                Generate Code
              </Button>
            </div>
          </div>
          
          {/* Code Preview */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="html" className="h-full flex flex-col">
              <TabsList className="w-full justify-start">
                {exportFormat === 'html' && (
                  <>
                    <TabsTrigger value="html">HTML</TabsTrigger>
                    <TabsTrigger value="css">CSS</TabsTrigger>
                  </>
                )}
                {exportFormat === 'react' && (
                  <>
                    <TabsTrigger value="component">Component</TabsTrigger>
                    {reactOptions.styleFormat !== 'tailwind' && (
                      <TabsTrigger value="styles">Styles</TabsTrigger>
                    )}
                  </>
                )}
              </TabsList>
              
              {exportFormat === 'html' && (
                <>
                  <TabsContent value="html" className="flex-1 overflow-hidden">
                    <CodePreview
                      code={generatedCode.html || '// Click "Generate Code" to preview'}
                      language="html"
                      onCopy={handleCopy}
                      onDownload={(code) => handleDownload(code, 'index.html')}
                    />
                  </TabsContent>
                  
                  <TabsContent value="css" className="flex-1 overflow-hidden">
                    <CodePreview
                      code={generatedCode.css || '// Click "Generate Code" to preview'}
                      language="css"
                      onCopy={handleCopy}
                      onDownload={(code) => handleDownload(code, 'styles.css')}
                    />
                  </TabsContent>
                </>
              )}
              
              {exportFormat === 'react' && (
                <>
                  <TabsContent value="component" className="flex-1 overflow-hidden">
                    <CodePreview
                      code={generatedCode.component || '// Click "Generate Code" to preview'}
                      language="typescript"
                      onCopy={handleCopy}
                      onDownload={(code) => handleDownload(code, reactOptions.typescript ? 'Component.tsx' : 'Component.jsx')}
                    />
                  </TabsContent>
                  
                  {reactOptions.styleFormat !== 'tailwind' && (
                    <TabsContent value="styles" className="flex-1 overflow-hidden">
                      <CodePreview
                        code={generatedCode.css || '// Click "Generate Code" to preview'}
                        language="css"
                        onCopy={handleCopy}
                        onDownload={(code) => handleDownload(code, 'Component.module.css')}
                      />
                    </TabsContent>
                  )}
                </>
              )}
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CodePreviewProps {
  code: string;
  language: string;
  onCopy: (code: string) => void;
  onDownload: (code: string) => void;
}

function CodePreview({ code, language, onCopy, onDownload }: CodePreviewProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{language.toUpperCase()}</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onCopy(code)}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDownload(code)}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 border rounded-md">
        <pre className="p-4 text-sm">
          <code>{code}</code>
        </pre>
      </ScrollArea>
    </div>
  );
}
