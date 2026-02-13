import React, { useState, useEffect } from 'react';
import { PATIENT_SECTIONS, PATIENT_RESOURCES, TRANSLATIONS } from '../constants';
import { ChevronRight, FileText, Utensils, Info, ShieldCheck, Phone, MessageCircle, Send, Loader2, BookOpen, ChevronDown, ChevronUp, X } from 'lucide-react';
import { getApiErrorMessage } from '../lib/apiKey';
import { AI_MODELS } from '../lib/aiModels';
import { chatWithGemini } from '../lib/geminiApi';
import patientHeroImage from '../BG/a-professional-and-compassionate-scene-inside-a-gl (1).jpeg';

const RESULT_EXPLAINER_SYSTEM = `You are VetLab Kaz result explainer for pet owners. Explain lab results in plain language (what the test is, what values mean in simple terms). Always end with: "This is for education only. Please discuss your pet's results with your veterinarian." Keep answers to 3–5 short sentences unless the user pasted a specific result.`;
const RESULT_TEST_TYPES = ['CBC (blood count)', 'Biochemistry / chemistry panel', 'PCR / molecular', 'Urinalysis', 'Other'];

const OIE_SYSTEM_INSTRUCTION = `You are the VetLab Protocol Expert. Strictly adhere to OIE (World Organisation for Animal Health) standards for sample collection and handling.
Answer only about: specimen stability, transport temperatures (2-8°C where applicable), and species-specific requirements for Avian, Canine, and Feline.
Be concise and cite OIE guidelines when relevant. Do not give treatment advice; recommend consulting a veterinarian and VetLab Kaz for diagnostics.`;

const PROTOCOL_OFFLINE = 'The Protocol Expert is currently offline. Please try again later.';

const SECTION_TITLE_KEYS: Record<string, string> = { prep: 'patientSectionPrep', rights: 'patientSectionRights', diet: 'patientSectionDiet' };

