import { useState } from 'react';

export default function Widget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-96 h-[600px] bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
          <div className="bg-gradient-to-r from-ocean-light to-ocean-dark p-4">
            <h3 className="text-white font-semibold text-lg">
              SynTech Studios Assistant
            </h3>
          </div>
          <div className="p-4 text-white">
            <p className="text-zinc-400">Widget en construction...</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gradient-to-r from-ocean-light to-ocean-dark rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center text-2xl"
        aria-label="Toggle SynTech Assistant"
      >
        💬
      </button>
    </div>
  );
}
