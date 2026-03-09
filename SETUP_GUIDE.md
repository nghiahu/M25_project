# 🚀 Setup Guide - DNS & Production Deployment

## 📋 Thông tin Server của bạn

```
Server IP:  43.201.27.34
Username:   ubuntu
Domain:     ngo-huu-nghia-k23.rikkeieducation.com
API Domain: api.ngo-huu-nghia-k23.rikkeieducation.com
```

---

## 🌐 Step 1: DNS Configuration (Cấu hình DNS)

### Để trỏ domain về server của bạn, bạn cần:

**Đăng nhập vào nhà cung cấp domain (GoDaddy, Namecheap, hoặc nơi bạn mua domain)**

Thêm 2 A Records:

#### Record 1 - Frontend
```
Type:  A
Name:  ngo-huu-nghia-k23.rikkeieducation.com
Value: 43.201.27.34
TTL:   3600
```

#### Record 2 - Backend API (Optional)
```
Type:  A
Name:  api.ngo-huu-nghia-k23.rikkeieducation.com
Value: 43.201.27.34
TTL:   3600
```

#### Hoặc sử dụng Wildcard (Dễ hơn):
```
Type:  A
Name:  *.ngo-huu-nghia-k23.rikkeieducation.com
Value: 43.201.27.34
TTL:   3600
```

### ✅ Kiểm tra DNS đã propagate:

```bash
# Test DNS resolution
nslookup ngo-huu-nghia-k23.rikkeieducation.com
# Hoặc
dig ngo-huu-nghia-k23.rikkeieducation.com

# Should return: 43.201.27.34
```

