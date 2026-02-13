
import React from 'react';
import { REVIEWS } from '../constants';
import { Star, MessageSquareQuote } from 'lucide-react';

const Reviews: React.FC = () => {
  return (
    <div className="min-h-screen pb-32 bg-[#f0f7ff]">
      {/* Header - Navy/White */}
      <section className="bg-secondary py-12 text-white text-center border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Patient Testimonials</h1>
          <p className="text-white/70 text-lg font-medium uppercase tracking-wide">
            Feedback on clinical excellence and medical hospitality.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {REVIEWS.map((review) => (
            <div key={review.id} className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-secondary/30 hover:shadow-lg hover:scale-[1.01] transition-all">
              <div className="absolute top-0 right-0 p-10 text-secondary opacity-5 group-hover:opacity-10 transition-opacity">
                <MessageSquareQuote size={140} />
              </div>
              <div className="relative z-10 space-y-8">
                <div className="flex text-accent gap-1">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-lg text-secondary leading-relaxed font-black uppercase tracking-tight italic">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-5 pt-8 border-t border-secondary/10">
                  <div className="w-14 h-14 bg-secondary text-white rounded-xl flex items-center justify-center font-black text-2xl shadow-xl">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-secondary uppercase tracking-widest">{review.name}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">{review.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Reviews;
