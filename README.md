# LinkPro Property & Project Management

A premium, modular platform designed for **Property Owners, Developers, and Management Teams**. LinkPro orchestrates residential and commercial portfolios with surgical precision, overseeing everything from ground-breaking developments to in-house renovations and maintenance.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript, Sequelize (PostgreSQL).
- **Communication**: Redis (OTP/Cashing), Bull (Queues), Socket.io (Real-time).
- **Architecture**: ESM, Clean Path Aliases, API Versioning (v1), Transaction-safe entry.

## Key Features
- **Bespoke Landing Page**: A "Quiet Luxury" minimalist portal marketing platform values.
- **Side-by-Side Auth Flow**: High-end marketing content paired with minimalist forms for a boutique experience.
- **Atomic Registration**: Secure 7-step auth flow with database transactions and OTP verification.
- **Client-Locked Public Signup**: Public registration is exclusively for Property Owners, with Admin-controlled worker assignment.
- **In-House Management**: Explicit workflows for renovations and maintenance handled by the core team.

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis Server

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   cd server && npm install
   cd ../web && npm install
   ```
3. Configure `.env` in the `server` directory (see `.env.example`).
4. Run development servers:
   ```bash
   # Terminal 1
   cd server && npm run dev
   # Terminal 2
   cd web && npm run dev
   ```

## License
MIT
