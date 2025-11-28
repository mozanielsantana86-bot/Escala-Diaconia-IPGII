import React, { useState, useEffect } from 'react';

interface Props {
  onStart: () => void;
  appName: string;
}

const WelcomeScreen: React.FC<Props> = ({ onStart, appName }) => {
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
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
          {appName}
        </h1>
        <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xs mx-auto">
          Gestão inteligente e simplificada para sua equipe de voluntários.
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

          <button
            onClick={onStart}
            className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-4 rounded-xl border border-white/10 backdrop-blur-sm transition-all flex items-center justify-center gap-3 hover:border-white/20"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Continuar com Google</span>
          </button>
           
          <div className="pt-2">
             <button 
                onClick={onStart}
                className="text-sm text-slate-500 hover:text-indigo-400 transition-colors py-2"
             >
                Explorar como convidado
             </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 text-[10px] uppercase tracking-wider text-slate-600 font-medium">
          <a href="#" className="hover:text-slate-400 transition-colors">Termos de Uso</a>
          <span className="text-slate-700">•</span>
          <a href="#" className="hover:text-slate-400 transition-colors">Política de Privacidade</a>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;