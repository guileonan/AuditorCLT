import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ASSETS } from '@/constants/appConstants';

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="absolute top-16 md:top-24 left-4 md:left-8 z-40"
    >
      <a href="/" title="Home" className="logo-wrapper header-logo-container flex items-center justify-center hover:opacity-90 transition-opacity">
        <img 
          src={ASSETS.LOGOS.NEXUMLAB}
          alt="NexumLab Logo" 
          className="logo-image h-[40px] md:h-[50px] w-auto"
          loading="eager"
          crossOrigin="anonymous"
        />
      </a>
    </motion.header>
  );
};

export default memo(Header);