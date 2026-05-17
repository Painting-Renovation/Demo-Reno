import Link from 'next/link';
import { PaintBucket, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-gold/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          <div className="relative w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center border-2 border-gold/30">
            <PaintBucket className="w-10 h-10 text-gold" />
          </div>
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold text-white mb-2">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-gold mb-4">Page Not Found</h2>
        <p className="text-white/60 mb-8 leading-relaxed">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let us help you find your way back.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
