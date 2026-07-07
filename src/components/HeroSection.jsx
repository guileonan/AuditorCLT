import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Cpu, Terminal, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {

  const scrollToTerminal = useCallback(() => {
    const element = document.getElementById('audit-terminal');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-8 py-20 md:py-32'>
      <div className='absolute inset-0 opacity-20 pointer-events-none'>
        <div className='absolute top-0 left-0 w-full h-full'>
          <svg className='w-full h-full' xmlns='http://www.w3.org/2000/svg'>
            <defs>
              <pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'>
                <path d='M 40 0 L 0 0 0 40' fill='none' stroke='#ff0000' strokeWidth='0.5' opacity='0.3'/>
              </pattern>
            </defs>
            <rect width='100%' height='100%' fill='url(#grid)' />
          </svg>
        </div>
        <motion.div
          className='absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-red-600 rounded-full blur-[100px]'
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className='absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-gray-700 rounded-full blur-[100px]'
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className='relative z-10 w-full max-w-6xl mx-auto text-center mt-16 md:mt-0'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='flex justify-center gap-4 md:gap-6 mb-8 md:mb-10'
        >
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <AlertTriangle className='w-10 h-10 md:w-14 md:h-14 text-red-500' />
          </motion.div>
          <Terminal className='w-10 h-10 md:w-14 md:h-14 text-gray-400' />
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Cpu className='w-10 h-10 md:w-14 md:h-14 text-red-500' />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='text-[2rem] sm:text-5xl md:text-6xl lg:text-[5rem] font-bold mb-6 md:mb-8 leading-[1.2] md:leading-[1.1] tracking-tight'
        >
          <span className='text-red-500'>SEU CHEFE ERROU</span>
          <br />
          <span className='text-red-500'>O CÁLCULO?</span>
          <br />
          <span className='text-white mt-2 inline-block'>NÃO DISCUTA,</span>
          <br />
          <span className='text-white'>MANDE A I.A. COBRAR.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='mb-10 md:mb-14 flex flex-col items-center justify-center gap-5'
        >
          <p className='text-gray-300 text-lg md:text-2xl max-w-4xl mx-auto leading-relaxed md:leading-loose px-4 font-light tracking-wide'>
            <span className='text-red-400 font-semibold'>[SISTEMA ATIVO]</span> Audite suas verbas rescisórias com inteligência artificial.
            <br className="hidden md:block"/> Gere mensagens jurídicas automatizadas. Detecte erros de cálculo em segundos.
          </p>
          
          <motion.div 
            animate={{ boxShadow: ["0 0 0px rgba(34, 197, 94, 0)", "0 0 25px rgba(34, 197, 94, 0.4)", "0 0 0px rgba(34, 197, 94, 0)"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 bg-green-500/10 border border-green-500/50 px-4 py-2 md:px-5 md:py-2.5 rounded-full backdrop-blur-sm mt-2"
          >
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
            <span className='text-green-400 font-bold uppercase tracking-wider text-xs md:text-sm'>
              Movido por IA Generativa
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="w-full px-4 md:px-0 flex justify-center"
        >
          <Button
            onClick={scrollToTerminal}
            className='w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm md:text-xl px-6 py-6 md:px-14 md:py-9 h-auto rounded-xl border border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all duration-300 hover:shadow-[0_0_45px_rgba(239,68,68,0.7)] hover:-translate-y-1 hover:scale-[1.02] uppercase tracking-widest group whitespace-normal text-center'
          >
            <Terminal className='w-5 h-5 md:w-7 md:h-7 mr-3 md:mr-4 flex-shrink-0 group-hover:animate-pulse' />
            INICIAR AUDITORIA & GERAR COBRANÇA
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className='mt-10 md:mt-12 text-[10px] md:text-sm text-gray-500 uppercase tracking-[0.2em]'
        >
          <span className='inline-flex items-center gap-2 border border-gray-800 px-4 py-2 md:px-6 md:py-2.5 bg-black/40 rounded-sm backdrop-blur-sm'>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            &gt; Sistema conectado | Status: OPERACIONAL
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(HeroSection);