**Lưu ý**: DNS propagation có thể mất 15 phút - 24 tiếng. Kiểm tra với [DNS Checker](https://dnschecker.org)

---

## 🔑 Step 2: SSH Key Setup

### Trên Server (43.201.27.34):

```bash
# SSH vào server
ssh ubuntu@43.201.27.34

# Tạo SSH key (nếu chưa có)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github_deploy -N ""

# Thêm public key vào authorized_keys
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Copy private key
cat ~/.ssh/github_deploy
```

### Lưu Private Key:
Sao chép nội dung của private key (từ `-----BEGIN RSA PRIVATE KEY-----` đến `-----END RSA PRIVATE KEY-----`)

---

## 🔐 Step 3: GitHub Secrets Configuration

### Vào GitHub Repository → Settings → Secrets and variables → Actions

Thêm các secrets sau:

| Secret Name | Giá trị | Ví dụ |
|---|---|---|
| `DOCKER_USERNAME` | Docker Hub username | `nghiahu` |
| `DOCKER_PASSWORD` | Docker Hub access token | `dckr_pat_xxxxx` |
| `SERVER_HOST` | Server IP | `43.201.27.34` |
| `SERVER_USER` | SSH user | `ubuntu` |
| `SERVER_SSH_KEY` | Private SSH key (full content) | `-----BEGIN RSA PRIVATE KEY-----\n...` |
| `SERVER_PORT` | SSH port | `22` |
| `PROJECT_PATH` | Path trên server | `/home/ubuntu/m25-project` |
| `DB_USER` | Database user | `rikkei` |
| `DB_PASSWORD` | Database password | `rikkei@2024` |
| `DB_NAME` | Database name | `rikkei_prod` |

---

## 📂 Step 4: Server Preparation

### SSH vào server và chuẩn bị:

```bash
# SSH vào server
ssh ubuntu@43.201.27.34

# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài Docker
curl -fsSL https://get.docker.com | sudo sh

# Cài Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Thêm ubuntu vào docker group
sudo usermod -aG docker ubuntu
newgrp docker

# Kiểm tra cài đặt
docker --version
docker-compose --version

# Clone project
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/m25-project.git
cd m25-project

# Tạo .env từ .env.example
cp .env.example .env

# Kiểm tra nội dung .env
cat .env
```

---

## 🚀 Step 5: Initial Deployment

### Local test (trước khi push lên production):

```bash
# Từ máy tính của bạn, trong project folder
docker-compose up -d

# Kiểm tra services
docker-compose ps

# Test health
curl http://localhost/health
curl http://localhost:8080
```

### Deploy Production (via GitHub Actions):

```bash
# Push code lên main branch
git add .
git commit -m "Production setup: ngo-huu-nghia-k23.rikkeieducation.com"
git push origin main
```

**Monitor deployment:**
1. Vào GitHub repo → Actions
2. Chọn "Deploy to Production"
3. Xem logs chi tiết

---

## 🌐 Step 6: Verify Deployment

### Sau deployment thành công:

```bash
# SSH vào server
ssh ubuntu@43.201.27.34

# Check running containers
docker ps
docker-compose ps

# View logs
docker-compose logs -f

# Test health endpoints
curl http://localhost/health
curl http://localhost:8080
```

### Truy cập từ browser:

- **Frontend**: https://ngo-huu-nghia-k23.rikkeieducation.com
- **Backend API**: https://api.ngo-huu-nghia-k23.rikkeieducation.com
- **Hoặc**: https://ngo-huu-nghia-k23.rikkeieducation.com/api/

---

## 🔒 SSL/TLS Certificate Setup (Let's Encrypt)

### Tùy chọn 1: Sử dụng Certbot (recommended):

```bash
ssh ubuntu@43.201.27.34

# Cài Certbot
sudo apt install -y certbot python3-certbot-nginx

# Tạo certificate
sudo certbot certonly --standalone \
  -d ngo-huu-nghia-k23.rikkeieducation.com \
  -d api.ngo-huu-nghia-k23.rikkeieducation.com \
  -d www.ngo-huu-nghia-k23.rikkeieducation.com

# Certificates sẽ ở: /etc/letsencrypt/live/ngo-huu-nghia-k23.rikkeieducation.com/
```

### Tùy chọn 2: Tự động với Docker (inside docker-compose):

```yaml
certbot:
  image: certbot/certbot
  volumes:
    - ./ssl:/etc/letsencrypt
  command: certonly --standalone -d ngo-huu-nghia-k23.rikkeieducation.com
```

---

## 📊 Monitoring & Troubleshooting

### Health Check:

```bash
# Frontend
curl -v http://ngo-huu-nghia-k23.rikkeieducation.com/health

# Backend
curl -v http://api.ngo-huu-nghia-k23.rikkeieducation.com

# Database
docker exec rikkei-db psql -U rikkei -d rikkei_prod -c "SELECT 1;"
```

### View Logs:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f nginx
docker-compose logs -f postgres
```

### Common Issues:

| Vấn đề | Giải pháp |
|--------|----------|
| DNS không resolve | Chờ 15-24 tiếng hoặc kiểm tra DNS records |
| Connection refused | Kiểm tra firewall, security group |
| 502 Bad Gateway | Backend không healthy, check logs |
| Port already in use | Stop containers khác, hoặc đổi port |
| SSH key không đúng | Kiểm tra private key permission `chmod 600` |

---

## 🔄 Updating Application

### Push code update:

```bash
# Trên máy tính của bạn
git add .
git commit -m "Update: new features"
git push origin main

# GitHub Actions tự động deploy
```

### Manual update (nếu cần):

```bash
ssh ubuntu@43.201.27.34

cd /home/ubuntu/m25-project
git pull origin main
docker-compose up -d --build
docker-compose ps
```

---

## 📝 Environment Variables Finalized

File `.env` trên server sẽ có:

```bash
# Database
DB_USER=rikkei
DB_PASSWORD=rikkei@2024
DB_NAME=rikkei_prod
DB_HOST=postgres
DB_PORT=5432

# Application
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.ngo-huu-nghia-k23.rikkeieducation.com
FRONTEND_PORT=3000
BACKEND_PORT=8080

# Domain
DOMAIN=ngo-huu-nghia-k23.rikkeieducation.com
API_DOMAIN=api.ngo-huu-nghia-k23.rikkeieducation.com
```

---

## ✅ Deployment Checklist

- [ ] DNS Records A (2 records hoặc 1 wildcard)
- [ ] SSH Key generated & stored in GitHub secrets
- [ ] GitHub Secrets cấu hình đầy đủ
- [ ] Server cài Docker & Docker Compose
- [ ] Server git clone project
- [ ] GitHub Actions workflow chạy thành công
- [ ] Containers running: postgres, backend, frontend, nginx
- [ ] Health endpoints respond 200
- [ ] DNS resolver trỏ tới 43.201.27.34
- [ ] Browser truy cập được domain
- [ ] SSL certificate cấu hình (nếu cần)

---

## 🎯 Final URLs

```
Frontend:     https://ngo-huu-nghia-k23.rikkeieducation.com
Backend:      https://api.ngo-huu-nghia-k23.rikkeieducation.com
API Endpoint: https://ngo-huu-nghia-k23.rikkeieducation.com/api/
```

---

## 📞 Support

Nếu gặp vấn đề:

1. **Check logs**: `docker-compose logs -f`
2. **Verify DNS**: `nslookup ngo-huu-nghia-k23.rikkeieducation.com`
3. **Test connectivity**: `curl -v http://43.201.27.34`
4. **Restart services**: `docker-compose restart`

---

**Version**: 1.0.0  
**Date**: March 2026  
**Status**: ✅ Ready for Production
