import test from 'node:test';
import assert from 'node:assert/strict';

import {
  avosDecimoTerceiro,
  avosFerias,
  calculateSeverance,
  fullMonthsBetween,
  fullYearsBetween,
  parseISODate,
  validateSeveranceInput,
  vacationPeriodStart,
} from '../src/lib/cltCalculator.js';

/** Formulário válido; cada teste sobrescreve o que lhe interessa. */
const form = (overrides = {}) => ({
  managerName: 'RH',
  userName: 'Fulano',
  salary: '3000',
  admissionDate: '2023-01-10',
  exitDate: '2026-03-20',
  contractEndDate: '',
  vacationOverdue: false,
  noticeType: 'trabalhado',
  terminationReason: 'sem_justa_causa',
  companyOffer: '0',
  tone: 'professional',
  ...overrides,
});

const verba = (result, key) => result.details.find((item) => item.key === key)?.value ?? 0;
const hint = (result, key) => result.details.find((item) => item.key === key)?.hint ?? '';

const near = (actual, expected, message) =>
  assert.ok(
    Math.abs(actual - expected) < 0.01,
    `${message}: esperado ~${expected.toFixed(2)}, veio ${actual.toFixed(2)}`,
  );

/* ================================================================== */
/* Bug 1 — timezone                                                    */
/* ================================================================== */

test('bug 1: data não volta um dia ao ser parseada', () => {
  const d = parseISODate('2026-03-01');
  assert.equal(d.getDate(), 1);
  assert.equal(d.getMonth(), 2);
  assert.equal(d.getFullYear(), 2026);
});

test('bug 1: saída no dia 1º gera 1 dia de saldo, não o mês inteiro', () => {
  const r = calculateSeverance(form({ exitDate: '2026-03-01' }));
  // O código antigo lia 28/02 e devolvia R$ 2.800 — erro de 28x.
  near(verba(r, 'saldoSalario'), 100, 'saldo de salário');
});

test('bug 1: saldo de salário acompanha o dia da saída', () => {
  near(verba(calculateSeverance(form({ exitDate: '2026-03-15' })), 'saldoSalario'), 1500, '15/03');
  near(verba(calculateSeverance(form({ exitDate: '2026-03-31' })), 'saldoSalario'), 3100, '31/03');
});

test('saldo considera a admissão quando entrada e saída são no mesmo mês', () => {
  const r = calculateSeverance(form({ admissionDate: '2026-03-10', exitDate: '2026-03-20' }));
  near(verba(r, 'saldoSalario'), 1100, '11 dias trabalhados');
});

/* ================================================================== */
/* Bug 2 — 13º proporcional                                            */
/* ================================================================== */

test('bug 2: 13º conta os avos do ano da saída a partir da admissão', () => {
  // Admitido em junho, saída em 20/set → jun, jul, ago, set = 4 avos.
  // O código antigo usava 10 avos (mês corrente duplicado + admissão ignorada).
  const r = calculateSeverance(form({ admissionDate: '2026-06-01', exitDate: '2026-09-20' }));
  near(verba(r, 'decimoTerceiro'), 1000, '13º de 4/12');
  assert.equal(hint(r, 'decimoTerceiro'), '4/12 avos');
});

test('bug 2: mês da saída só vira avo com 15 dias ou mais', () => {
  const catorze = calculateSeverance(form({ admissionDate: '2026-01-05', exitDate: '2026-06-14' }));
  const quinze = calculateSeverance(form({ admissionDate: '2026-01-05', exitDate: '2026-06-15' }));
  assert.equal(hint(catorze, 'decimoTerceiro'), '5/12 avos');
  assert.equal(hint(quinze, 'decimoTerceiro'), '6/12 avos');
});

test('avosDecimoTerceiro trava em 12', () => {
  assert.equal(avosDecimoTerceiro(parseISODate('2026-01-01'), parseISODate('2026-12-31')), 12);
});

/* ================================================================== */
/* Bug 3 — motivo da rescisão                                          */
/* ================================================================== */

test('bug 3: cada motivo produz um total diferente', () => {
  const totais = Object.keys({
    sem_justa_causa: 1,
    com_justa_causa: 1,
    pedido_demissao: 1,
    acordo_comum: 1,
  }).map((terminationReason) =>
    calculateSeverance(form({ terminationReason, noticeType: 'indenizado' })).estimatedValue,
  );

  // O código antigo devolvia o mesmo valor para três dos quatro.
  assert.equal(new Set(totais.map((t) => t.toFixed(2))).size, 4);
});

