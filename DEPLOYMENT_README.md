# 🚀 M25 Project - Deployment Guide

## 📦 Sản phẩm Bàn giao

### 1. **Cấu hình Containerization**
- ✅ [Dockerfile](./Dockerfile) - Multi-stage build tối ưu cho Next.js
  - Stage 1: Build Node (cài dependencies, build optimized)
  - Stage 2: Nginx Alpine (serve static files)
  - Health check tích hợp

### 2. **Docker Compose Orchestration**
- ✅ [docker-compose.yml](./docker-compose.yml) - Định nghĩa tất cả services
  - **PostgreSQL 15 Alpine**: Database chỉ kết nối nội bộ
  - **Frontend Container**: Next.js app chạy trên Nginx
  - **Nginx Container**: Reverse proxy & load balancing
  - Networks tách biệt để bảo mật
  - Volume persistence cho database

### 3. **Web Server Configuration**
- ✅ [nginx.conf](./nginx.conf) - Cấu hình Nginx tối ưu
  - Gzip compression (70% giảm dung lượng)
  - Rate limiting: 10req/s API, 50req/s tổng
  - **Client max body size: 50MB**
  - Caching headers cho static files
  - Security headers (XSS, Clickjacking, MIME sniffing)
  - Health check endpoints
  - SSL/TLS ready

### 4. **CI/CD Pipeline**
- ✅ [.github/workflows/deploy.yml](./.github/workflows/deploy.yml) - GitHub Actions
  - Trigger: Push vào `main` hoặc `production` branch
  - **Build**: Multi-stage Docker image build
  - **Push**: Đẩy lên Docker Hub
  - **Deploy**: SSH vào server, pull image, docker-compose up
  - **Verification**: Health checks tự động
  - **Rollback**: Tự động rollback nếu deploy fail

### 5. **Environment & Utility**
- ✅ [.env.example](./.env.example) - Template biến môi trường
- ✅ [deploy.sh](./deploy.sh) - Helper script cho Linux/Mac
- ✅ [deploy.ps1](./deploy.ps1) - Helper script cho Windows
- ✅ [DEPLOYMENT.md](./DEPLOYMENT.md) - Chi tiết hướng dẫn

---

## 🎯 Quick Start (Local Development)

### Prerequisite
- Docker Desktop cài đặt (Windows/Mac) hoặc Docker + Docker Compose (Linux)

### 1. Clone & Setup

```bash
git clone <your-repo-url> m25-project
cd m25-project

# Tạo .env file
cp .env.example .env

# Chỉnh sửa nếu cần (mặc định đã tối ưu)
```

### 2. Start Services

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh deploy
```

**Windows PowerShell:**
```powershell
.\deploy.ps1 deploy
```

**Or Manual:**
```bash
docker-compose up -d
docker-compose ps
curl http://localhost/health
```

### 3. Truy cập

- **Frontend**: http://localhost
- **Database**: localhost:5432 (nội bộ)
- **Health Check**: http://localhost/health

---

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│           Internet (Port 80/443)        │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Nginx Container (Reverse Proxy)       │
│   - domain.rikkei.edu.vn               │
│   - Gzip, Rate Limiting, SSL            │
└──────────────────┬──────────────────────┘
                   │
          (Internal Docker Network)
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
  ┌──────────────┐    ┌──────────────┐
  │  Frontend    │    │  PostgreSQL  │
  │ (Next.js)    │    │  (rikkei_    │
  │ on Nginx     │    │   prod DB)   │
  │ Port 3000    │    │ Port 5432    │
  └──────────────┘    └──────────────┘
        │                    │
        └────── Volume Persistence ──┘
```

---

## 🔧 Production Deployment

### Step 1: Server Preparation

