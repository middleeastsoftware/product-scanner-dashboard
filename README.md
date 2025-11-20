# Product Scanner Dashboard

A modern, elegant dashboard for monitoring Shopify product inventory and submissions, built with React, TypeScript, GraphQL, and shadcn/ui.

## Features

- **Real-time Metrics**: View total products, success rates, failed submissions, and vendor statistics
- **Visual Analytics**: Interactive charts showing product type distribution and growth trends
- **Recent Activity**: Monitor the latest products added to your inventory
- **GraphQL API**: Efficient data fetching with GraphQL
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS v4
- **Type-Safe**: Full TypeScript support throughout the application

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Data Fetching**: TanStack Query (React Query) + graphql-request
- **Charts**: Recharts
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ or pnpm
- Running Product Scanner API (Go backend)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment (Optional)

For development, the app uses Vite proxy to connect to the production API at `https://api.middleeastsoftware.com`.

**No .env file needed for development!** The proxy is pre-configured.

For production builds, create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=https://api.middleeastsoftware.com
```

### 3. Start Development Server

```bash
pnpm dev
```

The dashboard will be available at `http://localhost:3000`

### 4. Build for Production

```bash
pnpm build
```

The optimized build will be in the `dist/` directory.

## Project Structure

```
product-scanner-dashboard/
├── src/
│   ├── components/
│   │   └── ui/           # shadcn/ui components
│   │       └── card.tsx
│   ├── lib/
│   │   ├── graphql-client.ts  # GraphQL client and queries
│   │   └── utils.ts           # Utility functions
│   ├── pages/
│   │   └── Dashboard.tsx      # Main dashboard page
│   ├── types/
│   │   └── dashboard.ts       # TypeScript type definitions
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── public/
├── .env.example
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Available GraphQL Queries

The dashboard uses the following GraphQL queries:

- `dashboardMetrics` - Overall statistics and metrics
- `recentProducts` - Latest products added
- `productStats` - Product type distribution
- `vendorStats` - Top vendors by product count
- `recentActivity` - Recent submission activity
- `submissionStats` - Submission success/failure statistics

## API Integration

The dashboard connects to the Product Scanner API GraphQL endpoint via Vite proxy:

**Development:**
- Local URL: `http://localhost:3000/barcode-scanner/api/v1/graphql`
- Proxied to: `https://api.middleeastsoftware.com/barcode-scanner/api/v1/graphql`

**Production:**
- Direct URL: `https://api.middleeastsoftware.com/barcode-scanner/api/v1/graphql`

## Development

### GraphQL Playground

Access the GraphQL playground directly at:

```
https://api.middleeastsoftware.com/barcode-scanner/api/v1/graphql
```

Test queries interactively with GraphiQL interface.

### Hot Module Replacement

Vite provides instant HMR for a great development experience. Changes to your code will be reflected immediately in the browser.

### Type Safety

All API responses are fully typed with TypeScript interfaces in `src/types/dashboard.ts`.

## License

Proprietary - Middle East Software
