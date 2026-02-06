# TeleDash - Telecom Agent Dashboard SaaS

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js 15">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
</p>

<p align="center">
  <strong>Support at the speed of now.</strong>
</p>

TeleDash is a powerful, multi-tenant SaaS platform designed specifically for telecom companies in Ghana (Telecel Ghana, MTN Ghana, AirtelTigo/Africa). It provides a unified, real-time agent dashboard that enables seamless tracking of customer interactions, intelligent call routing, ML-driven churn prediction, automated billing reconciliation, and mobile money integrations.

## Features

### Core Features
- **Real-time Interaction Dashboard** - Live tracking of calls, SMS, tickets, and customer history
- **Intelligent Call/SMS Routing** - Rules engine to reduce random forwarding frustration
- **Churn Prediction Module** - Simple ML models to score customers and alert agents
- **Automated Billing Reconciliation** - Import/export tools with discrepancy detection
- **Mobile Money Integrations** - MTN MoMo, Telecel Cash, AirtelTigo Money APIs
- **Agent Performance Analytics** - Unified KPIs, leaderboards, and call quality scoring
- **Network Issue Prediction** - Ingest complaint data and predict hotspots
- **Compliance Tools** - Ghana Data Protection Act compliance with audit logs

### Technical Features
- **Multi-tenant Architecture** - Strict row-level isolation per organization
- **Role-based Access Control** - Owner, Admin, Supervisor, Agent, Viewer roles
- **Authentication** - Email/password + OAuth (Google, GitHub)
- **Billing & Subscriptions** - Stripe integration with free tier and paid plans
- **Background Jobs** - BullMQ + Redis for async processing
- **Audit Logging** - Complete activity tracking for compliance
- **API Rate Limiting** - Per-user and per-organization limits

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js v5
- **Queue**: BullMQ + Redis
- **Payments**: Stripe
- **Charts**: Recharts
- **Animations**: GSAP + Framer Motion

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/teledash.git
cd teledash
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/teledash"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"

# OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Redis
REDIS_URL="redis://localhost:6379"

# Stripe (optional)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

4. **Set up the database**
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database
npm run db:seed
```

5. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Demo Credentials

After seeding, you can log in with:

- **Admin**: `admin@teledash.io` / `admin123`
- **Agents**: `amara.kwame@telecel.com.gh` / `agent123`

## Project Structure

```
teledash/
├── prisma/                 # Database schema and migrations
│   ├── schema.prisma      # Prisma schema
│   └── seed.ts            # Database seed script
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Landing page
│   ├── components/        # React components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── landing/       # Landing page sections
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Utility functions
│   │   ├── auth.ts        # Authentication config
│   │   ├── db.ts          # Database client
│   │   └── utils.ts       # Helper functions
│   ├── types/             # TypeScript types
│   └── workers/           # Background job workers
├── public/                # Static assets
├── tests/                 # Test files
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Database Schema

The database uses PostgreSQL with Prisma ORM. Key entities include:

- **User** - Platform users (agents, supervisors, admins)
- **Organization** - Multi-tenant isolation
- **OrganizationMember** - User-organization relationships with roles
- **Customer** - Telecom customers
- **Interaction** - Calls, SMS, and other interactions
- **Ticket** - Support tickets
- **Transaction** - Payments and top-ups
- **ChurnPrediction** - ML-generated churn predictions
- **NetworkAlert** - Network issue alerts
- **Workflow** - Automation workflows
- **ActivityLog** - Audit trail for compliance

## API Routes

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/churn/predictions` - Churn risk predictions
- `GET /api/activity/recent` - Recent activity feed
- `GET /api/analytics/performance` - Performance metrics
- `GET /api/metrics/live` - Real-time metrics

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

## Development

### Running Tests
```bash
npm test
```

### Code Formatting
```bash
npm run format
```

### Type Checking
```bash
npm run type-check
```

### Database Management
```bash
# Open Prisma Studio
npm run db:studio

# Create a new migration
npm run db:migrate

# Reset database
npx prisma migrate reset
```

## Deployment

### Docker Deployment

1. **Build the Docker image**
```bash
docker build -t teledash .
```

2. **Run with Docker Compose**
```bash
docker-compose up -d
```

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables for Production

```env
# Required
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
REDIS_URL=

# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Stripe (optional)
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Mobile Money APIs (optional)
MTN_MOMO_BASE_URL=
MTN_MOMO_PRIMARY_KEY=
TELECEL_CASH_API_KEY=
AIRTELTIGO_MONEY_CLIENT_ID=

# Security
ENCRYPTION_KEY=
JWT_SECRET=
```

## Mobile Money Integration

TeleDash supports Ghana's major mobile money providers:

### MTN MoMo
```typescript
// Initialize payment
const payment = await initiateMomoPayment({
  phoneNumber: '233241234567',
  amount: 50.00,
  currency: 'GHS',
  description: 'Data bundle purchase'
});
```

### Telecel Cash
```typescript
const payment = await initiateTelecelPayment({
  phoneNumber: '233501234567',
  amount: 100.00,
  currency: 'GHS'
});
```

### AirtelTigo Money
```typescript
const payment = await initiateAirtelTigoPayment({
  phoneNumber: '233271234567',
  amount: 75.00,
  currency: 'GHS'
});
```

## Churn Prediction

The churn prediction module uses a simple ML model trained on:
- Customer usage patterns
- Support ticket frequency
- Payment history
- Account age

```typescript
// Get churn predictions
const predictions = await getChurnPredictions({
  organizationId: 'org-id',
  minRiskScore: 70
});
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@teledash.io or join our Slack channel.

## Roadmap

- [ ] Advanced ML churn models
- [ ] Voice call integration
- [ ] WhatsApp Business API
- [ ] Advanced workflow builder
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboards

## Acknowledgments

- Built for telecom companies in Ghana
- Inspired by the need for better customer support tools
- Thanks to all contributors and early adopters

---

<p align="center">
  Made with ❤️ in Ghana
</p>
