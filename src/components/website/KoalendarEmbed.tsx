'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

const WIDGET_ID = 'inline-widget-meet-a-property-maintenance-expert';
const WIDGET_URL = 'https://koalendar.com/e/meet-a-property-maintenance-expert';
const SCRIPT_SRC = 'https://koalendar.com/assets/widget.js';

// Module-level flag to ensure the external script is only loaded ONCE
let scriptLoaded = false;

// Extend window type for Koalendar
declare global {
  interface Window {
    Koalendar: {
      (action: string, options: Record<string, string>): void;
      props: Array<[string, Record<string, string>]>;
    };
  }
}

export function KoalendarEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Ensure the container has the correct ID
    container.id = WIDGET_ID;

    // Define the Koalendar stub function if not already defined
    if (!window.Koalendar) {
      window.Koalendar = function (...args: unknown[]) {
        (window.Koalendar.props = window.Koalendar.props || []).push(
          args as [string, Record<string, string>]
        );
      };
    }

    // Load the external script only once
    if (!scriptLoaded) {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => {
        scriptLoaded = true;
        // After script loads, call Koalendar inline to render
        window.Koalendar('inline', {
          url: WIDGET_URL,
          selector: `#${WIDGET_ID}`,
        });
        setIsLoading(false);
      };
      script.onerror = () => {
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      // Script already loaded, just initialize the widget
      window.Koalendar('inline', {
        url: WIDGET_URL,
        selector: `#${WIDGET_ID}`,
      });
      // Give it a brief moment to render before hiding the loader
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }

    return () => {
      // Cleanup: clear widget content from container
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center min-h-[600px] bg-white/80 z-10 rounded-lg">
          <Loader2 className="w-8 h-8 text-[#C8973E] animate-spin mb-3" />
          <p className="text-sm text-gray-500">Loading booking calendar...</p>
        </div>
      )}
      {/* Koalendar widget container */}
      <div
        ref={containerRef}
        id={WIDGET_ID}
        className="w-full min-h-[600px]"
      />
    </div>
  );
}
