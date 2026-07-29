require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs    = require('fs');
const swaggerUi    = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { connectDB } = require('./config/db');

const app  = express();
const isProd = process.env.NODE_ENV === 'production';
const PUBLIC_DIR = path.join(__dirname, '../public');
const INDEX_HTML = path.join(PUBLIC_DIR, 'index.html');
const hasPublicBuild = fs.existsSync(INDEX_HTML);
const serveFrontend = isProd || hasPublicBuild;

// Debug: log which bundle is being served (helps trace Railway cache issues)
console.log(`📂 Public dir: ${PUBLIC_DIR}`);
console.log(`📄 index.html exists: ${hasPublicBuild}`);
if (hasPublicBuild) {
  const html = fs.readFileSync(INDEX_HTML, 'utf8');
  const match = html.match(/assets\/index-[^"]+\.js/);
  console.log(`🔖 Active JS bundle: ${match ? match[0] : 'NOT FOUND'}`);
}

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve React build
if (serveFrontend) {
  app.use(express.static(PUBLIC_DIR, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));
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

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${req.protocol}://${req.get('host')}/sitemap.xml`);
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><priority>1.0</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/activities</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/publications</loc><priority>0.8</priority><changefreq>monthly</changefreq></url>
</urlset>`;
  res.send(xml);
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'Maikal Natural Foundation' }));

// React SPA fallback
if (serveFrontend) {
  app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(INDEX_HTML);
  });
}

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: 'Server error.' }));

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB();
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌿 Maikal Natural Foundation listening on 0.0.0.0:${PORT}`);
  if (!isProd) {
    console.log(`📚 Swagger → http://localhost:${PORT}/api-docs`);
  }
});
  } catch (err) {
    console.error('❌ Failed to start:', err.message);
    process.exit(1);
  }
};
start();
