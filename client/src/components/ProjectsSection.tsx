import React, { useState } from 'react';
import { PROJECTS } from '../data';
import { ProjectItem } from '../types';
import { Maximize2, MapPin, Building, X } from 'lucide-react';
import { Container } from './Container';

export const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section id="projects" className="w-full bg-[#f4f5f6] py-16 md:py-24">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-10 border-b border-neutral-300 gap-2">
          <div className="flex items-center gap-4">
            <div className="w-8 md:w-12 h-[2.5px] bg-[#222629]" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1f2427] tracking-wider uppercase font-['Montserrat',sans-serif]">
              OUR PROJECTS
            </h2>
          </div>
          <span className="text-sm text-neutral-500 font-semibold tracking-wider uppercase hidden sm:inline-block">
            Major Installations &amp; Fire Protection Sites
          </span>
        </div>

        {/* 3-Column Grid of 15 Architectural Projects (1 col on mobile, 2 cols on tablet, 3 cols on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {PROJECTS.map((proj, idx) => (
            <div
              key={proj.id}
              id={`project-card-${proj.id}`}
              onClick={() => setSelectedProject(proj)}
              className="group relative aspect-[4/3] bg-neutral-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer border border-neutral-300/80"
            >
              {/* Project Image */}
              <img
                src={proj.image}
                alt={proj.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              />

              {/* Gradient & Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-bold tracking-widest text-[#E5252B] uppercase mb-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" /> {proj.category}
                </span>
                <h4 className="text-[15px] font-bold leading-tight uppercase font-['Montserrat',sans-serif]">
                  {proj.title}
                </h4>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20 text-neutral-300 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E5252B]" /> {proj.location}
                  </span>
                  <span className="flex items-center gap-1 text-white font-semibold">
                    <Maximize2 className="w-3.5 h-3.5" /> View
                  </span>
                </div>
              </div>

              {/* Number Tag in Top Right */}
              <div className="absolute top-2.5 right-2.5 bg-black/40 text-white/90 text-[11px] font-mono px-1.5 py-0.5 rounded-xs backdrop-blur-xs opacity-60 group-hover:opacity-100 transition-opacity">
                {String(idx + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Project Detail Lightbox Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-[#1f2428] rounded-md max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-700 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full bg-black">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-3 right-3 bg-black/60 hover:bg-[#E5252B] text-white rounded-full p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E5252B] uppercase tracking-wider mb-1">
                <Building className="w-4 h-4" /> {selectedProject.category}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wide mb-2 font-['Montserrat',sans-serif]">
                {selectedProject.title}
              </h3>
              <p className="text-xs text-neutral-300 flex items-center gap-1.5 mb-4">
                <MapPin className="w-3.5 h-3.5 text-[#E5252B]" /> {selectedProject.location}, Bangladesh
              </p>
              <div className="pt-4 border-t border-neutral-700/60 flex items-center justify-between text-xs">
                <span className="text-neutral-400">Complete Fire Detection &amp; Hydrant System Installed</span>
                <span className="bg-[#E5252B] text-white px-2.5 py-1 rounded-xs font-semibold text-[11px] uppercase">
                  Verified Site
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
