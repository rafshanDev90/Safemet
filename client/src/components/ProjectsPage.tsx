import React, { useState } from 'react';
import { ASSETS, PROJECTS } from '../data';
import { ProjectItem } from '../types';
import { X, Building2, MapPin, Tag } from 'lucide-react';
import { Container } from './Container';

interface ProjectsPageProps {
  onNavigateHome?: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigateHome }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <div className="w-full bg-white flex flex-col font-['Montserrat',sans-serif]">
      {/* 1. HERO BANNER WITH HEXAGON ACCENTS & FIRE SAFETY COMPOSITE */}
      <section className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] bg-[#1a1e21] overflow-hidden flex items-center justify-center">
        {/* Background Composite Image */}
        <img
          src={ASSETS.aboutBanner}
          alt="Safemet Fire Safety Installation Projects"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Soft Vignette & Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Hexagon Graphic Overlays */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
          <svg
            className="w-full h-full max-w-[1200px]"
            viewBox="0 0 1000 400"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
          >
            <polygon points="500,100 580,150 580,250 500,300 420,250 420,150" />
            <polygon points="660,100 740,150 740,250 660,300 580,250 580,150" />
            <polygon points="340,100 420,150 420,250 340,300 260,250 260,150" />
            <line x1="500" y1="100" x2="500" y2="40" strokeDasharray="4 4" />
            <line x1="660" y1="300" x2="660" y2="360" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Centered Headline */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-widest uppercase">
            PROJECTS
          </h1>
          <div className="w-16 sm:w-20 h-[3px] bg-white mx-auto mt-3 sm:mt-4 shadow-sm" />
        </div>
      </section>

      {/* 2. BREADCRUMB NAVIGATION */}
      <section className="w-full bg-[#f8f9fa] border-b border-neutral-200 py-3 sm:py-3.5">
        <Container className="flex items-center justify-center">
          <nav className="flex items-center space-x-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <button
              onClick={onNavigateHome}
              className="text-neutral-500 hover:text-[#E5252B] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <span className="text-neutral-900 font-black">
              &rarr;
            </span>
            <span className="text-neutral-900 font-extrabold">
              PROJECTS
            </span>
          </nav>
        </Container>
      </section>

      {/* 3. 3-COLUMN PROJECTS GRID */}
      <section className="w-full bg-white py-12 sm:py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 lg:gap-y-16">
            {PROJECTS.map((project) => (
              <div
                key={project.id}
                id={`project-item-${project.id}`}
                onClick={() => setSelectedProject(project)}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Image Container with Shadow & Hover Scale */}
                <div className="relative aspect-[4/3] w-full overflow-hidden shadow-sm border border-neutral-200/80 bg-neutral-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#E5252B] text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 shadow-md">
                      View Project
                    </span>
                  </div>
                </div>

                {/* Project Title Card Box */}
                <div className="w-[90%] sm:w-[85%] -mt-4 z-10 bg-white border border-neutral-200/90 shadow-md py-3 px-4 text-center group-hover:border-[#E5252B]/60 transition-colors duration-300">
                  <h3 className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-[#1e2327] group-hover:text-[#E5252B] transition-colors font-['Montserrat',sans-serif] line-clamp-2">
                    {project.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* PROJECT INSPECTION MODAL */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#202528] text-white px-4 sm:px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#E5252B] shrink-0" />
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider line-clamp-1">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center -mr-2"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative aspect-[16/9] w-full bg-neutral-900 overflow-hidden">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Modal Details */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs font-semibold text-neutral-600">
                <div className="flex items-center gap-1.5 bg-neutral-100 px-3 py-1.5 border border-neutral-200">
                  <Tag className="w-3.5 h-3.5 text-[#E5252B]" />
                  <span>Category: {selectedProject.category}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-neutral-100 px-3 py-1.5 border border-neutral-200">
                  <MapPin className="w-3.5 h-3.5 text-[#E5252B]" />
                  <span>Location: {selectedProject.location}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-700 leading-relaxed">
                Full-scale fire safety protection, UL-listed sprinkler network, FM-approved fire pump installations, and addressable intelligent alarm system delivered and commissioned by Safemet Fire Safety Equipment &amp; Solution.
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="bg-[#202528] hover:bg-[#E5252B] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 transition-colors cursor-pointer min-h-[44px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