```bash
# SSH vào server
ssh user@your-server-ip

# Cài Docker
curl -fsSL https://get.docker.com | sh

# Cài Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Thêm user vào docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Step 2: Setup GitHub Secrets

Vào **GitHub Repo → Settings → Secrets and variables → Actions**

Thêm secrets:
```
DOCKER_USERNAME      = Docker Hub username
DOCKER_PASSWORD      = Docker Hub access token
SERVER_HOST          = 123.45.67.89 (server IP)
SERVER_USER          = ubuntu (SSH user)
SERVER_SSH_KEY       = Private SSH key content
SERVER_PORT          = 22 (SSH port)
PROJECT_PATH         = /home/ubuntu/m25-project
DB_USER              = rikkei
DB_PASSWORD          = rikkei@2024
DB_NAME              = rikkei_prod
NEXT_PUBLIC_API_URL  = http://api.rikkei.edu.vn
DOMAIN               = domain.rikkei.edu.vn
```

### Step 3: Deploy

**Push code triggers pipeline:**
```bash
git add .
git commit -m "Deploy: Production setup"
git push origin main
```

**Monitor GitHub Actions → Deploy to Production**

### Step 4: Domain Pointing (DNS)

```
Type: A Record
Name: domain.rikkei.edu.vn
Value: <your-server-ip>
TTL: 3600
```

---

## 📋 Commands

### Using Helper Scripts

**Linux/Mac:**
```bash
./deploy.sh check              # Check prerequisites
./deploy.sh deploy             # Full deployment
./deploy.sh start              # Start services
./deploy.sh stop               # Stop services
./deploy.sh restart            # Restart
./deploy.sh status             # Health check
./deploy.sh logs:frontend      # View logs
./deploy.sh db:backup          # Backup database
./deploy.sh db:restore <file>  # Restore database
./deploy.sh clean              # Cleanup
```

**Windows:**
```powershell
.\deploy.ps1 check
.\deploy.ps1 deploy
.\deploy.ps1 logs:postgres
# ... same commands as Linux
```

### Manual Docker Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f frontend

# Restart service
docker-compose restart frontend

# Stop & Remove
docker-compose down --volumes

# Rebuild
docker-compose up -d --build
```

---

## 📈 Performance Optimization

### Gzip Compression
```nginx
# Enabled in nginx.conf
# Reduces response size by ~70%
```

### Static File Caching
```nginx
# CSS, JS, Images cached for 30 days
location ~* \.(jpg|css|js)$ {
    expires 30d;
}
```

### Database Connection Pooling
```yaml
# PostgreSQL with Alpine image
# Minimal footprint, fast startup
```

---

## 🔒 Security Features

| Feature | Implementation |
|---------|---|
| **Database Isolation** | Port 5432 not exposed externally |
| **HTTPS Ready** | SSL/TLS configuration in nginx.conf |
| **Rate Limiting** | 10req/s for API, 50req/s general |
| **Security Headers** | X-Frame-Options, X-Content-Type-Options, XSS-Protection |
| **Input Validation** | client_max_body_size: 50MB |
| **Sensitive Files** | Denied access to .* and ~$ files |
| **DDoS Protection** | Rate limiting + connection limits |
| **Secrets Management** | Environment variables (not hardcoded) |

---

## 🆘 Troubleshooting

### Cannot connect to Docker daemon
```bash
sudo systemctl start docker
sudo usermod -aG docker $USER
```

### Port already in use
```bash
# Find & kill process on port 80
lsof -i :80
sudo kill -9 <PID>

# Or change port in docker-compose.yml
```

### Database won't start
```bash
docker-compose logs postgres
# Check password, volume permissions
```

### Nginx reverse proxy not working
```bash
docker exec rikkei-nginx nginx -t
docker exec rikkei-nginx curl http://frontend:80/health
```

---

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Chi tiết cấu hình & commands
- **[Dockerfile](./Dockerfile)** - Build image cho Frontend
- **[nginx.conf](./nginx.conf)** - Reverse proxy configuration
- **[docker-compose.yml](./docker-compose.yml)** - Services orchestration
- **[.github/workflows/deploy.yml](./.github/workflows/deploy.yml)** - CI/CD pipeline

---

## 🎯 Checklist for Production

- [ ] Server cài Docker & Docker Compose
- [ ] GitHub Secrets cấu hình đầy đủ
- [ ] SSH keys setup & tested
- [ ] DNS pointing tới server IP
- [ ] Firewall cho phép port 80, 443
- [ ] Database backup strategy
- [ ] Monitoring & alerts (nếu cần)
- [ ] SSL/TLS certificate (Let's Encrypt)
- [ ] Load testing & performance tuning
- [ ] Documentation & runbook

---

## 📞 Support

Gặp vấn đề? Kiểm tra:

1. **Docker/Compose version**: `docker --version`, `docker-compose --version`
2. **Services running**: `docker-compose ps`
3. **Logs**: `docker-compose logs -f <service>`
4. **Network**: `docker network inspect rikkei-network`
5. **Disk space**: `df -h`

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Author**: Development Team  
**Status**: ✅ Ready for Production
