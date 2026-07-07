# 🏗️ FicoBridge

**Plateforme intelligente de suivi de recherche d'alternance**

> Le pont entre votre potentiel et votre alternance

---

## 🚀 Démarrage rapide

```bash
# 1. Cloner et installer
cd ficobridge
npm run setup

# 2. Configurer l'environnement
cp apps/api/.env.example apps/api/.env
# Éditer apps/api/.env avec vos credentials PostgreSQL et SMTP

# 3. Lancer
npm run dev
```

- **Frontend** : http://localhost:5173
- **API** : http://localhost:4000
- **Prisma Studio** : `npm run db:studio`

---

## 🔐 Identifiants de test

| Champ | Valeur |
|-------|--------|
| Email | `fico@example.com` |
| Mot de passe | `FicoBridge2024!` |
| Code 2FA | Envoyé par email (mock) |

---

## 🏛️ Architecture

```
ficobridge/
├── apps/
│   ├── api/              # Backend Node.js/Express/Prisma
│   │   ├── src/
│   │   │   ├── index.ts          # Serveur Express
│   │   │   ├── routes/           # API REST
│   │   │   │   ├── auth.ts       # Auth JWT + 2FA
│   │   │   │   ├── applications.ts
│   │   │   │   ├── dashboard.ts
│   │   │   │   ├── ai.ts
│   │   │   │   ├── calendar.ts
│   │   │   │   ├── notifications.ts
│   │   │   │   ├── documents.ts
│   │   │   │   └── security.ts
│   │   │   ├── middleware/       # Auth, Error handling
│   │   │   │   ├── auth.ts
│   │   │   │   └── errorHandler.ts
│   │   │   ├── services/         # Email
│   │   │   └── utils/            # Logger
│   │   └── prisma/
│   │       ├── schema.prisma     # Schéma PostgreSQL
│   │       └── seed.ts           # Données de test
│   │
│   └── web/              # Frontend React/TypeScript
│       ├── src/
│       │   ├── components/
│       │   │   ├── 3d/           # CityscapeBackground (Three.js)
│       │   │   ├── layout/       # Sidebar, TopBar, Layout
│       │   │   └── dashboard/    # StatCard, Charts, AIInsights
│       │   ├── pages/            # Dashboard, Login, Applications
│       │   ├── store/            # Zustand auth store
│       │   ├── hooks/            # useApi (Axios)
│       │   ├── lib/              # Utils (cn, tailwind)
│       │   └── styles/           # Tailwind CSS
│       └── index.html
│
├── package.json          # Workspace npm
└── README.md
```

---

## 🔒 Sécurité

| Mesure | Implémentation |
|--------|---------------|
| Authentification | JWT + Refresh tokens |
| 2FA | Codes 6 chiffres par email (5 min, 3 tentatives max) |
| Mots de passe | bcrypt 12 rounds, regex complexe |
| Rate limiting | 100 req/15min global, 5 login/15min |
| Headers | Helmet (CSP, HSTS, X-Frame-Options) |
| CORS | Origine contrôlée |
| SQL Injection | Prisma ORM (paramétré) |
| XSS | React échappement automatique |
| CSRF | Cookie-parser + SameSite |
| Logs | Winston (accès + erreurs) |
| Verrouillage | Compte bloqué après 5 échecs |

---

## 🛠️ Technologies

**Frontend**
- React 18 + TypeScript
- Tailwind CSS + Glassmorphism
- Three.js / React Three Fiber (arrière-plan 3D)
- Framer Motion (animations)
- Recharts (graphiques)
- Zustand (state management)
- TanStack Query (data fetching)
- Radix UI (composants headless)
- Lucide React (icônes)

**Backend**
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT + bcrypt + speakeasy (2FA)
- Nodemailer (email)
- Winston (logging)
- Helmet + Rate Limit (sécurité)

---

## 📝 License

MIT © FicoBridge
