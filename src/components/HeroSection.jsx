import React, { memo, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ChevronRight, Terminal } from 'lucide-react';
import NetworkBackground from '@/components/NetworkBackground';
import { createFadeUpVariant, lineReveal } from '@/lib/motion';

const TRUST_ITEMS = [
  'SEM CADASTRO',
  'SEM DADOS ARMAZENADOS',
  'RESULTADO EM SEGUNDOS',
];

const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const scrollToTerminal = useCallback(() => {
    document.getElementById('audit-terminal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <section
      id="topo"
      ref={heroRef}
      className="relative min-h-[100dvh] flex items-center justify-center pt-28 pb-20 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(20,20,20,1)_0%,rgba(0,0,0,1)_100%)]" />

      <motion.div
        style={!shouldReduceMotion ? { y: heroY, opacity: opacityFade } : undefined}
        className="absolute inset-0 z-0"
      >
        <NetworkBackground />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="flex flex-col items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={createFadeUpVariant(0, 0.8)}
            className="mb-10 flex flex-col items-center gap-4"
          >
            <Terminal className="w-5 h-5 text-destructive animate-pulse" />
            <div className="font-mono-sys text-[10px] md:text-[11px] tracking-[0.3em] text-secondary border border-white/10 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm">
              MOTOR_CLT // STATUS: ONLINE
            </div>
          </motion.div>

          <div className="relative mb-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={lineReveal}
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-destructive origin-center"
            />
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={createFadeUpVariant(0.05, 0.8)}
              className="text-[2.6rem] sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.05]"
            >
              <span className="text-destructive text-glow-red">SEU CHEFE ERROU</span>
              <br />
              <span className="text-destructive text-glow-red">O CÁLCULO?</span>
              <br />
              <span className="text-foreground">NÃO DISCUTA,</span>
              <br />
              <span className="text-foreground">MANDE A I.A. COBRAR.</span>
            </motion.h1>
          </div>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={createFadeUpVariant(0.2, 0.8)}
            className="text-base md:text-xl text-secondary max-w-2xl mx-auto leading-relaxed mb-12 font-light"
          >
            Confira suas verbas rescisórias pelas regras da CLT, descubra a diferença
            entre o que a empresa ofereceu e o que a lei prevê, e receba a mensagem de
            cobrança pronta para enviar.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={createFadeUpVariant(0.35, 0.8)}
            className="w-full flex justify-center"
          >
            <button
              type="button"
              onClick={scrollToTerminal}
              className="btn-primary-solid group h-14 md:h-16 px-8 md:px-12 text-xs md:text-sm w-full sm:w-auto glow-red-hover"
            >
              INICIAR AUDITORIA
              <ChevronRight className="w-4 h-4 ml-3 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </motion.div>

          <motion.ul
            initial="hidden"
            animate="visible"
            variants={createFadeUpVariant(0.5, 0.8)}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-3 font-mono-sys text-[9px] md:text-[10px] tracking-[0.2em] text-secondary/80"
          >
            {TRUST_ITEMS.map((item, index) => (
              <li key={item} className="flex items-center gap-3">
                {index > 0 && <span className="text-destructive/40" aria-hidden="true">/</span>}
                <span>{item}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);
