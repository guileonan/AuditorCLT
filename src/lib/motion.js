/**
 * Variantes de animação compartilhadas com o site NexumLab.
 * Mantidas idênticas para que a "sensação" de scroll seja a mesma nos dois sites.
 */

export const createFadeUpVariant = (delay = 0, duration = 0.8) => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration, ease: 'easeOut' },
  },
});

export const lineReveal = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 1, ease: 'easeOut', delay: 0.2 },
  },
};

/** Preset de viewport usado em todas as seções. */
export const inView = { once: true, margin: '-100px' };
