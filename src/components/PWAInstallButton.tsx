import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, X, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-emerald-700/10 hover:bg-emerald-700/20 text-emerald-800 border border-emerald-300 px-3 py-1.5 text-xs sm:text-sm font-medium transition active:scale-95 shadow-xs"
        title="Install app to your home screen or desktop"
      >
        <Download className="w-4 h-4 text-emerald-700" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white/80 hover:bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 shadow-xs transition active:scale-95"
        >
          <Smartphone className="w-4 h-4 text-slate-600" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
                    🌿
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <p>
                    Tap the <strong className="text-slate-800">Share</strong> button <Share2 className="w-4 h-4 inline-block text-emerald-700 mx-0.5" /> in the Safari bottom toolbar.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <p>
                    Scroll down and tap <strong className="text-slate-800">Add to Home Screen</strong>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-700 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
