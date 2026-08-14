import React, { memo, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { LINKS } from '@/constants/appConstants';
import BrandLogo from '@/components/BrandLogo';

const NAV_ITEMS = [
  { label: 'AUDITORIA', href: '#audit-terminal' },
  { label: 'GUIA_CLT', href: '#guia-clt' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTerminal = useCallback((event) => {
    event.preventDefault();
    document.getElementById('audit-terminal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-morphism py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-5 md:py-7'
      }`}
    >
      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-destructive/80 via-destructive/20 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between relative z-10 gap-4">
        <a
          href="#topo"
          className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105 shrink-0"
          aria-label="auditorCLT — início"
        >
          <BrandLogo
            brand="AUDITOR_CLT"
            alt="auditorCLT"
            className="h-7 md:h-8 w-auto opacity-90 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(163,42,42,0.5)] transition-all duration-300"
            loading="eager"
          />
        </a>

        <nav className="hidden md:flex items-center gap-8 font-mono-sys text-[13px] tracking-widest">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="relative text-secondary hover:text-foreground transition-colors duration-300 group py-2"
            >
              <span className="text-destructive/50 group-hover:text-destructive transition-colors">&gt;</span> [{item.label}]
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-destructive group-hover:w-full transition-all duration-300 ease-out" />
            </a>
          ))}

          <a
            href={LINKS.NEXUMLAB_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] tracking-[0.2em] text-secondary/70 hover:text-foreground transition-colors border-l border-white/10 pl-8"
          >
            NEXUMLAB
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </nav>

        <button
          type="button"
          onClick={scrollToTerminal}
          className="md:hidden font-mono-sys text-[11px] tracking-[0.2em] border border-border text-foreground px-4 py-2 hover:border-destructive hover:text-white transition-all duration-300"
        >
          AUDITAR
        </button>
      </div>
    </motion.header>
  );
};

export default memo(Header);
