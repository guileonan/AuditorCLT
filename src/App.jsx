import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import SystemMetrics from '@/components/SystemMetrics';
import AuditTerminal from '@/components/AuditTerminal';
import EducationalContent from '@/components/EducationalContent';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Helmet>
        <html lang="pt-BR" />
        <title>auditorCLT — Confira suas verbas rescisórias pela CLT</title>
        <meta
          name="description"
          content="Calcule suas verbas rescisórias pelas regras da CLT, compare com a oferta da empresa e gere a mensagem de cobrança pronta para enviar. Sem cadastro."
        />
        <meta name="theme-color" content="#000000" />
        <link rel="canonical" href="https://auditorclt.nexumlab.net.br/" />

        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content="auditorCLT" />
        <meta property="og:title" content="auditorCLT — Confira suas verbas rescisórias pela CLT" />
        <meta
          property="og:description"
          content="Calcule suas verbas rescisórias pelas regras da CLT, compare com a oferta da empresa e gere a mensagem de cobrança pronta para enviar."
        />
        <meta property="og:url" content="https://auditorclt.nexumlab.net.br/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
          <HeroSection />
          <SystemMetrics />
          <AuditTerminal />
          <EducationalContent />
        </main>
        <Footer />
        <StickyCTA />
        <Toaster />
      </div>
    </>
  );
}

export default App;
