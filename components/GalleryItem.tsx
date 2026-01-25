import React from 'react';
import StarRating from './StarRating';
import { Trash2, MapPin, Calendar } from 'lucide-react';

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
  onClick: () => void;
  onUpdateRating?: (id: string, newRating: number) => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({
  project,
  onDelete,
  onClick,
  onUpdateRating
}) => {
  return (
    <div
      onClick={onClick}
      className="w-full border-2 border-slate-200 rounded-lg"
    >
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden bg-slate-100 w-full">
        <img 
          src={project.imageUrl} 
          alt={project.location}
          className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300" 
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300" />

        {/* Delete Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg border border-red-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
          title="Supprimer"
        >
          <Trash2 size={18} />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full border border-yellow-400">
          <p className="text-sm font-bold text-yellow-500">★ {project.rating.toFixed(1)}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col">
        {/* Location & Date */}
        <div className="space-y-1 mb-2">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
            <h3 className="font-bold text-slate-900 text-base group-hover:text-yellow-600 transition-colors">
              {project.location}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Calendar size={14} />
            {project.date}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-700 line-clamp-2 mb-2 flex-grow">
          {project.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <StarRating
            rating={project.rating}
            interactive
            onRate={r => onUpdateRating?.(project.id, r)}
          />
          <span className="text-xs font-medium text-yellow-600 group-hover:translate-x-1 transition-transform">
            Détails →
          </span>
        </div>
      </div>
    </div>
  );
};

export default GalleryItem;
