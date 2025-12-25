import React, { useState } from 'react';
import QrCodeGenerator from './components/QrCodeGenerator';
import { LegalModal } from './components/LegalModals';
import { ShieldCheckIcon, GiftIcon, InfinityIcon } from './components/Icons';

const App: React.FC = () => {
  const [modalView, setModalView] = useState<'terms' | 'privacy' | null>(null);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8 max-w-2xl pt-8">
        <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
          100% Percuma • Tiada Daftar • Tiada Iklan Semak
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-4 leading-tight">
          Buat Kod QR <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pantas & Cantik.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mt-2 font-medium max-w-xl mx-auto">
          Berhenti membazir duit langganan bulanan. Dapatkan kod QR tanpa had untuk bisnes atau kegunaan peribadi anda di sini.
        </p>
      </header>
      
      <main className="w-full max-w-5xl flex-grow z-10 mb-16">
        <QrCodeGenerator />
      </main>

      {/* Landing Page Content Starts Here */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 px-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GiftIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Percuma Seumur Hidup</h3>
              <p className="text-gray-600">Tiada "Free Trial" palsu. Tiada yuran tersembunyi. Anda boleh buat 1,000 kod QR dan kami tak akan minta kad kredit anda.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-green-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Privasi Gred Bank</h3>
              <p className="text-gray-600">Data anda diproses dalam browser anda sendiri. Kami tidak simpan, intip, atau jual data Wi-Fi atau kenalan anda.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-purple-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <InfinityIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tiada Tarikh Luput</h3>
              <p className="text-gray-600">Kod QR yang anda buat di sini adalah "Static". Ia akan berfungsi selamanya selagi link anda hidup.</p>
          </div>
      </section>

      <section className="w-full max-w-3xl mb-20 px-4">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-10">Soalan Yang Selalu Ditanya (FAQ)</h2>
          <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">💰 Betul ke ni free? Apa "catch" dia?</h4>
                  <p className="text-gray-600">Ya, serius. Tiada "catch". Kami buat tool ini sebab kami bosan tengok website lain caj mahal untuk benda mudah. Kami cuma letak logo kecil kami di footer, itu saja.</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">📅 Kod QR ni ada expired date tak?</h4>
                  <p className="text-gray-600">Tidak. Kod QR jenis ini dipanggil "Static QR Code". Ia menanam info terus ke dalam corak kod. Selagi anda tak ubah link website anda, kod QR ni boleh diguna sampai kiamat.</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">🖨️ Boleh guna untuk print bisnes kad tak?</h4>
                  <p className="text-gray-600">Boleh sangat! Kami bagi anda download dalam format PNG (High Quality) dan SVG (Vector). Kalau designer anda minta fail vector, bagi je fail SVG tu.</p>
              </div>
          </div>
      </section>

      <footer className="w-full border-t border-gray-200 bg-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
            <p className="text-gray-900 font-bold mb-4">QR Code Generator Malaysia 🇲🇾</p>
            <p className="mb-6 font-medium text-gray-500 text-sm">
                Dibina dengan ❤️ untuk usahawan, cikgu, dan pemimpi oleh <a href="https://afiladesign.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">afiladesign.com</a> © {new Date().getFullYear()}
            </p>
            <div className="flex justify-center gap-6 text-sm">
            <button 
                onClick={() => setModalView('terms')}
                className="text-gray-500 hover:text-blue-600 hover:underline transition-colors font-semibold"
            >
                Janji Kami (Terms)
            </button>
            <span className="text-gray-300">|</span>
            <button 
                onClick={() => setModalView('privacy')}
                className="text-gray-500 hover:text-blue-600 hover:underline transition-colors font-semibold"
            >
                Data Anda Selamat (Privacy)
            </button>
            </div>
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