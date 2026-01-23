import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import GalleryItem from './GalleryItem';

interface Project {
  id: string;
  image_url: string;
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

  /* -------------------- LOAD PROJECTS -------------------- */
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
      console.error('Error fetching projects:', err);
      setError('Impossible de charger les projets.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* -------------------- IMAGE UPLOAD -------------------- */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await res.json();
      if (!data.secure_url) throw new Error('Upload failed');

      setImageUrl(data.secure_url);
    } catch {
      setError("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  /* -------------------- CREATE PROJECT -------------------- */
  const handlePostProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isLoading || isUploading) return; 

    setError(null);

    if (passkey !== REQUIRED_PASSKEY) {
      setError('Passkey incorrecte');
      return;
    }
    if (!imageUrl || !desc || !loc) {
      setError('Tous les champs sont requis (attendez la fin du chargement de l\'image)');
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

      // Reset form
      setDesc('');
      setLoc('');
      setPasskey('');
      setImageUrl(null);
      setShowModal(false);

      await loadProjects();
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.message || 'Erreur lors de la création du projet.');
    } finally {
      setIsLoading(false); 
    }
  };

  /* -------------------- DELETE PROJECT -------------------- */
  const handleDeleteProject = async (id: string) => {
    const input = window.prompt('Entrez la passkey pour supprimer ce projet :');
    
    if (input === null) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('passkey', input); 

      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error:', err);
      alert('La suppression a échoué. La passkey est probablement incorrecte.');
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Nos Projets</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          +
        </button>
      </div>

      {isLoading && projects.length === 0 && (
        <p className="text-center text-gray-500 italic mb-4">
          Chargement des projets...
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <GalleryItem
            key={p.id}
            project={{
              id: p.id,
              imageUrl: p.image_url,
              description: p.description,
              rating: p.rating,
              location: p.location,
              date: new Date(p.created_at).toLocaleDateString(),
            }}
            onDelete={() => handleDeleteProject(p.id)}
          />
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <form 
            onSubmit={handlePostProject} 
            className="bg-white p-6 rounded-lg max-w-md w-full space-y-4 shadow-xl"
          >
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Nouveau Projet</h3>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600">Image du projet</label>
              <input 
                type="file" 
                onChange={handleFileUpload} 
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <input
              placeholder="Localisation (ex: Paris, France)"
              value={loc}
              onChange={e => setLoc(e.target.value)}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <textarea
              placeholder="Description du projet"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="border p-2 w-full rounded h-24 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="password"
              placeholder="Passkey"
              value={passkey}
              onChange={e => setPasskey(e.target.value)}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div className="flex flex-col gap-3 pt-2">
              {/* Image upload status indicators */}
              {isUploading && (
                <p className="text-blue-600 text-sm italic animate-pulse">
                  🔄 Téléchargement de l'image...
                </p>
              )}
              {imageUrl && !isUploading && (
                <p className="text-green-600 text-sm font-medium">
                  ✅ Image chargée avec succès
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isUploading || isLoading || !imageUrl}
                  className={`px-4 py-2 rounded flex-1 text-white font-bold transition-colors ${
                    (isUploading || isLoading || !imageUrl) 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isLoading ? 'Publication...' : 'Publier'}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-100">
                {error}
              </p>
            )}
          </form>
        </div>
      )}
    </section>
  );
};

export default ProjectGallery;