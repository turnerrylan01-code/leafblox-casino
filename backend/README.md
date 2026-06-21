# Leaf Blox Backend API

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env .env.local
```
Edit `.env.local` with your database credentials:
```
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/leafblox?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with wallet address
- `POST /api/auth/register` - Register new user (admin setup)
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id/status` - Update user status
- `POST /api/users/:id/notes` - Add internal note
- `POST /api/users/:id/logout` - Force logout

### Chat Moderation
- `POST /api/chat/mute` - Mute user
- `DELETE /api/chat/mute/:userId` - Unmute user
- `GET /api/chat/mutes` - Get active mutes
- `POST /api/chat/clear` - Clear chat

### Bans
- `POST /api/bans` - Create ban
- `GET /api/bans` - Get all bans
- `DELETE /api/bans/:id` - Lift ban

### Promotions
- `POST /api/promotions` - Create promo code
- `GET /api/promotions` - Get all promo codes
- `PATCH /api/promotions/:id` - Update promo code
- `PATCH /api/promotions/:id/disable` - Disable promo code

### Games
- `GET /api/games` - Get all games
- `PATCH /api/games/:id` - Update game settings
- `PATCH /api/games/:id/toggle` - Toggle game enabled status

### Support Tickets
- `GET /api/support` - Get all tickets
- `GET /api/support/:id` - Get ticket by ID
- `POST /api/support/:id/messages` - Add message to ticket
- `PATCH /api/support/:id/status` - Update ticket status

### Staff Management
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Add staff member
- `PATCH /api/staff/:id` - Update staff role
- `DELETE /api/staff/:id` - Remove staff member

### Level System
- `GET /api/levels` - Get all levels
- `POST /api/levels` - Create level
- `PATCH /api/levels/:id` - Update level
- `DELETE /api/levels/:id` - Delete level

### Settings
- `GET /api/settings` - Get system settings
- `PATCH /api/settings` - Update system settings

### Audit Logs
- `GET /api/audit` - Get audit logs (with optional filters)

## Database Management

### View database in Prisma Studio:
```bash
npm run prisma:studio
```

### Create a new migration:
```bash
npm run prisma:migrate
```

### Regenerate Prisma client:
```bash
npm run prisma:generate
```

## Production Deployment

1. Build the backend:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

Make sure to set environment variables in your production environment.
