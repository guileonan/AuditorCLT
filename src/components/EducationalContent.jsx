import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calculator, Scale, FileText, HelpCircle, AlertCircle } from 'lucide-react';
import SectionMarker from '@/components/SectionMarker';
import { createFadeUpVariant, inView } from '@/lib/motion';

const SECTIONS = [
  {
    icon: Calculator,
    title: 'Como calcular rescisão?',
    content: 'O cálculo da rescisão envolve somar todas as verbas a que o trabalhador tem direito (como saldo de salário, férias, 13º salário) e subtrair os descontos legais (INSS, IRRF). O resultado depende diretamente do tipo de desligamento e do tempo de serviço. Nossa ferramenta utiliza a base da CLT para fornecer uma estimativa precisa, mas é essencial considerar convenções coletivas da sua categoria.',
  },
  {
    icon: FileText,
    title: 'O que é rescisão de contrato?',
    content: 'A rescisão é o ato formal de encerramento do vínculo empregatício. Ela pode ocorrer por iniciativa do empregador (com ou sem justa causa), do empregado (pedido de demissão), por acordo mútuo ou término de contrato por prazo determinado. Cada modalidade confere direitos e deveres específicos no momento do pagamento das verbas.',
  },
  {
    icon: Scale,
    title: 'O que são verbas rescisórias?',
    content: 'São os valores pagos ao trabalhador ao fim do contrato. As principais incluem: Saldo de Salário (dias trabalhados no mês), Aviso Prévio (trabalhado ou indenizado), 13º Salário Proporcional, Férias Vencidas (se houver) + 1/3, Férias Proporcionais + 1/3 e a multa de 40% sobre o FGTS (em casos de demissão sem justa causa).',
  },
  {
    icon: AlertCircle,
    title: 'Como funciona a multa de 40%?',
    content: 'Quando o trabalhador é demitido sem justa causa, a empresa deve pagar uma multa de 40% sobre o valor total depositado no FGTS durante todo o contrato de trabalho. Esse valor é uma indenização compensatória e deve ser pago junto com as demais verbas rescisórias.',
  },
  {
    icon: HelpCircle,
    title: 'Como ficam o FGTS e o Seguro-Desemprego?',
    content: 'Na demissão sem justa causa, o trabalhador tem direito a sacar o saldo integral do FGTS e a solicitar o Seguro-Desemprego, caso cumpra os requisitos de tempo de trabalho. Em casos de pedido de demissão ou demissão por justa causa, esses direitos não são aplicáveis, restringindo-se o saque do FGTS a situações específicas previstas em lei.',
  },
  {
    icon: BookOpen,
    title: 'Prazos para pagamento',
    content: 'Com a Reforma Trabalhista, o prazo para pagamento das verbas rescisórias é de até 10 dias corridos após o término do contrato, independentemente do tipo de aviso prévio. O atraso no pagamento gera multa a favor do empregado no valor de um salário.',
  },
];

const EducationalContent = () => (
  <section id="guia-clt" className="relative py-20 md:py-28 border-t border-white/5 bg-card/40 scroll-mt-24">
    <div className="max-w-6xl mx-auto px-6">
      <SectionMarker slug="KNOWLEDGE_BASE" title="Guia da rescisão CLT" className="mb-6" />

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={inView}
        variants={createFadeUpVariant(0.1, 0.7)}
        className="text-base md:text-lg text-secondary font-light leading-relaxed max-w-2xl mb-14"
      >
        Entenda seus direitos e como funciona o cálculo das verbas trabalhistas
        segundo a Consolidação das Leis do Trabalho.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {SECTIONS.map((item, index) => (
          <motion.article
            key={item.title}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={createFadeUpVariant(0.05 * index, 0.6)}
            className="lab-card p-7 md:p-8 group transition-all duration-300 hover:scale-[1.015] glow-card-hover"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center group-hover:bg-destructive/20 transition-colors duration-300">
                <item.icon className="w-4 h-4 text-destructive" />
              </div>
              <h3 className="text-base md:text-lg font-medium text-foreground/90 group-hover:text-white transition-colors leading-snug">
                {item.title}
              </h3>
            </div>
            <p className="text-sm text-secondary font-light leading-relaxed">
              {item.content}
            </p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default memo(EducationalContent);
