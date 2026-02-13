
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Assistant from './components/Assistant';

const Home = lazy(() => import('./pages/Home'));
const Cabinet = lazy(() => import('./pages/Cabinet'));
const CabinetDashboard = lazy(() => import('./pages/CabinetDashboard'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const PartnersTreatmentPage = lazy(() => import('./pages/PartnersTreatmentPage'));
const PublicationsPage = lazy(() => import('./pages/PublicationsPage'));
const PublicationProjectPage = lazy(() => import('./pages/PublicationProjectPage'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Technology = lazy(() => import('./pages/Technology'));
const VirtualLabPage = lazy(() => import('./pages/VirtualLabPage'));
const VirtualLabStationPage = lazy(() => import('./pages/VirtualLabStationPage'));
const VirtualLabInfoPage = lazy(() => import('./pages/VirtualLabInfoPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const LearningHubPage = lazy(() => import('./pages/LearningHubPage'));
const LearningHubGuidePage = lazy(() => import('./pages/LearningHubGuidePage'));
const InnovationPage = lazy(() => import('./pages/InnovationPage'));
const Contacts = lazy(() => import('./pages/Contacts'));
const About = lazy(() => import('./pages/About'));
const Doctors = lazy(() => import('./pages/Doctors'));
const Patients = lazy(() => import('./pages/Patients'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Gallery = lazy(() => import('./pages/Gallery'));
const FAQ = lazy(() => import('./pages/FAQ'));

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#f0f7ff]">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      <span className="text-sm font-black text-secondary uppercase tracking-[0.3em]">VetLab Kaz</span>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="fixed inset-0 z-0 bg-[#f0f7ff]" aria-hidden />
          <div className="relative z-10 flex flex-col min-h-screen overflow-x-hidden w-full max-w-[100vw]">
          <Header />
          <main className="flex-grow w-full min-w-0 overflow-x-hidden">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/partners" element={<PartnersTreatmentPage />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/publications" element={<PublicationsPage />} />
                <Route path="/publications/project/:id" element={<PublicationProjectPage />} />
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/technology" element={<Technology />} />
                <Route path="/virtual-lab" element={<VirtualLabPage />} />
                <Route path="/virtual-lab/station/:stationId" element={<VirtualLabStationPage />} />
                <Route path="/virtual-lab/info/:infoType" element={<VirtualLabInfoPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/learning-hub" element={<LearningHubPage />} />
                <Route path="/learning-hub/guide/:slug" element={<LearningHubGuidePage />} />
                <Route path="/innovation" element={<InnovationPage />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/cabinet" element={<Cabinet />} />
                <Route path="/cabinet/dashboard" element={<CabinetDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <Assistant />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
