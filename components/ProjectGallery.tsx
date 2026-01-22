


import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Path is correct for your structure
import GalleryItem from './GalleryItem';

interface Project {
  id: string;
  image_url: string;
  description: string;
  location: string;
  rating: number;
  created_at: string;
}

const REQUIRED_PASSKEY = "INNO-SOLAR-2025";

const ProjectGallery: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [desc, setDesc] = useState('');
  const [loc, setLoc] = useState('');
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New state

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setProjects(data as Project[]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      setImageUrl(data.secure_url);
    } catch (err) {
      setError("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePostProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passkey !== REQUIRED_PASSKEY) {
      setError("Passkey incorrecte");
      return;
    }

    if (!imageUrl || !desc || !loc) {
      setError("Tous les champs sont requis");
      return;
    }

    const { error: insertError } = await supabase.from('projects').insert({
      image_url: imageUrl,
      description: desc,
      location: loc,
      rating: 0
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setDesc('');
      setLoc('');
      setPasskey('');
      setImageUrl(null);
      setShowModal(false);
      loadProjects();
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Nos Projets</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ajouter un Projet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map(p => (
          <GalleryItem
            key={p.id}
            project={{
              id: p.id,
              imageUrl: p.image_url,
              description: p.description,
              rating: p.rating,
              date: new Date(p.created_at).toLocaleDateString(),
              location: p.location
            }}
          />
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <form onSubmit={handlePostProject} className="bg-white p-6 rounded-lg max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold">Nouveau Projet</h3>
            
            <input type="file" onChange={handleFileUpload} className="w-full" />
            {isUploading && <p className="text-sm text-blue-500">Téléchargement en cours...</p>}
            {imageUrl && <p className="text-sm text-green-500">Image prête !</p>}

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
              className="border p-2 w-full rounded"
            />
            
            <input 
              type="password" 
              placeholder="Passkey"
              value={passkey} 
              onChange={e => setPasskey(e.target.value)} 
              className="border p-2 w-full rounded"
            />
            
            <div className="flex gap-2">
              <button type="submit" disabled={isUploading} className="bg-green-600 text-white px-4 py-2 rounded flex-1">
                Publier
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="bg-gray-200 px-4 py-2 rounded">
                Annuler
              </button>
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </div>
      )}
    </section>
  );
};

export default ProjectGallery;