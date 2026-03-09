# 📦 Hướng dẫn Deploy Dự án M25

## 📋 Mục lục
1. [Chuẩn bị Server & Database](#chuẩn-bị-server--database)
2. [Cấu hình Nginx Reverse Proxy](#cấu-hình-nginx-reverse-proxy)
3. [Setup CI/CD Pipeline](#setup-cicd-pipeline)
4. [Kiểm tra Deployment](#kiểm-tra-deployment)

---

## 🚀 Chuẩn bị Server & Database

### Bước 1: Cài đặt Docker & Docker Compose

```bash
# Cập nhật package manager
sudo apt update && sudo apt upgrade -y

# Cài Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Cài Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Xác nhận cài đặt
docker --version
docker-compose --version

# Thêm user vào docker group (tùy chọn, để không cần sudo)
sudo usermod -aG docker $USER
newgrp docker
```

### Bước 2: Clone Repository & Cấu hình

```bash
# Clone project
git clone <your-repo-url> ~/m25-project
cd ~/m25-project

# Tạo .env file từ .env.example
cp .env.example .env

# Chỉnh sửa cấu hình (thay đổi DB password, domain, etc.)
nano .env
```

### Bước 3: Khởi động Services

```bash
# Build và start containers
docker-compose up -d

# Kiểm tra status
docker-compose ps

# Xem logs
docker-compose logs -f postgres      # Database logs
docker-compose logs -f frontend      # Frontend logs
docker-compose logs -f nginx         # Nginx logs

# Kiểm tra health
curl http://localhost/health
```

---

## 🌐 Cấu hình Nginx Reverse Proxy

### Chương trình con Nginx đang chạy trong docker-compose

**nginx.conf** đã bao gồm:
- ✅ Cấu hình reverse proxy trỏ tới frontend container
- ✅ Gzip compression (giảm 70% dung lượng)
- ✅ Rate limiting (10req/s cho API, 50req/s cho tổng)
- ✅ Client max body size: **50MB**
- ✅ Caching headers cho static files
- ✅ Security headers
- ✅ Health check endpoint

### Domain Pointing (DNS)

Đăng ký DNS record trong nhà cung cấp của bạn:

```
Record Type: A
Name: domain.rikkei.edu.vn
Value: <your-server-ip>
TTL: 3600
```

### Kiểm tra cấu hình Nginx

```bash
# Validate nginx config
docker exec rikkei-nginx nginx -t

# Reload nginx (không cần restart)
docker exec rikkei-nginx nginx -s reload

# Check access logs
docker logs rikkei-nginx
```

---

## 🔧 Setup CI/CD Pipeline

### Bước 1: Tạo Docker Hub Account

```bash
# Đăng ký trên https://hub.docker.com
# Ghi nhớ username và access token
```

### Bước 2: Setup GitHub Secrets

Vào **Settings → Secrets and variables → Actions**, thêm các secrets sau:

| Secret Name | Giá trị |
|---|---|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token |
| `SERVER_HOST` | IP server production (ví dụ: 203.0.113.42) |
| `SERVER_USER` | SSH user (thường là `ubuntu` hoặc `root`) |
| `SERVER_SSH_KEY` | Nội dung private SSH key |
| `SERVER_PORT` | SSH port (mặc định 22) |
| `PROJECT_PATH` | Đường dẫn project trên server (ví dụ: `/home/ubuntu/m25-project`) |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_NAME` | Database name (rikkei_prod) |
| `NEXT_PUBLIC_API_URL` | API endpoint URL |
| `DOMAIN` | Domain (domain.rikkei.edu.vn) |

### Bước 3: Generate SSH Key (nếu chưa có)

```bash
# Trên server
ssh-keygen -t rsa -b 4096 -f ~/.ssh/deploy_key -N ""

# Lấy public key
cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys

# Lấy private key (add vào GitHub secret SERVER_SSH_KEY)
cat ~/.ssh/deploy_key
```

### Bước 4: Test Pipeline

```bash
# Push code vào main/production branch
git add .
git commit -m "Deploy: Setup CI/CD pipeline"
git push origin main

# Theo dõi workflow
# Vào GitHub repo → Actions → Deploy to Production
```

---

## ✅ Kiểm tra Deployment

### 1. Kiểm tra Container Status

```bash
# Xem tất cả containers
docker ps

# Kiểm tra logs
docker-compose logs --tail=50 -f

# Kiểm tra từng service
docker-compose logs postgres
docker-compose logs frontend
docker-compose logs nginx
```

### 2. Kiểm tra Database

```bash
# Kết nối vào PostgreSQL
docker exec -it rikkei-db psql -U rikkei -d rikkei_prod

# Các câu lệnh SQL
\l              # List databases
\dt             # List tables
\q              # Quit

# Hoặc từ bên ngoài (nếu cần)
psql -h localhost -U rikkei -d rikkei_prod -c "SELECT version();"
```

### 3. Kiểm tra Frontend

```bash
# Test health endpoint
curl http://localhost/health

# Test frontend
curl -I http://localhost

# Kiểm tra gzip compression
curl -I -H "Accept-Encoding: gzip" http://localhost

# Xem full page
curl http://localhost
```

### 4. Kiểm tra Nginx Reverse Proxy

```bash
# Test reverse proxy
curl -H "Host: domain.rikkei.edu.vn" http://localhost

# Xem request headers
curl -I -v http://localhost/health

# Kiểm tra rate limiting (gửi 20 request)
for i in {1..20}; do curl -s http://localhost/health; done
```

### 5. Kiểm tra DNS (sau khi pointing domain)

```bash
# DNS propagation check
nslookup domain.rikkei.edu.vn
# hoặc
dig domain.rikkei.edu.vn

# Truy cập qua browser
# https://domain.rikkei.edu.vn
```

---

## 🔒 Bảo mật

### PostgreSQL Security
- ✅ Database chỉ kết nối nội bộ (không expose port 5432)
- ✅ Environment variables quản lý credentials (không hardcode)
- ✅ Volume persistence để protect dữ liệu

### Nginx Security
- ✅ X-Frame-Options (ngăn Clickjacking)
- ✅ X-Content-Type-Options (ngăn MIME sniffing)
- ✅ X-XSS-Protection headers
- ✅ Rate limiting (DDoS protection)
- ✅ Deny access to sensitive files (., ~)

### Docker Security
- ✅ Alpine images (nhỏ, an toàn hơn)
- ✅ Health checks (auto-restart nếu lỗi)
- ✅ Restart policies

---

## 📊 Monitoring & Logs

```bash
# Real-time logs
docker-compose logs -f

# Logs từ thời gian cụ thể
docker-compose logs --since 10m

# Logs từ service cụ thể
docker-compose logs frontend

# Kiểm tra dung lượng storage
docker system df

# Cleanup unused resources
docker system prune -a --volumes
```

---

## 🔄 Update & Rollback

### Update ứng dụng

```bash
# Pull latest code
git pull origin main

# Restart containers
docker-compose restart frontend

# hoặc redeploy hoàn toàn
docker-compose down
docker-compose pull
docker-compose up -d
```

### Rollback (nếu có sự cố)

```bash
# Xem image history
docker images | grep m25-frontend

# Rollback bằng image tag cũ
docker-compose down
# Chỉnh sửa docker-compose.yml để dùng tag cũ
docker-compose up -d
```

---

## 🆘 Troubleshooting

### Container không start

```bash
# Xem chi tiết error
docker-compose logs postgres
docker-compose logs frontend

# Restart service
docker-compose restart frontend

# Rebuild image
docker-compose up -d --build
```

### Port đã bị sử dụng

```bash
# Tìm process sử dụng port 80
lsof -i :80
sudo kill -9 <PID>

# hoặc thay port trong docker-compose.yml
```

### Database connection error

```bash
# Kiểm tra postgres running
docker-compose ps postgres

# Test connection
docker exec rikkei-db psql -U rikkei -d rikkei_prod -c "SELECT 1;"

# Kiểm tra network
docker network ls
docker network inspect rikkei-network
```

### Nginx reverse proxy không hoạt động

```bash
# Validate nginx config
docker exec rikkei-nginx nginx -t

# Reload config
docker exec rikkei-nginx nginx -s reload

# Check upstream
docker exec rikkei-nginx curl http://frontend:80/health
```

---

## 📝 Sản phẩm Bàn giao

✅ **[docker-compose.yml](./docker-compose.yml)** - Orchestration config
✅ **[Dockerfile](./Dockerfile)** - Multi-stage build cho Next.js  
✅ **[nginx.conf](./nginx.conf)** - Reverse proxy configuration  
✅ **[.github/workflows/deploy.yml](./.github/workflows/deploy.yml)** - CI/CD pipeline  
✅ **[.env.example](./.env.example)** - Environment variables template  
✅ **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Hướng dẫn này  

🌐 **URL Truy cập**: https://domain.rikkei.edu.vn

---

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Docker & Docker Compose cài đặt đúng
2. SSH keys cấu hình đúng
3. DNS pointing tới đúng server IP
4. Firewall rules cho phép port 80, 443
5. Đủ dung lượng disk/memory trên server

---

**Last Updated**: March 2026  
**Version**: 1.0.0
