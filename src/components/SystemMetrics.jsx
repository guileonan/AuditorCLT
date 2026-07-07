import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { useCarousel } from '@/hooks/useCarousel';
import { SYSTEM_METRICS_LOGS, METRICS } from '@/constants/appConstants';

const SystemMetrics = () => {
  const currentIndex = useCarousel(SYSTEM_METRICS_LOGS.length, METRICS.CAROUSEL_INTERVAL_MS);
  const activeLog = SYSTEM_METRICS_LOGS[currentIndex];

  return (
    <section className="bg-[#050505] py-16 md:py-24 px-4 md:px-8 font-mono border-y border-[#222222]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 md:gap-8"
        >
          <div className="border border-[#333333] p-3 md:p-4 inline-flex items-center gap-3 self-start bg-[#0a0a0a] rounded-sm">
            <Terminal className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
            <h2 className="text-gray-400 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] m-0">
              &gt; [SYSTEM_METRICS] STATUS DE OPERAÇÃO
            </h2>
          </div>

          <div className="border border-[#333333] p-6 md:p-10 bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center md:justify-start rounded-sm shadow-lg">
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{ background: 'linear-gradient(rgba(255, 255, 0, 0.15) 50%, rgba(0, 0, 0, 0.6) 50%)', backgroundSize: '100% 4px' }}></div>
            <p 
              className="text-[#FFFF00] text-xl md:text-3xl lg:text-4xl font-extrabold tracking-wide relative z-10 text-center md:text-left animate-pulse-neon leading-tight"
            >
              &gt; {METRICS.TOTAL_AUDITS} AUDITORIAS TRABALHISTAS CONCLUÍDAS ESTE MÊS
            </p>
          </div>

          <div className="relative min-h-[120px] md:min-h-[140px] flex items-center w-full">
            <div 
              key={currentIndex}
              className="border border-[#333333] bg-[#0a0a0a] p-5 md:p-8 text-sm md:text-base lg:text-lg text-gray-300 w-full rounded-sm shadow-md animate-fade-in-out flex items-center"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5 w-full">
                <span className="text-[#FF0000] font-bold tracking-wider whitespace-nowrap bg-red-950/30 px-3 py-1.5 rounded-sm border border-red-900/50">
                  [CASE_LOG #{activeLog?.id}]
                </span>
                <span className="leading-relaxed font-light tracking-wide">
                  {activeLog?.text}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(SystemMetrics);