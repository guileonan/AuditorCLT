import React, { memo } from 'react';
import { motion } from 'framer-motion';

const AlertBar = ({ onScrollToFGTS }) => {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onClick={onScrollToFGTS}
      className="fixed top-0 left-0 right-0 z-50 bg-[#FFC107] text-black cursor-pointer hover:bg-[#FFE082] transition-colors duration-200 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 md:py-3 flex items-center justify-center">
        <span className="text-[11px] md:text-sm font-semibold tracking-wide text-center leading-snug max-w-3xl">
          ⚠️ Dinheiro preso? Libere seu FGTS retido agora. Clique aqui ➔
        </span>
      </div>
    </motion.div>
  );
};

export default memo(AlertBar);