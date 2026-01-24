
import React from 'react';
import ProjectGallery from './components/ProjectGallery';
import { ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-shrink-0 cursor-pointer py-2">
            <img 
              src="https://i.postimg.cc/5y2pkLJ9/logo.jpg" 
              alt="Logo" 
              className="h-20 w-auto object-contain" 
            />
          </div>

          <button className="bg-[#0D3156] text-white px-5 py-2.5 rounded text-[10px] font-extrabold uppercase tracking-widest hover:bg-red-800 transition-colors">
            <a href="https://platform-one-tan.vercel.app/#solutions">
              Retour
            </a>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden bg-gradient-to-br from-slate-50 to-white">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-sm font-semibold text-yellow-400">Notre Portfolio</p>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            Réalisations <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">Solaires</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Installation, entretien et performance énergétique à travers tout le territoire. Découvrez nos projets d'excellence.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <main className="max-w-7xl mx-auto px-6">
        <ProjectGallery />
      </main>

      {/* Footer */}
      <footer className="relative mt-32 border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8">
            <img 
              src="https://i.postimg.cc/5y2pkLJ9/logo.jpg" 
              alt="Solar Logo" 
              className="h-40 w-auto object-contain" 
            />
          </div>
          
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} AD Innovation Services Plus. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
