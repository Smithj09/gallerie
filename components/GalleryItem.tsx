
import React from 'react';
import { SolarProject } from '../types';
import StarRating from './StarRating';

interface GalleryItemProps {
  project: SolarProject;
  onUpdateRating: (id: string, newRating: number) => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ project, onUpdateRating }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={project.imageUrl} 
          alt={project.description}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-[#0D3156] uppercase tracking-wider">
          {project.location}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <p className="text-slate-500 text-[11px] uppercase tracking-widest font-bold">
            {project.date}
          </p>
          <StarRating 
            rating={project.rating} 
            interactive 
            onRate={(r) => onUpdateRating(project.id, r)} 
          />
        </div>
        
        <p className="text-[#4A6278] text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
          {project.description}
        </p>
        
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[#0D3156] text-xs font-bold hover:underline cursor-pointer">
            Voir les détails →
          </span>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden">
                <img src={`https://picsum.photos/seed/${project.id}${i}/100/100`} alt="Avatar" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryItem;
