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
      title: 'Janji Kami (Syarat Penggunaan)',
      body: (
        <div className="space-y-4 text-gray-700 text-sm leading-relaxed font-medium">
          <p className="text-lg font-bold text-gray-900">Apa yang anda perlu tahu:</p>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="font-bold text-blue-800">1. Guna Sampai Lebam (Percuma)</p>
            <p className="mt-1">Alat ini percuma 100%. Anda boleh buat 1 kod QR atau 1 juta kod QR. Kami tak akan caj anda satu sen pun. Guna untuk bisnes, sekolah, atau suka-suka.</p>
          </div>

          <p><strong>2. Tiada Jaminan (As-Is)</strong><br/>Kami dah cuba sehabis baik untuk pastikan ia power. Tapi, tolong test dulu kod QR anda sebelum cetak atas 1,000 helai baju. Kalau tak boleh scan nanti, jangan marah kami ya.</p>
          
          <p><strong>3. Jangan Buat Hal</strong><br/>Jangan guna alat ini untuk buat benda jahat atau menipu orang. Jadi orang baik.</p>
        </div>
      )
    },
    privacy: {
      title: 'Data Anda Selamat (Privasi)',
      body: (
        <div className="space-y-4 text-gray-700 text-sm leading-relaxed font-medium">
          <p className="text-lg font-bold text-gray-900">Kenapa anda boleh percaya kami:</p>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="font-bold text-green-800">1. Kami Tak Simpan Data</p>
            <p className="mt-1">Segala yang anda taip (password WiFi, link rahsia) kekal dalam browser anda. Ia TAK dihantar ke server kami. Anda selamat.</p>
          </div>

          <p><strong>2. Tiada Penjejak Jahat</strong><br/>Kami tak pasang "cctv" (cookies) untuk intip anda melayari internet. Kami cuma nak anda dapat kod QR yang cantik.</p>
          
          <p><strong>3. Hati-hati Dengan Link</strong><br/>Kalau anda buat kod QR yang bawa ke website orang lain, ingat, website itu bukan tanggungjawab kami. Jaga diri!</p>
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
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        style={{ animation: 'modalFadeIn 0.2s ease-out' }}
      >
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <h3 className="text-xl font-bold text-gray-900">{currentContent.title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {currentContent.body}
        </div>
        
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-transform active:scale-95"
          >
            Faham, Terima Kasih!
          </button>
        </div>
      </div>
    </div>
  );
};