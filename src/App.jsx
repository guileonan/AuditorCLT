import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import SystemMetrics from '@/components/SystemMetrics';
import AuditTerminal from '@/components/AuditTerminal';
import FGTSSection from '@/components/FGTSSection';
import EducationalContent from '@/components/EducationalContent';
import Footer from '@/components/Footer';

function App() {
  // NOTE: All logo assets and image utilities have been integrated.
  // We use the direct permanent URLs explicitly provided. Fallback logic is handled inside respective components via src/lib/imageUtils.js

  return (
    <>
      <Helmet>
        <title>auditorCLT - Audite suas verbas rescisórias com inteligência artificial.</title>
        <meta name="description" content="Audite suas verbas rescisórias com I.A. e gere cobranças jurídicas automaticamente. Conectado à API GPT-4 para análise em tempo real." />
      </Helmet>

      <div className='min-h-screen bg-[#0a0a0a] text-white font-mono'>
        <Header />
        <HeroSection />
        <SystemMetrics />
        <AuditTerminal />
        <FGTSSection />
        <EducationalContent />
        <Footer />
      </div>
    </>
  );
}

export default App;
