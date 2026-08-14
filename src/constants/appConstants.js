/**
 * Application Constants
 * Contains all magic strings, URLs, and shared configuration values.
 */

export const ASSETS = {
  /** Origem primária: arquivos em `public/`, servidos pelo próprio domínio. */
  LOGOS: {
    NEXUMLAB: '/logo-nexumlab.png',
    AUDITOR_CLT: '/logo-auditorclt.png',
  },
  /**
   * Espelho na conta imgbb `nexum-lab` (nexum-lab.imgbb.com), usado por
   * <BrandLogo> quando o arquivo local não carrega. Não trocar por links de
   * outra conta: a anterior ficou sem acesso e essas imagens não podem mais
   * ser substituídas nem recuperadas de lá.
   */
  LOGOS_FALLBACK: {
    NEXUMLAB: 'https://i.ibb.co/kVXjWXtv/logo-nexumlab-completa-removebg-preview.png',
    AUDITOR_CLT: 'https://i.ibb.co/zWy7yCYg/logo-auditorclt-no-BG.png',
  },
};

export const LINKS = {
  CREDLIBER_PORTAL: 'https://portal.credliber.com.br/credit/auditorcltu30',
  CAREER_KIT_PIX: 'https://bit.ly/4f5rPE4',
  NEXUMLAB_SITE: 'https://nexumlab.net.br',
};

export const METRICS = {
  CAROUSEL_INTERVAL_MS: 5000,
};

/** Verbas efetivamente calculadas por calculateSeverance(). */
export const VERBAS_CALCULADAS = [
  'Saldo de salário',
  'Aviso prévio indenizado',
  '13º salário proporcional',
  'Férias proporcionais + 1/3',
  'Férias vencidas + 1/3',
  'Multa do FGTS (40% ou 20%)',
  'Indenização por rescisão antecipada',
];

export const SYSTEM_METRICS_LOGS = [
  {
    id: "PRIVACIDADE",
    text: "O cálculo roda inteiramente no seu navegador. Nada do que você digita é enviado para servidores, gravado em banco de dados ou compartilhado."
  },
  {
    id: "BASE_LEGAL",
    text: "As fórmulas seguem as regras gerais da CLT para verbas rescisórias, incluindo o aviso prévio proporcional da Lei 12.506/2011."
  },
  {
    id: "ESCOPO",
    text: "O resultado é uma estimativa. Convenções coletivas, acordos individuais e adicionais da sua categoria podem alterar os valores devidos."
  }
];

export const MESSAGE_TEMPLATES = {
  professional: (data, calc) => `Prezado(a) ${data.managerName},\n\nSou ${data.userName} e realizei uma auditoria preliminar das minhas verbas rescisórias referente ao período de ${new Date(data.admissionDate + 'T12:00:00').toLocaleDateString('pt-BR')} a ${new Date(data.exitDate + 'T12:00:00').toLocaleDateString('pt-BR')}. \n\nCom base nos cálculos CLT (considerando ${calc.reasonLabel.toLowerCase()}), o valor estimado seria de R$ ${calc.estimatedValue.toFixed(2)}, porém a oferta apresentada foi de R$ ${data.companyOffer}. Existe uma diferença aproximada de R$ ${calc.difference.toFixed(2)}.\n\nGostaria de agendar uma reunião para revermos estes valores amigavelmente e procedermos com a correção.\n\nAtenciosamente,\n${data.userName}`,
  
  firm: (data, calc) => `Notificação Extrajudicial\n\nÀ atenção de ${data.managerName},\n\nEu, ${data.userName}, identifiquei inconsistências graves no cálculo da minha rescisão contratual (${calc.reasonLabel.toLowerCase()}). O valor correto, calculado conforme a legislação vigente, é de aproximadamente R$ ${calc.estimatedValue.toFixed(2)}, e não R$ ${data.companyOffer} como oferecido.\n\nA diferença apurada é de R$ ${calc.difference.toFixed(2)}. Solicito a retificação imediata dos valores para evitarmos medidas judiciais cabíveis.\n\nAguardo retorno em até 24 horas.\n${data.userName}`,
  
  aggressive: (data, calc) => `URGENTE: ERRO NO PAGAMENTO\n\nAtenção ${data.managerName} (RH/Financeiro),\n\nEu, ${data.userName}, detectei na minha auditoria um erro inaceitável nas verbas rescisórias. Vocês estão pagando R$ ${calc.difference.toFixed(2)} A MENOS do que manda a lei para casos de ${calc.reasonLabel.toLowerCase()}. \n\nValor correto: R$ ${calc.estimatedValue.toFixed(2)}\nValor oferecido: R$ ${data.companyOffer}\n\nExijo o pagamento integral da diferença imediatamente. Caso contrário, acionarei meu advogado para cobrar não apenas o valor devido, mas também a multa do Art. 477 da CLT e danos morais.\n\nAguardo confirmação de pagamento.\n${data.userName}`
};

export const INITIAL_FORM_STATE = {
  managerName: '',
  userName: '',
  salary: '',
  admissionDate: '',
  exitDate: '',
  contractEndDate: '',
  vacationOverdue: false,
  noticeType: 'trabalhado',
  terminationReason: 'sem_justa_causa',
  companyOffer: '',
  tone: 'professional'
};
