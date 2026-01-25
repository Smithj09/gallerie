
import React from 'react';
import ProjectGallery from './components/ProjectGallery';
import { ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-shrink-0 cursor-pointer">
            <img 
              src="https://i.postimg.cc/5y2pkLJ9/logo.jpg" 
              alt="Logo" 
              className="h-16 w-auto object-contain" 
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
      <section className="relative px-6 py-12 md:py-16 overflow-hidden bg-gradient-to-br from-slate-50 to-white">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block mb-3 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-sm font-semibold text-yellow-400">Notre Portfolio</p>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 leading-tight">
            Réalisations <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">Solaires</span>
          </h2>
          
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
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
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-slate-900 text-sm">
                  ☀
                </div>
                <h3 className="font-bold text-white">AD Innovation</h3>
              </div>
              <p className="text-sm text-slate-400">Solutions énergétiques durables pour un avenir meilleur.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Accueil</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Projets</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>📧 info@adinnovation.com</li>
                <li>📱 +33 (0) 1 23 45 67 89</li>
                <li>📍 Paris, France</li>
              </ul>
            </div>
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
