import React, { memo, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/**
 * Barra de ação fixa (apenas mobile).
 * Aparece depois que o usuário passa da dobra e some quando o terminal
 * já está na tela — para não competir com o próprio formulário.
 */
const StickyCTA = () => {
  const [pastHero, setPastHero] = useState(false);
  const [terminalVisible, setTerminalVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.75);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const target = document.getElementById('audit-terminal');
    if (!target || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setTerminalVisible(entry.isIntersecting),
      { rootMargin: '-15% 0px -15% 0px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const scrollToTerminal = useCallback(() => {
    document.getElementById('audit-terminal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const visible = pastHero && !terminalVisible;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-morphism border-t border-white/10 px-4 py-3.5"
        >
          <button
            type="button"
            onClick={scrollToTerminal}
            className="btn-primary-solid w-full h-12 text-[11px] group"
          >
            INICIAR AUDITORIA
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(StickyCTA);
