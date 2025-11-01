# BloodLeague - Deployment Guide

## Local Development with Docker

### Prerequisites
- Docker
- Docker Compose

### Running Locally
1. Clone the repository
```bash
git clone <repository-url>
cd BloodLeague
```

2. Start the application stack
```bash
docker-compose up --build
```

The services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5432

## Deployment to Render

### Prerequisites
- A Render account
- Git repository connected to Render

### Deployment Steps

1. Log in to your Render dashboard (https://dashboard.render.com)

2. Create a new "Blueprint Instance":
   - Click "New +"
   - Select "Blueprint"
   - Connect your repository
   - Select the repository
   - Click "Connect"

3. Render will automatically:
   - Create a PostgreSQL database
   - Deploy the backend service
   - Deploy the frontend service

4. The deployment will take a few minutes. Once complete, you can access:
   - Frontend: https://bloodleague-frontend.onrender.com
   - Backend: https://bloodleague-backend.onrender.com

### Environment Variables
The following environment variables are configured automatically by Render:
- Backend:
  - `SPRING_PROFILES_ACTIVE`
  - `SPRING_DATASOURCE_URL`
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`
- Frontend:
  - `NEXT_PUBLIC_API_URL`

## Troubleshooting

### Local Development
- Database issues: Check PostgreSQL logs
```bash
docker-compose logs postgres
```

- Backend issues: Check Spring Boot logs
```bash
docker-compose logs backend
```

- Frontend issues: Check Next.js logs
```bash
docker-compose logs frontend
```

### Render Deployment
- Check the deployment logs in your Render dashboard
- Verify environment variables are set correctly
- Check the service health checks
- Review the PostgreSQL connection string format

## Maintenance

### Updating the Application
1. Push changes to your repository
2. Render will automatically rebuild and deploy

### Database Backups
Render automatically manages PostgreSQL backups for paid plans.

### Monitoring
Use the Render dashboard to monitor:
- Service status
- Resource usage
- Logs
- Deployment history