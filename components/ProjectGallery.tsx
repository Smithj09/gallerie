import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import GalleryItem from './GalleryItem';
import { X, ChevronLeft, ChevronRight, Plus, Loader, AlertCircle } from 'lucide-react';

interface Project {
  id: string;
  image_url: string | string[];
  description: string;
  location: string;
  rating: number;
  created_at: string;
}

const REQUIRED_PASSKEY = 'INNO-SOLAR-2025';

const ProjectGallery: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [desc, setDesc] = useState('');
  const [loc, setLoc] = useState('');
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* ---------- DETAILS MODAL ---------- */
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const startY = useRef(0);

  /* ---------------- LOAD PROJECTS ---------------- */
  const loadProjects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setProjects(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await res.json();
      if (!data.secure_url) throw new Error();

      setImageUrl(data.secure_url);
    } catch {
      setError("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  /* ---------------- CREATE PROJECT ---------------- */
  const handlePostProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading || isLoading) return;

    if (passkey !== REQUIRED_PASSKEY) {
      setError('Passkey incorrecte');
      return;
    }

    if (!imageUrl || !desc || !loc) {
      setError('Tous les champs sont requis');
      return;
    }

    setIsLoading(true);

    await supabase.from('projects').insert({
      image_url: imageUrl,
      description: desc,
      location: loc,
      rating: 0,
      passkey: REQUIRED_PASSKEY,
    });

    setShowModal(false);
    setImageUrl(null);
    setDesc('');
    setLoc('');
    setPasskey('');
    loadProjects();
    setIsLoading(false);
  };

  /* ---------------- DELETE PROJECT ---------------- */
  const handleDeleteProject = async (id: string) => {
    const input = window.prompt('Entrez la passkey :');
    if (!input) return;

    await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('passkey', input);

    setProjects(p => p.filter(x => x.id !== id));
  };

  /* ---------------- UPDATE RATING ---------------- */
  const handleUpdateRating = async (id: string, newRating: number) => {
    await supabase.from('projects').update({ rating: newRating }).eq('id', id);
    setProjects(p =>
      p.map(x => (x.id === id ? { ...x, rating: newRating } : x))
    );
  };

  /* ---------------- RENDER ---------------- */
  return (
    <section className="py-16">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Nos Projets</h2>
          <p className="text-slate-600 text-lg">{projects.length} réalisations</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-yellow-500/30"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Loading State */}
      {isLoading && !projects.length ? (
        <div className="flex justify-center items-center py-32">
          <div className="text-center">
            <Loader className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Chargement des projets...</p>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-32 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">
          <p className="text-slate-600 text-lg mb-4">Aucun projet pour le moment</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Créer le premier projet
          </button>
        </div>
      ) : (
        /* Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <GalleryItem
              key={p.id}
              project={{
                id: p.id,
                imageUrl: Array.isArray(p.image_url)
                  ? p.image_url[0]
                  : p.image_url,
                description: p.description,
                location: p.location,
                rating: p.rating,
                date: new Date(p.created_at).toLocaleDateString('fr-FR'),
              }}
              onDelete={() => handleDeleteProject(p.id)}
              onClick={() => {
                setSelectedProject(p);
                setCurrentImage(0);
                setZoomed(false);
              }}
              onUpdateRating={handleUpdateRating}
            />
          ))}
        </div>
      )}

      {/* ADD PROJECT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 overflow-hidden shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Nouveau Projet</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handlePostProject} className="p-6 space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Image du projet
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="sr-only"
                    id="file-input"
                    accept="image/*"
                  />
                  <label
                    htmlFor="file-input"
                    className="block w-full p-4 border-2 border-dashed border-slate-300 hover:border-yellow-400 rounded-lg text-center cursor-pointer transition-colors"
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader size={18} className="animate-spin text-yellow-400" />
                        <span className="text-slate-400">Upload...</span>
                      </div>
                    ) : imageUrl ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-green-600">✓ Image prête</span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-700 font-medium">Cliquez pour télécharger</p>
                        <p className="text-xs text-slate-500 mt-1">ou glissez-déposez une image</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Localisation
                </label>
                <input
                  placeholder="ex: Paris, France"
                  value={loc}
                  onChange={e => setLoc(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Décrivez le projet..."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors h-24 resize-none"
                />
              </div>

              {/* Passkey */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Passkey
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={passkey}
                  onChange={e => setPasskey(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>

              {/* Error Alert */}
              {error && (
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-300 rounded-lg">
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={!imageUrl || isLoading || isUploading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-slate-600 disabled:to-slate-600 text-slate-900 font-bold rounded-lg transition-all disabled:cursor-not-allowed"
                >
                  Publier
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
          onTouchStart={e => (startY.current = e.touches[0].clientY)}
          onTouchEnd={e => {
            if (e.changedTouches[0].clientY - startY.current > 120)
              setSelectedProject(null);
          }}
        >
          <div
            className="bg-white max-w-4xl w-full h-[90vh] rounded-2xl overflow-hidden border border-slate-200 shadow-xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Image Container with Navigation */}
            <div className="relative flex-1 overflow-hidden bg-slate-950">
              <img
                src={
                  Array.isArray(selectedProject.image_url)
                    ? selectedProject.image_url[currentImage]
                    : selectedProject.image_url
                }
                onClick={() => setZoomed(!zoomed)}
                className={`w-full h-full object-contain cursor-zoom-in ${
                  zoomed ? 'scale-150' : ''
                } transition-transform`}
              />

              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
              >
                <X size={24} className="text-white" />
              </button>

              {/* Image Navigation */}
              {Array.isArray(selectedProject.image_url) &&
                selectedProject.image_url.length > 1 && (
                  <>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setCurrentImage(
                          (currentImage - 1 + selectedProject.image_url.length) %
                            selectedProject.image_url.length
                        );
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                    >
                      <ChevronLeft size={24} className="text-white" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setCurrentImage(
                          (currentImage + 1) % selectedProject.image_url.length
                        );
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
                    >
                      <ChevronRight size={24} className="text-white" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedProject.image_url.map((_, i) => (
                        <button
                          key={i}
                          onClick={e => {
                            e.stopPropagation();
                            setCurrentImage(i);
                          }}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i === currentImage ? 'bg-yellow-400' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
            </div>

            {/* Content Footer */}
            <div className="p-4 bg-white border-t border-slate-200">
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                {selectedProject.location}
              </h3>

              <p className="text-slate-700 text-sm mb-4 line-clamp-2">
                {selectedProject.description}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Evaluation</p>
                  <p className="text-lg font-bold text-yellow-500">
                    ★ {selectedProject.rating.toFixed(1)}/5
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteProject(selectedProject.id)}
                  className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors border border-red-300 text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectGallery;
