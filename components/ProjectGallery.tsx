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

  /* ---------- DETAILS MODAL STATES ---------- */
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const startY = useRef(0);

  /* ---------------- LOAD PROJECTS ---------------- */
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger les projets.');
    } finally {
      setIsLoading(false);
    }
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
    if (isLoading || isUploading) return;

    if (passkey !== REQUIRED_PASSKEY) {
      setError('Passkey incorrecte');
      return;
    }

    if (!imageUrl || !desc || !loc) {
      setError('Tous les champs sont requis');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from('projects').insert({
        image_url: imageUrl,
        description: desc,
        location: loc,
        rating: 0,
        passkey: REQUIRED_PASSKEY,
      });

      if (error) throw error;

      setDesc('');
      setLoc('');
      setPasskey('');
      setImageUrl(null);
      setShowModal(false);

      loadProjects();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- DELETE PROJECT ---------------- */
  const handleDeleteProject = async (id: string) => {
    const input = window.prompt('Entrez la passkey :');
    if (!input) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('passkey', input);

    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== id));
    } else {
      alert('Passkey incorrecte');
    }
  };

  /* ---------------- RENDER ---------------- */
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Nos Projets</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          +
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <GalleryItem
            key={p.id}
            project={{
              id: p.id,
              imageUrl: Array.isArray(p.image_url)
                ? p.image_url[0]
                : p.image_url,
              description: p.description,
              rating: p.rating,
              location: p.location,
              date: new Date(p.created_at).toLocaleDateString(),
            }}
            onDelete={() => handleDeleteProject(p.id)}
            onClick={() => {
              setSelectedProject(p);
              setCurrentImage(0);
              setZoomed(false);
            }}
          />
        ))}
      </div>

      {/* ---------------- DETAILS MODAL ---------------- */}
      {selectedProject && (() => {
        const images = Array.isArray(selectedProject.image_url)
          ? selectedProject.image_url
          : [selectedProject.image_url];

        return (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
            onTouchStart={e => (startY.current = e.touches[0].clientY)}
            onTouchEnd={e => {
              if (e.changedTouches[0].clientY - startY.current > 120) {
                setSelectedProject(null);
              }
            }}
          >
            <div
              className="bg-white max-w-5xl w-full rounded-lg overflow-hidden relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-3 right-3 bg-black/60 text-white w-8 h-8 rounded-full"
              >
                ✕
              </button>

              <div className="bg-black flex items-center justify-center">
                <img
                  src={images[currentImage]}
                  onClick={() => setZoomed(!zoomed)}
                  className={`max-h-[75vh] w-full object-contain cursor-zoom-in transition ${
                    zoomed ? 'scale-150 cursor-zoom-out' : ''
                  }`}
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage(i => Math.max(i - 1, 0))}
                      className="absolute left-4 text-white text-3xl"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImage(i =>
                          Math.min(i + 1, images.length - 1)
                        )
                      }
                      className="absolute right-4 text-white text-3xl"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-2xl font-bold">
                  {selectedProject.location}
                </h3>

                <p>{selectedProject.description}</p>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    📅{' '}
                    {new Date(
                      selectedProject.created_at
                    ).toLocaleDateString()}
                  </span>
                  <span>⭐ {selectedProject.rating}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(images[currentImage])
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    🔗 Partager
                  </button>

                  <a
                    href={images[currentImage]}
                    target="_blank"
                    className="bg-gray-200 px-4 py-2 rounded"
                  >
                    🖼️ Plein écran
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
};

export default ProjectGallery;
