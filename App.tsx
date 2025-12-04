
import React from 'react';
import QrCodeGenerator from './components/QrCodeGenerator';

const App: React.FC = () => {
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
      <main className="w-full max-w-4xl">
        <QrCodeGenerator />
      </main>
      <footer className="text-center mt-8 text-gray-500">
        <p>© afiladesign.com</p>
      </footer>
    </div>
  );
};

export default App;
