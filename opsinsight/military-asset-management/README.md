# Military Asset Management System

## Project Overview

A full-stack Military Asset Management System designed to manage and track military assets across different bases.

The system provides functionality for monitoring asset balances, recording purchases, transferring assets between bases, assigning assets to personnel, and recording asset expenditures.

## Technology Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM

### Database
- PostgreSQL

## Project Structure

```text
military-asset-management/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── ...
│
├── server/
│   ├── src/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
│
├── database/
│   └── ...
│
├── README.md
└── .gitignore
