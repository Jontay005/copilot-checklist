# Copilot Readiness Checklist

A simple web application to help government agencies prepare for Copilot adoption.

## Features

- Agency management (create and track multiple agencies)
- Interactive checklist with 9 preparation items
- Progress tracking for each agency
- Clean, responsive UI

## Local Development

### Prerequisites
- Docker and Docker Compose installed
- Git

### Quick Start

1. Clone the repository
2. Navigate to the project directory
3. Run Docker Compose:

```bash
docker-compose up
```

This will:
- Start PostgreSQL database
- Initialize the schema with sample checklist items
- Start the Node.js backend on port 3001
- Start the React frontend on port 3000

4. Open http://localhost:3000 in your browser

### Manual Setup (without Docker)

**Backend:**
```bash
cd backend
npm install
# Update .env with your database credentials
node server.js
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

**Database:**
```bash
psql -U postgres -h localhost
\i backend/init.sql
```

## Building Docker Images

### Backend Image
```bash
cd backend
docker build -t harbor.company.com/project/copilot-checklist-backend:v1 .
docker push harbor.company.com/project/copilot-checklist-backend:v1
```

### Frontend Image
```bash
cd frontend
docker build -t harbor.company.com/project/copilot-checklist-frontend:v1 .
docker push harbor.company.com/project/copilot-checklist-frontend:v1
```

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 3001)
- `DB_USER`: PostgreSQL user
- `DB_PASSWORD`: PostgreSQL password
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:3001)

## API Endpoints

- `GET /health` - Health check
- `GET /api/agencies` - List all agencies with progress
- `POST /api/agencies` - Create new agency
- `GET /api/checklist` - Get all checklist items
- `GET /api/agencies/:id` - Get agency with progress
- `PUT /api/agencies/:agencyId/progress/:itemId` - Update checklist item

## Deployment

See Helm chart for Kubernetes deployment configuration.

## Tech Stack

- **Frontend**: React 18, CSS3
- **Backend**: Node.js, Express, PostgreSQL
- **Containerization**: Docker, Kubernetes
- **Registry**: Harbor

## Next Steps

- Add authentication
- Add admin panel for checklist management
- Add email notifications
- Add reporting/analytics
