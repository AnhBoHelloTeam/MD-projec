# Simple CRUD API

Ứng dụng CRUD đơn giản được xây dựng với Node.js, Express và có thể deploy lên các platform miễn phí.

## 🚀 Tính năng

- ✅ CRUD operations cho sản phẩm (Create, Read, Update, Delete)
- ✅ API RESTful với Express.js
- ✅ Validation dữ liệu đầu vào
- ✅ Error handling
- ✅ Health check endpoint
- ✅ Docker containerization
- ✅ CI/CD với GitHub Actions
- ✅ Deploy lên multiple platforms miễn phí

## 📋 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Thông tin API và danh sách endpoints |
| GET | `/health` | Health check |
| GET | `/api/products` | Lấy tất cả sản phẩm |
| GET | `/api/products/:id` | Lấy sản phẩm theo ID |
| POST | `/api/products` | Tạo sản phẩm mới |
| PUT | `/api/products/:id` | Cập nhật sản phẩm |
| DELETE | `/api/products/:id` | Xóa sản phẩm |

## 🛠️ Cài đặt và chạy local

### Yêu cầu
- Node.js >= 14.0.0
- npm hoặc yarn

### Cài đặt

```bash
# Clone repository
git clone <your-repo-url>
cd simple-crud-app

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Hoặc chạy production
npm start
```

Server sẽ chạy tại `http://localhost:3000`

### Test API

```bash
# Lấy tất cả sản phẩm
curl http://localhost:3000/api/products

# Tạo sản phẩm mới
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro",
    "price": 35000000,
    "description": "Laptop cao cấp từ Apple",
    "category": "Electronics"
  }'

# Lấy sản phẩm theo ID
curl http://localhost:3000/api/products/1

# Cập nhật sản phẩm
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro M3",
    "price": 40000000,
    "description": "Laptop cao cấp từ Apple với chip M3",
    "category": "Electronics"
  }'

# Xóa sản phẩm
curl -X DELETE http://localhost:3000/api/products/1
```

## 🐳 Docker

### Build và chạy với Docker

```bash
# Build image
docker build -t simple-crud-app .

# Chạy container
docker run -p 3000:3000 simple-crud-app

# Hoặc sử dụng docker-compose
docker-compose up
```

### Test Docker container

```bash
# Health check
curl http://localhost:3000/health

# Test API
curl http://localhost:3000/api/products
```

## 🚀 Deploy lên Platform Miễn Phí

### 1. Railway (Khuyến nghị)

Railway cung cấp 500 giờ miễn phí mỗi tháng.

#### Cách deploy:

1. **Tạo tài khoản Railway:**
   - Truy cập [railway.app](https://railway.app)
   - Đăng ký bằng GitHub

2. **Deploy từ GitHub:**
   - Click "New Project"
   - Chọn "Deploy from GitHub repo"
   - Chọn repository này
   - Railway sẽ tự động detect và deploy

3. **Cấu hình Environment Variables (nếu cần):**
   - Vào Settings > Variables
   - Thêm các biến môi trường cần thiết

4. **Custom Domain (tùy chọn):**
   - Vào Settings > Domains
   - Thêm custom domain

#### Railway sẽ tự động:
- Build Docker image
- Deploy ứng dụng
- Cung cấp HTTPS
- Auto-deploy khi push code mới

### 2. Render

Render cung cấp plan miễn phí với một số giới hạn.

#### Cách deploy:

1. **Tạo tài khoản Render:**
   - Truy cập [render.com](https://render.com)
   - Đăng ký bằng GitHub

2. **Tạo Web Service:**
   - Click "New +" > "Web Service"
   - Connect GitHub repository
   - Chọn repository này

3. **Cấu hình:**
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** `Node`
   - **Plan:** `Free`

4. **Deploy:**
   - Click "Create Web Service"
   - Render sẽ tự động build và deploy

### 3. Vercel

Vercel tốt cho static sites và serverless functions.

#### Cách deploy:

1. **Cài đặt Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Hoặc deploy từ GitHub:**
   - Truy cập [vercel.com](https://vercel.com)
   - Import project từ GitHub
   - Vercel sẽ tự động detect và deploy

### 4. Heroku (Alternative)

Heroku không còn miễn phí nhưng vẫn có thể dùng với credit card.

#### Cách deploy:

1. **Cài đặt Heroku CLI:**
   ```bash
   # Windows
   winget install Heroku.HerokuCLI
   
   # macOS
   brew tap heroku/brew && brew install heroku
   ```

2. **Login và deploy:**
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   ```

## 🔧 CI/CD với GitHub Actions

Repository đã được cấu hình sẵn GitHub Actions workflow:

### Workflow bao gồm:
- ✅ Test code khi push/PR
- ✅ Build Docker image
- ✅ Push image lên Docker Hub
- ✅ Deploy lên Railway (nếu có token)

### Cấu hình Secrets:

Vào GitHub repository > Settings > Secrets and variables > Actions, thêm:

```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
RAILWAY_TOKEN=your-railway-token
```

### Lấy Railway Token:
1. Vào Railway dashboard
2. Account Settings > Tokens
3. Tạo token mới
4. Copy token vào GitHub Secrets

## 📊 Monitoring và Logs

### Railway:
- Vào project dashboard để xem logs
- Metrics có sẵn trong dashboard

### Render:
- Vào service dashboard để xem logs
- Logs realtime có sẵn

### Health Check:
Tất cả platform đều có health check endpoint:
```
GET /health
```

## 🔒 Security Best Practices

- ✅ Sử dụng non-root user trong Docker
- ✅ Health checks
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled
- ✅ Environment variables cho sensitive data

## 🚀 Performance Tips

- ✅ Sử dụng Alpine Linux image (nhẹ hơn)
- ✅ Multi-stage build (nếu cần)
- ✅ Health checks
- ✅ Restart policies
- ✅ Resource limits

## 📝 Cấu trúc Project

```
simple-crud-app/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions workflow
├── server.js                  # Main application file
├── package.json               # Dependencies và scripts
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose setup
├── .dockerignore              # Docker ignore file
├── railway.json               # Railway configuration
├── render.yaml                # Render configuration
├── vercel.json                # Vercel configuration
└── README.md                  # Documentation
```

## 🐛 Troubleshooting

### Common Issues:

1. **Port binding issues:**
   - Đảm bảo sử dụng `process.env.PORT || 3000`
   - Platform sẽ tự động assign port

2. **Build failures:**
   - Check Node.js version compatibility
   - Đảm bảo `engines` field trong package.json

3. **Health check failures:**
   - Verify `/health` endpoint hoạt động
   - Check timeout settings

4. **Environment variables:**
   - Đảm bảo set đúng trong platform dashboard
   - Check variable names và values

## 📞 Support

Nếu gặp vấn đề:
1. Check logs trong platform dashboard
2. Verify environment variables
3. Test local trước khi deploy
4. Check GitHub Actions logs

## 🎯 Next Steps

Để mở rộng ứng dụng:
- [ ] Thêm database (PostgreSQL/MongoDB)
- [ ] Authentication & Authorization
- [ ] Rate limiting
- [ ] API documentation (Swagger)
- [ ] Unit tests
- [ ] Frontend interface
- [ ] Caching (Redis)
- [ ] Monitoring (Prometheus/Grafana)

---

**Happy Coding! 🚀**