test('bug 3: justa causa paga apenas saldo de salário e férias vencidas', () => {
  const r = calculateSeverance(
    form({ terminationReason: 'com_justa_causa', vacationOverdue: true }),
  );

  assert.equal(verba(r, 'decimoTerceiro'), 0, '13º não é devido (art. 482)');
  assert.equal(verba(r, 'feriasProporcionais'), 0, 'férias proporcionais não são devidas');
  assert.equal(verba(r, 'multaFGTS'), 0, 'sem multa de FGTS');
  near(verba(r, 'feriasVencidas'), 4000, 'férias vencidas continuam devidas (art. 146)');
  near(r.estimatedValue, 2000 + 4000, 'total da justa causa');
});

test('bug 3: acordo comum tem multa de FGTS pela metade da dispensa', () => {
  // Sem aviso indenizado dos dois lados, para que a projeção não mexa na
  // contagem de meses de depósito e sobre só a diferença de alíquota.
  const acordo = calculateSeverance(form({ terminationReason: 'acordo_comum' }));
  const dispensa = calculateSeverance(form({ terminationReason: 'sem_justa_causa' }));

  near(verba(acordo, 'multaFGTS'), verba(dispensa, 'multaFGTS') / 2, 'multa 20% vs 40%');
});

test('bug 3: acordo comum indeniza metade do aviso prévio (art. 484-A)', () => {
  const acordo = calculateSeverance(
    form({ terminationReason: 'acordo_comum', noticeType: 'indenizado' }),
  );
  const dispensa = calculateSeverance(
    form({ terminationReason: 'sem_justa_causa', noticeType: 'indenizado' }),
  );

  near(verba(acordo, 'avisoPrevio'), verba(dispensa, 'avisoPrevio') / 2, 'aviso pela metade');
});

test('bug 3: pedido de demissão não tem multa de FGTS mas mantém férias proporcionais', () => {
  const r = calculateSeverance(form({ terminationReason: 'pedido_demissao' }));
  assert.equal(verba(r, 'multaFGTS'), 0);
  assert.ok(verba(r, 'feriasProporcionais') > 0, 'Súmula 261 do TST');
});

/* ================================================================== */
/* Bug 4 — férias proporcionais                                        */
/* ================================================================== */

test('bug 4: exatos 6 anos zeram os avos proporcionais em vez de devolver 1/12', () => {
  // Período aquisitivo recém-iniciado: 0 avos. O código antigo dava 1/12.
  const r = calculateSeverance(
    form({ admissionDate: '2020-01-10', exitDate: '2026-01-10' }),
  );
  assert.equal(hint(r, 'feriasProporcionais'), '0/12 avos');
});

test('bug 4: um dia antes do aniversário fecha o período em 12/12', () => {
  const r = calculateSeverance(
    form({ admissionDate: '2020-01-10', exitDate: '2026-01-09' }),
  );
  assert.equal(hint(r, 'feriasProporcionais'), '12/12 avos');
});

test('bug 4: férias contam meses contratuais, não meses de calendário', () => {
  // 10/01 → 20/03: dois meses contratuais completos e fração de 11 dias (< 15).
  const r = calculateSeverance(form({ admissionDate: '2023-01-10', exitDate: '2026-03-20' }));
  assert.equal(hint(r, 'feriasProporcionais'), '2/12 avos');
  near(verba(r, 'feriasProporcionais'), (3000 / 12) * 2 * (4 / 3), 'férias + 1/3');
});

test('bug 4: fração de 15 dias ou mais vale um avo', () => {
  const catorze = avosFerias(parseISODate('2026-01-10'), parseISODate('2026-03-23'));
  const quinze = avosFerias(parseISODate('2026-01-10'), parseISODate('2026-03-24'));
  assert.equal(catorze, 2);
  assert.equal(quinze, 3);
});

/* ================================================================== */
/* Aviso prévio                                                        */
/* ================================================================== */

test('aviso prévio proporcional: 30 dias + 3 por ano completo, teto de 90', () => {
  const tresAnos = calculateSeverance(
    form({ admissionDate: '2023-01-10', exitDate: '2026-03-20', noticeType: 'indenizado' }),
  );
  near(verba(tresAnos, 'avisoPrevio'), (3000 / 30) * 39, '39 dias');

  const trintaAnos = calculateSeverance(
    form({ admissionDate: '1996-01-10', exitDate: '2026-03-20', noticeType: 'indenizado' }),
  );
  near(verba(trintaAnos, 'avisoPrevio'), (3000 / 30) * 90, 'teto de 90 dias');
});

test('aviso indenizado projeta o contrato e gera mais avos (Súmula 371 do TST)', () => {
  const trabalhado = calculateSeverance(form({ noticeType: 'trabalhado' }));
  const indenizado = calculateSeverance(form({ noticeType: 'indenizado' }));

  assert.equal(hint(trabalhado, 'decimoTerceiro'), '3/12 avos');
  assert.equal(hint(indenizado, 'decimoTerceiro'), '4/12 avos', 'projeção alcança abril');
  assert.ok(
    verba(indenizado, 'feriasProporcionais') > verba(trabalhado, 'feriasProporcionais'),
    'projeção também aumenta as férias',
  );
});

