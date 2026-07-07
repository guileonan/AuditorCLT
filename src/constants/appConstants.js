/**
 * Application Constants
 * Contains all magic strings, URLs, and shared configuration values.
 */

export const ASSETS = {
  LOGOS: {
    NEXUMLAB: 'https://i.ibb.co/hRSZQh9c/logo-nexumlab-png.png',
    AUDITOR_CLT: 'https://i.ibb.co/fGysJ3x9/logo-auditorclt-png.png',
  },
};

export const LINKS = {
  CREDLIBER_PORTAL: 'https://portal.credliber.com.br/credit/auditorcltu30',
  INFOPRODUTO_CHECKOUT: 'https://pay.kiwify.com.br/kit-curriculo-perfeito',
};

export const METRICS = {
  TOTAL_AUDITS: '3.247',
  CAROUSEL_INTERVAL_MS: 5000,
};

export const SYSTEM_METRICS_LOGS = [
  {
    id: "849",
    text: "Marcos S. (Ex-Balconista): Diferença encontrada em horas extras. Erro corrigido amigavelmente com a empresa graças ao relatório."
  },
  {
    id: "122",
    text: "Ana C. (Ex-Assistente): Verbas rescisórias recalculadas com precisão. O saldo do FGTS foi antecipado logo em seguida para quitação de contas."
  },
  {
    id: "904",
    text: "Carlos E. (Ex-Operador): Auditoria direta, limpa e sem burocracia. Me deu a certeza dos meus valores reais."
  }
];

export const MESSAGE_TEMPLATES = {
  professional: (data, calc) => `Prezado(a) ${data.managerName},\n\nSou ${data.userName} e realizei uma auditoria preliminar das minhas verbas rescisórias referente ao período de ${new Date(data.admissionDate + 'T12:00:00').toLocaleDateString('pt-BR')} a ${new Date(data.exitDate + 'T12:00:00').toLocaleDateString('pt-BR')}. \n\nCom base nos cálculos CLT (considerando ${data.terminationReason.replace(/_/g, ' ')}), o valor estimado seria de R$ ${calc.estimatedValue.toFixed(2)}, porém a oferta apresentada foi de R$ ${data.companyOffer}. Existe uma diferença aproximada de R$ ${calc.difference.toFixed(2)}.\n\nGostaria de agendar uma reunião para revermos estes valores amigavelmente e procedermos com a correção.\n\nAtenciosamente,\n${data.userName}`,
  
  firm: (data, calc) => `Notificação Extrajudicial\n\nÀ atenção de ${data.managerName},\n\nEu, ${data.userName}, identifiquei inconsistências graves no cálculo da minha rescisão contratual (${data.terminationReason.replace(/_/g, ' ')}). O valor correto, calculado conforme a legislação vigente, é de aproximadamente R$ ${calc.estimatedValue.toFixed(2)}, e não R$ ${data.companyOffer} como oferecido.\n\nA diferença apurada é de R$ ${calc.difference.toFixed(2)}. Solicito a retificação imediata dos valores para evitarmos medidas judiciais cabíveis.\n\nAguardo retorno em até 24 horas.\n${data.userName}`,
  
  aggressive: (data, calc) => `URGENTE: ERRO NO PAGAMENTO\n\nAtenção ${data.managerName} (RH/Financeiro),\n\nEu, ${data.userName}, detectei na minha auditoria um erro inaceitável nas verbas rescisórias. Vocês estão pagando R$ ${calc.difference.toFixed(2)} A MENOS do que manda a lei para casos de ${data.terminationReason.replace(/_/g, ' ')}. \n\nValor correto: R$ ${calc.estimatedValue.toFixed(2)}\nValor oferecido: R$ ${data.companyOffer}\n\nExijo o pagamento integral da diferença imediatamente. Caso contrário, acionarei meu advogado para cobrar não apenas o valor devido, mas também a multa do Art. 477 da CLT e danos morais.\n\nAguardo confirmação de pagamento.\n${data.userName}`
};

export const INITIAL_FORM_STATE = {
  managerName: '',
  userName: '',
  salary: '',
  admissionDate: '',
  exitDate: '',
  vacationOverdue: false,
  noticeType: 'trabalhado',
  terminationReason: 'sem_justa_causa',
  companyOffer: '',
  tone: 'professional'
};
