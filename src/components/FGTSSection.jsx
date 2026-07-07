import React, { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Shield, Lock, CheckCircle, AlertCircle, ArrowRight, Zap, Phone, BadgeCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { LINKS } from '@/constants/appConstants';

const BENEFITS = [
  { icon: TrendingUp, title: 'TAXA MÍNIMA GARANTIDA', description: 'As menores taxas do mercado para antecipação de FGTS' },
  { icon: Zap, title: '100% ONLINE', description: 'Todo processo digital, sem burocracia e papelada' },
  { icon: Phone, title: 'SUPORTE COMPLETO', description: 'Atendimento especializado em todas as etapas' }
];

const EDUCATIONAL_STEPS = [
  { icon: Lock, title: 'O que é FGTS?', content: 'Fundo de Garantia do Tempo de Serviço - dinheiro depositado mensalmente pelo empregador em sua conta vinculada (8% do salário).' },
  { icon: CheckCircle, title: 'Quando posso sacar?', content: 'Demissão sem justa causa, aposentadoria, compra da casa própria, doenças graves, ou após 3 anos sem depósitos.' },
  { icon: DollarSign, title: 'Antecipação de FGTS', content: 'Você pode antecipar até 10 parcelas do saque-aniversário ou utilizar seu saldo para empréstimos com taxas menores.' },
  { icon: Shield, title: 'É seguro antecipar?', content: 'Sim! A operação é regulamentada pela Caixa Econômica Federal e intermediada por instituições financeiras autorizadas pelo Banco Central.' }
];

const FGTSSection = () => {
  const { toast } = useToast();
  const [simulationData, setSimulationData] = useState({
    fgtsBalance: '',
    withdrawalPercentage: 50
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setSimulationData(prev => ({ ...prev, [name]: value }));
  }, []);

  const calculateWithdrawal = useCallback(() => {
    const balance = parseFloat(simulationData.fgtsBalance);
    if (isNaN(balance) || balance <= 0) return 0;
    return (balance * simulationData.withdrawalPercentage) / 100;
  }, [simulationData]);

  return (
    <section id="fgts-section" className='py-16 px-4 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] fintech-rounded-lg fintech-shadow-soft fintech-shadow-glow p-6 md:p-10 mb-12 relative overflow-hidden'
        >
          <div className="absolute top-0 left-0 w-20 h-20 border-l-4 border-t-4 border-yellow-400/50"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-r-4 border-b-4 border-yellow-400/50"></div>

          <div className='relative z-10'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='p-3 bg-yellow-500/10 border border-yellow-400/30 fintech-rounded'>
                <DollarSign className='w-8 h-8 text-yellow-400' />
              </div>
              <div>
                <h2 className='text-2xl md:text-3xl font-bold text-white uppercase tracking-wider'>
                  Desbloquear Saldo Agora
                </h2>
                <p className='fintech-text-silver text-sm md:text-base mt-1'>
                  Antecipe seu FGTS com as melhores condições do mercado
                </p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
              <div className='space-y-6'>
                <div>
                  <label className='block text-xs uppercase tracking-widest text-yellow-400 mb-2 font-bold'>
                    &gt; Saldo Aproximado do FGTS
                  </label>
                  <div className='relative'>
                    <span className='absolute left-3 top-3 fintech-text-muted'>R$</span>
                    <input
                      type='number'
                      name='fgtsBalance'
                      placeholder='0.00'
                      className='w-full bg-black/50 border border-gray-700 text-white p-3 pl-10 text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all font-mono fintech-rounded'
                      value={simulationData.fgtsBalance}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-xs uppercase tracking-widest text-yellow-400 mb-2 font-bold'>
                    &gt; Percentual de Antecipação: {simulationData.withdrawalPercentage}%
                  </label>
                  <input
                    type='range'
                    name='withdrawalPercentage'
                    min='10'
                    max='100'
                    step='10'
                    className='w-full accent-yellow-400'
                    value={simulationData.withdrawalPercentage}
                    onChange={handleInputChange}
                  />
                  <div className='flex justify-between text-xs fintech-text-muted mt-1'>
                    <span>10%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className='text-center mt-4 mb-4'>
                  <p className='text-xs fintech-text-muted'>
                    👤 Credliber: Operação intermediada por Guilherme Leonan (Correspondente Autorizado)
                  </p>
                </div>

                {calculateWithdrawal() > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='bg-yellow-900/20 border border-yellow-700/50 p-4 fintech-rounded'
                  >
                    <div className='flex justify-between items-center'>
                      <span className='fintech-text-silver text-sm'>Valor Estimado:</span>
                      <span className='text-2xl font-bold text-yellow-400 font-mono'>
                        R$ {calculateWithdrawal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </motion.div>
                )}

                <a
                  href={LINKS.CREDLIBER_PORTAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className='block w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold py-4 fintech-rounded border-2 border-yellow-600 uppercase tracking-wider text-center transition-all text-sm md:text-base pulse-animation'
                >
                  <span className='flex items-center justify-center gap-2'>
                    <Lock className='w-5 h-5' />
                    Simular Antecipação Credliber
                    <ArrowRight className='w-5 h-5' />
                  </span>
                </a>
              </div>

              <div className='space-y-4'>
                <div className='bg-black/40 border border-gray-800 p-4 fintech-rounded fintech-shadow-soft'>
                  <h3 className='text-sm font-bold text-yellow-400 uppercase mb-3 flex items-center gap-2'>
                    <BadgeCheck className='w-4 h-4' />
                    Por que escolher a Credliber?
                  </h3>
                  <ul className='space-y-2 text-sm fintech-text-silver'>
                    <li className='flex items-start gap-2'><CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' /><span>Aprovação em até 24 horas</span></li>
                    <li className='flex items-start gap-2'><CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' /><span>Dinheiro na conta em até 48h</span></li>
                    <li className='flex items-start gap-2'><CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' /><span>Sem consulta ao SPC/Serasa</span></li>
                    <li className='flex items-start gap-2'><CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' /><span>Taxas competitivas e transparentes</span></li>
                  </ul>
                </div>

                <div className='bg-blue-900/10 border border-blue-700/30 p-4 fintech-rounded fintech-shadow-soft'>
                  <div className='flex items-start gap-3'>
                    <AlertCircle className='w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5' />
                    <div>
                      <p className='text-xs text-blue-300 leading-relaxed'>
                        <strong>Importante:</strong> Esta é uma simulação estimada. Os valores finais dependem de análise de crédito e condições específicas da operação.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='mb-12'
        >
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6'>
            {BENEFITS.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='bg-slate-950 border border-slate-800 py-3 px-4 md:p-4 hover:scale-[1.02] hover:border-slate-700 transition-all cursor-pointer group fintech-rounded fintech-shadow-soft'
              >
                <div className='flex md:flex-col items-start md:items-center gap-3 md:gap-0 md:text-center'>
                  <div className='p-2 md:p-3 bg-black/30 border border-slate-800 rounded-full flex-shrink-0 md:mb-3 group-hover:scale-110 transition-transform'>
                    <benefit.icon className='w-5 h-5 md:w-6 md:h-6 text-red-500' />
                  </div>
                  <div className='flex-1 md:flex-none'>
                    <h3 className='text-xs md:text-sm font-bold text-red-500 uppercase tracking-wider mb-1 md:mb-2 font-mono'>
                      {benefit.title}
                    </h3>
                    <p className='text-xs fintech-text-muted leading-relaxed'>
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='bg-[#0d0d0d] border border-gray-800 fintech-rounded-lg p-6 md:p-10 fintech-shadow-soft'
        >
          <div className='mb-8'>
            <h2 className='text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-2'>
              Guia Rápido do FGTS
            </h2>
            <p className='fintech-text-silver text-sm md:text-base'>
              Entenda seus direitos e saiba exatamente o que você deve receber
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {EDUCATIONAL_STEPS.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='bg-black/40 border border-gray-800 p-5 hover:border-gray-700 transition-all group fintech-rounded'
              >
                <div className='flex items-start gap-4'>
                  <div className='p-3 bg-red-900/20 border border-red-700/50 fintech-rounded flex-shrink-0 group-hover:scale-110 transition-transform'>
                    <step.icon className='w-5 h-5 text-red-500' />
                  </div>
                  <div>
                    <h3 className='text-base font-bold text-white mb-2 uppercase tracking-wide'>
                      {step.title}
                    </h3>
                    <p className='text-sm fintech-text-muted leading-relaxed'>
                      {step.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className='mt-8 p-5 bg-gradient-to-r from-red-900/10 to-transparent border-l-4 border-red-500 fintech-rounded'>
            <p className='text-sm fintech-text-silver leading-relaxed'>
              <strong className='text-red-500'>Dica importante:</strong> Sempre consulte um advogado trabalhista ou o sindicato da sua categoria para garantir que todos os seus direitos sejam respeitados. As verbas rescisórias variam de acordo com o motivo da demissão e tempo de serviço.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(FGTSSection);