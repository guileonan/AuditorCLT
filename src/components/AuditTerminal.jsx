import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Activity,
  Calculator,
  AlertTriangle,
  RefreshCw,
  Copy,
  MessageSquare,
  User,
  Briefcase,
  Unlock,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { MESSAGE_TEMPLATES, INITIAL_FORM_STATE, LINKS } from '@/constants/appConstants';
import {
  calculateSeverance,
  validateSeveranceInput,
  FIXED_TERM_REASONS,
  TERMINATION_OPTIONS,
} from '@/lib/cltCalculator';

/* ------------------------------------------------------------------ */
/* Primitivas de formulário no padrão terminal                         */
/* ------------------------------------------------------------------ */

const FieldLabel = memo(({ children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className="block font-mono-sys text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-secondary mb-3"
  >
    <span className="text-destructive mr-2">&gt;</span>
    {children}
  </label>
));
FieldLabel.displayName = 'FieldLabel';

/**
 * Seletor de data em três partes. Lógica preservada do original.
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
    { value: '11', label: 'Nov' }, { value: '12', label: 'Dez' },
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
      <FieldLabel>{label}</FieldLabel>
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <select
          aria-label={`${label} — dia`}
          className="terminal-select"
          value={selectedDay}
          onChange={(e) => handlePartChange('day', e.target.value)}
        >
          <option value="">Dia</option>
          {days.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <select
          aria-label={`${label} — mês`}
          className="terminal-select"
          value={selectedMonth}
          onChange={(e) => handlePartChange('month', e.target.value)}
        >
          <option value="">Mês</option>
          {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>

        <select
          aria-label={`${label} — ano`}
          className="terminal-select"
          value={selectedYear}
          onChange={(e) => handlePartChange('year', e.target.value)}
        >
          <option value="">Ano</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
    </div>
  );
});
DateSelector.displayName = 'DateSelector';

/** Linha do relatório financeiro. */
const ReportRow = memo(({ label, hint, value, tone = 'default', size = 'lg' }) => (
  <div className="flex justify-between items-baseline gap-4 py-3 border-b border-white/5 last:border-b-0">
    <span className="text-sm text-secondary font-light">
      {label}
      {hint && (
        <span className="block font-mono-sys text-[10px] tracking-wider text-secondary/50 mt-1">
          {hint}
        </span>
      )}
    </span>
    <span
      className={`font-mono-sys font-medium tabular-nums shrink-0 ${
        size === 'sm' ? 'text-sm md:text-base' : 'text-lg md:text-xl'
      } ${
        tone === 'negative'
          ? 'text-destructive'
          : tone === 'muted'
            ? 'text-secondary'
            : 'text-foreground'
      }`}
    >
      {value}
    </span>
  </div>
));
ReportRow.displayName = 'ReportRow';

const formatBRL = (n) =>
  Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ------------------------------------------------------------------ */
/* Terminal                                                            */
/* ------------------------------------------------------------------ */

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
      terminalTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };

      // Sair de um contrato a termo descarta a data prevista, para não deixar
      // um valor órfão influenciando o cálculo depois.
      if (name === 'terminationReason' && !FIXED_TERM_REASONS.includes(value)) {
        next.contractEndDate = '';
      }

      return next;
    });
  }, []);

  /* ---- Cálculo: motor em @/lib/cltCalculator, testado em tests/ ---- */
  const runCalculation = useCallback(() => {
    const problem = validateSeveranceInput(formData);

    if (problem) {
      toast({ ...problem, variant: 'destructive' });
      return null;
    }

    return calculateSeverance(formData);
  }, [formData, toast]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setStep('processing');
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    const calcResults = runCalculation();

    if (calcResults) {
      await new Promise((resolve) => setTimeout(resolve, 800));
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
  }, [runCalculation, formData]);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copiado', description: 'Mensagem copiada para a área de transferência.' });
  }, [toast]);

  const statusLabel =
    step === 'input' ? 'Aguardando dados'
      : step === 'processing' ? 'Processando'
        : 'Auditoria concluída';

  const hasShortfall = results ? results.difference > 0 : false;
  const isFixedTerm = FIXED_TERM_REASONS.includes(formData.terminationReason);

  return (
    <section id="audit-terminal" className="relative py-20 md:py-28 border-t border-white/5 scroll-mt-24">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] grid-overlay" />

      <div className="max-w-6xl mx-auto px-5 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="gradient-border pulse-glow bg-background rounded-2xl relative overflow-hidden border border-transparent scanlines scan-sweep"
          ref={terminalTopRef}
        >
          {/* Barra de topo */}
          <div className="relative z-30 border-b border-white/5 bg-card/60 backdrop-blur-sm px-5 py-5 md:px-8 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="font-mono-sys text-sm md:text-base tracking-[0.2em] text-foreground uppercase">
                  Terminal de auditoria
                </h2>
                <p className="text-secondary text-xs md:text-sm font-light mt-1.5 max-w-xl leading-relaxed">
                  Cálculo aproximado da sua rescisão pelas regras da CLT. Nada é enviado
                  a servidores — tudo roda no seu navegador.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 font-mono-sys text-[10px] tracking-widest text-secondary border border-white/10 bg-white/5 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--terminal-green))] animate-pulse" />
                SYSTEM READY
              </div>
              <motion.div
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="hidden sm:flex items-center gap-2 font-mono-sys text-[10px] tracking-widest text-destructive"
              >
                <Activity className="w-3.5 h-3.5" />
                REC
              </motion.div>
            </div>
          </div>

          {/* Corpo */}
          <div className="relative z-10 px-5 py-10 md:p-12 min-h-[520px]">
            <AnimatePresence mode="wait">
              {step === 'input' && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    {/* Identificação */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pb-10 mb-10 border-b border-white/5">
                      <div>
                        <FieldLabel htmlFor="managerName">Nome do gestor / chefe</FieldLabel>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/60 pointer-events-none" />
                          <input
                            id="managerName"
                            type="text"
                            name="managerName"
                            required
                            placeholder="Ex: Sr. Roberto"
                            className="terminal-input field-with-icon"
                            value={formData.managerName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <FieldLabel htmlFor="userName">Seu nome</FieldLabel>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/60 pointer-events-none" />
                          <input
                            id="userName"
                            type="text"
                            name="userName"
                            required
                            placeholder="Ex: Ana Silva"
                            className="terminal-input field-with-icon"
                            value={formData.userName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contrato */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                      <div className="space-y-8">
                        <div>
                          <FieldLabel htmlFor="salary">Último salário bruto</FieldLabel>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono-sys text-xs text-secondary/70 pointer-events-none">
                              R$
                            </span>
                            <input
                              id="salary"
                              type="number"
                              step="0.01"
                              min="0"
                              name="salary"
                              required
                              placeholder="0,00"
                              className="terminal-input field-with-icon"
                              value={formData.salary}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <DateSelector
                          label="Data de admissão"
                          name="admissionDate"
                          value={formData.admissionDate}
                          onChange={handleInputChange}
                        />
                        <DateSelector
                          label="Data de saída"
                          name="exitDate"
                          value={formData.exitDate}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-8">
                        <div>
                          <FieldLabel htmlFor="terminationReason">Motivo da rescisão</FieldLabel>
                          <select
                            id="terminationReason"
                            name="terminationReason"
                            value={formData.terminationReason}
                            onChange={handleInputChange}
                            className="terminal-select"
                          >
                            {TERMINATION_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {isFixedTerm && (
                          <div>
                            <DateSelector
                              label="Término previsto do contrato"
                              name="contractEndDate"
                              value={formData.contractEndDate}
                              onChange={handleInputChange}
                            />
                            <p className="mt-3 text-[11px] text-secondary/70 font-light leading-relaxed">
                              A data que constava no contrato de experiência. Na rescisão
                              antecipada, é ela que define a indenização do art. 479 — metade da
                              remuneração dos dias que faltavam.
                            </p>
                          </div>
                        )}

                        <div>
                          <FieldLabel htmlFor="noticeType">Aviso prévio</FieldLabel>
                          <select
                            id="noticeType"
                            name="noticeType"
                            value={formData.noticeType}
                            onChange={handleInputChange}
                            className="terminal-select"
                          >
                            <option value="trabalhado">Trabalhado</option>
                            <option value="indenizado">Indenizado pelo empregador</option>
                            <option value="nao_cumprido">Não cumprido pelo empregado</option>
                            <option value="dispensado">Dispensado</option>
                          </select>
                        </div>

                        <div>
                          <FieldLabel htmlFor="companyOffer">Valor oferecido pela empresa</FieldLabel>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono-sys text-xs text-secondary/70 pointer-events-none">
                              R$
                            </span>
                            <input
                              id="companyOffer"
                              type="number"
                              step="0.01"
                              min="0"
                              name="companyOffer"
                              required
                              placeholder="0,00"
                              className="terminal-input field-with-icon"
                              value={formData.companyOffer}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div>
                          <FieldLabel htmlFor="tone">Tom da mensagem</FieldLabel>
                          <div className="relative">
                            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/60 pointer-events-none z-10" />
                            <select
                              id="tone"
                              name="tone"
                              value={formData.tone}
                              onChange={handleInputChange}
                              className="terminal-select field-with-icon"
                            >
                              <option value="professional">Profissional (recomendado)</option>
                              <option value="firm">Firme (jurídico)</option>
                              <option value="aggressive">Agressivo (ultimato)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Férias vencidas */}
                    <label
                      htmlFor="vacationOverdue"
                      className="mt-8 flex items-center gap-4 p-4 border border-white/10 bg-black hover:border-destructive/40 transition-colors cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        id="vacationOverdue"
                        name="vacationOverdue"
                        checked={formData.vacationOverdue}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-[#A32A2A] bg-black cursor-pointer"
                      />
                      <span className="text-sm text-secondary font-light">
                        Possuo férias vencidas (período completo não gozado)
                      </span>
                    </label>

                    {/* Ação */}
                    <div className="mt-10">
                      <button
                        type="submit"
                        className="btn-primary-solid w-full h-16 md:h-[72px] text-xs md:text-sm glow-red-hover"
                      >
                        <Calculator className="w-5 h-5 mr-3 shrink-0" />
                        EXECUTAR AUDITORIA
                      </button>
                    </div>

                    <p className="mt-8 flex items-start justify-center gap-2.5 text-center text-xs text-secondary/70 font-light max-w-xl mx-auto leading-relaxed">
                      <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <span>
                        Ferramenta de estimativa baseada nas regras gerais da CLT. Convenções
                        coletivas e acordos específicos podem alterar os valores.
                      </span>
                    </p>
                  </form>
                </motion.div>
              )}

              {step === 'processing' && (
                <motion.div
                  ref={loadingRef}
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-[460px]"
                >
                  <div className="relative w-24 h-24 mb-10">
                    <div className="absolute inset-0 border border-white/10 rounded-full" />
                    <motion.div
                      className="absolute inset-0 border border-t-destructive border-r-transparent border-b-transparent border-l-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                      className="absolute inset-5 border border-dashed border-white/15 rounded-full"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-destructive" />
                    </div>
                  </div>

                  <div className="font-mono-sys text-center space-y-2.5 text-xs md:text-sm tracking-widest">
                    <motion.p
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-destructive uppercase"
                    >
                      Auditando valores
                    </motion.p>
                    <p className="text-secondary/70">&gt; consultando tabelas CLT</p>
                    <p className="text-secondary/70">&gt; gerando minuta [{formData.tone.toUpperCase()}]</p>
                  </div>
                </motion.div>
              )}

              {step === 'result' && results && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-4xl mx-auto"
                >
                  {/* Relatório financeiro */}
                  <div className="lab-card p-6 md:p-10 mb-6 relative overflow-hidden">
                    <p className="font-mono-sys text-[10px] tracking-[0.25em] text-secondary mb-6 pb-4 border-b border-white/5 uppercase">
                      <span className="text-destructive mr-2">&gt;</span>
                      Relatório financeiro
                    </p>

                    {/* Composição verba a verba — o que sustenta o total */}
                    <div className="mb-8">
                      <p className="font-mono-sys text-[10px] tracking-[0.2em] text-secondary/60 uppercase mb-1">
                        Composição — {results.reasonLabel}
                      </p>
                      {results.details.map((item) => (
                        <ReportRow
                          key={item.key}
                          label={item.label}
                          hint={item.hint}
                          size="sm"
                          tone={item.value < 0 ? 'negative' : 'muted'}
                          value={`${item.value < 0 ? '− ' : ''}R$ ${formatBRL(Math.abs(item.value))}`}
                        />
                      ))}
                    </div>

                    <ReportRow label="Valor estimado pela CLT" value={`R$ ${formatBRL(results.estimatedValue)}`} />
                    <ReportRow label="Oferta da empresa" value={`R$ ${formatBRL(formData.companyOffer)}`} tone="muted" />

                    {hasShortfall ? (
                      <div className="mt-8 border border-destructive/40 bg-destructive/[0.07] p-6 md:p-8 rounded-xl relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-56 h-56 bg-destructive/20 rounded-full blur-[80px] pointer-events-none" />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between gap-4 mb-3">
                            <span className="font-mono-sys text-[10px] md:text-[11px] tracking-[0.2em] text-destructive uppercase">
                              Diferença encontrada
                            </span>
                            <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
                          </div>
                          <p className="font-mono-sys text-4xl md:text-6xl font-bold text-destructive tracking-tighter text-glow-red tabular-nums leading-none">
                            R$ {formatBRL(Math.abs(results.difference))}
                          </p>
                          <p className="mt-4 text-xs md:text-sm text-secondary font-light">
                            Valor que você pode estar deixando de receber.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-8 border border-white/10 bg-white/[0.03] p-6 md:p-8 rounded-xl">
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <span className="font-mono-sys text-[10px] md:text-[11px] tracking-[0.2em] text-[hsl(var(--terminal-green))] uppercase">
                            Sem diferença a cobrar
                          </span>
                          <CheckCircle2 className="w-5 h-5 text-[hsl(var(--terminal-green))] shrink-0" />
                        </div>
                        <p className="font-mono-sys text-3xl md:text-4xl font-bold text-foreground tracking-tighter tabular-nums leading-none">
                          R$ {formatBRL(Math.abs(results.difference))}
                        </p>
                        <p className="mt-4 text-xs md:text-sm text-secondary font-light">
                          {results.difference === 0
                            ? 'A oferta da empresa bate exatamente com a estimativa da CLT.'
                            : 'A oferta da empresa está acima da estimativa da CLT nesse valor.'}{' '}
                          Ainda assim, vale conferir a convenção coletiva da sua categoria.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* O que a lei deixa de fora, e o que ela não decide */}
                  {results.notes.length > 0 && (
                    <div className="lab-card p-6 md:p-8 mb-6">
                      <p className="font-mono-sys text-[10px] tracking-[0.25em] text-secondary mb-5 pb-4 border-b border-white/5 uppercase">
                        <span className="text-destructive mr-2">&gt;</span>
                        Observações sobre este cálculo
                      </p>
                      <ul className="space-y-4">
                        {results.notes.map((note) => (
                          <li
                            key={note}
                            className="flex gap-3 text-[13px] md:text-sm text-secondary font-light leading-relaxed"
                          >
                            <span className="font-mono-sys text-[10px] text-destructive shrink-0 mt-1.5">
                              &gt;
                            </span>
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="text-[11px] md:text-xs text-secondary/60 font-light leading-relaxed mb-8">
                    Nota de sistema: os valores e a minuta acima são uma simulação estimada a
                    partir dos dados informados e da legislação trabalhista vigente. O relatório
                    tem caráter informativo e pedagógico e não substitui assistência jurídica.
                  </p>

                  {/* Oferta condicional — antecipação FGTS */}
                  {(results.terminationReason === 'pedido_demissao' || results.terminationReason === 'com_justa_causa') && (
                    <motion.aside
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mb-6 lab-card lab-card-alert p-6 md:p-8 relative overflow-hidden glow-card-hover transition-all duration-300"
                      aria-labelledby="credliber-offer-title"
                    >
                      <div className="absolute -top-24 -right-24 w-64 h-64 bg-destructive/10 rounded-full blur-[90px] pointer-events-none" />
                      <div className="relative z-10 flex flex-col md:flex-row items-start gap-5 md:gap-7">
                        <div className="w-12 h-12 shrink-0 rounded-xl border border-destructive/25 bg-destructive/10 flex items-center justify-center">
                          <Unlock className="w-5 h-5 text-destructive" aria-hidden="true" />
                        </div>
                        <div className="flex-1 w-full">
                          <p className="font-mono-sys text-[10px] tracking-[0.2em] text-destructive uppercase mb-3">
                            Opcional · Produto de crédito
                          </p>
                          <h3 id="credliber-offer-title" className="text-xl md:text-2xl font-medium text-foreground mb-3">
                            Antecipação do saque-aniversário
                          </h3>
                          <p className="text-sm md:text-base text-secondary font-light leading-relaxed mb-6">
                            Ficou com o FGTS preso por causa do tipo de demissão? É possível
                            antecipar as parcelas do saque-aniversário. Serviço de terceiro,
                            sujeito a análise e a juros — não faz parte dos seus direitos acima.
                          </p>
                          <a
                            href={LINKS.CREDLIBER_PORTAL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-ghost-outline h-12 px-7 text-[11px] w-full md:w-auto glow-red-hover"
                          >
                            FALAR COM O ATENDIMENTO
                          </a>
                        </div>
                      </div>
                    </motion.aside>
                  )}

                  {/* Oferta condicional — kit de recolocação */}
                  {results.terminationReason === 'sem_justa_causa' && (
                    <motion.aside
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mb-6 lab-card p-6 md:p-8 relative overflow-hidden glow-card-hover transition-all duration-300"
                      aria-labelledby="career-kit-offer-title"
                    >
                      <div className="relative z-10 flex flex-col md:flex-row items-start gap-5 md:gap-7">
                        <div className="w-12 h-12 shrink-0 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-foreground" aria-hidden="true" />
                        </div>
                        <div className="flex-1 w-full">
                          <p className="font-mono-sys text-[10px] tracking-[0.2em] text-secondary uppercase mb-3">
                            Opcional · Material de apoio
                          </p>
                          <h3 id="career-kit-offer-title" className="text-xl md:text-2xl font-medium text-foreground mb-3">
                            Kit para voltar ao mercado
                          </h3>
                          <p className="text-sm md:text-base text-secondary font-light leading-relaxed mb-6">
                            Foi demitido e precisa se recolocar? O Kit Currículo Perfeito
                            + Guia de Entrevistas sai por R$ 9,90.
                          </p>
                          <a
                            href={LINKS.CAREER_KIT_PIX}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary-solid h-12 px-7 text-[11px] w-full md:w-auto glow-red-hover"
                          >
                            COMPRAR POR PIX — R$ 9,90
                          </a>
                        </div>
                      </div>
                    </motion.aside>
                  )}

                  {/* Minuta gerada */}
                  <div className="lab-card p-6 md:p-10 mb-8">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/5">
                      <p className="font-mono-sys text-[10px] tracking-[0.25em] text-secondary uppercase">
                        <span className="text-destructive mr-2">&gt;</span>
                        Minuta gerada · {formData.tone}
                      </p>
                      <span className="font-mono-sys text-[9px] tracking-widest text-secondary border border-white/10 bg-white/5 px-3 py-1.5 rounded-full">
                        PRONTA PARA WHATSAPP
                      </span>
                    </div>

                    <div className="bg-black border border-white/10 p-5 md:p-7 font-mono-sys text-[13px] md:text-sm text-secondary leading-loose whitespace-pre-wrap mb-6">
                      {results.aiMessage}
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(results.aiMessage)}
                      className="btn-ghost-outline w-full h-14 text-[11px] md:text-xs glow-red-hover"
                    >
                      <Copy className="w-4 h-4 mr-3" />
                      COPIAR MENSAGEM
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleNewAudit}
                      className="inline-flex items-center font-mono-sys text-[11px] tracking-[0.2em] text-secondary hover:text-foreground transition-colors py-3 px-6 uppercase"
                    >
                      <RefreshCw className="w-4 h-4 mr-3" />
                      Nova auditoria
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Rodapé do terminal */}
          <div className="relative z-30 border-t border-white/5 bg-card/60 px-5 py-3.5 md:px-8">
            <div className="flex items-center justify-between font-mono-sys text-[10px] tracking-widest text-secondary/70">
              <span className="flex items-center gap-2">
                <span className="caret" aria-hidden="true" />
                {statusLabel}
              </span>
              <span className="hidden sm:inline">SYSTEM ID: LGT-9000</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(AuditTerminal);
