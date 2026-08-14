import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { createFadeUpVariant, inView } from '@/lib/motion';

/**
 * Marcador de seção no padrão NexumLab:  > [SLUG] TÍTULO
 * Mono, uppercase, tracking largo, chevron vermelho.
 */
const SectionMarker = ({ slug, title, className = '', delay = 0 }) => (
  <motion.h2
    initial="hidden"
    whileInView="visible"
    viewport={inView}
    variants={createFadeUpVariant(delay, 0.7)}
    className={`font-mono-sys text-xs md:text-sm tracking-[0.2em] text-secondary flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`}
  >
    <span className="text-destructive">&gt;</span>
    <span className="text-destructive/90">[{slug}]</span>
    {title ? <span className="uppercase">{title}</span> : null}
  </motion.h2>
);

export default memo(SectionMarker);
