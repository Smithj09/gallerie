import React from 'react';
import StarRating from './StarRating';

interface GalleryItemProps {
  project: {
    id: string;
    imageUrl: string;
    description: string;
    location: string;
    rating: number;
    date: string;
  };
  onDelete: () => void;
  onUpdateRating?: (id: string, newRating: number) => void; // Optional if you want to use the rating feature
}

const GalleryItem: React.FC<GalleryItemProps> = ({ project, onDelete, onUpdateRating }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative">
      
      {/* Delete Button - Appears on Hover */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-3 left-3 z-20 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        title="Supprimer ce projet"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={project.imageUrl} 
          alt={project.description}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-[#0D3156] uppercase tracking-wider z-10">
          {project.location}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <p className="text-slate-500 text-[11px] uppercase tracking-widest font-bold">
            {project.date}
          </p>
          <StarRating 
            rating={project.rating} 
            interactive={!!onUpdateRating} 
            onRate={(r) => onUpdateRating?.(project.id, r)} 
          />
        </div>
        
        <p className="text-[#4A6278] text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
          {project.description}
        </p>
        
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[#0D3156] text-xs font-bold hover:underline cursor-pointer">
            Voir les détails →
          </span>
          
          {/* Avatar Stack */}
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-sm">
                <img src={`https://picsum.photos/seed/${project.id}${i}/100/100`} alt="User" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryItem;