# auditorCLT — NexumLab

Versão do auditorCLT alinhada ao sistema de design do site NexumLab.

## Status atual (24/08/2026, 01:04 — última verificação real)

**No ar e funcionando:** https://auditorclt.nexumlab.net.br — Cloudflare Pages,
HTTPS válido até 22/11/2026, conteúdo conferido (título, HTML, headers
`server: cloudflare`). Não é suposição, foi testado com `curl` e no navegador.

O que já aconteceu, pra não repetir:
- Deploy conectado ao GitHub (`guileonan/AuditorCLT`, branch `main`) — push novo já dispara build automático no Cloudflare
- Domínio `auditorclt.nexumlab.net.br` migrado da Hostinger pro Cloudflare Pages: o site antigo foi **removido** do hPanel da Hostinger, e um CNAME (`auditorclt` → `auditorclt.pages.dev`) foi criado na zona DNS de `nexumlab.net.br`, que continua na Hostinger
- `nexumlab.net.br` (raiz — site institucional) **não foi mexido** e continua na Hostinger de propósito — ver "O que falta" abaixo

**⚠️ Pendência imediata:** existe 1 commit local (`ae5ee88` — zera vulnerabilidades do npm audit, corrige toast e parallax, testes 29/29 passando) que **ainda não foi enviado pro GitHub**. Rodar `git push` antes de qualquer coisa nova — sem isso o deploy em produção está uma versão atrás do que está no disco.

## O que falta (fora deste projeto)

O site **institucional** da NexumLab (`nexumlab.net.br`, raiz — diferente deste
app) ainda está no Horizons/Hostinger, não migrado. Motivo: o formulário de
lista de espera usa PocketBase com endpoint `/hcgi/platform`, que é **interno
da Hostinger Horizons** e não existe fora dali — migrar sem resolver isso
quebra o formulário silenciosamente. Fica pra quando alguém decidir o destino
do formulário (Formspree, Google Forms, ou self-host do PocketBase). Isso é
um projeto separado, não uma tarefa deste repositório.

Contexto mais completo (por quê, decisões, histórico) em
`~/Documents/segundo-cerebro/02-projetos/auditorclt.md`.

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

Domínio customizado já configurado (ver "Status atual" no topo deste
arquivo) — não precisa refazer. Se um dia precisar recriar do zero: Custom
domains → `auditorclt.nexumlab.net.br` → o Cloudflare mostra o CNAME pra
cadastrar no DNS de onde o domínio estiver.

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
