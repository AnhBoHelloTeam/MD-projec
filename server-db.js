const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert sample data if table is empty
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (err) {
      console.error('Error checking products count:', err);
    } else if (row.count === 0) {
      console.log('📊 Inserting sample data...');
      
      const sampleProducts = [
        {
          id: '1',
          name: 'Laptop Dell XPS 13',
          price: 15000000,
          description: 'Laptop cao cấp với màn hình 13 inch',
          category: 'Electronics'
        },
        {
          id: '2',
          name: 'iPhone 15 Pro',
          price: 25000000,
          description: 'Điện thoại thông minh mới nhất từ Apple',
          category: 'Electronics'
        },
        {
          id: '3',
          name: 'Áo thun nam',
          price: 200000,
          description: 'Áo thun cotton chất lượng cao',
          category: 'Fashion'
        }
      ];

      const stmt = db.prepare(`INSERT INTO products (id, name, price, description, category) 
                               VALUES (?, ?, ?, ?, ?)`);
      
      sampleProducts.forEach(product => {
        stmt.run(product.id, product.name, product.price, product.description, product.category);
      });
      
      stmt.finalize();
      console.log('✅ Sample data inserted successfully!');
    }
  });
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes

// GET /api/products - Lấy tất cả sản phẩm
app.get('/api/products', (req, res) => {
  try {
    db.all("SELECT * FROM products ORDER BY created_at DESC", (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi database khi lấy danh sách sản phẩm',
          error: err.message
        });
      }
      
      res.json({
        success: true,
        data: rows,
        total: rows.length
      });
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
    
    db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi database khi lấy sản phẩm',
          error: err.message
        });
      }
      
      if (!row) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm'
        });
      }
      
      res.json({
        success: true,
        data: row
      });
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
    
    const id = uuidv4();
    
    db.run(`INSERT INTO products (id, name, price, description, category) 
            VALUES (?, ?, ?, ?, ?)`, 
           [id, name, price, description, category], 
           function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi database khi tạo sản phẩm',
          error: err.message
        });
      }
      
      // Get the created product
      db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi database khi lấy sản phẩm vừa tạo',
            error: err.message
          });
        }
        
        res.status(201).json({
          success: true,
          message: 'Tạo sản phẩm thành công',
          data: row
        });
      });
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
    
    db.run(`UPDATE products 
            SET name = ?, price = ?, description = ?, category = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?`, 
           [name, price, description, category, id], 
           function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi database khi cập nhật sản phẩm',
          error: err.message
        });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm'
        });
      }
      
      // Get the updated product
      db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi database khi lấy sản phẩm đã cập nhật',
            error: err.message
          });
        }
        
        res.json({
          success: true,
          message: 'Cập nhật sản phẩm thành công',
          data: row
        });
      });
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
    
    // Get product before deleting
    db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi database khi lấy sản phẩm',
          error: err.message
        });
      }
      
      if (!row) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm'
        });
      }
      
      // Delete the product
      db.run("DELETE FROM products WHERE id = ?", [id], function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi database khi xóa sản phẩm',
            error: err.message
          });
        }
        
        res.json({
          success: true,
          message: 'Xóa sản phẩm thành công',
          data: row
        });
      });
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
  // Check database connection
  db.get("SELECT 1", (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: err.message,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    }
    
    res.json({
      success: true,
      message: 'Server is running with database',
      database: 'SQLite connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
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
    message: 'Welcome to Simple CRUD API with Database',
    version: '2.0.0',
    database: 'SQLite',
    endpoints: {
      'GET /api/products': 'Lấy tất cả sản phẩm',
      'GET /api/products/:id': 'Lấy sản phẩm theo ID',
      'POST /api/products': 'Tạo sản phẩm mới',
      'PUT /api/products/:id': 'Cập nhật sản phẩm',
      'DELETE /api/products/:id': 'Xóa sản phẩm',
      'GET /health': 'Health check với database'
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

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`🧪 Test Dashboard: http://localhost:${PORT}/test`);
  console.log(`🗄️ Database: SQLite (${dbPath})`);
});

module.exports = app;
