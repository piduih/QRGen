import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { QrCodeIcon, ArrowDownTrayIcon, PaintBrushIcon, ArrowUpTrayIcon, TrashIcon, SparklesIcon, LinkIcon, WifiIcon, UserCircleIcon, EnvelopeIcon, EyeIcon, StarIcon } from './Icons';

type QRType = 'text' | 'wifi' | 'vcard' | 'email';
type EyeStyle = 'square' | 'circle' | 'rounded';
type DotStyle = 'squares' | 'dots' | 'rounded' | 'diamonds' | 'stars';

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

// Alex Hormozi DNA: Naming things with Authority
const colorPalettes = [
    { name: 'CEO Style (Gelap)', dark: '#1f2937', light: '#ffffff' }, 
    { name: 'Biru Korporat', dark: '#0078D4', light: '#f0f8ff' },
    { name: 'Duit (Hijau)', dark: '#107C10', light: '#f0fff0' },
    { name: 'Api (Merah)', dark: '#D83B01', light: '#fff5f2' },
    { name: 'Gold (Mewah)', dark: '#FFB900', light: '#fffff0' },
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
  
  // Customization States
  const [eyeStyle, setEyeStyle] = useState<EyeStyle>('square');
  const [dotStyle, setDotStyle] = useState<DotStyle>('squares');
  const [logoFrame, setLogoFrame] = useState<boolean>(true);

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

        // Clear and set background
        ctx.fillStyle = options.color.light;
        ctx.fillRect(0, 0, options.width, options.width);

        // Prepare Foreground Gradient/Color
        let foregroundFill: string | CanvasGradient = options.color.dark;
        if (gradient.enabled) {
            const grad = ctx.createLinearGradient(0, 0, options.width, options.width);
            grad.addColorStop(0, gradient.color1);
            grad.addColorStop(1, gradient.color2);
            foregroundFill = grad;
        }
        ctx.fillStyle = foregroundFill;
        
        // Helper: Check if module is part of the 3 large finder patterns (eyes)
        const isFinderPattern = (r: number, c: number) => {
            if (r < 7 && c < 7) return true; // Top Left
            if (r < 7 && c >= moduleCount - 7) return true; // Top Right
            if (r >= moduleCount - 7 && c < 7) return true; // Bottom Left
            return false;
        };

        // Draw Data Modules
        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (modules[row * moduleCount + col]) {
                    // If it is a finder pattern, skip it here (we draw custom eyes later)
                    if (isFinderPattern(row, col)) continue;

                    const x = col * moduleSize;
                    const y = row * moduleSize;
                    const cx = x + moduleSize / 2;
                    const cy = y + moduleSize / 2;

                    switch (dotStyle) {
                        case 'dots':
                            ctx.beginPath();
                            ctx.arc(cx, cy, (moduleSize / 2) * 0.85, 0, 2 * Math.PI);
                            ctx.fill();
                            break;
                        case 'rounded':
                             ctx.beginPath();
                             ctx.roundRect(x, y, moduleSize, moduleSize, moduleSize * 0.3);
                             ctx.fill();
                             break;
                        case 'diamonds':
                             ctx.beginPath();
                             ctx.moveTo(cx, y);
                             ctx.lineTo(x + moduleSize, cy);
                             ctx.lineTo(cx, y + moduleSize);
                             ctx.lineTo(x, cy);
                             ctx.closePath();
                             ctx.fill();
                             break;
                        case 'stars':
                             drawStar(ctx, cx, cy, 4, moduleSize/1.8, moduleSize/4);
                             ctx.fill();
                             break;
                        case 'squares':
                        default:
                            ctx.fillRect(x, y, moduleSize + 0.5, moduleSize + 0.5); // +0.5 to avoid gaps
                            break;
                    }
                }
            }
        }

        // Helper to draw custom Eye
        const drawEye = (startRow: number, startCol: number) => {
             const startX = startCol * moduleSize;
             const startY = startRow * moduleSize;
             const outerSize = 7 * moduleSize;
             const innerSize = 3 * moduleSize;
             const outerCenter = outerSize / 2;
             
             // Save context to translate to eye position
             ctx.save();
             ctx.translate(startX, startY);

             // Draw Outer Shape
             ctx.beginPath();
             if (eyeStyle === 'circle') {
                 ctx.arc(outerCenter, outerCenter, outerSize / 2, 0, Math.PI * 2);
                 ctx.moveTo(outerCenter + (outerSize/2) - moduleSize, outerCenter); // Move to create hole
                 ctx.arc(outerCenter, outerCenter, (outerSize/2) - moduleSize, 0, Math.PI * 2, true); // Counter clockwise for hole
             } else if (eyeStyle === 'rounded') {
                 ctx.roundRect(0, 0, outerSize, outerSize, moduleSize * 2);
                 ctx.rect(moduleSize, moduleSize, outerSize - 2*moduleSize, outerSize - 2*moduleSize); // Hole
             } else { // Square
                 ctx.rect(0, 0, outerSize, outerSize);
                 ctx.rect(moduleSize, moduleSize, outerSize - 2*moduleSize, outerSize - 2*moduleSize); // Hole
             }
             // Use evenodd rule to knock out the hole
             ctx.fill('evenodd');

             // Draw Inner Shape
             ctx.beginPath();
             const innerOffset = 2 * moduleSize;
             if (eyeStyle === 'circle') {
                 ctx.arc(outerCenter, outerCenter, innerSize / 2, 0, Math.PI * 2);
             } else if (eyeStyle === 'rounded') {
                 ctx.roundRect(innerOffset, innerOffset, innerSize, innerSize, moduleSize);
             } else {
                 ctx.rect(innerOffset, innerOffset, innerSize, innerSize);
             }
             ctx.fill();

             ctx.restore();
        };

        // Draw 3 Eyes
        drawEye(0, 0);
        drawEye(0, moduleCount - 7);
        drawEye(moduleCount - 7, 0);

        // Draw Logo
        if (logo) {
            const logoImg = new Image();
            logoImg.src = logo;
            logoImg.onload = () => {
                const logoSize = options.width * 0.22;
                const logoX = (options.width - logoSize) / 2;
                const logoY = (options.width - logoSize) / 2;
                
                // Draw Frame/Padding if enabled
                if (logoFrame) {
                     const framePadding = 5;
                     ctx.fillStyle = options.color.light;
                     if (eyeStyle === 'circle' || eyeStyle === 'rounded') {
                         ctx.beginPath();
                         ctx.roundRect(logoX - framePadding, logoY - framePadding, logoSize + framePadding * 2, logoSize + framePadding * 2, 10);
                         ctx.fill();
                     } else {
                         ctx.fillRect(logoX - framePadding, logoY - framePadding, logoSize + framePadding * 2, logoSize + framePadding * 2);
                     }
                }

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
  }, [qrString, options, logo, dotStyle, eyeStyle, logoFrame, gradient]);

  useEffect(() => {
    drawQrCode();
  }, [drawQrCode]);

  // Helper for stars
  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  }

  const generateSvgString = (): string => {
      // NOTE: For simplicity, the SVG export in this demo will use the standard geometric shapes.
      // Advanced shapes like stars in SVG would require complex path generation logic similar to the canvas.
      // We will map custom styles to closest SVG equivalents or standard shapes.
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
  
        const isFinderPattern = (r: number, c: number) => {
             if (r < 7 && c < 7) return true;
             if (r < 7 && c >= moduleCount - 7) return true;
             if (r >= moduleCount - 7 && c < 7) return true;
             return false;
        };

        // Draw Data Modules
        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (qr.modules.data[row * moduleCount + col]) {
                    if (isFinderPattern(row, col)) continue;

                    const cx = col * moduleSize + moduleSize / 2;
                    const cy = row * moduleSize + moduleSize / 2;
                    
                    if (dotStyle === 'dots') {
                        svg += `<circle cx="${cx}" cy="${cy}" r="${(moduleSize / 2) * 0.85}" fill="${fill}" />`;
                    } else if (dotStyle === 'diamonds') {
                        svg += `<polygon points="${cx},${row * moduleSize} ${col * moduleSize + moduleSize},${cy} ${cx},${row * moduleSize + moduleSize} ${col * moduleSize},${cy}" fill="${fill}" />`;
                    } else if (dotStyle === 'rounded') {
                         svg += `<rect x="${col * moduleSize}" y="${row * moduleSize}" width="${moduleSize}" height="${moduleSize}" rx="${moduleSize * 0.3}" fill="${fill}" />`;
                    } else {
                        // Squares and Fallback for Stars (to keep SVG simple for now)
                        svg += `<rect x="${col * moduleSize}" y="${row * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="${fill}" />`;
                    }
                }
            }
        }
        
        // Draw Finder Patterns
        const drawSvgEye = (r: number, c: number) => {
            const x = c * moduleSize;
            const y = r * moduleSize;
            const outerSize = 7 * moduleSize;
            const innerSize = 3 * moduleSize;
            
            // Outer
            if (eyeStyle === 'circle') {
                svg += `<circle cx="${x + outerSize/2}" cy="${y + outerSize/2}" r="${outerSize/2}" fill="${fill}" />`;
                svg += `<circle cx="${x + outerSize/2}" cy="${y + outerSize/2}" r="${outerSize/2 - moduleSize}" fill="${options.color.light}" />`;
            } else if (eyeStyle === 'rounded') {
                svg += `<rect x="${x}" y="${y}" width="${outerSize}" height="${outerSize}" rx="${moduleSize * 2}" fill="${fill}" />`;
                svg += `<rect x="${x + moduleSize}" y="${y + moduleSize}" width="${outerSize - 2*moduleSize}" height="${outerSize - 2*moduleSize}" rx="${moduleSize}" fill="${options.color.light}" />`;
            } else {
                svg += `<rect x="${x}" y="${y}" width="${outerSize}" height="${outerSize}" fill="${fill}" />`;
                svg += `<rect x="${x + moduleSize}" y="${y + moduleSize}" width="${outerSize - 2*moduleSize}" height="${outerSize - 2*moduleSize}" fill="${options.color.light}" />`;
            }
            
            // Inner
            const innerOffset = 2 * moduleSize;
            if (eyeStyle === 'circle') {
                svg += `<circle cx="${x + outerSize/2}" cy="${y + outerSize/2}" r="${innerSize/2}" fill="${fill}" />`;
            } else if (eyeStyle === 'rounded') {
                svg += `<rect x="${x + innerOffset}" y="${y + innerOffset}" width="${innerSize}" height="${innerSize}" rx="${moduleSize}" fill="${fill}" />`;
            } else {
                svg += `<rect x="${x + innerOffset}" y="${y + innerOffset}" width="${innerSize}" height="${innerSize}" fill="${fill}" />`;
            }
        }
        
        drawSvgEye(0, 0);
        drawSvgEye(0, moduleCount - 7);
        drawSvgEye(moduleCount - 7, 0);
  
        if (logo) {
            const logoSize = svgSize * 0.22;
            const logoX = (svgSize - logoSize) / 2;
            if (logoFrame) {
                 svg += `<rect x="${logoX - 5}" y="${logoX - 5}" width="${logoSize + 10}" height="${logoSize + 10}" fill="${options.color.light}" rx="10" />`;
            }
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
        link.download = `qr-code-padu-${Date.now()}.png`; // Better filename
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
        link.download = `qr-code-padu-${Date.now()}.svg`;
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
      { id: 'text', icon: LinkIcon, label: 'Website / Link' },
      { id: 'wifi', icon: WifiIcon, label: 'Login WiFi' },
      { id: 'vcard', icon: UserCircleIcon, label: 'Kad Nama' },
      { id: 'email', icon: EnvelopeIcon, label: 'Hantar Email' },
    ];
    return (
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setQrType(tab.id as QRType)}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center p-4 text-sm font-bold transition-all ${
              qrType === tab.id
                ? 'border-b-4 border-blue-600 text-blue-700 bg-blue-50/50'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="h-5 w-5 mb-1 sm:mb-0 sm:mr-2" />
            <span>{tab.label}</span>
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
                  <label htmlFor="qr-text" className="block text-sm font-bold text-gray-800 mb-2">Tampal Link Website Di Sini</label>
                  <input type="text" id="qr-text" value={textData} onChange={(e) => setTextData(e.target.value)} placeholder="https://contoh-website-anda.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm font-medium"/>
                  <p className="text-xs text-gray-500 mt-2">*Tips: Masukkan link penuh supaya senang orang scan.</p>
                </div>
              );
          case 'wifi':
              return (
                  <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 text-lg">Bagi Customer Scan Je (Tak Payah Tanya Password)</h4>
                      <div>
                          <label htmlFor="wifi-ssid" className="block text-sm font-bold text-gray-700 mb-1">Nama WiFi (SSID)</label>
                          <input type="text" id="wifi-ssid" placeholder="Contoh: KedaiMakan_Guest" value={wifiData.ssid} onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition"/>
                      </div>
                      <div>
                          <label htmlFor="wifi-password" className="block text-sm font-bold text-gray-700 mb-1">Password WiFi</label>
                          <input type="text" id="wifi-password" placeholder="Masuk password sini" value={wifiData.password} onChange={(e) => setWifiData({...wifiData, password: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition"/>
                      </div>
                      <div>
                          <label htmlFor="wifi-encryption" className="block text-sm font-bold text-gray-700 mb-1">Jenis Security</label>
                          <select id="wifi-encryption" value={wifiData.encryption} onChange={(e) => setWifiData({...wifiData, encryption: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition">
                              <option value="WPA">Standard (WPA/WPA2) - Paling Biasa</option>
                              <option value="WEP">Lama (WEP)</option>
                              <option value="nopass">Open (Tak Ada Password)</option>
                          </select>
                      </div>
                  </div>
              );
          case 'vcard':
              return (
                  <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 text-lg">Kad Nama Digital (Networking Power)</h4>
                      <div>
                          <label htmlFor="vcard-name" className="block text-sm font-bold text-gray-700 mb-1">Nama Penuh</label>
                          <input type="text" id="vcard-name" placeholder="Ali Baba" value={vcardData.name} onChange={(e) => setVcardData({...vcardData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition"/>
                      </div>
                      <div>
                          <label htmlFor="vcard-phone" className="block text-sm font-bold text-gray-700 mb-1">Nombor Telefon</label>
                          <input type="tel" id="vcard-phone" placeholder="+60 12 345 6789" value={vcardData.phone} onChange={(e) => setVcardData({...vcardData, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition"/>
                      </div>
                      <div>
                          <label htmlFor="vcard-email" className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                          <input type="email" id="vcard-email" placeholder="ali@bisnes.com" value={vcardData.email} onChange={(e) => setVcardData({...vcardData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition"/>
                      </div>
                       <div>
                          <label htmlFor="vcard-company" className="block text-sm font-bold text-gray-700 mb-1">Nama Syarikat</label>
                          <input type="text" id="vcard-company" placeholder="Syarikat Ali Maju Sdn Bhd" value={vcardData.company} onChange={(e) => setVcardData({...vcardData, company: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition"/>
                      </div>
                  </div>
              );
           case 'email':
                return (
                    <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 text-lg">Setup Email Automatik</h4>
                        <div>
                            <label htmlFor="email-to" className="block text-sm font-bold text-gray-700 mb-1">Hantar Kepada (Email)</label>
                            <input type="email" id="email-to" placeholder="sales@syarikat.com" value={emailData.to} onChange={(e) => setEmailData({ ...emailData, to: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition" />
                        </div>
                        <div>
                            <label htmlFor="email-subject" className="block text-sm font-bold text-gray-700 mb-1">Tajuk Email</label>
                            <input type="text" id="email-subject" placeholder="Pertanyaan Produk" value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition" />
                        </div>
                        <div>
                            <label htmlFor="email-body" className="block text-sm font-bold text-gray-700 mb-1">Isi Mesej</label>
                            <textarea id="email-body" placeholder="Saya berminat nak beli..." value={emailData.body} onChange={(e) => setEmailData({ ...emailData, body: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition" />
                        </div>
                    </div>
                );
      }
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-0 overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-gray-100">
      {/* Left Side: Controls */}
      <div className="flex flex-col bg-white">
        {renderTabs()}
        <div className="p-6 md:p-8 space-y-8">
            <div className="min-h-[220px]">{renderForm()}</div>

            <div className="border-t border-gray-100 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
                    <PaintBrushIcon className="h-6 w-6 mr-2 text-blue-600" />
                    Biar Nampak Mahal (Design)
                </h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Pilih Tema Warna (Fast)</label>
                        <div className="flex flex-wrap gap-2">
                            {colorPalettes.map(p => (
                                <button key={p.name} onClick={() => applyPalette(p)} className="h-9 px-4 text-xs font-bold rounded-full border border-gray-200 shadow-sm hover:scale-105 active:scale-95 transition-all" style={{backgroundColor: p.light, color: p.dark, borderColor: p.dark}}>
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="qr-color-dark" className="block text-sm font-semibold text-gray-700 mb-1">Warna Kod</label>
                            <input id="qr-color-dark" type="color" value={options.color.dark} onChange={(e) => handleColorChange('dark', e.target.value)} disabled={gradient.enabled} className="w-full h-12 p-1 bg-white border border-gray-300 rounded-lg cursor-pointer disabled:opacity-50"/>
                        </div>
                        <div>
                            <label htmlFor="qr-color-light" className="block text-sm font-semibold text-gray-700 mb-1">Warna Belakang</label>
                            <input id="qr-color-light" type="color" value={options.color.light} onChange={(e) => handleColorChange('light', e.target.value)} className="w-full h-12 p-1 bg-white border border-gray-300 rounded-lg cursor-pointer"/>
                        </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center text-sm font-bold text-gray-800">
                                <SparklesIcon className="h-5 w-5 mr-2 text-blue-600"/>
                                Nak Warna Gradient? (Baru Nampak Pro)
                            </label>
                            <label htmlFor="gradient-toggle" className="inline-flex relative items-center cursor-pointer">
                              <input type="checkbox" id="gradient-toggle" className="sr-only peer" checked={gradient.enabled} onChange={(e) => handleGradientChange('enabled', e.target.checked)} />
                              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        {gradient.enabled && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div><input type="color" value={gradient.color1} onChange={(e) => handleGradientChange('color1', e.target.value)} className="w-full h-10 p-1 bg-white border border-gray-300 rounded-lg cursor-pointer"/></div>
                                <div><input type="color" value={gradient.color2} onChange={(e) => handleGradientChange('color2', e.target.value)} className="w-full h-10 p-1 bg-white border border-gray-300 rounded-lg cursor-pointer"/></div>
                            </div>
                        )}
                    </div>

                     {/* SHAPE CUSTOMIZATION */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                         <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <EyeIcon className="h-4 w-4 mr-1"/> Bentuk Mata (Corner)
                            </label>
                            <div className="flex gap-2">
                                {(['square', 'rounded', 'circle'] as EyeStyle[]).map((style) => (
                                    <button 
                                        key={style} 
                                        onClick={() => setEyeStyle(style)} 
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${eyeStyle === style ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {style === 'square' ? 'Kotak' : style === 'rounded' ? 'Lengkun' : 'Bulat'}
                                    </button>
                                ))}
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <StarIcon className="h-4 w-4 mr-1"/> Corak Titik (Pattern)
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['squares', 'dots', 'rounded', 'diamonds', 'stars'] as DotStyle[]).map((style) => (
                                    <button 
                                        key={style} 
                                        onClick={() => setDotStyle(style)} 
                                        className={`py-2 px-1 text-[10px] font-bold rounded-lg border transition-all ${dotStyle === style ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {style.charAt(0).toUpperCase() + style.slice(1)}
                                    </button>
                                ))}
                            </div>
                         </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                         <div className="space-y-4">
                            <div>
                                <label htmlFor="qr-error-level" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tahap Kerosakan
                                </label>
                                <select id="qr-error-level" value={options.errorCorrectionLevel} onChange={(e) => handleOptionChange('errorCorrectionLevel', e.target.value as QROptions['errorCorrectionLevel'])} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 transition">
                                    <option value="L">Rendah (Paling Jelas)</option>
                                    <option value="M">Sederhana (Standard)</option>
                                    <option value="Q">Tinggi (Bagus)</option>
                                    <option value="H">Paling Tinggi (Tahan Lasak)</option>
                                </select>
                            </div>
                         </div>
                         
                         <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Logo Tengah (Optional)</label>
                            <input type="file" accept="image/*" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" />
                            {logo ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-2 border rounded-lg bg-gray-50">
                                        <img src={logo} alt="Logo preview" className="w-10 h-10 rounded object-cover border bg-white"/>
                                        <button onClick={() => setLogo(null)} className="text-xs font-bold text-red-600 hover:text-red-800 px-2 py-1">
                                            Buang
                                        </button>
                                    </div>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={logoFrame} onChange={(e) => setLogoFrame(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"/>
                                        <span className="text-sm font-medium text-gray-700">Bingkai Putih (Supaya Jelas)</span>
                                    </label>
                                </div>
                            ) : (
                                <button onClick={() => logoInputRef.current?.click()} className="w-full h-[76px] flex flex-col items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition">
                                    <ArrowUpTrayIcon className="h-5 w-5 mb-1" />
                                    Upload Logo
                                </button>
                            )}
                             <div className="mt-4">
                                <label htmlFor="qr-size" className="block text-sm font-semibold text-gray-700 flex justify-between"><span>Saiz</span> <span className="text-gray-400 font-normal">{options.width}px</span></label>
                                <input id="qr-size" type="range" min="128" max="1024" step="32" value={options.width} onChange={(e) => handleOptionChange('width', parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"/>
                            </div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
      </div>

      {/* Right Side: QR Code Display */}
      <div className="flex flex-col items-center justify-center bg-gray-50/50 p-8 border-t lg:border-t-0 lg:border-l border-gray-100">
        <div className="text-center mb-6">
            <h3 className="text-2xl font-black text-gray-900">Hasilnya</h3>
            <p className="text-gray-500 text-sm">Preview automatik setiap kali anda taip.</p>
        </div>
        
        <div className="relative p-4 bg-white rounded-xl shadow-lg border border-gray-100 mb-8 transform transition-transform hover:scale-105 duration-300">
            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded z-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
                    </div>
                )}
                <canvas ref={qrCanvasRef} className="rounded max-w-full"/>
            </div>
        </div>

        <div className="w-full max-w-xs space-y-3">
            <button onClick={() => handleDownload('png')} disabled={!qrString || isLoading} className="w-full group relative inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform active:scale-95">
                <ArrowDownTrayIcon className="h-6 w-6 mr-2 group-hover:animate-bounce" />
                Simpan (PNG) - Percuma
            </button>
             <button onClick={() => handleDownload('svg')} disabled={!qrString || isLoading} className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 text-sm font-bold rounded-xl text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                Download Vector (SVG)
            </button>
        </div>
        <p className="mt-6 text-xs text-gray-400 text-center max-w-xs">
            100% High Resolution. Boleh guna untuk print billboard, baju, atau letak di kaunter kedai.
        </p>
      </div>
    </div>
  );
};

export default QrCodeGenerator;