test('aviso não cumprido no pedido de demissão vira desconto de 30 dias', () => {
  const r = calculateSeverance(
    form({ terminationReason: 'pedido_demissao', noticeType: 'nao_cumprido' }),
  );
  near(verba(r, 'avisoPrevio'), -3000, 'desconto do art. 487, §2º');
});

test('aviso dispensado pelo empregador é indenizável (Súmula 276 do TST)', () => {
  const dispensado = calculateSeverance(form({ noticeType: 'dispensado' }));
  const indenizado = calculateSeverance(form({ noticeType: 'indenizado' }));
  near(verba(dispensado, 'avisoPrevio'), verba(indenizado, 'avisoPrevio'), 'mesmo tratamento');
});

/* ================================================================== */
/* Contrato de experiência                                             */
/* ================================================================== */

test('art. 479: indenização é metade dos dias que faltavam', () => {
  const r = calculateSeverance(
    form({
      terminationReason: 'exp_antes',
      admissionDate: '2026-01-10',
      exitDate: '2026-02-20',
      contractEndDate: '2026-04-10',
    }),
  );
  // 20/02 → 10/04 = 49 dias restantes.
  near(verba(r, 'indenizacao479'), (3000 / 30) * 49 * 0.5, 'metade da remuneração restante');
});

test('rescisão antecipada sem data prevista é barrada na validação', () => {
  const erro = validateSeveranceInput(form({ terminationReason: 'exp_antes' }));
  assert.ok(erro, 'deve recusar');
  assert.match(erro.title, /data prevista/i);
  assert.equal(calculateSeverance(form({ terminationReason: 'exp_antes' })), null);
});

test('data prevista anterior à saída é rejeitada', () => {
  const erro = validateSeveranceInput(
    form({
      terminationReason: 'exp_antes',
      exitDate: '2026-03-20',
      contractEndDate: '2026-01-01',
    }),
  );
  assert.ok(erro);
});

/* ================================================================== */
/* Validação                                                           */
/* ================================================================== */

test('validação recusa dados incompletos e datas invertidas', () => {
  assert.ok(validateSeveranceInput(form({ userName: '' })), 'nome vazio');
  assert.ok(validateSeveranceInput(form({ salary: '' })), 'salário vazio');
  assert.ok(validateSeveranceInput(form({ salary: '0' })), 'salário zero');
  assert.ok(validateSeveranceInput(form({ admissionDate: '' })), 'data vazia');
  assert.ok(
    validateSeveranceInput(form({ admissionDate: '2026-05-01', exitDate: '2026-01-01' })),
    'saída antes da admissão',
  );
  assert.equal(validateSeveranceInput(form()), null, 'formulário válido passa');
});

/* ================================================================== */
/* Helpers de data                                                     */
/* ================================================================== */

test('fullYearsBetween conta por aniversário, não por 365 dias', () => {
  assert.equal(fullYearsBetween(parseISODate('2020-03-10'), parseISODate('2026-03-09')), 5);
  assert.equal(fullYearsBetween(parseISODate('2020-03-10'), parseISODate('2026-03-10')), 6);
  // Atravessa dois bissextos: por diffDays/365 daria 6.
  assert.equal(fullYearsBetween(parseISODate('2018-03-01'), parseISODate('2024-02-29')), 5);
});

test('fullMonthsBetween conta por aniversário do dia', () => {
  assert.equal(fullMonthsBetween(parseISODate('2026-01-31'), parseISODate('2026-02-28')), 0);
  assert.equal(fullMonthsBetween(parseISODate('2026-01-10'), parseISODate('2026-03-10')), 2);
});

test('vacationPeriodStart devolve o último aniversário de admissão', () => {
  const inicio = vacationPeriodStart(parseISODate('2020-06-15'), parseISODate('2026-03-20'));
  assert.equal(inicio.getFullYear(), 2025);
  assert.equal(inicio.getMonth(), 5);
  assert.equal(inicio.getDate(), 15);
});

/* ================================================================== */
/* Integração                                                          */
/* ================================================================== */

test('total é a soma exata das verbas detalhadas', () => {
  const r = calculateSeverance(
    form({ noticeType: 'indenizado', vacationOverdue: true, companyOffer: '5000' }),
  );
  const soma = r.details.reduce((acc, item) => acc + item.value, 0);
  near(r.estimatedValue, soma, 'total bate com o detalhamento');
  near(r.difference, r.estimatedValue - 5000, 'diferença desconta a oferta');
});

test('todo motivo produz rótulo legível e ao menos uma nota quando há ressalva', () => {
  const r = calculateSeverance(form({ terminationReason: 'aposentadoria' }));
  assert.equal(r.reasonLabel, 'Aposentadoria do empregado');
  assert.ok(r.notes.some((n) => /OJ 361/.test(n)), 'expõe a divergência em vez de escondê-la');
});
