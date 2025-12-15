import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { QrCodeIcon, ArrowDownTrayIcon, PaintBrushIcon, ArrowUpTrayIcon, TrashIcon, SparklesIcon, LinkIcon, WifiIcon, UserCircleIcon, EnvelopeIcon } from './Icons';

type QRType = 'text' | 'wifi' | 'vcard' | 'email';

interface QROptions {
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  scale: number;
  width: number;
  color: {
    dark: string;
    light: string;
  };
}

interface GradientOptions {
    enabled: boolean;
    color1: string;
    color2: string;
}

const colorPalettes = [
    { name: 'Dark Mode', dark: '#1f2937', light: '#ffffff' }, 
    { name: 'Sky Blue', dark: '#0078D4', light: '#f0f8ff' },
    { name: 'Forest', dark: '#107C10', light: '#f0fff0' },
    { name: 'Lava', dark: '#D83B01', light: '#fff5f2' },
    { name: 'Lemon', dark: '#FFB900', light: '#fffff0' },
];

const QrCodeGenerator: React.FC = () => {
  const [qrType, setQrType] = useState<QRType>('text');
  
  // Form states
  const [textData, setTextData] = useState('https://afiladesign.com');
  const [wifiData, setWifiData] = useState({ ssid: '', password: '', encryption: 'WPA' });
  const [vcardData, setVcardData] = useState({ name: '', phone: '', email: '', company: '' });
  const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });
  
  const [qrString, setQrString] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [dotStyle, setDotStyle] = useState<'squares' | 'dots'>('squares');
  const [gradient, setGradient] = useState<GradientOptions>({
      enabled: false,
      color1: '#0078D4',
      color2: '#00A1F1',
  });
  const [options, setOptions] = useState<QROptions>({
    errorCorrectionLevel: 'M',
    margin: 4,
    scale: 4,
    width: 256,
    color: {
      dark: '#1f2937', // gray-800
      light: '#ffffff',
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const generateQrDataString = useCallback(() => {
    switch (qrType) {
      case 'wifi':
        return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardData.name}\nORG:${vcardData.company}\nTEL:${vcardData.phone}\nEMAIL:${vcardData.email}\nEND:VCARD`;
      case 'email':
        return `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
      case 'text':
      default:
        return textData;
    }
  }, [qrType, textData, wifiData, vcardData, emailData]);

  useEffect(() => {
    setQrString(generateQrDataString());
  }, [generateQrDataString]);

  const drawQrCode = useCallback(() => {
    setIsLoading(true);
    const canvas = qrCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = options.width * dpr;
    canvas.height = options.width * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${options.width}px`;
    canvas.style.height = `${options.width}px`;

    if (!qrString) {
        ctx.clearRect(0, 0, options.width, options.width);
        setIsLoading(false);
        return;
    }

    try {
        const qr = QRCode.create(qrString, { errorCorrectionLevel: options.errorCorrectionLevel, margin: options.margin });
        
        const modules = qr.modules.data;
        const moduleCount = qr.modules.size;
        const moduleSize = options.width / moduleCount;

        ctx.fillStyle = options.color.light;
        ctx.fillRect(0, 0, options.width, options.width);

        let foregroundFill: string | CanvasGradient = options.color.dark;
        if (gradient.enabled) {
            const grad = ctx.createLinearGradient(0, 0, options.width, options.width);
            grad.addColorStop(0, gradient.color1);
            grad.addColorStop(1, gradient.color2);
            foregroundFill = grad;
        }
        ctx.fillStyle = foregroundFill;
        
        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (modules[row * moduleCount + col]) {
                    if (dotStyle === 'dots') {
                        ctx.beginPath();
                        ctx.arc(
                            col * moduleSize + moduleSize / 2,
                            row * moduleSize + moduleSize / 2,
                            (moduleSize / 2) * 0.8,
                            0,
                            2 * Math.PI
                        );
                        ctx.fill();
                    } else {
                        ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
                    }
                }
            }
        }

        if (logo) {
            const logoImg = new Image();
            logoImg.src = logo;
            logoImg.onload = () => {
                const logoSize = options.width * 0.25;
                const logoX = (options.width - logoSize) / 2;
                const logoY = (options.width - logoSize) / 2;
                const padding = 5;

                ctx.fillStyle = options.color.light;
                ctx.fillRect(logoX - padding, logoY - padding, logoSize + padding * 2, logoSize + padding * 2);
                ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
                setIsLoading(false);
            };
            logoImg.onerror = () => setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    } catch (err) {
        console.error(err);
        setIsLoading(false);
    }
  }, [qrString, options, logo, dotStyle, gradient]);

  useEffect(() => {
    drawQrCode();
  }, [drawQrCode]);

  const generateSvgString = (): string => {
    if (!qrString) return '';
    try {
      const qr = QRCode.create(qrString, { errorCorrectionLevel: options.errorCorrectionLevel, margin: options.margin });
      const moduleCount = qr.modules.size;
      const moduleSize = 10;
      const svgSize = moduleCount * moduleSize;
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${options.width}" height="${options.width}" viewBox="0 0 ${svgSize} ${svgSize}">`;
      svg += `<rect width="100%" height="100%" fill="${options.color.light}" />`;

      if (gradient.enabled) {
          svg += `<defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${gradient.color1}"/><stop offset="100%" stop-color="${gradient.color2}"/></linearGradient></defs>`;
      }

      const fill = gradient.enabled ? 'url(#grad)' : options.color.dark;
      let pathData = '';

      for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
              if (qr.modules.data[row * moduleCount + col]) {
                  if (dotStyle === 'dots') {
                      svg += `<circle cx="${col * moduleSize + moduleSize / 2}" cy="${row * moduleSize + moduleSize / 2}" r="${(moduleSize / 2) * 0.9}" fill="${fill}" />`;
                  } else {
                      pathData += `M${col * moduleSize},${row * moduleSize}h${moduleSize}v${moduleSize}h-${moduleSize}z`;
                  }
              }
          }
      }
      if (pathData) {
          svg += `<path d="${pathData}" fill="${fill}" />`;
      }

      if (logo) {
          const logoSize = svgSize * 0.25;
          const logoX = (svgSize - logoSize) / 2;
          svg += `<image href="${logo}" x="${logoX}" y="${logoX}" width="${logoSize}" height="${logoSize}" />`;
      }

      svg += `</svg>`;
      return svg;
    } catch (err) {
      console.error(err);
      return '';
    }
  };

  const handleDownload = (format: 'png' | 'svg') => {
    if (format === 'png') {
        const canvas = qrCanvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        const svgString = generateSvgString();
        if (!svgString) return;
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qrcode.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
  };
  
  const handleOptionChange = <K extends keyof QROptions>(key: K, value: QROptions[K]) => {
      setOptions(prev => ({...prev, [key]: value}));
  };

  const handleColorChange = (type: 'dark' | 'light', value: string) => {
    setOptions(prev => ({
        ...prev,
        color: { ...prev.color, [type]: value }
    }));
  };

  const handleGradientChange = <K extends keyof GradientOptions>(key: K, value: GradientOptions[K]) => {
      setGradient(prev => ({...prev, [key]: value}));
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            setLogo(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const applyPalette = (palette: { dark: string, light: string}) => {
    handleColorChange('dark', palette.dark);
    handleColorChange('light', palette.light);
  }

  const renderTabs = () => {
    const tabs = [
      { id: 'text', icon: LinkIcon, label: 'Website/Link' },
      { id: 'wifi', icon: WifiIcon, label: 'Wi-Fi Login' },
      { id: 'vcard', icon: UserCircleIcon, label: 'My Contact' },
      { id: 'email', icon: EnvelopeIcon, label: 'Send Email' },
    ];
    return (
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setQrType(tab.id as QRType)}
            className={`flex-1 flex items-center justify-center p-3 text-sm font-medium transition-colors ${
              qrType === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    );
  };
  
  const renderForm = () => {
      switch(qrType) {
          case 'text':
              return (
                <div>
                  <label htmlFor="qr-text" className="block text-sm font-medium text-gray-700 mb-2">Where should it go?</label>
                  <input type="text" id="qr-text" value={textData} onChange={(e) => setTextData(e.target.value)} placeholder="Type a website (e.g., google.com) or a message here..." className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                </div>
              );
          case 'wifi':
              return (
                  <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">Internet Info</h4>
                      <div>
                          <label htmlFor="wifi-ssid" className="block text-sm font-medium text-gray-700 mb-1">Wi-Fi Name (SSID)</label>
                          <input type="text" id="wifi-ssid" placeholder="e.g. MyHomeWiFi" value={wifiData.ssid} onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                      </div>
                      <div>
                          <label htmlFor="wifi-password" className="block text-sm font-medium text-gray-700 mb-1">Wi-Fi Password</label>
                          <input type="password" id="wifi-password" placeholder="Secret password" value={wifiData.password} onChange={(e) => setWifiData({...wifiData, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                      </div>
                      <div>
                          <label htmlFor="wifi-encryption" className="block text-sm font-medium text-gray-700 mb-1">Security Type</label>
                          <select id="wifi-encryption" value={wifiData.encryption} onChange={(e) => setWifiData({...wifiData, encryption: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                              <option value="WPA">Standard (WPA/WPA2)</option>
                              <option value="WEP">Old School (WEP)</option>
                              <option value="nopass">Open (No Password)</option>
                          </select>
                      </div>
                  </div>
              );
          case 'vcard':
              return (
                  <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">My Details</h4>
                      <div>
                          <label htmlFor="vcard-name" className="block text-sm font-medium text-gray-700 mb-1">My Name</label>
                          <input type="text" id="vcard-name" placeholder="John Doe" value={vcardData.name} onChange={(e) => setVcardData({...vcardData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                      </div>
                      <div>
                          <label htmlFor="vcard-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <input type="tel" id="vcard-phone" placeholder="+1 555 123 4567" value={vcardData.phone} onChange={(e) => setVcardData({...vcardData, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                      </div>
                      <div>
                          <label htmlFor="vcard-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <input type="email" id="vcard-email" placeholder="hello@example.com" value={vcardData.email} onChange={(e) => setVcardData({...vcardData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                      </div>
                       <div>
                          <label htmlFor="vcard-company" className="block text-sm font-medium text-gray-700 mb-1">Work Place</label>
                          <input type="text" id="vcard-company" placeholder="My Cool Company" value={vcardData.company} onChange={(e) => setVcardData({...vcardData, company: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                      </div>
                  </div>
              );
           case 'email':
                return (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">Write an Email</h4>
                        <div>
                            <label htmlFor="email-to" className="block text-sm font-medium text-gray-700 mb-1">Send to (Email)</label>
                            <input type="email" id="email-to" placeholder="friend@example.com" value={emailData.to} onChange={(e) => setEmailData({ ...emailData, to: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                        </div>
                        <div>
                            <label htmlFor="email-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject (Title)</label>
                            <input type="text" id="email-subject" placeholder="Hello!" value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                        </div>
                        <div>
                            <label htmlFor="email-body" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea id="email-body" placeholder="Type your message here..." value={emailData.body} onChange={(e) => setEmailData({ ...emailData, body: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                        </div>
                    </div>
                );
      }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-0 md:p-0 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Side: Controls */}
      <div className="flex flex-col">
        {renderTabs()}
        <div className="p-6 space-y-6">
            <div className="min-h-[250px]">{renderForm()}</div>

            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <PaintBrushIcon className="h-5 w-5 mr-2" />
                    Make it Pretty
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pick a Color Combo</label>
                        <div className="flex flex-wrap gap-2">
                            {colorPalettes.map(p => (
                                <button key={p.name} onClick={() => applyPalette(p)} className="h-8 px-3 text-sm rounded-full border shadow-sm hover:shadow-md transition-shadow" style={{backgroundColor: p.light, color: p.dark, borderColor: p.dark}}>
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="qr-color-dark" className="block text-sm font-medium text-gray-700 mb-1">Code Color</label>
                            <input id="qr-color-dark" type="color" value={options.color.dark} onChange={(e) => handleColorChange('dark', e.target.value)} disabled={gradient.enabled} className="w-full h-10 p-1 bg-white border border-gray-300 rounded-md cursor-pointer disabled:opacity-50"/>
                        </div>
                        <div>
                            <label htmlFor="qr-color-light" className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                            <input id="qr-color-light" type="color" value={options.color.light} onChange={(e) => handleColorChange('light', e.target.value)} className="w-full h-10 p-1 bg-white border border-gray-300 rounded-md cursor-pointer"/>
                        </div>
                    </div>
                    <div className="p-3 rounded-md bg-gray-50 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <SparklesIcon className="h-5 w-5 mr-2 text-blue-500"/>
                                Mix Colors (Gradient)
                            </label>
                            <label htmlFor="gradient-toggle" className="inline-flex relative items-center cursor-pointer">
                              <input type="checkbox" id="gradient-toggle" className="sr-only peer" checked={gradient.enabled} onChange={(e) => handleGradientChange('enabled', e.target.checked)} />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        {gradient.enabled && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                <div><input type="color" value={gradient.color1} onChange={(e) => handleGradientChange('color1', e.target.value)} className="w-full h-10 p-1 bg-white border border-gray-300 rounded-md cursor-pointer"/></div>
                                <div><input type="color" value={gradient.color2} onChange={(e) => handleGradientChange('color2', e.target.value)} className="w-full h-10 p-1 bg-white border border-gray-300 rounded-md cursor-pointer"/></div>
                            </div>
                        )}
                    </div>
                     <div className="pt-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Shapes & Size</h4>
                         <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Dot Shape</label>
                                <div className="flex items-center space-x-4 mt-1">
                                    <label className="flex items-center cursor-pointer"><input type="radio" name="dotStyle" value="squares" checked={dotStyle === 'squares'} onChange={() => setDotStyle('squares')} className="mr-2"/> Squares</label>
                                    <label className="flex items-center cursor-pointer"><input type="radio" name="dotStyle" value="dots" checked={dotStyle === 'dots'} onChange={() => setDotStyle('dots')} className="mr-2"/> Round Dots</label>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="qr-size" className="block text-sm font-medium text-gray-700">How Big? ({options.width}px)</label>
                                <input id="qr-size" type="range" min="128" max="512" step="16" value={options.width} onChange={(e) => handleOptionChange('width', parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"/>
                            </div>
                            <div>
                                <label htmlFor="qr-error-level" className="block text-sm font-medium text-gray-700 mb-1">
                                    Safety Level
                                    <span className="text-xs text-gray-400 font-normal ml-2">(Helps if code gets blurry)</span>
                                </label>
                                <select id="qr-error-level" value={options.errorCorrectionLevel} onChange={(e) => handleOptionChange('errorCorrectionLevel', e.target.value as QROptions['errorCorrectionLevel'])} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                                    <option value="L">Low (Clearer)</option>
                                    <option value="M">Medium (Standard)</option>
                                    <option value="Q">High (Better)</option>
                                    <option value="H">Best (Super Strong)</option>
                                </select>
                            </div>
                         </div>
                     </div>
                     <div className="pt-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Middle Sticker</h4>
                        <input type="file" accept="image/*" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" />
                        {logo ? (
                            <div className="flex items-center space-x-3">
                                <img src={logo} alt="Logo preview" className="w-12 h-12 rounded object-cover border"/>
                                <button onClick={() => setLogo(null)} className="flex items-center text-sm text-red-600 hover:text-red-800">
                                    <TrashIcon className="h-4 w-4 mr-1"/> Remove Sticker
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => logoInputRef.current?.click()} className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                                <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                                Upload Logo Image
                            </button>
                        )}
                     </div>
                </div>
            </div>
        </div>
      </div>

      {/* Right Side: QR Code Display */}
      <div className="flex flex-col items-center justify-center bg-gray-100 p-6 rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none">
        <div className="relative w-full max-w-xs aspect-square flex items-center justify-center">
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            )}
            <canvas ref={qrCanvasRef} className="rounded-md shadow-md"/>
            {!qrString && (
                 <div className="absolute inset-0 w-full h-full bg-gray-200 rounded-md flex flex-col items-center justify-center text-center p-4">
                    <QrCodeIcon className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-500">Start typing to see magic!</p>
                </div>
            )}
        </div>
        <div className="mt-8 w-full max-w-xs space-y-3">
            <button onClick={() => handleDownload('png')} disabled={!qrString || isLoading} className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Save Image (PNG)
            </button>
             <button onClick={() => handleDownload('svg')} disabled={!qrString || isLoading} className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed transition">
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Save Vector (SVG)
            </button>
        </div>
      </div>
    </div>
  );
};

export default QrCodeGenerator;