const Patients: React.FC = () => {
  const [lang, setLang] = useState(localStorage.getItem('vetlab_lang') || 'KZ');
  const [activeTab, setActiveTab] = useState(PATIENT_SECTIONS[0].id);
  const [protocolQuery, setProtocolQuery] = useState('');
  const [protocolMessages, setProtocolMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [protocolLoading, setProtocolLoading] = useState(false);
  const [resultExplainerOpen, setResultExplainerOpen] = useState(false);
  const [resultTestType, setResultTestType] = useState(RESULT_TEST_TYPES[0]);
  const [resultSnippet, setResultSnippet] = useState('');
  const [resultExplainReply, setResultExplainReply] = useState('');
  const [resultExplainLoading, setResultExplainLoading] = useState(false);
  const [featureModal, setFeatureModal] = useState<'prep' | 'rights' | 'diet' | null>(null);

  useEffect(() => {
    const h = () => setLang(localStorage.getItem('vetlab_lang') || 'KZ');
    window.addEventListener('languageChange', h);
    return () => window.removeEventListener('languageChange', h);
  }, []);

  const t = TRANSLATIONS[lang] as Record<string, string>;

  const askResultExplainer = async () => {
    const q = resultSnippet.trim()
      ? `Test type: ${resultTestType}. Result or question: ${resultSnippet}`
      : `Explain in simple terms what a ${resultTestType} is and what pet owners should know.`;
    if (resultExplainLoading) return;
    setResultExplainLoading(true);
    setResultExplainReply('');
    try {
      const result = await chatWithGemini({
        model: AI_MODELS.protocolExpert,
        contents: [{ role: 'user', parts: [{ text: q }] }],
        config: { systemInstruction: RESULT_EXPLAINER_SYSTEM, temperature: 0.3 },
      });
      setResultExplainReply(result.error || result.text || 'Please try again.');
    } catch {
      setResultExplainReply('Service temporarily unavailable.');
    } finally {
      setResultExplainLoading(false);
    }
  };

  const askProtocolExpert = async () => {
    const q = protocolQuery.trim();
    if (!q || protocolLoading) return;
    setProtocolMessages((prev) => [...prev, { role: 'user', content: q }]);
    setProtocolQuery('');
    setProtocolLoading(true);
    try {
      const result = await chatWithGemini({
        model: AI_MODELS.protocolExpert,
        contents: [{ role: 'user', parts: [{ text: q }] }],
        config: {
          systemInstruction: OIE_SYSTEM_INSTRUCTION,
          temperature: 0.3,
        },
      });
      const text = result.error ? (result.error || PROTOCOL_OFFLINE) : (result.text ?? PROTOCOL_OFFLINE);
      setProtocolMessages((prev) => [...prev, { role: 'assistant', content: text }]);
    } catch (err: unknown) {
      setProtocolMessages((prev) => [...prev, { role: 'assistant', content: getApiErrorMessage(err, PROTOCOL_OFFLINE) }]);
    } finally {
      setProtocolLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#f0f7ff]">
      {/* Hero - background image with navy overlay (aligned like other pages) */}
      <section className="relative min-h-[32vh] flex items-center justify-center overflow-hidden border-b border-slate-200">
        <img
          src={patientHeroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-secondary/85 via-secondary/70 to-secondary/55"
          aria-hidden
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">{t.patientResources}</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto font-medium tracking-wide uppercase">
            {t.patientResourcesSub}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Sidebar Tabs */}
          <div className="space-y-2 sm:space-y-3">
            {PATIENT_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  activeTab === section.id 
                    ? 'bg-secondary text-white shadow-xl' 
                    : 'bg-white text-secondary hover:bg-primary border border-slate-100 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {section.id === 'diet' && <Utensils size={16} className={activeTab === section.id ? 'text-accent shrink-0' : 'shrink-0'} />}
                  {section.id === 'prep' && <Info size={16} className={activeTab === section.id ? 'text-accent shrink-0' : 'shrink-0'} />}
                  {section.id === 'rights' && <ShieldCheck size={16} className={activeTab === section.id ? 'text-accent shrink-0' : 'shrink-0'} />}
                  {t[SECTION_TITLE_KEYS[section.id]] ?? section.title}
                </div>
                <ChevronRight size={12} className="shrink-0" />
              </button>
            ))}
            
            {/* Patient Hotline */}
            <div className="bg-secondary text-white p-3 sm:p-5 rounded-lg mt-6 sm:mt-8 shadow-xl space-y-1.5 group cursor-pointer hover:bg-slate-800 transition-all">
              <h4 className="font-black text-white text-[10px] uppercase tracking-[0.3em] flex items-center gap-1.5 group-hover:text-accent transition-colors">
                <Phone size={14} className="text-accent shrink-0" /> {t.patientHotline}
              </h4>
              <p className="text-white/70 text-[9px] uppercase font-black tracking-widest leading-snug">{t.patientHotlineSub}</p>
              <div className="text-base sm:text-lg font-black text-white tracking-tighter pt-1 group-hover:scale-105 origin-left transition-transform break-all">{t.patientHotlineNumber}</div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-slate-100 min-h-[320px] animate-in fade-in slide-in-from-right-8 duration-500">
              {activeTab === 'diet' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-secondary">{t.patientDietaryProtocols}</h2>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {t.patientDietaryIntro}
                  </p>
                  <button
                    type="button"
                    onClick={() => setFeatureModal('diet')}
                    className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 border-accent/40 bg-accent/5 hover:bg-accent/10 hover:border-accent text-secondary font-black text-[10px] uppercase tracking-widest transition-all group text-left"
                  >
                    <span className="flex items-center gap-2">
                      <Utensils size={16} className="text-accent shrink-0" />
                      {t.patientFeatureProtocolsTitle}
                    </span>
                    <ChevronRight size={14} className="text-accent group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 hover:border-accent hover:bg-white transition-all shadow-sm">
                        <div className="w-8 h-8 bg-secondary text-white rounded-md flex items-center justify-center font-black text-xs mb-3 shadow-sm">
                          0{i}
                        </div>
                        <h4 className="text-base font-black text-secondary uppercase tracking-tight mb-1.5">{t[`patientDiet${i}Title`]}</h4>
                        <p className="text-slate-500 text-[11px] leading-relaxed font-medium uppercase tracking-wide">{t[`patientDiet${i}Desc`]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'prep' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-secondary">{t.patientPreparationGuide}</h2>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {t.patientPreparationGuideSub}
                  </p>
                  <button
                    type="button"
                    onClick={() => setFeatureModal('prep')}
                    className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 border-accent/40 bg-accent/5 hover:bg-accent/10 hover:border-accent text-secondary font-black text-[10px] uppercase tracking-widest transition-all group text-left"
                  >
                    <span className="flex items-center gap-2">
                      <Info size={16} className="text-accent shrink-0" />
                      {t.patientFeatureSampleTitle}
                    </span>
                    <ChevronRight size={14} className="text-accent group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                  <div className="space-y-2 sm:space-y-3">
                    {([1,2,3,4] as const).map((i) => (
                      <div key={i} className="flex gap-3 p-3 sm:p-4 rounded-lg border border-slate-200 bg-white items-center hover:bg-slate-50 hover:border-accent transition-all shadow-sm group cursor-default">
                        <div className="w-6 h-6 rounded-md bg-secondary text-white flex items-center justify-center font-black text-[10px] shrink-0 shadow-sm group-hover:bg-accent transition-colors">✓</div>
                        <span className="text-secondary font-black text-[11px] uppercase tracking-widest leading-relaxed">{t[`patientPrepStep${i}`]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'rights' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-secondary">{t.patientRightsEthics}</h2>
                  <div className="space-y-6">
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {t.patientRightsIntro}
                    </p>
                    <button
                      type="button"
                      onClick={() => setFeatureModal('rights')}
                      className="w-full flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 border-accent/40 bg-accent/5 hover:bg-accent/10 hover:border-accent text-secondary font-black text-[10px] uppercase tracking-widest transition-all group text-left"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-accent shrink-0" />
                        {t.patientFeatureRightsTitle}
                      </span>
                      <ChevronRight size={14} className="text-accent group-hover:translate-x-1 transition-transform shrink-0" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
                      <div className="space-y-3">
                        <h4 className="text-base font-black text-secondary uppercase tracking-tight border-b-2 border-slate-100 pb-1.5">{t.patientRightsTitle}</h4>
                        <ul className="space-y-2">
                          {([1,2,3,4] as const).map((i) => (
                             <li key={i} className="flex items-center gap-2 text-secondary text-[10px] font-black uppercase tracking-widest group cursor-default">
                               <div className="w-1 h-1 bg-accent rounded-full transition-all group-hover:scale-150 shrink-0" /> {t[`patientRight${i}`]}
                             </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-base font-black text-secondary uppercase tracking-tight border-b-2 border-slate-100 pb-1.5">{t.patientDutiesTitle}</h4>
                        <ul className="space-y-2">
                          {([1,2,3,4] as const).map((i) => (
                             <li key={i} className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest group cursor-default">
                               <div className="w-1 h-1 bg-slate-300 rounded-full transition-all group-hover:bg-secondary shrink-0" /> {t[`patientDuty${i}`]}
                             </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Protocol Expert – OIE standards, specimen stability, transport, species */}
        <div className="mt-16 rounded-2xl border border-slate-200 bg-[#f0f7ff] overflow-hidden shadow-lg">
          <div className="bg-[#1a3f71] text-white p-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageCircle size={24} className="text-[#d5af34]" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{t.patientProtocolExpert}</h2>
              <p className="text-white/80 text-sm">{t.patientProtocolExpertSub}</p>
            </div>
          </div>
          <div className="p-6 space-y-4 max-h-[360px] overflow-y-auto">
            {protocolMessages.length === 0 && (
              <p className="text-slate-500 text-sm">{t.patientProtocolExample}</p>
            )}
            {protocolMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                    msg.role === 'user' ? 'bg-[#1a3f71] text-white rounded-tr-none' : 'bg-white border border-slate-200 text-[#1a3f71] rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {protocolLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Loader2 size={18} className="animate-spin" /> {t.patientThinking}
              </div>
            )}
          </div>
          <div className="p-4 border-t bg-white flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={protocolQuery}
              onChange={(e) => setProtocolQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askProtocolExpert()}
              placeholder={t.patientProtocolPlaceholder}
              className="flex-1 min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-[#d5af34] outline-none text-[#1a3f71]"
            />
            <button
              type="button"
              onClick={askProtocolExpert}
              disabled={protocolLoading}
              className="bg-[#1a3f71] text-white px-5 py-3 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Send size={18} /> {t.patientAsk}
            </button>
          </div>
        </div>

        {/* Result Explainer – plain-language lab result help */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-lg">
          <button
            type="button"
            onClick={() => setResultExplainerOpen(!resultExplainerOpen)}
            className="w-full bg-slate-50 hover:bg-slate-100 p-6 flex items-center justify-between text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen size={24} className="text-[#1a3f71]" />
              <div>
                <h3 className="text-lg font-bold text-[#1a3f71]">{t.patientResultExplainer}</h3>
                <p className="text-slate-500 text-sm">{t.patientResultExplainerSub}</p>
              </div>
            </div>
            {resultExplainerOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {resultExplainerOpen && (
            <div className="p-6 border-t border-slate-100 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.patientTestTypeLabel}</label>
                  <select
                    value={resultTestType}
                    onChange={(e) => setResultTestType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#d5af34] outline-none"
                  >
                    {RESULT_TEST_TYPES.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.patientResultExplainer}</label>
                <textarea
                  value={resultSnippet}
                  onChange={(e) => setResultSnippet(e.target.value)}
                  placeholder={t.patientResultPlaceholder}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#d5af34] outline-none resize-none"
                />
              </div>
              <button
                type="button"
                onClick={askResultExplainer}
                disabled={resultExplainLoading}
                className="bg-[#1a3f71] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 disabled:opacity-60 flex items-center gap-2"
              >
                {resultExplainLoading ? <Loader2 size={18} className="animate-spin" /> : <BookOpen size={18} />} {t.patientExplainBtn}
              </button>
              {resultExplainReply && (
                <div className="p-4 rounded-xl bg-[#f0f7ff] border border-slate-200 text-slate-700 text-sm">
                  {resultExplainReply}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Mock feature detail modal */}
      {featureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setFeatureModal(null)}>
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-4 sm:p-5 border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start gap-3 mb-3">
              <h3 className="text-base font-black text-secondary uppercase tracking-tight">
                {featureModal === 'prep' && t.patientFeatureSampleTitle}
                {featureModal === 'rights' && t.patientFeatureRightsTitle}
                {featureModal === 'diet' && t.patientFeatureProtocolsTitle}
              </h3>
              <button
                type="button"
                onClick={() => setFeatureModal(null)}
                className="p-1.5 text-slate-400 hover:text-secondary rounded-lg transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              {featureModal === 'prep' && t.patientFeatureSampleDesc}
              {featureModal === 'rights' && t.patientFeatureRightsDesc}
              {featureModal === 'diet' && t.patientFeatureProtocolsDesc}
            </p>
            <button
              type="button"
              onClick={() => setFeatureModal(null)}
              className="mt-4 w-full bg-secondary text-white py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
