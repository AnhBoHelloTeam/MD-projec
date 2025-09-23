# 🚀 Hướng dẫn Deploy Simple CRUD App

## 📋 Tổng quan
Dự án này có thể deploy lên nhiều platform miễn phí với cấu hình sẵn có.

## 🎯 Platform khuyến nghị (Miễn phí)

### 1. Railway (Khuyến nghị nhất)
- **Ưu điểm:** Dễ deploy, auto-deploy từ GitHub, 500 giờ/tháng miễn phí
- **URL:** https://railway.app

#### Cách deploy:
1. Truy cập Railway.app
2. Đăng nhập bằng GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Chọn repository `simple-crud-app`
5. Railway tự động detect và deploy
6. Ứng dụng sẽ có URL dạng: `https://your-app-name.railway.app`

### 2. Render
- **Ưu điểm:** Stable, có free tier
- **URL:** https://render.com

#### Cách deploy:
1. Truy cập Render.com
2. Đăng nhập bằng GitHub
3. Click "New +" → "Web Service"
4. Connect GitHub repository
5. Cấu hình:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** `Node`
   - **Plan:** `Free`
6. Click "Create Web Service"

### 3. Vercel
- **Ưu điểm:** Tốt cho static sites và serverless
- **URL:** https://vercel.com

#### Cách deploy:
1. Truy cập Vercel.com
2. Import project từ GitHub
3. Vercel tự động detect và deploy

### 4. Heroku (Alternative)
- **Lưu ý:** Cần credit card nhưng có free tier
- **URL:** https://heroku.com

## 🔧 Cấu hình Environment Variables

### Railway
- Vào project dashboard → Settings → Variables
- Thêm nếu cần:
  ```
  NODE_ENV=production
  PORT=3000
  ```

### Render
- Vào service dashboard → Environment
- Thêm nếu cần:
  ```
  NODE_ENV=production
  ```

## 🐳 Docker Deploy

Nếu muốn deploy với Docker:

### Railway
- Tự động detect Dockerfile
- Không cần cấu hình thêm

### Render
- Cần cấu hình:
  - **Build Command:** `docker build -t app .`
  - **Start Command:** `docker run -p 10000:3000 app`

## 🔄 CI/CD với GitHub Actions

Repository đã có sẵn workflow `.github/workflows/ci-cd.yml`:

### Cấu hình Secrets (nếu muốn auto-deploy):
1. Vào GitHub repository → Settings → Secrets and variables → Actions
2. Thêm:
   ```
   DOCKER_USERNAME=your-dockerhub-username
   DOCKER_PASSWORD=your-dockerhub-password
   RAILWAY_TOKEN=your-railway-token
   ```

### Lấy Railway Token:
1. Vào Railway dashboard
2. Account Settings → Tokens
3. Tạo token mới
4. Copy vào GitHub Secrets

## 📊 Monitoring và Logs

### Railway
- Dashboard → Logs tab
- Real-time logs
- Metrics có sẵn

### Render
- Service dashboard → Logs
- Logs realtime

## 🛠️ Troubleshooting

### Common Issues:

1. **Build fails:**
   - Check Node.js version (cần >= 14.0.0)
   - Verify package.json có đúng dependencies

2. **App không start:**
   - Check PORT environment variable
   - Verify start command

3. **Health check fails:**
   - Verify `/health` endpoint hoạt động
   - Check timeout settings

4. **Static files không load:**
   - Verify `express.static('public')` trong server.js
   - Check file paths

## 🎯 Test sau khi deploy

1. **Health check:**
   ```
   GET https://your-app-url/health
   ```

2. **API endpoints:**
   ```
   GET https://your-app-url/api/products
   POST https://your-app-url/api/products
   ```

3. **Web interface:**
   ```
   https://your-app-url/
   ```

## 📱 Custom Domain (Optional)

### Railway
1. Vào project → Settings → Domains
2. Add custom domain
3. Cấu hình DNS

### Render
1. Vào service → Settings → Custom Domains
2. Add domain
3. Cấu hình DNS

## 🔒 Security Best Practices

- ✅ Sử dụng HTTPS (tự động có sẵn)
- ✅ Environment variables cho sensitive data
- ✅ CORS enabled
- ✅ Input validation
- ✅ Error handling

## 📈 Performance Tips

- ✅ Sử dụng CDN cho static files
- ✅ Enable gzip compression
- ✅ Optimize images
- ✅ Use caching headers

---

**Happy Deploying! 🚀**
