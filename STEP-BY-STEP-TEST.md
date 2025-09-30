# 🧪 Hướng dẫn Test Từng Bước - Docker, CI/CD, VPS

<div align="center">

![Testing](https://img.shields.io/badge/Testing-Step%20by%20Step-green.svg)
![Docker](https://img.shields.io/badge/Docker-Testing-2496ED.svg)
![CI/CD](https://img.shields.io/badge/CI%2FCD-Testing-blue.svg)
![VPS](https://img.shields.io/badge/VPS-Testing-orange.svg)

**Hướng dẫn test từng bước một cách chi tiết và an toàn**

</div>

---

## 📋 **Mục lục**

1. [🔧 Bước 1: Chuẩn bị môi trường](#-bước-1-chuẩn-bị-môi-trường)
2. [🐳 Bước 2: Test Docker Local](#-bước-2-test-docker-local)
3. [🗄️ Bước 3: Test Database Persistent](#️-bước-3-test-database-persistent)
4. [🔄 Bước 4: Test CI/CD Pipeline](#-bước-4-test-cicd-pipeline)
5. [☁️ Bước 5: Test Deploy lên VPS](#️-bước-5-test-deploy-lên-vps)
6. [📊 Bước 6: Test Lưu dữ liệu](#-bước-6-test-lưu-dữ-liệu)
7. [✅ Bước 7: Checklist hoàn thành](#-bước-7-checklist-hoàn-thành)

---

## 🔧 **Bước 1: Chuẩn bị môi trường**

### **1.1 Kiểm tra Docker Desktop**

```bash
# Kiểm tra Docker version
docker --version

# Kiểm tra Docker đang chạy
docker ps

# Nếu lỗi, khởi động Docker Desktop
# Tìm "Docker Desktop" trong Start Menu và mở
```

**✅ Kết quả mong đợi:**
```
Docker version 20.x.x
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

### **1.2 Kiểm tra Node.js và npm**

```bash
# Kiểm tra Node.js
node --version

# Kiểm tra npm
npm --version

# Cài đặt dependencies
npm install
```

**✅ Kết quả mong đợi:**
```
node v18.x.x
npm 8.x.x
```

### **1.3 Kiểm tra Git và GitHub**

```bash
# Kiểm tra Git
git --version

# Kiểm tra remote repository
git remote -v

# Kiểm tra status
git status
```

**✅ Kết quả mong đợi:**
```
git version 2.x.x
origin  https://github.com/AnhBoHelloTeam/MD-projec.git (fetch)
origin  https://github.com/AnhBoHelloTeam/MD-projec.git (push)
```

---

## 🐳 **Bước 2: Test Docker Local**

### **2.1 Build Docker Image (Version cũ - không database)**

```bash
# Build image từ Dockerfile gốc
docker build -t simple-crud-app .

# Kiểm tra image đã build
docker images | grep simple-crud-app
```

**✅ Kết quả mong đợi:**
```
REPOSITORY          TAG       IMAGE ID       CREATED        SIZE
simple-crud-app     latest    abc123def456   2 minutes ago   40MB
```

### **2.2 Test Container (Version cũ)**

```bash
# Chạy container
docker run -d -p 3001:3000 --name test-old simple-crud-app

# Kiểm tra container
docker ps

# Test health check
curl http://localhost:3001/health

# Test API
curl http://localhost:3001/api/products

# Dọn dẹp
docker stop test-old
docker rm test-old
```

**✅ Kết quả mong đợi:**
```
CONTAINER ID   IMAGE              COMMAND                  CREATED         STATUS                    PORTS                    NAMES
abc123def456   simple-crud-app    "docker-entrypoint.s…"   10 seconds ago  Up 9 seconds (healthy)    0.0.0.0:3001->3000/tcp   test-old

{"success":true,"message":"Server is running","timestamp":"...","uptime":10.5}
```

### **2.3 Build Docker Image (Version mới - có database)**

```bash
# Build image với database
docker build -f Dockerfile-db -t simple-crud-app-db .

# Kiểm tra image
docker images | grep simple-crud-app-db
```

**✅ Kết quả mong đợi:**
```
REPOSITORY              TAG       IMAGE ID       CREATED        SIZE
simple-crud-app-db      latest    def456ghi789   2 minutes ago   45MB
```

### **2.4 Test Container (Version mới - có database)**

```bash
# Chạy container với volume
docker run -d -p 3002:3000 -v $(pwd)/data:/app/data --name test-db simple-crud-app-db

# Kiểm tra container
docker ps

# Test health check
curl http://localhost:3002/health

# Test API
curl http://localhost:3002/api/products

# Kiểm tra database file
ls -la data/

# Dọn dẹp
docker stop test-db
docker rm test-db
```

**✅ Kết quả mong đợi:**
```
{"success":true,"message":"Server is running with database","database":"SQLite connected","timestamp":"...","uptime":15.2}

# Database file
-rw-r--r-- 1 user user 8192 Sep 30 10:30 data/database.sqlite
```

---

## 🗄️ **Bước 3: Test Database Persistent**

### **3.1 Test Lưu dữ liệu**

```bash
# Chạy container
docker run -d -p 3003:3000 -v $(pwd)/data:/app/data --name test-persistent simple-crud-app-db

# Đợi container khởi động
sleep 5

# Test thêm sản phẩm mới
curl -X POST http://localhost:3003/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 100000,
    "description": "Test description",
    "category": "Test"
  }'

# Kiểm tra sản phẩm đã thêm
curl http://localhost:3003/api/products
```

**✅ Kết quả mong đợi:**
```
{"success":true,"message":"Tạo sản phẩm thành công","data":{"id":"...","name":"Test Product",...}}
```

### **3.2 Test Restart Container**

```bash
# Dừng container
docker stop test-persistent

# Khởi động lại container
docker run -d -p 3003:3000 -v $(pwd)/data:/app/data --name test-persistent-2 simple-crud-app-db

# Đợi container khởi động
sleep 5

# Kiểm tra dữ liệu vẫn còn
curl http://localhost:3003/api/products

# Dọn dẹp
docker stop test-persistent-2
docker rm test-persistent-2
```

**✅ Kết quả mong đợi:**
```
# Sản phẩm "Test Product" vẫn còn trong database
{"success":true,"data":[...sản phẩm cũ vẫn còn...]}
```

---

## 🔄 **Bước 4: Test CI/CD Pipeline**

### **4.1 Kiểm tra GitHub Actions**

1. **Truy cập:** https://github.com/AnhBoHelloTeam/MD-projec/actions
2. **Kiểm tra workflow runs**
3. **Xem logs của từng step**

**✅ Kết quả mong đợi:**
- Workflow chạy thành công
- Tất cả steps pass
- Docker image được push lên Docker Hub

### **4.2 Test Auto-deploy**

```bash
# Tạo thay đổi nhỏ
echo "# Test auto-deploy $(date)" >> README.md

# Commit và push
git add README.md
git commit -m "Test auto-deploy $(date)"
git push origin main
```

**✅ Kết quả mong đợi:**
- GitHub Actions tự động chạy
- Docker image được build và push
- Render tự động redeploy

### **4.3 Kiểm tra Docker Hub**

1. **Truy cập:** https://hub.docker.com/r/nhanng0808/simple-crud-app
2. **Kiểm tra image mới**
3. **Test pull image**

```bash
# Pull image mới
docker pull nhanng0808/simple-crud-app:latest

# Test image
docker run -d -p 3004:3000 --name test-hub nhanng0808/simple-crud-app:latest

# Test
curl http://localhost:3004/health

# Dọn dẹp
docker stop test-hub
docker rm test-hub
```

**✅ Kết quả mong đợi:**
- Image pull thành công
- Container chạy healthy
- API hoạt động đúng

---

## ☁️ **Bước 5: Test Deploy lên VPS**

### **5.1 Chuẩn bị VPS**

**Yêu cầu VPS:**
- Ubuntu 20.04+ hoặc CentOS 7+
- Docker đã cài đặt
- Port 3000 mở
- SSH access

### **5.2 Deploy lên VPS**

```bash
# SSH vào VPS
ssh user@your-vps-ip

# Cài đặt Docker (nếu chưa có)
sudo apt update
sudo apt install docker.io docker-compose -y

# Tạo thư mục project
mkdir -p /home/user/simple-crud-app
cd /home/user/simple-crud-app

# Tạo thư mục data
mkdir -p data

# Tạo docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'
services:
  app:
    image: nhanng0808/simple-crud-app-db:latest
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DB_PATH=/app/data/database.sqlite
    restart: unless-stopped
EOF

# Chạy container
docker-compose up -d

# Kiểm tra container
docker ps
```

**✅ Kết quả mong đợi:**
```
CONTAINER ID   IMAGE                              COMMAND                  CREATED         STATUS                    PORTS                    NAMES
abc123def456   nhanng0808/simple-crud-app-db      "docker-entrypoint.s…"   10 seconds ago  Up 9 seconds (healthy)    0.0.0.0:3000->3000/tcp   simple-crud-app_app_1
```

### **5.3 Test VPS từ bên ngoài**

```bash
# Test từ máy local
curl http://your-vps-ip:3000/health

# Test API
curl http://your-vps-ip:3000/api/products

# Test web interface
# Mở trình duyệt: http://your-vps-ip:3000
```

**✅ Kết quả mong đợi:**
- Health check trả về status 200
- API hoạt động đúng
- Web interface hiển thị đẹp

---

## 📊 **Bước 6: Test Lưu dữ liệu**

### **6.1 Test Thêm dữ liệu trên VPS**

```bash
# SSH vào VPS
ssh user@your-vps-ip

# Thêm sản phẩm mới
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "VPS Test Product",
    "price": 500000,
    "description": "Test product on VPS",
    "category": "VPS Test"
  }'

# Kiểm tra sản phẩm
curl http://localhost:3000/api/products
```

**✅ Kết quả mong đợi:**
```
{"success":true,"message":"Tạo sản phẩm thành công","data":{"id":"...","name":"VPS Test Product",...}}
```

### **6.2 Test Restart Container trên VPS**

```bash
# SSH vào VPS
ssh user@your-vps-ip

# Dừng container
docker-compose down

# Khởi động lại
docker-compose up -d

# Đợi container khởi động
sleep 10

# Kiểm tra dữ liệu vẫn còn
curl http://localhost:3000/api/products
```

**✅ Kết quả mong đợi:**
```
# Sản phẩm "VPS Test Product" vẫn còn
{"success":true,"data":[...sản phẩm cũ vẫn còn...]}
```

### **6.3 Test từ bên ngoài**

```bash
# Test từ máy local
curl http://your-vps-ip:3000/api/products

# Kiểm tra web interface
# Mở trình duyệt: http://your-vps-ip:3000
```

**✅ Kết quả mong đợi:**
- Dữ liệu vẫn còn sau restart
- Web interface hiển thị đúng
- Tất cả tính năng hoạt động

---

## ✅ **Bước 7: Checklist hoàn thành**

### **🔧 Local Development**
- [ ] Node.js và npm hoạt động
- [ ] Dependencies cài đặt thành công
- [ ] Server chạy local (npm start)
- [ ] Database version hoạt động (node server-db.js)
- [ ] API endpoints hoạt động
- [ ] Web interface hiển thị đẹp

### **🐳 Docker Local**
- [ ] Docker Desktop khởi động
- [ ] Docker image build thành công (version cũ)
- [ ] Docker image build thành công (version mới)
- [ ] Container chạy healthy
- [ ] Port mapping hoạt động
- [ ] API hoạt động trong container
- [ ] Database persistent hoạt động

### **🗄️ Database Persistent**
- [ ] SQLite database tạo thành công
- [ ] Sample data được insert
- [ ] Thêm sản phẩm mới thành công
- [ ] Dữ liệu lưu trong file database.sqlite
- [ ] Dữ liệu còn sau restart container
- [ ] Volume mount hoạt động đúng

### **🔄 CI/CD Pipeline**
- [ ] GitHub Actions chạy thành công
- [ ] Docker image được push lên Docker Hub
- [ ] Auto-deploy hoạt động
- [ ] Secrets được cấu hình đúng
- [ ] Workflow steps hoàn thành

### **☁️ VPS Deploy**
- [ ] VPS có Docker
- [ ] Container chạy trên VPS
- [ ] Port 3000 accessible từ bên ngoài
- [ ] Health check hoạt động
- [ ] API endpoints hoạt động
- [ ] Web interface accessible

### **📊 Data Persistence**
- [ ] Dữ liệu lưu trong volume
- [ ] Dữ liệu còn sau restart container
- [ ] Dữ liệu còn sau restart VPS
- [ ] Database file tồn tại
- [ ] CRUD operations hoạt động

---

## 🚨 **Troubleshooting**

### **Lỗi thường gặp:**

1. **Docker Desktop không khởi động:**
   ```bash
   # Restart Docker Desktop
   # Check Windows features
   # Reinstall Docker Desktop
   ```

2. **Port đã được sử dụng:**
   ```bash
   # Thay đổi port
   docker run -p 3005:3000 ...
   
   # Kill process
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

3. **Database không persistent:**
   ```bash
   # Kiểm tra volume mount
   docker run -v $(pwd)/data:/app/data ...
   
   # Kiểm tra quyền thư mục
   chmod 755 data/
   ```

4. **VPS không accessible:**
   ```bash
   # Kiểm tra firewall
   sudo ufw allow 3000
   
   # Kiểm tra Docker port
   docker ps
   ```

### **Logs để debug:**

```bash
# Docker logs
docker logs container-name

# Database logs
docker exec -it container-name ls -la /app/data/

# VPS logs
ssh user@vps-ip "docker logs container-name"
```

---

## 🎯 **Kết luận**

Sau khi hoàn thành tất cả tests:

- ✅ **Local development** hoạt động
- ✅ **Docker containerization** hoạt động
- ✅ **Database persistent** hoạt động
- ✅ **CI/CD pipeline** hoạt động
- ✅ **VPS deployment** hoạt động
- ✅ **Data persistence** hoạt động

**Dự án đã sẵn sàng cho production với đầy đủ tính năng!** 🚀

---

<div align="center">

**📞 Support:** [GitHub Issues](https://github.com/AnhBoHelloTeam/MD-projec/issues)

**🌐 Live Demo:** https://md-projec.onrender.com

**🐳 Docker Hub:** https://hub.docker.com/r/nhanng0808/simple-crud-app

**🧪 Test Dashboard:** https://md-projec.onrender.com/test

</div>
