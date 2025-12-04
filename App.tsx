
import React, { useState } from 'react';
import QrCodeGenerator from './components/QrCodeGenerator';
import { LegalModal } from './components/LegalModals';

const App: React.FC = () => {
  const [modalView, setModalView] = useState<'terms' | 'privacy' | null>(null);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          QR Code Generator
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Create and customize your QR codes instantly.
        </p>
      </header>
      <main className="w-full max-w-4xl flex-grow">
        <QrCodeGenerator />
      </main>
      <footer className="text-center mt-12 mb-4 text-gray-500 text-sm">
        <p className="mb-2">&copy; {new Date().getFullYear()} afiladesign.com</p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setModalView('terms')}
            className="hover:text-gray-800 hover:underline transition-colors"
          >
            Terms of Service
          </button>
          <span className="text-gray-300">|</span>
          <button 
            onClick={() => setModalView('privacy')}
            className="hover:text-gray-800 hover:underline transition-colors"
          >
            Privacy Policy
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
