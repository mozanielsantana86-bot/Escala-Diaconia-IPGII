import React, { useState, useEffect } from 'react';

interface Props {
  onStart: () => void;
  appName: string;
}

const WelcomeScreen: React.FC<Props> = ({ onStart }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center font-sans selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Content */}
      <div className={`relative z-10 max-w-md w-full px-6 flex flex-col items-center text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

        {/* Logo / Icon */}
        <div className="mb-8 relative group cursor-pointer">
          <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
          <div className="relative w-28 h-28 bg-slate-800/50 backdrop-blur-2xl border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl ring-1 ring-white/5 group-hover:scale-105 transition-transform duration-500 group-hover:border-indigo-500/30">
             <svg className="w-12 h-12 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
          <span className="block text-4xl font-normal mb-1">Escala Diaconia</span>
          <span className="block text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">IPGII</span>
        </h1>
        <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-sm mx-auto font-bold italic font-serif">
          "Portanto, meus amados irmãos, sede firmes, inabaláveis e sempre abundantes na obra do Senhor, sabendo que, no Senhor, o vosso trabalho não é vão."
        </p>

        {/* Buttons */}
        <div className="w-full space-y-4">
          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group border border-indigo-500/20"
          >
            <span>Começar Agora</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;