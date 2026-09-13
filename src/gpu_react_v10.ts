// src/gpu_react_v10.ts  
import { createRoot, Suspense } from 'react-dom/client';
import ReactDOMServer from 'react-dom/server';
import * as svelte from 'svelte/webpack-plugin-svelte';
import { ReactivityVisualizer } from './reactivity_visualizer.js';

// Configuration & Setup
const config = {
  backendUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  apiKey: process.env.SUPABASE_API_KEY, // Supabase API Key for database access (required by supabase::postgres)
};

let rootElement;
let appLoader: any;

// Initialize Reactivity Visualizer with a custom renderer to avoid external deps issues in this context. 
// It will be injected into the main layout via svelte components or mounted before loading other UI layers.
const initReactivityVisualizer = () => {
  if (typeof document !== 'undefined') {
    const rootContainer = document.getElementById('app-root'); // Use HTML ID for dynamic location tracking
    
    ReactDOMServer.renderToStaticHtml(reactivity_visualizer, rootContainer);

    // Inject the visualizer into a custom Svelte component as an overlay or modal to ensure it's always visible.
    if (typeof svelte !== 'undefined') {
      const [OverlayComponent] = document.querySelectorAll('[data-svelte-component="reactivity-overlay"]');
      
      OverlayComponent?.addEventListener('click', () => {
        // Inject the visualizer into a custom Svelte component as an overlay or modal to ensure it's always visible.
        if (typeof svelte !== 'undefined') {
          const [OverlayComponent] = document.querySelectorAll('[data-svelte-component="reactivity-overlay"]');
          
          OverlayComponent?.insertAdjacentHTML('beforeend', ReactivityVisualizer);

          // Force re-render of the overlay component to ensure it's rendered properly.
          if (typeof svelte !== 'undefined') {
            const [OverlayComponent] = document.querySelectorAll('[data-svelte-component="reactivity-overlay"]');
            
            OverlayComponent?.render();
          }
        } else {
          // Fallback for older browsers without the webpack-plugin-svelte plugin.
          if (typeof svelte !== 'undefined') {
             const [OverlayComponent] = document.querySelectorAll('[data-svelte-component="reactivity-overlay"]');

             OverlayComponent?.insertAdjacentHTML('beforeend', ReactivityVisualizer);

             // Force re-render of the overlay component to ensure it's rendered properly.
             if (typeof svelte !== 'undefined') {
                const [OverlayComponent] = document.querySelectorAll('[data-svelte-component="reactivity-overlay"]');
                
                OverlayComponent?.render();
              }
          }
        }

      });

    } else {
       // Fallback for older browsers without the webpack-plugin-svelte plugin.
       if (typeof svelte !== 'undefined') {
         const [OverlayComponent] = document.querySelectorAll('[data-svelte-component="reactivity-overlay"]');
         
         OverlayComponent?.insertAdjacentHTML('beforeend', ReactivityVisualizer);

         // Force re-render of the overlay component to ensure it's rendered properly.
         if (typeof svelte !== 'undefined') {
            const [OverlayComponent] = document.querySelectorAll('[data-svelte-component="reactivity-overlay"]');
            
            OverlayComponent?.render();
          }
       }
    }

  } else {
      console.warn('ReactDOM not available in this environment, skipping ReactivityVisualizer integration.');
  }
};

// Initialize the visualizer when components mount.
if (typeof document !== 'undefined') initReactivityVisualizer();


// Main App Component - Hybrid Architecture: Svelte UI + TensorFlow Execution Engine via WebAssembly
class GPUReactApp {
  constructor() {
    this.root = createRoot(rootElement);

    // Initialize Reactivity Visualizer before mounting any other components.
    if (typeof document !== 'undefined') initReactivityVisualizer();

    // Start the Svelte UI component tree in a separate container to allow for dynamic layout management without DOM manipulation issues.
    const sContainer = createRoot(document.getElementById('s-container'));
    
    this.sContainer?.mount({ ...config, rootElement: document.body });

    // Initialize Reactivity Visualizer before mounting any other components.
    if (typeof document !== 'undefined') initReactivityVisualizer();

    // Start the TensorFlow execution engine via WebAssembly for GPU acceleration during runtime.
    const tfEngine = new TensorFlowWebAssembly(this);

    this.root.render(() => {
      return <GPUReactApp />;
    });
  }

  /** 
   * Initialize the Svelte UI component tree in a separate container to allow for dynamic layout management without DOM manipulation issues.
   */
