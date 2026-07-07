import React, { memo } from 'react';
import { Shield, AlertTriangle, Lock } from 'lucide-react';
import { ASSETS } from '@/constants/appConstants';

const CpuIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="16" height="16" x="4" y="4" rx="2" />
    <rect width="6" height="6" x="9" y="9" rx="1" />
    <path d="M15 2v2" />
    <path d="M15 20v2" />
    <path d="M2 15h2" />
    <path d="M2 9h2" />
    <path d="M20 15h2" />
    <path d="M20 9h2" />
    <path d="M9 2v2" />
    <path d="M9 20v2" />
  </svg>
);

const Footer = () => {
  return (
    <footer className='bg-[#050505] border-t-2 border-gray-900 py-16 px-6 md:px-12'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-12 flex flex-col items-center justify-center gap-6'>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10">
            <a href="/" title="NexumLab" className="logo-wrapper footer-logo-container flex items-center justify-center hover:opacity-80 transition-opacity">
              <img 
                src={ASSETS.LOGOS.NEXUMLAB}
                alt="NexumLab Logo" 
                className="logo-image h-[40px] w-auto"
                loading="eager"
                crossOrigin="anonymous"
              />
            </a>
            
            <div className="hidden md:block h-12 w-[1px] bg-gray-800"></div>
            
            <a href="/" title="AuditorCLT" className="logo-wrapper footer-logo-container flex items-center justify-center hover:opacity-80 transition-opacity">
              <img 
                src={ASSETS.LOGOS.AUDITOR_CLT}
                alt="AuditorCLT Logo"
                className="logo-image h-[40px] w-auto"
                loading="eager"
                crossOrigin="anonymous"
              />
            </a>
          </div>
          <p className='text-gray-400 text-sm md:text-base uppercase tracking-widest text-center mt-4'>
            Serviço oferecido pela <span className='text-red-500 font-bold'>Nexumlab</span>
          </p>
        </div>

        <div className='bg-[#0a0a0a] border border-gray-800 p-6 md:p-8 mb-8 rounded-sm hover:border-gray-700 transition-colors'>
          <div className='flex items-start gap-4'>
            <CpuIcon className='w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5' />
            <div>
              <span className='text-blue-400 font-bold text-sm md:text-base uppercase tracking-wider block mb-3'>
                Tecnologia de Análise Preditiva
              </span>
              <p className='text-gray-300 text-xs md:text-sm leading-relaxed'>
                Este sistema utiliza algoritmos avançados de processamento de linguagem natural e modelos de inteligência artificial generativa para estruturar argumentos jurídicos e realizar cálculos estimativos trabalhistas com base na legislação vigente.
              </p>
            </div>
          </div>
        </div>

        <div className='bg-[#0a0a0a] border border-red-900/50 p-6 md:p-8 rounded-sm hover:border-red-900/80 transition-colors'>
          <div className='flex items-start gap-4'>
            <AlertTriangle className='w-6 h-6 text-red-500 flex-shrink-0 mt-0.5' />
            <div>
              <span className='text-red-500 font-bold text-sm md:text-base uppercase tracking-wider block mb-5'>
                Aviso Legal e Termos de Uso
              </span>
              
              <div className="space-y-5">
                <p className='text-gray-300 text-xs md:text-sm leading-relaxed'>
                  <strong>1. Natureza Informativa:</strong> As informações, cálculos e minutas gerados por esta ferramenta têm caráter estritamente educativo e informativo. Eles representam simulações baseadas em dados inseridos pelo usuário e não devem ser interpretados como documentos oficiais ou sentenças judiciais.
                </p>
                
                <p className='text-gray-300 text-xs md:text-sm leading-relaxed'>
                  <strong>2. Ausência de Assessoria Jurídica:</strong> O uso desta plataforma NÃO constitui relação advogado-cliente nem substitui a consulta jurídica profissional. A complexidade das leis trabalhistas envolve convenções coletivas, acordos individuais e particularidades fáticas que uma IA não pode capturar integralmente.
                </p>

                <p className='text-gray-300 text-xs md:text-sm leading-relaxed'>
                  <strong>3. Isenção de Responsabilidade:</strong> A Nexumlab e seus desenvolvedores não se responsabilizam por quaisquer perdas, danos ou consequências jurídicas decorrentes do uso direto das mensagens geradas (seja envio por WhatsApp, e-mail ou outro meio) sem a prévia revisão de um advogado habilitado pela OAB.
                </p>

                <p className='text-gray-300 text-xs md:text-sm leading-relaxed'>
                  <strong>4. Proteção de Dados:</strong> Os dados inseridos no terminal são processados em tempo real para a geração dos resultados e não são armazenados permanentemente em nossos servidores públicos. Recomendamos não inserir dados sensíveis (como CPF ou número de conta bancária) nos campos de texto livre.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8 mt-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            <span className="text-xs tracking-wider text-gray-400 uppercase font-semibold">SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-400" />
            <span className="text-xs tracking-wider text-gray-400 uppercase font-semibold">Secure Data</span>
          </div>
        </div>

        <div className='mt-12 pt-8 border-t border-gray-900 text-center'>
          <p className='text-gray-500 text-[10px] md:text-xs font-mono uppercase tracking-widest'>
            &gt; System v1.0.0 | {new Date().getFullYear()} | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);