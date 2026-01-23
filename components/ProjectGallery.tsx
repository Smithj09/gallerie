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

const REQUIRED_PASSKEY = "INNO-SOLAR-2025";

const ProjectGallery: React.FC = () => {
  // --- States ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [desc, setDesc] = useState('');
  const [loc, setLoc] = useState('');
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // --- Lifecycle ---
  useEffect(() => {
    loadProjects();
  }, []);

  // --- Actions ---
  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
    } else if (data) {
      setProjects(data as Project[]);
    }
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
      if (data.secure_url) {
        setImageUrl(data.secure_url);
      } else {
        throw new Error("Upload failed");
      }
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
      // Reset form and close modal
      setDesc('');
      setLoc('');
      setPasskey('');
      setImageUrl(null);
      setShowModal(false);
      loadProjects();
    }
  };

  const handleDeleteProject = async (id: string) => {
    const input = window.prompt("Entrez la passkey pour supprimer ce projet :");
    if (input === REQUIRED_PASSKEY) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        alert("Erreur lors de la suppression");
      } else {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    } else if (input !== null) {
      alert("Passkey incorrecte");
    }
  };

  // --- Render ---
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Nos Projets</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          +
        </button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            onDelete={() => handleDeleteProject(p.id)}
          />
        ))}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <form 
            onSubmit={handlePostProject} 
            className="bg-white p-6 rounded-lg max-w-md w-full space-y-4 shadow-xl"
          >
            <h3 className="text-xl font-bold">Nouveau Projet</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">Image du projet</label>
              <input type="file" onChange={handleFileUpload} className="w-full text-sm" />
              {isUploading && <p className="text-sm text-blue-500 mt-1 italic">Téléchargement en cours...</p>}
              {imageUrl && <p className="text-sm text-green-500 mt-1">✓ Image prête !</p>}
            </div>

            <input 
              placeholder="Localisation (ex: Paris, France)"
              value={loc} 
              onChange={e => setLoc(e.target.value)} 
              className="border p-2 w-full rounded"
              required
            />
            
            <textarea 
              placeholder="Description du projet..."
              value={desc} 
              onChange={e => setDesc(e.target.value)} 
              className="border p-2 w-full rounded h-24"
              required
            />
            
            <input 
              type="password" 
              placeholder="Passkey d'administration"
              value={passkey} 
              onChange={e => setPasskey(e.target.value)} 
              className="border p-2 w-full rounded"
              required
            />
            
            <div className="flex gap-2 pt-2">
              <button 
                type="submit" 
                disabled={isUploading} 
                className={`bg-green-600 text-white px-4 py-2 rounded flex-1 font-semibold ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
              >
                {isUploading ? 'Patientez...' : 'Publier'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
              >
                Annuler
              </button>
            </div>
            
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          </form>
        </div>
      )}
    </section>
  );
};

export default ProjectGallery;