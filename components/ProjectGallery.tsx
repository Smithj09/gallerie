import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import GalleryItem from './GalleryItem';

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
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* HEADER (z-index FIXED) */}
      <div className="flex justify-between items-center mb-8 relative z-30">
        <h2 className="text-3xl font-bold">Nos Projets</h2>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded relative z-40"
        >
          +
        </button>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
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
              date: new Date(p.created_at).toLocaleDateString(),
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

      {/* ---------- ADD PROJECT MODAL ---------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handlePostProject}
            className="bg-white p-6 rounded-lg max-w-md w-full space-y-4"
          >
            <h3 className="text-xl font-bold">Nouveau Projet</h3>

            <input type="file" onChange={handleFileUpload} />

            <input
              placeholder="Localisation"
              value={loc}
              onChange={e => setLoc(e.target.value)}
              className="border p-2 w-full rounded"
            />

            <textarea
              placeholder="Description"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="border p-2 w-full rounded h-24"
            />

            <input
              type="password"
              placeholder="Passkey"
              value={passkey}
              onChange={e => setPasskey(e.target.value)}
              className="border p-2 w-full rounded"
            />

            {isUploading && <p className="text-sm text-blue-600">Upload...</p>}
            {imageUrl && <p className="text-sm text-green-600">Image prête</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!imageUrl}
                className="bg-green-600 text-white px-4 py-2 rounded flex-1"
              >
                Publier
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---------- DETAILS MODAL ---------- */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
          onTouchStart={e => (startY.current = e.touches[0].clientY)}
          onTouchEnd={e => {
            if (e.changedTouches[0].clientY - startY.current > 120)
              setSelectedProject(null);
          }}
        >
          <div
            className="bg-white max-w-5xl w-full rounded-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={
                Array.isArray(selectedProject.image_url)
                  ? selectedProject.image_url[currentImage]
                  : selectedProject.image_url
              }
              onClick={() => setZoomed(!zoomed)}
              className={`w-full max-h-[75vh] object-contain bg-black ${
                zoomed ? 'scale-150' : ''
              }`}
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold">
                {selectedProject.location}
              </h3>
              <p className="mt-2">{selectedProject.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                ⭐ {selectedProject.rating}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectGallery;
