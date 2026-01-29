// Load Fabric.js immediately
(function() {
  if (typeof window.fabric !== 'undefined') {
    console.log('Fabric already loaded');
    return;
  }

  console.log('[load-fabric.js] Loading Fabric.js from CDN...');

  var script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js';
  script.async = false;
  script.onload = function() {
    console.log('[load-fabric.js] Fabric.js loaded successfully! Version:', window.fabric.version);
  };
  script.onerror = function(e) {
    console.error('[load-fabric.js] Failed to load Fabric.js:', e);
  };

  document.head.appendChild(script);
})();
