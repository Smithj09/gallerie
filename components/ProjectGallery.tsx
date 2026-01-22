
import React, { useState } from 'react';
import { SolarProject } from '../types';
import GalleryItem from './GalleryItem';

const INITIAL_PROJECTS: SolarProject[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1000&auto=format&fit=crop',
    description: 'Installation de panneaux monocristallins pour une résidence privée à Ouanaminthe. Performance optimisée de 5.5kW.',
    rating: 5,
    date: '22 JAN 2024',
    location: 'Ouanaminthe'
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=1000&auto=format&fit=crop',
    description: 'Système hybride avec stockage batterie lithium pour un commerce local. Autonomie totale garantie.',
    rating: 4,
    date: '15 JAN 2024',
    location: 'Cap-Haïtien'
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1548518014-97ca0b3b249b?q=80&w=1000&auto=format&fit=crop',
    description: 'Maintenance préventive et nettoyage professionnel de parc solaire industriel.',
    rating: 5,
    date: '10 JAN 2024',
    location: 'Fort-Liberté'
  }
];

const REQUIRED_PASSKEY = "INNO-SOLAR-2025";

const ProjectGallery: React.FC = () => {
  const [projects, setProjects] = useState<SolarProject[]>(INITIAL_PROJECTS);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [newDesc, setNewDesc] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostProject = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passkey !== REQUIRED_PASSKEY) {
      setError("Passkey incorrecte. Accès refusé.");
      return;
    }

    if (!newDesc || !newLoc || !imagePreview) {
      setError("Veuillez remplir tous les champs et ajouter une image.");
      return;
    }

    const newProject: SolarProject = {
      id: Date.now().toString(),
      imageUrl: imagePreview,
      description: newDesc,
      rating: 0,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      location: newLoc
    };

    setProjects([newProject, ...projects]);
    setNewDesc('');
    setNewLoc('');
    setPasskey('');
    setImagePreview(null);
    setShowModal(false);
  };

  const updateRating = (id: string, newRating: number) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, rating: newRating } : p));
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h4 className="text-[#FFC600] font-black uppercase tracking-[0.2em] text-[10px] mb-2">
            Réalisations
          </h4>
          <h2 className="text-[#0D3156] text-3xl md:text-4xl font-extrabold uppercase">
            Nos Derniers Projets
          </h2>
          <div className="h-1 w-20 bg-[#FFC600] mt-4"></div>
        </div>
        
        <button 
          onClick={() => {
            setError(null);
            setShowModal(true);
          }}
          className="bg-[#0D3156] text-white px-6 py-3 rounded-md font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#1a4a7a] transition-colors shadow-lg shadow-blue-900/20"
        >
          <i className="fa-solid fa-lock text-[10px] opacity-70"></i>
          Publier un projet
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <GalleryItem key={project.id} project={project} onUpdateRating={updateRating} />
        ))}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D3156]/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-[#0D3156] font-extrabold uppercase text-lg">Nouveau Projet</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Zone sécurisée pour l'administration</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handlePostProject} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#4A6278] uppercase tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-image text-[#FFC600]"></i> Image du Projet
                </label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors ${imagePreview ? 'border-green-400 bg-green-50' : 'border-slate-200 group-hover:border-[#FFC600] group-hover:bg-slate-50'}`}>
                    {imagePreview ? (
                      <div className="relative w-full h-24">
                        <img src={imagePreview} className="w-full h-full object-cover rounded-lg" alt="Preview" />
                        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-[10px] font-bold uppercase">Changer l'image</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <i className="fa-solid fa-cloud-arrow-up text-2xl text-slate-300 mb-2"></i>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Sélectionner une photo</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#4A6278] uppercase tracking-wider">Localisation</label>
                  <input 
                    type="text" 
                    value={newLoc}
                    onChange={(e) => setNewLoc(e.target.value)}
                    placeholder="Ex: Ouanaminthe"
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC600]/20 focus:border-[#FFC600] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#4A6278] uppercase tracking-wider">Description</label>
                <textarea 
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Détails techniques du projet..."
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC600]/20 focus:border-[#FFC600] transition-all resize-none"
                  required
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#4A6278] uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-key text-[#FFC600]"></i> Passkey de Sécurité
                  </label>
                  <input 
                    type="password" 
                    value={passkey}
                    onChange={(e) => {
                      setPasskey(e.target.value);
                      setError(null);
                    }}
                    placeholder="Entrez le code administrateur"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all font-mono tracking-widest ${error ? 'border-red-500 bg-red-50 focus:ring-red-200 animate-shake' : 'border-slate-200 focus:ring-[#FFC600]/20 focus:border-[#FFC600]'}`}
                    required
                  />
                  {error && (
                    <p className="text-red-500 text-[10px] font-bold uppercase animate-bounce italic">{error}</p>
                  )}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#0D3156] text-white py-3.5 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-[#1a4a7a] transition-all transform active:scale-[0.98] shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                  Confirmer la publication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectGallery;
