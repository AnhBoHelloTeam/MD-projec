const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory database (thay thế bằng database thật trong production)
let products = [
  {
    id: '1',
    name: 'Laptop Dell XPS 13',
    price: 15000000,
    description: 'Laptop cao cấp với màn hình 13 inch',
    category: 'Electronics',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    price: 25000000,
    description: 'Điện thoại thông minh mới nhất từ Apple',
    category: 'Electronics',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Áo thun nam',
    price: 200000,
    description: 'Áo thun cotton chất lượng cao',
    category: 'Fashion',
    createdAt: new Date().toISOString()
  }
];

// Routes

// GET /api/products - Lấy tất cả sản phẩm
app.get('/api/products', (req, res) => {
  try {
    res.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách sản phẩm',
      error: error.message
    });
  }
});

// GET /api/products/:id - Lấy sản phẩm theo ID
app.get('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy sản phẩm',
      error: error.message
    });
  }
});

// POST /api/products - Tạo sản phẩm mới
app.post('/api/products', (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    
    // Validation
    if (!name || !price || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin sản phẩm'
      });
    }
    
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Giá sản phẩm phải lớn hơn 0'
      });
    }
    
    const newProduct = {
      id: uuidv4(),
      name,
      price: parseInt(price),
      description,
      category,
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    
    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo sản phẩm',
      error: error.message
    });
  }
});

// PUT /api/products/:id - Cập nhật sản phẩm
app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category } = req.body;
    
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    // Validation
    if (!name || !price || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin sản phẩm'
      });
    }
    
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Giá sản phẩm phải lớn hơn 0'
      });
    }
    
    products[productIndex] = {
      ...products[productIndex],
      name,
      price: parseInt(price),
      description,
      category,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: products[productIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật sản phẩm',
      error: error.message
    });
  }
});

// DELETE /api/products/:id - Xóa sản phẩm
app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    const deletedProduct = products.splice(productIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công',
      data: deletedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa sản phẩm',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint - serve the web interface
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Test dashboard endpoint
app.get('/test', (req, res) => {
  res.sendFile(__dirname + '/public/test-dashboard.html');
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Simple CRUD API',
    version: '1.0.0',
    endpoints: {
      'GET /api/products': 'Lấy tất cả sản phẩm',
      'GET /api/products/:id': 'Lấy sản phẩm theo ID',
      'POST /api/products': 'Tạo sản phẩm mới',
      'PUT /api/products/:id': 'Cập nhật sản phẩm',
      'DELETE /api/products/:id': 'Xóa sản phẩm',
      'GET /health': 'Health check'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint không tồn tại'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Lỗi server nội bộ',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
});

module.exports = app;
