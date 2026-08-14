# auditorCLT — NexumLab

Versão do auditorCLT alinhada ao sistema de design do site NexumLab.

## Rodar local

```bash
npm install
npm run dev      # http://localhost:3000
```

Build de produção:

```bash
npm run build    # gera dist/
npm run preview  # serve o dist/ localmente
```

Requer Node 20+ (ver `.nvmrc`).

## Deploy no Cloudflare Pages

Duas rotas.

**A) Arrastar a pasta (mais rápido, sem Git)**
1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Upload assets
2. Sobe a pasta `dist/` (já vem pronta neste zip)

**B) Conectado ao Git (recomendado — deploy automático a cada push)**

| Campo | Valor |
|---|---|
| Framework preset | None / Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `20` (variável de ambiente `NODE_VERSION`) |

Depois: Custom domains → `auditorclt.nexumlab.net.br` → o Cloudflare mostra o
CNAME para cadastrar no DNS da Hostinger.

`public/_redirects` e `public/_headers` já estão configurados (fallback de SPA,
cache imutável em `/assets/*`, headers de segurança).

## Sistema de design

Herdado do site NexumLab. Toda a fonte da verdade está em `src/index.css`.

| Token | Valor |
|---|---|
| Fundo | `#000000` |
| Card | `#080808` |
| Accent / destructive | `#A32A2A` |
| Texto secundário | `#8C8C8C` |
| Borda | `#1F1F1F` |
| Raio | `0.5rem` (cards `rounded-2xl`, botões `rounded-none`) |
| Display / prosa | Outfit |
| Sistema / dados | JetBrains Mono (`.font-mono-sys`) |

### Utilities compartilhadas com o NexumLab

`glow-red` · `glow-red-hover` · `glow-card-hover` · `text-glow-red` ·
`glass-morphism` · `gradient-border` · `pulse-glow` · `shimmer` · `grid-overlay`

### Utilities próprias do auditorCLT

`lab-card` · `lab-card-alert` · `terminal-input` · `terminal-select` ·
`field-with-icon` · `btn-primary-solid` · `btn-ghost-outline` ·
`scanlines` · `scan-sweep` · `caret`

> **Atenção ao mexer no CSS:** as utilities customizadas são compiladas *depois*
> das do Tailwind. Combinar `terminal-input` com `pl-12` não funciona — a classe
> base vence. Use os modificadores (`field-with-icon`, `lab-card-alert`), que
> estão declarados depois das classes base de propósito.

## Estrutura

```
src/
├── App.jsx                      # shell + <Helmet> + <Toaster>
├── index.css                    # ← sistema de design inteiro
├── components/
│   ├── Header.jsx               # fixo, glass no scroll
│   ├── HeroSection.jsx
│   ├── NetworkBackground.jsx    # assinatura visual herdada do NexumLab
│   ├── SectionMarker.jsx        # padrão "> [SLUG] TÍTULO"
│   ├── SystemMetrics.jsx
│   ├── AuditTerminal.jsx        # ← núcleo: cálculo CLT + minuta
│   ├── EducationalContent.jsx
│   ├── Footer.jsx
│   ├── StickyCTA.jsx            # CTA fixo, só mobile
│   └── ui/                      # shadcn/ui (não editar à mão)
├── constants/appConstants.js    # links, métricas, templates de mensagem
├── hooks/useCarousel.js
└── lib/
    ├── motion.js                # variantes de animação
    └── utils.js                 # cn()
```

## Onde mexer no conteúdo

| O quê | Arquivo |
|---|---|
| Links (CredLiber, Pix, NexumLab) | `src/constants/appConstants.js` |
| Contador e depoimentos | `src/constants/appConstants.js` |
| Textos das 3 minutas | `src/constants/appConstants.js` |
| Headline do hero | `src/components/HeroSection.jsx` |
| Perguntas do guia CLT | `src/components/EducationalContent.jsx` |
| Aviso legal | `src/components/Footer.jsx` |
| Fórmulas da rescisão | `src/components/AuditTerminal.jsx` → `calculateSeverance` |

## Pendências conhecidas

- **Headline diz "MANDE A I.A. COBRAR"**, mas o motor é determinístico
  (fórmulas da CLT + templates de texto). O rodapé e as metas já foram
  corrigidos; o headline foi mantido de propósito, é decisão comercial.
- **Contador "3.247 auditorias" é fixo** em `appConstants.js`.
- ~~Logos vêm do i.ibb.co.~~ Resolvido: os PNGs estão em `public/` e são
  servidos pelo próprio domínio. O `<BrandLogo>` cai para o espelho no imgbb
  (conta `nexum-lab`) se o arquivo local não carregar. Ao trocar um logo,
  atualizar os dois lados — o arquivo local e a imagem na conta.
