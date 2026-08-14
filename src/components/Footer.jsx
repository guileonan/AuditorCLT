import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowUpRight, Cpu, Lock, Shield } from 'lucide-react';
import { LINKS } from '@/constants/appConstants';
import BrandLogo from '@/components/BrandLogo';

const LEGAL_ITEMS = [
  {
    title: '1. Natureza informativa',
    body: 'As informações, cálculos e minutas gerados por esta ferramenta têm caráter estritamente educativo e informativo. Eles representam simulações baseadas em dados inseridos pelo usuário e não devem ser interpretados como documentos oficiais ou sentenças judiciais.',
  },
  {
    title: '2. Ausência de assessoria jurídica',
    body: 'O uso desta plataforma NÃO constitui relação advogado-cliente nem substitui a consulta jurídica profissional. A complexidade das leis trabalhistas envolve convenções coletivas, acordos individuais e particularidades fáticas que uma ferramenta automatizada não captura integralmente.',
  },
  {
    title: '3. Isenção de responsabilidade',
    body: 'A NexumLab e seus desenvolvedores não se responsabilizam por quaisquer perdas, danos ou consequências jurídicas decorrentes do uso direto das mensagens geradas (seja envio por WhatsApp, e-mail ou outro meio) sem a prévia revisão de um advogado habilitado pela OAB.',
  },
  {
    title: '4. Proteção de dados',
    body: 'Os dados inseridos no terminal são processados no próprio navegador para a geração dos resultados e não são armazenados em nossos servidores. Ainda assim, recomendamos não inserir dados sensíveis (como CPF ou número de conta bancária) nos campos de texto livre.',
  },
];

const Footer = () => (
  <footer className="relative bg-background pt-24 pb-12 overflow-hidden border-t border-white/5">
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-4xl mx-auto px-6 relative z-10"
    >
      {/* Marca */}
      <div className="flex flex-col items-center mb-16">
        <div className="flex items-center gap-8 md:gap-10 mb-6">
          <BrandLogo
            brand="AUDITOR_CLT"
            alt="auditorCLT"
            className="h-7 w-auto opacity-60 hover:opacity-100 transition-opacity duration-500"
          />
          <span className="h-8 w-[1px] bg-white/10" aria-hidden="true" />
          <a
            href={LINKS.NEXUMLAB_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            aria-label="Ir para o site da NexumLab"
          >
            <BrandLogo
              brand="NEXUMLAB"
              alt="NexumLab"
              className="h-6 w-auto opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
            />
          </a>
        </div>

        <a
          href={LINKS.NEXUMLAB_SITE}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-mono-sys text-[10px] tracking-[0.25em] text-secondary hover:text-foreground transition-colors relative group"
        >
          UM SISTEMA NEXUMLAB
          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300 ease-out" />
        </a>
      </div>

      {/* Como funciona */}
      <section className="lab-card p-6 md:p-8 mb-5">
        <div className="flex items-start gap-4">
          <Cpu className="w-5 h-5 text-destructive shrink-0 mt-1" />
          <div>
            <h2 className="font-mono-sys text-[10px] tracking-[0.2em] text-destructive uppercase mb-3">
              Como o cálculo é feito
            </h2>
            <p className="text-secondary text-xs md:text-sm font-light leading-relaxed">
              O terminal aplica um motor de cálculo determinístico construído sobre as
              regras da CLT (saldo de salário, aviso prévio, 13º proporcional, férias
              e multa de FGTS) e monta a minuta a partir de modelos de texto
              pré-estruturados, no tom escolhido por você. Todo o processamento acontece
              no seu navegador.
            </p>
          </div>
        </div>
      </section>

      {/* Aviso legal */}
      <section className="lab-card lab-card-alert p-6 md:p-8">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-1" />
          <div>
            <h2 className="font-mono-sys text-[10px] tracking-[0.2em] text-destructive uppercase mb-5">
              Aviso legal e termos de uso
            </h2>

            <div className="space-y-5">
              {LEGAL_ITEMS.map((item) => (
                <p key={item.title} className="text-secondary text-xs md:text-sm font-light leading-relaxed">
                  <strong className="text-foreground/80 font-medium">{item.title}:</strong>{' '}
                  {item.body}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Selos */}
      <div className="flex justify-center gap-8 mt-12 mb-10">
        <span className="flex items-center gap-2 font-mono-sys text-[10px] tracking-widest text-secondary/60">
          <Shield className="w-4 h-4" />
          SSL ENCRYPTED
        </span>
        <span className="flex items-center gap-2 font-mono-sys text-[10px] tracking-widest text-secondary/60">
          <Lock className="w-4 h-4" />
          SEM ARMAZENAMENTO
        </span>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-16 h-[1px] bg-border mb-8" />
        <p className="text-center font-mono-sys text-[10px] text-muted tracking-[0.3em] leading-loose">
          SYSTEM V1.1.0
          <span className="hidden md:inline mx-4">|</span>
          <br className="md:hidden" />
          &copy; {new Date().getFullYear()} NEXUMLAB
          <span className="hidden md:inline mx-4">|</span>
          <br className="md:hidden" />
          ALL RIGHTS RESERVED
        </p>
      </div>
    </motion.div>
  </footer>
);

export default memo(Footer);
