
# Enterprise-Grade Admin Dashboard

A production-ready, enterprise-grade admin dashboard with full-stack architecture, including frontend, backend, and database, with professional security, scalability, and clean UI/UX.

## Features

- **Full-stack architecture** with clear separation of concerns
- **Modern frontend** with React/Next.js, TypeScript, and Tailwind CSS
- **Secure backend** with Node.js/Express, JWT authentication, and PostgreSQL
- **Role-based access control** (RBAC) with admin, manager, and user roles
- **Enterprise-level UI** with responsive design and professional UX
- **Security features** including helmet, rate limiting, and input validation
- **Docker support** for easy deployment
- **Production-ready** configuration

## Tech Stack

### Backend
- Node.js with Express.js
- TypeScript
- PostgreSQL database
- JWT authentication
- Bcrypt for password hashing
- Sequelize ORM
- Helmet for security headers
- Rate limiting for DDoS protection

### Frontend
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- React Icons
- Axios for API calls

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Docker (optional, for containerized deployment)

### Installation

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on the example:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=admin_dashboard
DB_USER=admin_user
DB_PASSWORD=admin_password
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
```

4. Run database migrations:
```bash
npm run migrate
```

5. Start the backend server:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Docker Deployment

For production deployment, you can use Docker Compose:

1. Make sure you're in the root directory
2. Run the following command:
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Database: `http://localhost:5432`

To stop the services:
```bash
docker-compose down
```

## Security Features

- JWT token-based authentication with expiration
- Password hashing with bcrypt
- Input validation and sanitization
- Helmet.js security headers
- Rate limiting to prevent DDoS attacks
- CORS configuration
- Role-based access control
- SQL injection prevention through ORM

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Users (requires authentication)
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user (admin only)

### Business Entities (requires authentication)
- `GET /api/business` - Get all business entities
- `GET /api/business/:id` - Get business entity by ID
- `POST /api/business` - Create business entity
- `PUT /api/business/:id` - Update business entity
- `DELETE /api/business/:id` - Delete business entity

## Environment Variables

### Backend (.env)
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRES_IN` - JWT expiration time (default: 24h)
- `CORS_ORIGIN` - Allowed origin for CORS (default: http://localhost:3000)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Production Deployment

For production deployment:

1. Update environment variables with production values
2. Build the frontend: `npm run build`
3. Use the provided Docker configuration for containerized deployment
4. Set up a reverse proxy (like Nginx) for SSL termination
5. Configure proper logging and monitoring

## Default Credentials

After running migrations, a default admin user is created:
- Email: `admin@example.com`
- Password: `Admin123!`

## Project Structure

```
Admin Dashboard/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Authentication and error handling
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── server.ts        # Main server file
├── frontend/
│   ├── app/            # Next.js app router pages
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts
│   ├── services/       # API service functions
│   └── ...             # Other Next.js files
├── docker-compose.yml  # Docker configuration
└── Dockerfiles         # Container configurations
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
بص كده ي معلم علي شرح المشروع ده انا المشروع معايا ومش عارف اشغله اصلا ازاي هههههههههههه