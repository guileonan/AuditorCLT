import React, { memo } from 'react';
import { motion } from 'framer-motion';
import SectionMarker from '@/components/SectionMarker';
import { useCarousel } from '@/hooks/useCarousel';
import { SYSTEM_METRICS_LOGS, METRICS, VERBAS_CALCULADAS } from '@/constants/appConstants';
import { createFadeUpVariant, inView } from '@/lib/motion';

const SystemMetrics = () => {
  const currentIndex = useCarousel(SYSTEM_METRICS_LOGS.length, METRICS.CAROUSEL_INTERVAL_MS);
  const activeLog = SYSTEM_METRICS_LOGS[currentIndex];

  return (
    <section className="relative py-20 md:py-28 border-t border-white/5 bg-card/40">
      <div className="max-w-6xl mx-auto px-6">
        <SectionMarker slug="ESPECIFICACAO" title="O que a auditoria calcula" className="mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-6 lg:gap-8 items-stretch">
          {/* Contador */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={createFadeUpVariant(0.05, 0.7)}
            className="lab-card p-8 md:p-10 flex flex-col justify-center relative overflow-hidden glow-card-hover transition-all duration-300"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-destructive/10 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10">
              <p className="font-mono-sys text-[10px] tracking-[0.25em] text-secondary mb-4">
                VERBAS CONSIDERADAS NO CÁLCULO
              </p>
              <p className="text-6xl md:text-7xl font-bold tracking-tighter text-foreground leading-none">
                {VERBAS_CALCULADAS.length}
              </p>
              <div className="mt-6 h-[2px] w-20 bg-gradient-to-r from-destructive to-transparent" />

              <ul className="mt-7 space-y-2.5">
                {VERBAS_CALCULADAS.map((verba) => (
                  <li key={verba} className="flex items-baseline gap-3 text-sm text-secondary font-light">
                    <span className="font-mono-sys text-[10px] text-destructive shrink-0">&gt;</span>
                    {verba}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Log rotativo */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={createFadeUpVariant(0.15, 0.7)}
            className="lab-card p-7 md:p-9 relative overflow-hidden scanlines flex items-center min-h-[190px]"
          >
            <div key={currentIndex} className="animate-log-cycle w-full relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono-sys text-[10px] tracking-widest text-destructive bg-destructive/10 border border-destructive/20 px-3 py-1.5 rounded-full">
                  [{activeLog?.id}]
                </span>
                <span className="h-[1px] flex-1 bg-white/5" />
              </div>
              <p className="text-sm md:text-base text-secondary font-light leading-relaxed">
                {activeLog?.text}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(SystemMetrics);
