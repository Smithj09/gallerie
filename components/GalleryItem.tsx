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
      className="bg-white rounded-xl shadow hover:shadow-xl transition cursor-pointer relative group"
    >
      <button
        onClick={e => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-3 left-3 bg-red-600 text-white p-2 rounded opacity-0 group-hover:opacity-100"
      >
        ✕
      </button>

      <img src={project.imageUrl} className="h-64 w-full object-cover" />

      <div className="p-4">
        <div className="flex justify-between">
          <span className="text-xs text-gray-400">{project.date}</span>
          <StarRating
            rating={project.rating}
            interactive
            onRate={r => onUpdateRating?.(project.id, r)}
          />
        </div>

        <p className="mt-2 text-sm text-gray-700 line-clamp-3">
          {project.description}
        </p>

        <span className="text-xs font-bold text-blue-700 mt-4 inline-block">
          Voir les détails →
        </span>
      </div>
    </div>
  );
};

export default GalleryItem;
