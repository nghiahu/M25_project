# Post-Deployment Guide

## What Happens After `git push`?

When you push code to the `master` branch, GitHub Actions automatically triggers the CI/CD pipeline defined in `.github/workflows/deploy.yml`. Here's the complete flow:

## 1. **Automated Build Phase** (Build Job)
   - ✅ Code is checked out from the repository
   - ✅ Docker image is built using the `Dockerfile`
   - ✅ Docker Buildx is configured for multi-platform builds
   - ✅ Image is tagged with:
     - Branch name (e.g., `master`)
     - Git SHA (e.g., `master-abc1234`)
     - Latest tag (if on default branch)
     - Build run number
   - ✅ Image is pushed to Docker Hub registry

## 2. **Automated Deployment Phase** (Deploy Job)
   Runs only after the build job succeeds.

   **SSH Connection:**
   - Connects to your production server via SSH
   - Uses `appleboy/ssh-action` for secure deployment

   **Deployment Steps:**
   ```bash
   # Navigate to project directory
   cd $PROJECT_PATH
   
   # Create .env file with secrets
   cat > .env << EOF
   DB_USER=...
   DB_PASSWORD=...
   DB_NAME=...
   NODE_ENV=production
   ...
   EOF
   
   # Pull latest code from repository
   git pull origin main
   
   # Pull latest Docker image
   docker pull your-registry/m25-frontend:latest
   
   # Stop old containers
   docker-compose down --remove-orphans
   
   # Start new containers
   docker-compose up -d
   
   # Wait for services to stabilize
   sleep 30
   ```

## 3. **Verification Phase**
   The workflow verifies that deployment was successful:

   ```bash
   # Check running containers
   docker ps
   
   # Test frontend health
   curl http://localhost:3000/api/health
   # Expected: HTTP 200 with JSON response
   
   # Test backend health  
   curl http://localhost:8080
   # Expected: HTTP 200
   ```

## 4. **Automatic Rollback** (if deployment fails)
   If health checks fail, the `rollback` job automatically:
   - Stops current containers
   - Pulls the previous version
   - Restarts containers with the old image
   - Posts a failure notification

---

## Container Startup Order

Due to `depends_on` configuration in `docker-compose.yml`, containers start in this order:

```
PostgreSQL (postgres)
    ↓
Backend (backend) - waits for PostgreSQL to be healthy
    ↓
Frontend (frontend) - waits for Backend to be healthy
    ↓
Nginx (nginx) - waits for Frontend to be healthy
```

### Health Check Details:

| Service | Health Check | Interval | Timeout | Start Delay |
|---------|-------------|----------|---------|------------|
| PostgreSQL | `pg_isready -U {user}` | 10s | 5s | - |
| Backend | `wget localhost:8080` | 30s | 3s | 10s |
| Frontend | `wget localhost:3000/api/health` | 30s | 5s | 40s |

---

## Monitoring Deployment Status

### Check Status in GitHub Actions:
1. Go to repository → Actions tab
2. Select the latest workflow run
3. Check job status: Build → Deploy → Verify

### On Your Server:
```bash
# View running containers
docker ps

# Check logs for all services
docker-compose logs -f

# Check specific service
docker-compose logs -f frontend

# Check Docker disk usage
docker system df

# Prune unused images
docker image prune -f --filter "dangling=true"
```

---

## Common Issues & Fixes

### ❌ Health Check Failed (HTTP 000)
**Cause:** Health endpoint not responding
**Fix:** 
- Ensure `/api/health` endpoint exists in Next.js app ✅ (Already added)
- Check frontend port is 3000 in docker-compose
- Verify NODE_ENV is set to production

### ❌ Containers Won't Start
**Cause:** Port already in use or insufficient resources
**Fix:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Free up disk space if needed
docker system prune -a
```

### ❌ Database Connection Issues
**Cause:** PostgreSQL not healthy or credentials wrong
**Fix:**
- Check DB_USER, DB_PASSWORD in .env file
- Ensure DB_HOST=postgres (service name)
- Wait for PostgreSQL to fully start (max 25s with retries)

### ❌ Backend Not Responding
**Cause:** JSON Server port conflict
**Fix:**
- Verify port 8080 is available
- Check docker-compose BACKEND_PORT setting

---

## Environment Variables Required

Add these to GitHub Secrets:
```
SERVER_HOST           # Your server IP/domain
SERVER_USER           # SSH username
SERVER_SSH_KEY        # Private SSH key (full content)
SERVER_PORT           # SSH port (optional, default 22)
PROJECT_PATH          # Path to project on server (e.g., /home/ubuntu/M25_project)
DB_USER              # PostgreSQL username
DB_PASSWORD          # PostgreSQL password
DB_NAME              # PostgreSQL database name
DOCKER_USERNAME      # Docker Hub username
DOCKER_PASSWORD      # Docker Hub access token
```

---

## Performance Tips

1. **Speed up deployments:** Use Docker BuildKit cache
   - Images are cached in Docker Hub as `buildcache` tag
   - Subsequent builds are 50-70% faster

2. **Reduce container size:** Multi-stage build in Dockerfile
   - Builder stage: ~500MB
   - Final image: ~100MB

3. **Monitor resources:**
   ```bash
   docker stats
   ```

---

## Rollback Without Redeployment

If you need to rollback manually:
```bash
# Stop all services
docker-compose down

# Pull previous image (replace with actual previous tag)
docker pull docker.io/username/m25-frontend:master-oldsha

# Update docker-compose to use old image
# Or manually tag it as latest
docker tag docker.io/username/m25-frontend:master-oldsha \
           docker.io/username/m25-frontend:latest

# Restart
docker-compose up -d
```

---

## Next Steps for Production

1. ✅ **SSL/TLS Certificates:** Set up in nginx config (Certbot recommended)
2. ✅ **Backup Strategy:** Regular PostgreSQL backups
3. ✅ **Monitoring:** Set up log aggregation and alerts
4. ✅ **Resource Limits:** Add memory/CPU limits in docker-compose
5. ✅ **Rate Limiting:** Already configured in nginx.conf

