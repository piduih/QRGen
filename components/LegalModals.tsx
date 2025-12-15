import React from 'react';

type ModalType = 'terms' | 'privacy' | null;

interface LegalModalProps {
  isOpen: boolean;
  type: ModalType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  const content = {
    terms: {
      title: 'The Rules (Terms of Service)',
      body: (
        <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
          <p><strong>1. Hello!</strong><br/>Welcome to the QR Code Magic Maker. By using this fun tool, you agree to these simple rules.</p>
          <p><strong>2. It's Free!</strong><br/>You can use this for anything you want—for fun, for school, or for your business. It's completely free.</p>
          <p><strong>3. Test It First</strong><br/>We tried our best to make this work perfectly ("as is"), but computers can be tricky. Please test your QR code to make sure it works before you print it on a thousand t-shirts! We aren't responsible if it doesn't scan later.</p>
          <p><strong>4. Be Nice</strong><br/>Don't use this tool to make bad things. That's all!</p>
        </div>
      )
    },
    privacy: {
      title: 'Your Secrets (Privacy Policy)',
      body: (
        <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
          <p><strong>1. No Peeking!</strong><br/>We take your privacy seriously. This app runs entirely on <strong>your computer</strong> (in your browser).</p>
          <p><strong>2. We Don't See Anything</strong><br/>When you type your Wi-Fi password or messages, they stay right here. We don't send them to the internet or save them on our servers.</p>
          <p><strong>3. No Tracking Cookies</strong><br/>We don't use creepy cookies to follow you around the internet. We just want to help you make cool codes.</p>
          <p><strong>4. Be Careful with Links</strong><br/>If you make a QR code that leads to a website, remember that <em>that</em> website might have its own rules. Stay safe!</p>
        </div>
      )
    }
  };

  const currentContent = content[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        style={{ animation: 'modalFadeIn 0.2s ease-out' }}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">{currentContent.title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {currentContent.body}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};