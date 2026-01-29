import * as fabric from 'fabric';

/**
 * Canvas Demo Utilities
 * Helper functions to populate canvas with sample content for testing
 */

export function addSampleContent(canvas: fabric.Canvas) {
  if (!canvas) return;

  // Clear existing content
  canvas.clear();

  // Add a header section (blue rectangle with white text)
  const header = new fabric.Rect({
    left: 50,
    top: 50,
    width: 900,
    height: 80,
    fill: '#3b82f6',
    rx: 8,
    ry: 8,
  });
  canvas.add(header);

  const headerText = new fabric.IText('Welcome to PixelForge', {
    left: 450,
    top: 75,
    fontSize: 32,
    fontFamily: 'Arial',
    fill: '#ffffff',
    originX: 'center',
  });
  canvas.add(headerText);

  // Add a card-like section
  const card = new fabric.Rect({
    left: 50,
    top: 160,
    width: 400,
    height: 300,
    fill: '#ffffff',
    stroke: '#e5e7eb',
    strokeWidth: 2,
    rx: 12,
    ry: 12,
    shadow: new fabric.Shadow({
      color: 'rgba(0, 0, 0, 0.1)',
      blur: 15,
      offsetX: 0,
      offsetY: 4,
    }),
  });
  canvas.add(card);

  const cardTitle = new fabric.IText('Design to Code', {
    left: 250,
    top: 190,
    fontSize: 24,
    fontFamily: 'Arial',
    fill: '#1f2937',
    fontWeight: 'bold',
    originX: 'center',
  });
  canvas.add(cardTitle);

  const cardDescription = new fabric.IText('Export your designs as\nHTML, CSS, or React', {
    left: 250,
    top: 240,
    fontSize: 16,
    fontFamily: 'Arial',
    fill: '#6b7280',
    originX: 'center',
    textAlign: 'center',
  });
  canvas.add(cardDescription);

  // Add a button
  const button = new fabric.Rect({
    left: 150,
    top: 360,
    width: 200,
    height: 48,
    fill: '#10b981',
    rx: 6,
    ry: 6,
  });
  canvas.add(button);

  const buttonText = new fabric.IText('Get Started', {
    left: 250,
    top: 375,
    fontSize: 16,
    fontFamily: 'Arial',
    fill: '#ffffff',
    fontWeight: 'bold',
    originX: 'center',
  });
  canvas.add(buttonText);

  // Add a second card
  const card2 = new fabric.Rect({
    left: 500,
    top: 160,
    width: 450,
    height: 200,
    fill: '#fef3c7',
    stroke: '#fbbf24',
    strokeWidth: 2,
    rx: 12,
    ry: 12,
  });
  canvas.add(card2);

  const card2Title = new fabric.IText('AI-Powered Generation', {
    left: 725,
    top: 190,
    fontSize: 20,
    fontFamily: 'Arial',
    fill: '#78350f',
    fontWeight: 'bold',
    originX: 'center',
  });
  canvas.add(card2Title);

  const card2Text = new fabric.IText('Generate images with AI\nEdit with powerful tools\nExport production-ready code', {
    left: 725,
    top: 235,
    fontSize: 14,
    fontFamily: 'Arial',
    fill: '#92400e',
    originX: 'center',
    textAlign: 'center',
  });
  canvas.add(card2Text);

  // Add feature boxes
  const features = [
    { x: 50, y: 490, color: '#dbeafe', text: '🎨 Design', textColor: '#1e40af' },
    { x: 250, y: 490, color: '#dcfce7', text: '🤖 Generate', textColor: '#166534' },
    { x: 450, y: 490, color: '#fce7f3', text: '✨ Edit', textColor: '#9f1239' },
    { x: 650, y: 490, color: '#e0e7ff', text: '📦 Export', textColor: '#3730a3' },
  ];

  features.forEach(feature => {
    const box = new fabric.Rect({
      left: feature.x,
      top: feature.y,
      width: 180,
      height: 100,
      fill: feature.color,
      rx: 8,
      ry: 8,
    });
    canvas.add(box);

    const featureText = new fabric.IText(feature.text, {
      left: feature.x + 90,
      top: feature.y + 40,
      fontSize: 18,
      fontFamily: 'Arial',
      fill: feature.textColor,
      fontWeight: 'bold',
      originX: 'center',
    });
    canvas.add(featureText);
  });

  canvas.renderAll();
}

export function addSimpleLayout(canvas: fabric.Canvas) {
  if (!canvas) return;

  canvas.clear();

  // Simple header
  const header = new fabric.Rect({
    left: 0,
    top: 0,
    width: 1024,
    height: 60,
    fill: '#1f2937',
  });
  canvas.add(header);

  const logo = new fabric.IText('Logo', {
    left: 20,
    top: 20,
    fontSize: 24,
    fontFamily: 'Arial',
    fill: '#ffffff',
    fontWeight: 'bold',
  });
  canvas.add(logo);

  // Navigation items
  const navItems = ['Home', 'Features', 'Pricing', 'Contact'];
  navItems.forEach((item, index) => {
    const navText = new fabric.IText(item, {
      left: 800 + (index * 70),
      top: 22,
      fontSize: 16,
      fontFamily: 'Arial',
      fill: '#ffffff',
    });
    canvas.add(navText);
  });

  // Hero section
  const heroTitle = new fabric.IText('Build Amazing Designs', {
    left: 512,
    top: 150,
    fontSize: 48,
    fontFamily: 'Arial',
    fill: '#1f2937',
    fontWeight: 'bold',
    originX: 'center',
  });
  canvas.add(heroTitle);

  const heroSubtitle = new fabric.IText('Export to HTML, CSS, and React with one click', {
    left: 512,
    top: 220,
    fontSize: 20,
    fontFamily: 'Arial',
    fill: '#6b7280',
    originX: 'center',
  });
  canvas.add(heroSubtitle);

  // CTA Button
  const ctaButton = new fabric.Rect({
    left: 412,
    top: 280,
    width: 200,
    height: 50,
    fill: '#3b82f6',
    rx: 8,
    ry: 8,
  });
  canvas.add(ctaButton);

  const ctaText = new fabric.IText('Try It Free', {
    left: 512,
    top: 295,
    fontSize: 18,
    fontFamily: 'Arial',
    fill: '#ffffff',
    fontWeight: 'bold',
    originX: 'center',
  });
  canvas.add(ctaText);

  canvas.renderAll();
}
