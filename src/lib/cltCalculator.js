/**
 * Motor de cálculo de verbas rescisórias (CLT).
 *
 * Módulo puro de propósito: sem React, sem imports, sem acesso ao DOM.
 * Isso é o que permite exercitá-lo em `tests/cltCalculator.test.js` com
 * `node --test`, sem montar a árvore de componentes.
 *
 * Toda data entra no formato 'YYYY-MM-DD' vindo dos <select> do formulário.
 */

/* ------------------------------------------------------------------ */
/* Datas                                                               */
/* ------------------------------------------------------------------ */

/**
 * Converte 'YYYY-MM-DD' em Date ao meio-dia LOCAL.
 *
 * `new Date('2026-03-01')` é interpretado como meia-noite UTC, mas
 * `.getDate()` lê em horário local — em UTC−3 isso devolve 28/02.
 * Ancorar ao meio-dia deixa a data imune a fuso e a horário de verão.
 */
export const parseISODate = (iso) => {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const date = new Date(`${iso}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/** Soma meses preservando o fim do mês: 31/jan + 1 mês = 28/fev, não 03/mar. */
const addMonths = (date, months) => {
  const dayOfMonth = date.getDate();
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  if (result.getDate() !== dayOfMonth) result.setDate(0);
  return result;
};

/** Dias corridos entre duas datas, contando as duas pontas. */
const inclusiveDays = (from, to) => Math.round((to - from) / 86400000) + 1;

const lastDayOfMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0).getDate();

/** Anos completos de contrato, por aniversário — não por `diffDays / 365`. */
export const fullYearsBetween = (start, end) => {
  let years = end.getFullYear() - start.getFullYear();
  const monthDelta = end.getMonth() - start.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && end.getDate() < start.getDate())) years -= 1;
  return Math.max(0, years);
};

/** Meses completos de contrato, por aniversário. */
export const fullMonthsBetween = (start, end) => {
  let months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) months -= 1;
  return Math.max(0, months);
};

/* ------------------------------------------------------------------ */
/* Contagem de avos                                                    */
/* ------------------------------------------------------------------ */

/**
 * Avos de 13º: meses do ANO-CALENDÁRIO com 15 dias ou mais trabalhados
 * (Lei 4.090/62, art. 1º, §2º).
 */
export const avosDecimoTerceiro = (start, end) => {
  if (end < start) return 0;

  let avos = 0;
  let year = start.getFullYear();
  let month = start.getMonth();

  while (year < end.getFullYear() || (year === end.getFullYear() && month <= end.getMonth())) {
    const isFirstMonth = year === start.getFullYear() && month === start.getMonth();
    const isLastMonth = year === end.getFullYear() && month === end.getMonth();

    const from = isFirstMonth ? start.getDate() : 1;
    const to = isLastMonth ? end.getDate() : lastDayOfMonth(year, month);

    if (to - from + 1 >= 15) avos += 1;

    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  return Math.min(12, avos);
};

/**
 * Avos de férias: meses CONTRATUAIS a partir do início do período aquisitivo,
 * com a fração final de 15 dias ou mais valendo mês inteiro (art. 146, § único).
 *
 * Contador diferente do 13º de propósito: férias correm do aniversário de
 * admissão, não do calendário civil.
 */
export const avosFerias = (periodStart, end) => {
  if (end < periodStart) return 0;

  let avos = 0;
  while (avos < 12 && addMonths(periodStart, avos + 1) <= end) avos += 1;

  if (avos < 12) {
    const fractionStart = addMonths(periodStart, avos);
    if (inclusiveDays(fractionStart, end) >= 15) avos += 1;
  }

  return Math.min(12, avos);
};

/** Início do período aquisitivo em curso: último aniversário de admissão. */
export const vacationPeriodStart = (admission, end) =>
  addMonths(admission, fullYearsBetween(admission, end) * 12);

/* ------------------------------------------------------------------ */
/* Regras por motivo de rescisão                                       */
/* ------------------------------------------------------------------ */

/**
 * `avisoDe` diz quem deve o aviso prévio:
 *   'empregador' → indeniza e projeta o contrato
 *   'empregado'  → pode ser descontado se não for cumprido
 *   'metade'     → art. 484-A
 *   'nenhum'     → contrato a termo e justa causa
 */
export const TERMINATION_RULES = {
  sem_justa_causa: {
    label: 'Dispensa sem justa causa',
    avisoDe: 'empregador',
    decimoTerceiro: true,
    feriasProporcionais: true,
    multaFGTS: 0.4,
    notes: [],
  },

  com_justa_causa: {
    label: 'Dispensa por justa causa',
    avisoDe: 'nenhum',
    decimoTerceiro: false,
    feriasProporcionais: false,
    multaFGTS: 0,
    notes: [
      'Na justa causa (art. 482 da CLT) não são devidos aviso prévio, 13º proporcional nem férias proporcionais. As férias vencidas continuam devidas (art. 146 da CLT).',
    ],
  },

  pedido_demissao: {
    label: 'Pedido de demissão',
    avisoDe: 'empregado',
    decimoTerceiro: true,
    feriasProporcionais: true,
    multaFGTS: 0,
    notes: [
      'No pedido de demissão não há multa de 40% nem saque do FGTS. As férias proporcionais são devidas mesmo com menos de 12 meses de casa (Súmula 261 do TST).',
    ],
  },

  acordo_comum: {
    label: 'Demissão de comum acordo',
    avisoDe: 'metade',
    decimoTerceiro: true,
    feriasProporcionais: true,
    multaFGTS: 0.2,
    notes: [
      'No acordo do art. 484-A da CLT o aviso prévio indenizado é pago pela metade e a multa do FGTS cai para 20%. O saque fica limitado a 80% do saldo.',
    ],
  },

  exp_prazo: {
    label: 'Fim do contrato de experiência (no prazo)',
    avisoDe: 'nenhum',
    decimoTerceiro: true,
    feriasProporcionais: true,
    multaFGTS: 0,
    notes: [
      'No término normal de contrato por prazo determinado não há aviso prévio nem multa de 40% do FGTS.',
    ],
  },

  exp_antes: {
    label: 'Fim do contrato de experiência (antes do prazo)',
    avisoDe: 'nenhum',
    decimoTerceiro: true,
    feriasProporcionais: true,
    multaFGTS: 0,
    art479: true,
    notes: [
      'A multa de 40% do FGTS na rescisão antecipada é controvertida e não foi incluída. Havendo cláusula assecuratória do direito recíproco de rescisão (art. 481 da CLT), o valor devido pode ser maior — vale confirmar com um advogado.',
    ],
  },

  aposentadoria: {
    label: 'Aposentadoria do empregado',
    avisoDe: 'empregado',
    decimoTerceiro: true,
    feriasProporcionais: true,
    multaFGTS: 0,
    notes: [
      'Calculado como saída a pedido do empregado. Atenção: a aposentadoria espontânea não extingue o contrato de trabalho (OJ 361 da SDI-1 do TST). Se você continuou trabalhando depois de se aposentar e só então foi dispensado, a multa de 40% é devida sobre todo o período e o valor acima está subestimado.',
    ],
  },

  falecimento: {
    label: 'Falecimento do empregador',
    avisoDe: 'nenhum',
    decimoTerceiro: true,
    feriasProporcionais: true,
    multaFGTS: 0,
    notes: [
      'Falecimento do empregador pessoa física (art. 483, §2º da CLT). Há entendimento de que as verbas se equiparam às da dispensa sem justa causa, com multa de 40% — não incluída aqui por não ser matéria pacífica. Vale confirmar com um advogado.',
    ],
  },
};

/** Motivos na ordem em que aparecem no formulário. */
export const TERMINATION_OPTIONS = Object.entries(TERMINATION_RULES).map(([value, rule]) => ({
  value,
  label: rule.label,
}));

/** Motivos que exigem a data prevista de término do contrato. */
export const FIXED_TERM_REASONS = ['exp_prazo', 'exp_antes'];

/* ------------------------------------------------------------------ */
/* Validação                                                           */
/* ------------------------------------------------------------------ */

/**
 * Valida os dados do formulário.
 * Devolve `null` quando está tudo certo, ou `{ title, description }` para o toast.
 */
export const validateSeveranceInput = (formData) => {
  const salary = parseFloat(formData.salary);
  const offer = parseFloat(formData.companyOffer);
  const admission = parseISODate(formData.admissionDate);
  const exit = parseISODate(formData.exitDate);

  if (
    Number.isNaN(salary) ||
    Number.isNaN(offer) ||
    !admission ||
    !exit ||
    !formData.managerName ||
    !formData.userName
  ) {
    return {
      title: 'Dados incompletos',
      description: 'Preencha todos os campos, incluindo datas e nomes.',
    };
  }

  if (salary <= 0) {
    return {
      title: 'Salário inválido',
      description: 'Informe o salário mensal bruto.',
    };
  }

  if (exit < admission) {
    return {
      title: 'Datas inválidas',
      description: 'A data de saída não pode ser anterior à data de admissão.',
    };
  }

  if (formData.terminationReason === 'exp_antes') {
    const contractEnd = parseISODate(formData.contractEndDate);
    if (!contractEnd) {
      return {
        title: 'Falta a data prevista de término',
        description:
          'Na rescisão antecipada, a indenização do art. 479 depende de quantos dias faltavam para o fim do contrato.',
      };
    }
    if (contractEnd <= exit) {
      return {
        title: 'Data prevista inconsistente',
        description: 'O término previsto do contrato precisa ser posterior à data de saída.',
      };
    }
  }

  return null;
};

/* ------------------------------------------------------------------ */
/* Cálculo                                                             */
/* ------------------------------------------------------------------ */

/**
 * Calcula as verbas rescisórias.
 *
 * @returns {{
 *   estimatedValue: number,
 *   difference: number,
 *   details: Array<{ key: string, label: string, value: number, hint?: string }>,
 *   notes: string[],
 *   reasonLabel: string,
 * } | null} `null` se os dados não passarem na validação.
 */
export const calculateSeverance = (formData) => {
  if (validateSeveranceInput(formData)) return null;

  const salary = parseFloat(formData.salary);
  const offer = parseFloat(formData.companyOffer);
  const admission = parseISODate(formData.admissionDate);
  const exit = parseISODate(formData.exitDate);
  const contractEnd = parseISODate(formData.contractEndDate);
  const rule = TERMINATION_RULES[formData.terminationReason] ?? TERMINATION_RULES.sem_justa_causa;

  const dailyRate = salary / 30;
  const details = [];
  const notes = [...rule.notes];

  /* --- Saldo de salário --------------------------------------------- */
  const startedThisMonth =
    admission.getFullYear() === exit.getFullYear() && admission.getMonth() === exit.getMonth();
  const diasTrabalhadosNoMes = exit.getDate() - (startedThisMonth ? admission.getDate() - 1 : 0);
  const saldoSalario = dailyRate * diasTrabalhadosNoMes;

  details.push({
    key: 'saldoSalario',
    label: 'Saldo de salário',
    value: saldoSalario,
    hint: `${diasTrabalhadosNoMes} ${diasTrabalhadosNoMes === 1 ? 'dia' : 'dias'} no mês da saída`,
  });

  /* --- Aviso prévio -------------------------------------------------- */
  // Lei 12.506/2011: 30 dias + 3 por ano completo, teto de 90.
  const avisoDiasDevidos = Math.min(90, 30 + fullYearsBetween(admission, exit) * 3);
  const empregadorIndeniza =
    formData.noticeType === 'indenizado' || formData.noticeType === 'dispensado';

  let avisoPrevio = 0;
  let diasProjetados = 0;

  if (rule.avisoDe === 'empregador' && empregadorIndeniza) {
    diasProjetados = avisoDiasDevidos;
    avisoPrevio = dailyRate * avisoDiasDevidos;
    details.push({
      key: 'avisoPrevio',
      label: 'Aviso prévio indenizado',
      value: avisoPrevio,
      hint: `${avisoDiasDevidos} dias (Lei 12.506/2011)`,
    });
    notes.push(
      'O aviso prévio indenizado projeta o contrato para todos os efeitos (art. 487, §1º da CLT; Súmula 371 do TST) — por isso os avos de 13º e de férias já incluem esse período.',
    );
  } else if (rule.avisoDe === 'metade' && empregadorIndeniza) {
    diasProjetados = Math.round(avisoDiasDevidos / 2);
    avisoPrevio = dailyRate * (avisoDiasDevidos / 2);
    details.push({
      key: 'avisoPrevio',
      label: 'Aviso prévio indenizado (metade)',
      value: avisoPrevio,
      hint: `${avisoDiasDevidos} dias pela metade (art. 484-A)`,
    });
  } else if (rule.avisoDe === 'empregado' && formData.noticeType === 'nao_cumprido') {
    // Art. 487, §2º: o empregador desconta os dias não trabalhados. O aviso
    // proporcional é benefício exclusivo do empregado, então o desconto é de 30 dias.
    avisoPrevio = -salary;
    details.push({
      key: 'avisoPrevio',
      label: 'Desconto de aviso prévio não cumprido',
      value: avisoPrevio,
      hint: '30 dias (art. 487, §2º)',
    });
  } else if (rule.avisoDe === 'empregador' && formData.noticeType === 'nao_cumprido') {
    notes.push(
      'Você marcou que o aviso prévio não foi cumprido. Como a dispensa partiu do empregador, o aviso não foi somado — se ele deixou de ser trabalhado por decisão da empresa, o correto é "indenizado" e o valor sobe.',
    );
  }

  // O aviso indenizado empurra o fim do contrato para frente, gerando mais avos.
  const dataProjetada = diasProjetados > 0 ? addDays(exit, diasProjetados) : exit;

  /* --- 13º proporcional ---------------------------------------------- */
  // A janela para no fim do ano da saída: se a projeção cruzar o ano, o 13º
  // daquele dezembro já teria sido pago. Fica conservador e avisa.
  const fimDoAnoDaSaida = new Date(exit.getFullYear(), 11, 31, 12, 0, 0);
  const fimJanela13 = dataProjetada > fimDoAnoDaSaida ? fimDoAnoDaSaida : dataProjetada;
  const inicioJanela13 =
    admission.getFullYear() === exit.getFullYear()
      ? admission
      : new Date(exit.getFullYear(), 0, 1, 12, 0, 0);

  let decimoTerceiro = 0;
  if (rule.decimoTerceiro) {
    const avos13 = avosDecimoTerceiro(inicioJanela13, fimJanela13);
    decimoTerceiro = (salary / 12) * avos13;
    details.push({
      key: 'decimoTerceiro',
      label: '13º salário proporcional',
      value: decimoTerceiro,
      hint: `${avos13}/12 avos`,
    });

    if (dataProjetada > fimDoAnoDaSaida) {
      notes.push(
        'A projeção do aviso prévio alcança o ano seguinte. Pode haver 13º proporcional adicional a apurar, não incluído aqui.',
      );
    }
  }

  /* --- Férias --------------------------------------------------------- */
  let feriasProporcionais = 0;
  if (rule.feriasProporcionais) {
    const periodoAquisitivo = vacationPeriodStart(admission, dataProjetada);
    const avosFer = avosFerias(periodoAquisitivo, dataProjetada);
    feriasProporcionais = (salary / 12) * avosFer * (4 / 3);
    details.push({
      key: 'feriasProporcionais',
      label: 'Férias proporcionais + 1/3',
      value: feriasProporcionais,
      hint: `${avosFer}/12 avos`,
    });
  }

  const feriasVencidas = formData.vacationOverdue ? salary * (4 / 3) : 0;
  if (feriasVencidas > 0) {
    details.push({
      key: 'feriasVencidas',
      label: 'Férias vencidas + 1/3',
      value: feriasVencidas,
      hint: 'período completo não gozado',
    });
  }

  /* --- Indenização do art. 479 ---------------------------------------- */
  let indenizacao479 = 0;
  if (rule.art479 && contractEnd && contractEnd > exit) {
    const diasRestantes = inclusiveDays(exit, contractEnd) - 1;
    indenizacao479 = dailyRate * diasRestantes * 0.5;
    details.push({
      key: 'indenizacao479',
      label: 'Indenização por rescisão antecipada',
      value: indenizacao479,
      hint: `metade de ${diasRestantes} dias restantes (art. 479)`,
    });
  }

  /* --- Multa do FGTS --------------------------------------------------- */
  let multaFGTS = 0;
  if (rule.multaFGTS > 0) {
    // Depósitos de 8% incidem também sobre o 13º — daí 13 salários por ano, não 12.
    const mesesContrato = Math.max(1, fullMonthsBetween(admission, dataProjetada));
    const baseFGTS = salary * 0.08 * mesesContrato * (13 / 12);
    multaFGTS = baseFGTS * rule.multaFGTS;

    details.push({
      key: 'multaFGTS',
      label: `Multa de ${Math.round(rule.multaFGTS * 100)}% do FGTS`,
      value: multaFGTS,
      hint: `estimativa sobre ${mesesContrato} ${mesesContrato === 1 ? 'mês' : 'meses'} de depósito`,
    });
    notes.push(
      'A multa do FGTS foi estimada a partir do seu salário atual. O valor real incide sobre todos os depósitos do contrato corrigidos — se o seu salário mudou ao longo dos anos, confira o extrato no app do FGTS. Saques anteriores não reduzem a base da multa.',
    );
  }

  const estimatedValue = details.reduce((total, item) => total + item.value, 0);

  return {
    estimatedValue,
    difference: estimatedValue - offer,
    details,
    notes,
    reasonLabel: rule.label,
  };
};
