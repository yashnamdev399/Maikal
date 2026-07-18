require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const swaggerUi    = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { connectDB } = require('./config/db');

const app  = express();
const isProd = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve React build in production
if (isProd) {
  app.use(express.static(path.join(__dirname, '../public')));
}

// Swagger (dev only)
if (!isProd) {
  const swaggerSpec = swaggerJsdoc({
    definition: {
      openapi: '3.0.0',
      info: { title: 'Maikal Natural Foundation API', version: '2.0.0' },
      servers: [{ url: 'http://localhost:5000/api' }],
      components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
      security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.js'],
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Maikal Natural Foundation API',
    customCss: '.swagger-ui .topbar { background-color: #2d6a4f; }',
  }));
}

// API Routes
app.use('/api/auth',         require('./routes/auth.routes'));
app.use('/api/products',     require('./routes/products.routes'));
app.use('/api/posts',        require('./routes/posts.routes'));
app.use('/api/gallery',      require('./routes/gallery.routes'));
app.use('/api/contact',      require('./routes/contact.routes'));
app.use('/api/activities',   require('./routes/activities.routes'));
app.use('/api/publications', require('./routes/publications.routes'));
app.use('/api/hero',         require('./routes/hero.routes'));
app.use('/api/testimonials', require('./routes/testimonials.routes'));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'Maikal Natural Foundation' }));

// React SPA fallback
if (isProd) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
}

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: 'Server error.' }));

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🌿 Maikal Natural Foundation → http://localhost:${PORT}`);
      if (!isProd) console.log(`📚 Swagger → http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('❌ Failed to start:', err.message);
    process.exit(1);
  }
};
start();
