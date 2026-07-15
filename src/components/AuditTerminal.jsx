import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, Calculator, AlertTriangle, RefreshCw, Copy, MessageSquare, User, Briefcase, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { MESSAGE_TEMPLATES, INITIAL_FORM_STATE, LINKS } from '@/constants/appConstants';

/**
 * Reusable Date Selector component.
 */
const DateSelector = memo(({ label, name, value, onChange }) => {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-');
      setSelectedYear(y);
      setSelectedMonth(m);
      setSelectedDay(d);
    }
  }, [value]);

  const years = Array.from({ length: 42 }, (_, i) => 2026 - i);
  const months = [
    { value: '01', label: 'Jan' }, { value: '02', label: 'Fev' },
    { value: '03', label: 'Mar' }, { value: '04', label: 'Abr' },
    { value: '05', label: 'Mai' }, { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' }, { value: '08', label: 'Ago' },
    { value: '09', label: 'Set' }, { value: '10', label: 'Out' },
    { value: '11', label: 'Nov' }, { value: '12', label: 'Dez' }
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const handlePartChange = useCallback((type, val) => {
    const newDay = type === 'day' ? val : selectedDay;
    const newMonth = type === 'month' ? val : selectedMonth;
    const newYear = type === 'year' ? val : selectedYear;

    if (type === 'day') setSelectedDay(val);
    if (type === 'month') setSelectedMonth(val);
    if (type === 'year') setSelectedYear(val);

    if (newDay && newMonth && newYear) {
      onChange({ target: { name, value: `${newYear}-${newMonth}-${newDay}` } });
    }
  }, [name, onChange, selectedDay, selectedMonth, selectedYear]);

  return (
    <div className="w-full">
      <label className="block text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400 mb-2 md:mb-3">{label}</label>
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <div className="relative">
           <select 
             className="w-full bg-black/60 border border-gray-700 text-white p-3 md:p-3.5 text-xs md:text-sm appearance-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none rounded-sm transition-all"
             value={selectedDay}
             onChange={(e) => handlePartChange('day', e.target.value)}
           >
             <option value="">Dia</option>
             {days.map(d => <option key={d} value={d}>{d}</option>)}
           </select>
        </div>
        <div className="relative">
           <select 
             className="w-full bg-black/60 border border-gray-700 text-white p-3 md:p-3.5 text-xs md:text-sm appearance-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none rounded-sm transition-all"
             value={selectedMonth}
             onChange={(e) => handlePartChange('month', e.target.value)}
           >
             <option value="">Mês</option>
             {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
           </select>
        </div>
        <div className="relative">
           <select 
             className="w-full bg-black/60 border border-gray-700 text-white p-3 md:p-3.5 text-xs md:text-sm appearance-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none rounded-sm transition-all"
             value={selectedYear}
             onChange={(e) => handlePartChange('year', e.target.value)}
           >
             <option value="">Ano</option>
             {years.map(y => <option key={y} value={y}>{y}</option>)}
           </select>
        </div>
      </div>
    </div>
  );
});

DateSelector.displayName = 'DateSelector';

const AuditTerminal = () => {
  const { toast } = useToast();
  const [step, setStep] = useState('input');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [results, setResults] = useState(null);

  const loadingRef = useRef(null);
  const terminalTopRef = useRef(null);

  useEffect(() => {
    let timer;
    if (loading && loadingRef.current) {
      timer = setTimeout(() => {
        loadingRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    let timer;
    if (step === 'result' && terminalTopRef.current) {
      timer = setTimeout(() => {
        terminalTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
    return () => clearTimeout(timer);
  }, [step]);

  const handleNewAudit = useCallback(() => {
    setStep('input');
    setFormData(INITIAL_FORM_STATE);
    setTimeout(() => {
      if (terminalTopRef.current) {
        terminalTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  }, []);

  const calculateSeverance = useCallback(() => {
    const salary = parseFloat(formData.salary);
    const start = new Date(formData.admissionDate);
    const end = new Date(formData.exitDate);
    const offer = parseFloat(formData.companyOffer);

    if (isNaN(salary) || isNaN(offer) || !formData.admissionDate || !formData.exitDate || !formData.managerName || !formData.userName) {
      toast({ title: "Dados Incompletos", description: "Por favor preencha todos os campos, incluindo datas e nomes.", variant: "destructive" });
      return null;
    }

    if (end < start) {
      toast({ title: "Datas Inválidas", description: "A data de saída não pode ser anterior à data de admissão.", variant: "destructive" });
      return null;
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const yearsWorked = Math.floor(diffDays / 365);
    const monthsWorked = Math.floor(diffDays / 30);

    const daysInLastMonth = end.getDate();
    const saldoSalario = (salary / 30) * daysInLastMonth;

    let avisoPrevio = 0;
    if (formData.noticeType === 'indenizado') {
        const avisoDays = Math.min(90, 30 + (yearsWorked * 3));
        avisoPrevio = (salary / 30) * avisoDays;
    }

    const monthsCurrentYear = end.getMonth() + 1 + (end.getDate() >= 15 ? 1 : 0);
    const decimoTerceiro = (salary / 12) * Math.min(12, monthsCurrentYear);

    const feriasProporcionaisBase = (salary / 12) * (monthsWorked % 12);
    const feriasTotal = feriasProporcionaisBase * 1.3333;
    const feriasVencidas = formData.vacationOverdue ? salary * 1.3333 : 0;

    let multaFGTS = 0;
    if (formData.terminationReason === 'sem_justa_causa' || formData.terminationReason === 'rescisao_indireta') {
         const estimatedFGTSBalance = (salary * 0.08) * monthsWorked;
         multaFGTS = estimatedFGTSBalance * 0.40;
    }

    const totalEstimated = saldoSalario + avisoPrevio + decimoTerceiro + feriasTotal + feriasVencidas + multaFGTS;
    const difference = totalEstimated - offer;

    return {
      estimatedValue: totalEstimated,
      difference: difference,
      details: { saldoSalario, avisoPrevio, decimoTerceiro, feriasTotal, multaFGTS }
    };
  }, [formData, toast]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setStep('processing');
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));
    const calcResults = calculateSeverance();
    
    if (calcResults) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const template = MESSAGE_TEMPLATES[formData.tone] || MESSAGE_TEMPLATES.professional;
      const generatedText = template(formData, calcResults);
      
      setResults({
        ...calcResults,
        aiMessage: generatedText,
        terminationReason: formData.terminationReason,
      });
      setStep('result');
    } else {
      setStep('input');
    }
    setLoading(false);
  }, [calculateSeverance, formData]);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "Mensagem copiada para a área de transferência." });
  }, [toast]);

  return (
    <section id="audit-terminal" className='py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-[#0a0a0a] to-[#121212] border-t border-gray-900'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='bg-[#0d0d0d] border border-gray-800 shadow-2xl relative overflow-hidden rounded-xl'
          ref={terminalTopRef}
        >
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ background: 'linear-gradient(rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 1), rgba(0, 255, 0, 1), rgba(0, 0, 255, 1))', backgroundSize: '100% 3px, 4px 100%' }}></div>

          <div className='bg-[#111] border-b border-gray-800 px-5 py-4 md:px-8 md:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6'>
            <div className='flex items-center gap-4'>
              <div className="p-2 md:p-3 bg-red-950/30 rounded-lg border border-red-900/30">
                <Terminal className='w-6 h-6 md:w-8 md:h-8 text-red-500' />
              </div>
              <div>
                <h2 className='text-lg md:text-2xl font-bold text-white uppercase tracking-wider font-mono'>
                  Terminal de Auditoria
                </h2>
                <p className="text-gray-400 text-[11px] md:text-sm font-mono mt-1 max-w-2xl leading-relaxed">
                  O auditor faz o cálculo aproximado da sua rescisão de trabalho com FGTS. Não é coletado nenhum dado do usuário.
                </p>
              </div>
            </div>
            <div className='flex items-center gap-4 w-full md:w-auto justify-between md:justify-end'>
              <div className='flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-gray-800 rounded-sm text-xs font-mono tracking-wider'>
                <div className='w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]'></div>
                <span className='text-blue-400 font-semibold'>SYSTEM READY</span>
              </div>
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className='flex items-center gap-2 text-red-500 text-sm font-bold tracking-widest'>
                <Activity className='w-4 h-4' />
                <span>REC</span>
              </motion.div>
            </div>
          </div>

          <div className='p-6 md:p-12 min-h-[500px] relative font-mono'>
            <AnimatePresence mode="wait">
              {step === 'input' && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-gray-800/50">
                       <div>
                        <label className="block text-xs md:text-sm font-bold uppercase tracking-wider text-purple-400 mb-2 md:mb-3">&gt; Nome do Gestor/Chefe</label>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-3.5 md:top-4 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                          <input 
                            type="text" 
                            name="managerName"
                            required
                            placeholder="Ex: Sr. Roberto"
                            className="w-full bg-black/60 border border-gray-700 text-white p-3 md:p-4 pl-12 md:pl-14 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all font-mono rounded-sm"
                            value={formData.managerName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-bold uppercase tracking-wider text-purple-400 mb-2 md:mb-3">&gt; Seu Nome</label>
                        <div className="relative">
                          <User className="absolute left-4 top-3.5 md:top-4 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                          <input 
                            type="text" 
                            name="userName"
                            required
                            placeholder="Ex: Ana Silva"
                            className="w-full bg-black/60 border border-gray-700 text-white p-3 md:p-4 pl-12 md:pl-14 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all font-mono rounded-sm"
                            value={formData.userName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8 md:space-y-10">
                      <div>
                        <label className="block text-xs md:text-sm font-bold uppercase tracking-wider text-red-500 mb-2 md:mb-3">&gt; Último Salário Bruto</label>
                        <div className="relative">
                          <span className="absolute left-4 top-3.5 md:top-4 text-gray-500 font-bold">R$</span>
                          <input 
                            type="number" 
                            name="salary"
                            required
                            placeholder="0.00"
                            className="w-full bg-black/60 border border-gray-700 text-white p-3 md:p-4 pl-12 md:pl-14 text-sm md:text-base focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all font-mono rounded-sm"
                            value={formData.salary}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-8 md:gap-6">
                        <DateSelector label="> Data de Admissão" name="admissionDate" value={formData.admissionDate} onChange={handleInputChange} />
                        <DateSelector label="> Data de Saída" name="exitDate" value={formData.exitDate} onChange={handleInputChange} />
                      </div>
                    </div>

                    <div className="space-y-8 md:space-y-10">
                       <div>
                          <label className="block text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400 mb-2 md:mb-3">&gt; Motivo da Rescisão</label>
                          <div className="relative">
                            <select
                              name="terminationReason"
                              value={formData.terminationReason}
                              onChange={handleInputChange}
                              className="w-full bg-black/60 border border-gray-700 text-white p-3 md:p-4 text-sm md:text-base focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all font-mono appearance-none rounded-sm"
                            >
                              <option value="sem_justa_causa">Dispensado sem justa causa</option>
                              <option value="com_justa_causa">Dispensado com justa causa</option>
                              <option value="pedido_demissao">Pedido de demissão</option>
                              <option value="acordo_comum">Demissão de comum acordo</option>
                              <option value="exp_prazo">Fim contrato experiência (no prazo)</option>
                              <option value="exp_antes">Fim contrato experiência (antes do prazo)</option>
                              <option value="aposentadoria">Aposentadoria do empregado</option>
                              <option value="falecimento">Falecimento do empregador</option>
                            </select>
                          </div>
                       </div>

                       <div>
                          <label className="block text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400 mb-2 md:mb-3">&gt; Aviso Prévio</label>
                          <div className="relative">
                            <select
                              name="noticeType"
                              value={formData.noticeType}
                              onChange={handleInputChange}
                              className="w-full bg-black/60 border border-gray-700 text-white p-3 md:p-4 text-sm md:text-base focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all font-mono appearance-none rounded-sm"
                            >
                              <option value="trabalhado">Trabalhado</option>
                              <option value="indenizado">Indenizado pelo empregador</option>
                              <option value="nao_cumprido">Não cumprido pelo empregado</option>
                              <option value="dispensado">Dispensado</option>
                            </select>
                          </div>
                       </div>

                       <div className="flex items-center gap-4 p-4 border border-gray-700/80 bg-black/40 rounded-sm hover:border-gray-600 transition-colors">
                          <input 
                            type="checkbox" 
                            id="vacationOverdue"
                            name="vacationOverdue"
                            checked={formData.vacationOverdue}
                            onChange={handleInputChange}
                            className="w-5 h-5 accent-red-500 bg-black border-gray-600 rounded cursor-pointer"
                          />
                          <label htmlFor="vacationOverdue" className="text-sm md:text-base text-gray-300 select-none cursor-pointer font-semibold">
                            Possui férias vencidas?
                          </label>
                       </div>

                      <div>
                        <label className="block text-xs md:text-sm font-bold uppercase tracking-wider text-green-400 mb-2 md:mb-3">&gt; Valor Oferecido pela Empresa</label>
                        <div className="relative">
                          <span className="absolute left-4 top-3.5 md:top-4 text-gray-500 font-bold">R$</span>
                          <input 
                            type="number" 
                            name="companyOffer"
                            required
                            placeholder="0.00"
                            className="w-full bg-black/60 border border-gray-700 text-white p-3 md:p-4 pl-12 md:pl-14 text-sm md:text-base focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all font-mono rounded-sm"
                            value={formData.companyOffer}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-bold uppercase tracking-wider text-blue-400 mb-2 md:mb-3">&gt; Tom da Mensagem</label>
                        <div className="relative">
                          <MessageSquare className="absolute left-4 top-3.5 md:top-4 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                          <select
                            name="tone"
                            value={formData.tone}
                            onChange={handleInputChange}
                            className="w-full bg-black/60 border border-gray-700 text-white p-3 md:p-4 pl-12 md:pl-14 text-sm md:text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all font-mono appearance-none cursor-pointer rounded-sm"
                          >
                            <option value="professional">Profissional (Recomendado)</option>
                            <option value="firm">Firme (Jurídico)</option>
                            <option value="aggressive">Agressivo (Ultimato)</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button 
                          type="submit"
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-7 md:py-8 rounded-md border-2 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:-translate-y-1 text-sm md:text-lg"
                        >
                          <Calculator className="w-5 h-5 md:w-6 md:h-6" />
                          Executar Auditoria
                        </Button>
                      </div>
                    </div>
                  </form>
                  
                  <div className="mt-12 pt-8 border-t border-gray-800/50 text-center">
                    <p className="text-gray-500 text-xs md:text-sm max-w-2xl mx-auto flex items-center justify-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <span>AVISO: Esta é uma ferramenta de estimativa baseada em regras gerais da CLT.</span>
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 'processing' && (
                <motion.div
                  ref={loadingRef}
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full min-h-[400px] md:min-h-[500px]"
                >
                  <div className="relative w-20 h-20 md:w-28 md:h-28 mb-10">
                    <motion.div className="absolute inset-0 border-4 border-gray-800 rounded-full" />
                    <motion.div 
                      className="absolute inset-0 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                      className="absolute inset-4 border-4 border-t-transparent border-r-blue-500 border-b-transparent border-l-transparent rounded-full"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <div className="font-mono text-center space-y-3">
                    <motion.p animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-red-500 font-bold uppercase tracking-widest text-sm md:text-lg">
                      Auditando valores...
                    </motion.p>
                    <p className="text-gray-500 text-sm md:text-base">Consultando tabelas CLT...</p>
                    <p className="text-gray-500 text-sm md:text-base">Gerando minuta {formData.tone.toUpperCase()}...</p>
                  </div>
                </motion.div>
              )}

              {step === 'result' && results && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-5xl mx-auto"
                >
                  <div className="mb-8">
                    <div className="bg-[#0a0a0a] border border-gray-700/80 p-6 md:p-10 relative group hover:border-red-500/50 transition-colors rounded-sm shadow-lg">
                      <div className="absolute top-0 right-0 p-4 opacity-30">
                        <Calculator className="w-10 h-10 md:w-16 md:h-16 text-gray-600 group-hover:text-red-500/30 transition-colors" />
                      </div>
                      <h3 className="text-gray-400 text-xs md:text-sm uppercase tracking-widest mb-6 font-bold border-b border-gray-800 pb-3">
                        Relatório Financeiro
                      </h3>
                      
                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                          <span className="text-gray-400 text-sm md:text-base">Valor Estimado CLT:</span>
                          <span className="text-xl md:text-2xl text-white font-bold font-mono">
                            R$ {results.estimatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-gray-400 text-sm md:text-base">Oferta da Empresa:</span>
                          <span className="text-xl md:text-2xl text-yellow-500 font-mono font-bold">
                            R$ {parseFloat(formData.companyOffer).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        
                        <div className="my-6 border-t border-dashed border-gray-700"></div>
                        
                        <div className="bg-red-950/20 border border-red-900/40 p-5 md:p-6 rounded-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-red-400 text-sm md:text-base font-bold uppercase tracking-wide">Diferença Encontrada</span>
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                          <div className="text-3xl md:text-5xl text-red-500 font-bold font-mono tracking-tighter my-3">
                            - R$ {Math.abs(results.difference).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <p className="text-xs md:text-sm text-red-400/80 mt-2 uppercase font-semibold">
                            * Valor que você está deixando de receber
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] md:text-xs text-gray-500 font-mono mb-8 leading-relaxed">
                    *Nota de Sistema: Os valores e minutas gerados acima constituem uma simulação estimada com base nos dados fornecidos pelo usuário e na legislação trabalhista corrente. Este relatório possui caráter puramente informativo e pedagógico, não substituindo assistência jurídica formal.
                  </p>

                  {(results.terminationReason === 'pedido_demissao' || results.terminationReason === 'com_justa_causa') && (
                    <motion.aside
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mb-8 rounded-lg border-2 border-yellow-500/60 bg-[#111] p-6 shadow-lg md:p-8"
                      aria-labelledby="credliber-offer-title"
                    >
                      <div className="flex flex-col items-start gap-5 md:flex-row md:gap-6">
                        <div className="rounded-full border border-yellow-500/40 bg-yellow-500/10 p-3">
                          <Unlock className="h-7 w-7 text-yellow-500" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <h3 id="credliber-offer-title" className="mb-3 text-sm font-bold uppercase tracking-wider text-yellow-500 md:text-base">
                            Antecipação do Saque-Aniversário
                          </h3>
                          <p className="mb-6 text-sm leading-relaxed text-gray-200 md:text-base">
                            Ficou com o FGTS preso na Caixa devido ao tipo de demissão? Antecipe as parcelas do Saque-Aniversário hoje mesmo.
                          </p>
                          <a
                            href={LINKS.CREDLIBER_PORTAL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center rounded-md border border-yellow-600 bg-yellow-500 px-6 py-4 text-center text-sm font-extrabold uppercase tracking-widest text-black transition-colors hover:bg-yellow-400 md:w-fit"
                          >
                            Falar com o atendimento
                          </a>
                        </div>
                      </div>
                    </motion.aside>
                  )}

                  {results.terminationReason === 'sem_justa_causa' && (
                    <motion.aside
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mb-8 rounded-lg border-2 border-green-500/60 bg-[#111] p-6 shadow-lg md:p-8"
                      aria-labelledby="career-kit-offer-title"
                    >
                      <div className="flex flex-col items-start gap-5 md:flex-row md:gap-6">
                        <div className="rounded-full border border-green-500/40 bg-green-500/10 p-3">
                          <Briefcase className="h-7 w-7 text-green-400" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <h3 id="career-kit-offer-title" className="mb-3 text-sm font-bold uppercase tracking-wider text-green-400 md:text-base">
                            Kit para voltar ao mercado
                          </h3>
                          <p className="mb-6 text-sm leading-relaxed text-gray-200 md:text-base">
                            Foi demitido e precisa voltar ao mercado? Baixe nosso Kit Currículo Perfeito + Guia de Entrevistas por apenas R$ 9,90.
                          </p>
                          <a
                            href={LINKS.CAREER_KIT_PIX}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center rounded-md border border-green-600 bg-green-500 px-6 py-4 text-center text-sm font-extrabold uppercase tracking-widest text-black transition-colors hover:bg-green-400 md:w-fit"
                          >
                            Comprar por Pix — R$ 9,90
                          </a>
                        </div>
                      </div>
                    </motion.aside>
                  )}

                  <div className="mb-10">
                    <div className="bg-[#0a0a0a] border border-gray-700/80 p-6 md:p-10 flex flex-col relative group hover:border-blue-500/50 transition-colors rounded-sm shadow-lg">
                      <div className="absolute top-0 right-0 p-4 opacity-30">
                        <Terminal className="w-10 h-10 md:w-16 md:h-16 text-gray-600 group-hover:text-blue-500/30 transition-colors" />
                      </div>
                      <h3 className="text-gray-400 text-xs md:text-sm uppercase tracking-widest mb-6 font-bold border-b border-gray-800 pb-3 flex items-center justify-between flex-wrap gap-3">
                        <span>Mensagem Gerada ({formData.tone})</span>
                        <span className="text-[10px] md:text-xs bg-blue-950/40 text-blue-400 px-3 py-1 rounded-sm border border-blue-900/60 font-semibold tracking-wide">WhatsApp Ready</span>
                      </h3>
                      
                      <div className="flex-grow bg-[#050505] border border-gray-800 p-5 md:p-6 font-mono text-sm md:text-base text-gray-300 leading-relaxed md:leading-loose whitespace-pre-wrap mb-6 font-light rounded-sm shadow-inner">
                        {results.aiMessage}
                      </div>

                      <div className="space-y-4">
                        <Button 
                          onClick={() => copyToClipboard(results.aiMessage)}
                          variant="outline"
                          className="w-full border-gray-700 hover:bg-gray-800 hover:text-white text-gray-300 hover:border-gray-500 transition-all text-sm md:text-base py-6 rounded-md font-semibold tracking-wide"
                        >
                          <Copy className="w-5 h-5 mr-3" />
                          Copiar Mensagem
                        </Button>

                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <Button 
                      variant="ghost" 
                      onClick={handleNewAudit}
                      className="text-gray-400 hover:text-white hover:bg-white/10 font-mono text-sm md:text-base uppercase tracking-widest transition-all py-6 px-8 rounded-md"
                    >
                      <RefreshCw className="w-5 h-5 mr-3" />
                      Nova Auditoria
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className='bg-[#0a0a0a] border-t border-gray-800 px-5 py-3 md:px-8 md:py-4'>
            <div className='flex items-center justify-between text-[10px] md:text-xs text-gray-500 font-mono tracking-wider'>
              <span className="flex items-center gap-2">
                <span className="animate-pulse text-green-500 font-bold">_</span> 
                {step === 'input' ? 'Waiting data...' : step === 'processing' ? 'Processing...' : 'Audit done.'}
              </span>
              <span className='text-gray-600 hidden sm:inline font-semibold'>System ID: LGT-9000</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(AuditTerminal);
