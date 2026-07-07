import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calculator, Scale, FileText, HelpCircle, AlertCircle } from 'lucide-react';

const SECTIONS = [
  {
    icon: Calculator,
    title: "Como calcular rescisão?",
    content: "O cálculo da rescisão envolve somar todas as verbas a que o trabalhador tem direito (como saldo de salário, férias, 13º salário) e subtrair os descontos legais (INSS, IRRF). O resultado depende diretamente do tipo de desligamento e do tempo de serviço. Nossa ferramenta utiliza a base da CLT para fornecer uma estimativa precisa, mas é essencial considerar convenções coletivas da sua categoria."
  },
  {
    icon: FileText,
    title: "O que é rescisão de contrato?",
    content: "A rescisão é o ato formal de encerramento do vínculo empregatício. Ela pode ocorrer por iniciativa do empregador (com ou sem justa causa), do empregado (pedido de demissão), por acordo mútuo ou término de contrato por prazo determinado. Cada modalidade confere direitos e deveres específicos no momento do pagamento das verbas."
  },
  {
    icon: Scale,
    title: "O que são verbas rescisórias?",
    content: "São os valores pagos ao trabalhador ao fim do contrato. As principais incluem: Saldo de Salário (dias trabalhados no mês), Aviso Prévio (trabalhado ou indenizado), 13º Salário Proporcional, Férias Vencidas (se houver) + 1/3, Férias Proporcionais + 1/3 e a multa de 40% sobre o FGTS (em casos de demissão sem justa causa)."
  },
  {
    icon: AlertCircle,
    title: "Como funciona a multa de 40%?",
    content: "Quando o trabalhador é demitido sem justa causa, a empresa deve pagar uma multa de 40% sobre o valor total depositado no FGTS durante todo o contrato de trabalho. Esse valor é uma indenização compensatória e deve ser pago junto com as demais verbas rescisórias."
  },
  {
    icon: HelpCircle,
    title: "Como ficam o FGTS e o Seguro-Desemprego?",
    content: "Na demissão sem justa causa, o trabalhador tem direito a sacar o saldo integral do FGTS e a solicitar o Seguro-Desemprego, caso cumpra os requisitos de tempo de trabalho. Em casos de pedido de demissão ou demissão por justa causa, esses direitos não são aplicáveis, restringindo-se o saque do FGTS a situações específicas previstas em lei."
  },
  {
    icon: BookOpen,
    title: "Prazos para Pagamento",
    content: "Com a Reforma Trabalhista, o prazo para pagamento das verbas rescisórias é de até 10 dias corridos após o término do contrato, independentemente do tipo de aviso prévio. O atraso no pagamento gera multa a favor do empregado no valor de um salário."
  }
];

const EducationalContent = () => {
  return (
    <section className='py-12 md:py-16 px-4 bg-[#0a0a0a] border-t border-gray-900'>
      <div className='max-w-6xl mx-auto'>
        <div className="mb-10 md:mb-12 text-center group cursor-pointer">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="inline-block"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 group-hover:from-red-500 group-hover:via-red-400 group-hover:to-white transition-all duration-300">
              Guia Completo da Rescisão CLT
            </h2>
            <div className="h-1 w-16 md:w-24 bg-red-600 mx-auto rounded-full group-hover:w-full transition-all duration-500"></div>
          </motion.div>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mt-3 md:mt-4 group-hover:text-gray-300 transition-colors px-2">
            Entenda seus direitos e como funciona o processo de cálculo das verbas trabalhistas segundo a Consolidação das Leis do Trabalho.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {SECTIONS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -5,
                borderColor: 'rgba(239, 68, 68, 0.4)',
                backgroundColor: 'rgba(15, 15, 15, 0.9)'
              }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#0f0f0f] p-5 md:p-6 rounded-xl border border-gray-800 shadow-lg hover:shadow-red-900/10 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="bg-red-500/10 p-2 rounded-lg group-hover:bg-red-500/20 group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-white group-hover:text-red-400 transition-colors">{item.title}</h3>
              </div>
              <p className="text-gray-400 text-xs md:text-sm leading-relaxed text-justify group-hover:text-gray-300 transition-colors">
                {item.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(EducationalContent);