
import React from 'react';
import { GALLERY_IMAGES } from '../constants';

const Gallery: React.FC = () => {
  return (
    <div className="min-h-screen pb-32 bg-[#f0f7ff]">
      {/* Header - Navy/White */}
      <section className="bg-secondary py-12 text-white text-center border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Center Architecture</h1>
          <p className="text-white/70 text-lg font-medium uppercase tracking-wide">
            Sterile, modern, and highly comfortable medical environments.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {GALLERY_IMAGES.map((img, i) => (
            <div key={i} className="group relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[16/10] border-8 border-slate-200 hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)] transition-all duration-300">
              <img 
                src={img.url} 
                className="w-full h-full object-cover grayscale-[0.4] transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0" 
                alt={img.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent flex items-end p-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="space-y-2">
                  <div className="w-12 h-1 bg-accent mb-4" />
                  <h4 className="text-2xl font-black text-white uppercase tracking-tight">{img.title}</h4>
                  <p className="text-accent text-[10px] font-black uppercase tracking-[0.4em]">Clinical Excellence</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Gallery;
