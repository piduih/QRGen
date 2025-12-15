import React, { useState } from 'react';
import QrCodeGenerator from './components/QrCodeGenerator';
import { LegalModal } from './components/LegalModals';

const App: React.FC = () => {
  const [modalView, setModalView] = useState<'terms' | 'privacy' | null>(null);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          QR Code Magic Maker
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Turn your words and links into secret scanning squares!
        </p>
      </header>
      <main className="w-full max-w-4xl flex-grow">
        <QrCodeGenerator />
      </main>
      <footer className="text-center mt-12 mb-4 text-gray-500 text-sm">
        <p className="mb-2">Made with 🎈 in {new Date().getFullYear()} by afiladesign.com</p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setModalView('terms')}
            className="hover:text-gray-800 hover:underline transition-colors"
          >
            The Rules (Terms)
          </button>
          <span className="text-gray-300">|</span>
          <button 
            onClick={() => setModalView('privacy')}
            className="hover:text-gray-800 hover:underline transition-colors"
          >
            Your Secrets (Privacy)
          </button>
        </div>
      </footer>

      {/* Legal Modals */}
      <LegalModal 
        isOpen={!!modalView} 
        type={modalView} 
        onClose={() => setModalView(null)} 
      />
    </div>
  );
};

export default App;