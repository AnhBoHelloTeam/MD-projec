# 🧪 Hướng dẫn Test Dự án Simple CRUD App

<div align="center">

![Testing](https://img.shields.io/badge/Testing-Guide-green.svg)
![Docker](https://img.shields.io/badge/Docker-Testing-2496ED.svg)
![API](https://img.shields.io/badge/API-Testing-blue.svg)
![Web](https://img.shields.io/badge/Web-Testing-orange.svg)

**Hướng dẫn test từng bước một cách chi tiết**

</div>

---

## 📋 **Mục lục**

1. [🔧 Chuẩn bị môi trường](#-chuẩn-bị-môi-trường)
2. [🌐 Test Local Development](#-test-local-development)
3. [🐳 Test Docker Local](#-test-docker-local)
4. [☁️ Test Cloud Deploy](#️-test-cloud-deploy)
5. [🔄 Test CI/CD Pipeline](#-test-cicd-pipeline)
6. [📊 Test API Endpoints](#-test-api-endpoints)
7. [🎨 Test Web Interface](#-test-web-interface)
8. [🔍 Test Docker Hub](#-test-docker-hub)
9. [✅ Checklist hoàn thành](#-checklist-hoàn-thành)

---

## 🔧 **Chuẩn bị môi trường**

### **Yêu cầu hệ thống:**
- ✅ Node.js >= 14.0.0
- ✅ npm hoặc yarn
- ✅ Docker Desktop
- ✅ Git
- ✅ Trình duyệt web

### **Kiểm tra môi trường:**

```bash
# Kiểm tra Node.js
node --version
# Kết quả mong đợi: v18.x.x hoặc cao hơn

# Kiểm tra npm
npm --version
# Kết quả mong đợi: 8.x.x hoặc cao hơn

# Kiểm tra Docker
docker --version
# Kết quả mong đợi: Docker version 20.x.x hoặc cao hơn

# Kiểm tra Git
git --version
# Kết quả mong đợi: git version 2.x.x hoặc cao hơn
```

---

## 🌐 **Test Local Development**

### **Bước 1: Clone và cài đặt**

```bash
# 1. Clone repository
git clone https://github.com/AnhBoHelloTeam/MD-projec.git
cd MD-projec

# 2. Cài đặt dependencies
npm install

# 3. Kiểm tra package.json
cat package.json
```

**✅ Kết quả mong đợi:**
- Repository được clone thành công
- Dependencies được cài đặt (node_modules folder)
- package.json hiển thị đúng thông tin

### **Bước 2: Chạy development server**

```bash
# Chạy server
npm start
```

**✅ Kết quả mong đợi:**
```
🚀 Server đang chạy tại http://localhost:3000
📊 Health check: http://localhost:3000/health
📚 API Documentation: http://localhost:3000/
```

### **Bước 3: Test local endpoints**

```bash
# Test health check
curl http://localhost:3000/health

# Test API products
curl http://localhost:3000/api/products

# Test web interface
# Mở trình duyệt: http://localhost:3000
```

**✅ Kết quả mong đợi:**
- Health check trả về JSON với status 200
- API products trả về danh sách sản phẩm
- Web interface hiển thị giao diện đẹp

---

## 🐳 **Test Docker Local**

### **Bước 1: Khởi động Docker Desktop**

1. **Tìm Docker Desktop** trong Start Menu
2. **Mở Docker Desktop**
3. **Đợi Docker khởi động** (1-2 phút)
4. **Kiểm tra icon Docker** ở system tray

### **Bước 2: Build Docker image**

```bash
# Build image từ Dockerfile
docker build -t simple-crud-app .

# Kiểm tra image đã build
docker images | grep simple-crud-app
```

**✅ Kết quả mong đợi:**
```
REPOSITORY          TAG       IMAGE ID       CREATED        SIZE
simple-crud-app     latest    abc123def456   2 minutes ago   40MB
```

### **Bước 3: Chạy Docker container**

```bash
# Chạy container
docker run -d -p 3001:3000 --name simple-crud-test simple-crud-app

# Kiểm tra container đang chạy
docker ps
```

**✅ Kết quả mong đợi:**
```
CONTAINER ID   IMAGE              COMMAND                  CREATED         STATUS                    PORTS                    NAMES
abc123def456   simple-crud-app    "docker-entrypoint.s…"   10 seconds ago  Up 9 seconds (healthy)    0.0.0.0:3001->3000/tcp   simple-crud-test
```

### **Bước 4: Test Docker container**

```bash
# Test health check
curl http://localhost:3001/health

# Test API
curl http://localhost:3001/api/products

# Test web interface
# Mở trình duyệt: http://localhost:3001
```

**✅ Kết quả mong đợi:**
- Container chạy healthy
- API hoạt động đúng
- Web interface hiển thị đẹp

### **Bước 5: Cleanup**

```bash
# Dừng container
docker stop simple-crud-test

# Xóa container
docker rm simple-crud-test

# Xóa image (optional)
docker rmi simple-crud-app
```

---

## ☁️ **Test Cloud Deploy**

### **Test Render Deploy**

1. **Truy cập:** https://md-projec.onrender.com
2. **Kiểm tra giao diện web**
3. **Test các tính năng:**
   - Thêm sản phẩm mới
   - Sửa sản phẩm
   - Xóa sản phẩm
   - Tìm kiếm sản phẩm

**✅ Kết quả mong đợi:**
- Website load nhanh
- Giao diện responsive
- Tất cả tính năng hoạt động

### **Test API Endpoints**

```bash
# Test health check
curl https://md-projec.onrender.com/health

# Test API products
curl https://md-projec.onrender.com/api/products

# Test API info
curl https://md-projec.onrender.com/api
```

**✅ Kết quả mong đợi:**
- Tất cả endpoints trả về status 200
- JSON response đúng format
- CORS headers có sẵn

---

## 🔄 **Test CI/CD Pipeline**

### **Bước 1: Kiểm tra GitHub Actions**

1. **Truy cập:** https://github.com/AnhBoHelloTeam/MD-projec/actions
2. **Kiểm tra workflow runs**
3. **Xem logs của từng step**

**✅ Kết quả mong đợi:**
- Workflow chạy thành công
- Tất cả steps pass
- Docker image được push lên Docker Hub

### **Bước 2: Test auto-deploy**

```bash
# Tạo thay đổi nhỏ
echo "# Test auto-deploy" >> README.md

# Commit và push
git add README.md
git commit -m "Test auto-deploy"
git push origin main
```

**✅ Kết quả mong đợi:**
- GitHub Actions tự động chạy
- Docker image được build và push
- Render tự động redeploy

---

## 📊 **Test API Endpoints**

### **Test tất cả endpoints:**

```bash
# 1. Health check
curl -X GET https://md-projec.onrender.com/health

# 2. Get all products
curl -X GET https://md-projec.onrender.com/api/products

# 3. Get product by ID
curl -X GET https://md-projec.onrender.com/api/products/1

# 4. Create new product
curl -X POST https://md-projec.onrender.com/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 100000,
    "description": "Test description",
    "category": "Test"
  }'

# 5. Update product
curl -X PUT https://md-projec.onrender.com/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Product",
    "price": 200000,
    "description": "Updated description",
    "category": "Updated"
  }'

# 6. Delete product
curl -X DELETE https://md-projec.onrender.com/api/products/1
```

**✅ Kết quả mong đợi:**
- Tất cả endpoints trả về status 200
- JSON response đúng format
- CRUD operations hoạt động

---

## 🎨 **Test Web Interface**

### **Test giao diện web:**

1. **Truy cập:** https://md-projec.onrender.com
2. **Kiểm tra responsive design:**
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)

### **Test các tính năng:**

1. **Thêm sản phẩm:**
   - Điền form đầy đủ
   - Click "Lưu sản phẩm"
   - Kiểm tra sản phẩm xuất hiện trong danh sách

2. **Sửa sản phẩm:**
   - Click "Sửa" trên sản phẩm
   - Form được điền sẵn dữ liệu
   - Thay đổi thông tin và lưu

3. **Xóa sản phẩm:**
   - Click "Xóa" trên sản phẩm
   - Xác nhận xóa
   - Sản phẩm biến mất khỏi danh sách

4. **Tìm kiếm:**
   - Nhập từ khóa vào ô tìm kiếm
   - Danh sách được lọc theo kết quả

5. **Xem chi tiết:**
   - Click "Xem" trên sản phẩm
   - Modal popup hiển thị thông tin chi tiết

**✅ Kết quả mong đợi:**
- Giao diện đẹp, responsive
- Tất cả tính năng hoạt động mượt mà
- Form validation hoạt động
- Error handling hiển thị rõ ràng

---

## 🔍 **Test Docker Hub**

### **Bước 1: Kiểm tra Docker Hub repository**

1. **Truy cập:** https://hub.docker.com/r/nhanng0808/simple-crud-app
2. **Kiểm tra thông tin:**
   - Repository name đúng
   - Description có sẵn
   - Tags available
   - Last updated time

### **Bước 2: Pull và test image**

```bash
# Pull image từ Docker Hub
docker pull nhanng0808/simple-crud-app

# Chạy container
docker run -d -p 3002:3000 --name docker-hub-test nhanng0808/simple-crud-app

# Test container
curl http://localhost:3002/health
curl http://localhost:3002/api/products

# Cleanup
docker stop docker-hub-test
docker rm docker-hub-test
```

**✅ Kết quả mong đợi:**
- Image pull thành công
- Container chạy healthy
- API hoạt động đúng

---

## ✅ **Checklist hoàn thành**

### **🔧 Local Development**
- [ ] Node.js và npm hoạt động
- [ ] Dependencies cài đặt thành công
- [ ] Server chạy local (npm start)
- [ ] API endpoints hoạt động
- [ ] Web interface hiển thị đẹp

### **🐳 Docker Local**
- [ ] Docker Desktop khởi động
- [ ] Docker image build thành công
- [ ] Container chạy healthy
- [ ] Port mapping hoạt động
- [ ] API hoạt động trong container

### **☁️ Cloud Deploy**
- [ ] Render deploy thành công
- [ ] Website accessible
- [ ] API endpoints hoạt động
- [ ] Web interface responsive
- [ ] Auto-deploy hoạt động

### **🔄 CI/CD Pipeline**
- [ ] GitHub Actions chạy thành công
- [ ] Docker image được push lên Docker Hub
- [ ] Auto-deploy hoạt động
- [ ] Secrets được cấu hình đúng

### **📊 API Testing**
- [ ] Health check endpoint
- [ ] GET /api/products
- [ ] GET /api/products/:id
- [ ] POST /api/products
- [ ] PUT /api/products/:id
- [ ] DELETE /api/products/:id

### **🎨 Web Interface**
- [ ] Giao diện đẹp, responsive
- [ ] Form validation hoạt động
- [ ] CRUD operations hoạt động
- [ ] Search functionality
- [ ] Error handling
- [ ] Loading states

### **🔍 Docker Hub**
- [ ] Repository accessible
- [ ] Image tags available
- [ ] Pull image thành công
- [ ] Container chạy từ Docker Hub image

---

## 🚨 **Troubleshooting**

### **Lỗi thường gặp:**

1. **Docker Desktop không khởi động:**
   - Restart Docker Desktop
   - Check Windows features
   - Reinstall Docker Desktop

2. **Port đã được sử dụng:**
   - Thay đổi port: `-p 3003:3000`
   - Kill process đang sử dụng port

3. **API không hoạt động:**
   - Check server đang chạy
   - Check CORS settings
   - Check network connectivity

4. **Web interface không load:**
   - Check static files
   - Check browser console
   - Check network tab

### **Logs để debug:**

```bash
# Docker logs
docker logs simple-crud-test

# Server logs
npm start

# Network test
curl -v http://localhost:3000/health
```

---

## 🎯 **Kết luận**

Sau khi hoàn thành tất cả tests:

- ✅ **Local development** hoạt động
- ✅ **Docker containerization** hoạt động
- ✅ **Cloud deployment** hoạt động
- ✅ **CI/CD pipeline** hoạt động
- ✅ **API endpoints** hoạt động
- ✅ **Web interface** hoạt động
- ✅ **Docker Hub integration** hoạt động

**Dự án đã sẵn sàng cho production!** 🚀

---

<div align="center">

**📞 Support:** [GitHub Issues](https://github.com/AnhBoHelloTeam/MD-projec/issues)

**🌐 Live Demo:** https://md-projec.onrender.com

**🐳 Docker Hub:** https://hub.docker.com/r/nhanng0808/simple-crud-app

</div>
