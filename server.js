const express = require('express');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const matter = require('gray-matter');
const { marked } = require('marked');
const { Liquid } = require('liquidjs');

const app = express();
const PORT = 3000;

// Configure Marked
marked.setOptions({
  gfm: true,
  breaks: true
});

// Configure LiquidJS engine
const engine = new Liquid({
  root: [__dirname, path.join(__dirname, '_layouts'), path.join(__dirname, '_includes')],
  extname: '.html',
  jekyllInclude: true,
  dynamicPartials: false,
  cache: process.env.NODE_ENV === 'production'
});

engine.registerFilter('absolute_url', (v) => {
  if (!v) return 'https://wanjaaro.com';
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  return 'https://wanjaaro.com' + (v.startsWith('/') ? v : '/' + v);
});

engine.registerFilter('relative_url', (v) => {
  if (!v) return '/';
  return v.startsWith('/') ? v : '/' + v;
});

engine.registerFilter('jsonify', (v) => JSON.stringify(v, null, 2));

// Load Site Configuration & Data
function loadSiteData() {
  let siteConfig = {};
  try {
    siteConfig = yaml.load(fs.readFileSync(path.join(__dirname, '_config.yml'), 'utf8')) || {};
  } catch (err) {
    console.error('Error loading _config.yml:', err);
  }

  let categories = {};
  try {
    categories = yaml.load(fs.readFileSync(path.join(__dirname, '_data', 'categories.yml'), 'utf8')) || {};
  } catch (err) {
    console.error('Error loading categories.yml:', err);
  }

  let tools = [];
  try {
    tools = yaml.load(fs.readFileSync(path.join(__dirname, '_data', 'tools.yml'), 'utf8')) || [];
  } catch (err) {
    console.error('Error loading tools.yml:', err);
  }

  // Load Posts from _posts/
  const posts = [];
  const postsDir = path.join(__dirname, '_posts');
  if (fs.existsSync(postsDir)) {
    const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    for (const file of postFiles) {
      try {
        const fullPath = path.join(postsDir, file);
        const parsed = matter(fs.readFileSync(fullPath, 'utf8'));
        const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
        const slug = dateMatch ? dateMatch[2] : file.replace('.md', '');
        const dateStr = dateMatch ? dateMatch[1] : (parsed.data.date || '');
        const url = parsed.data.permalink || ('/' + slug);

        posts.push({
          ...parsed.data,
          title: parsed.data.title || slug,
          slug,
          date: dateStr,
          url,
          categories: parsed.data.category ? [parsed.data.category] : (parsed.data.categories || []),
          filePath: fullPath
        });
      } catch (err) {
        console.error('Error reading post', file, err);
      }
    }
  }

  // Sort posts by date descending
  posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return {
    ...siteConfig,
    url: siteConfig.url || 'https://wanjaaro.com',
    data: {
      categories,
      tools
    },
    posts
  };
}

let site = loadSiteData();

// Build page registry mapping slugs to file info
function buildPageRegistry() {
  const routes = new Map();

  // 1. Root markdown files
  const rootFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.md') && !f.startsWith('.'));
  for (const file of rootFiles) {
    const fullPath = path.join(__dirname, file);
    try {
      const parsed = matter(fs.readFileSync(fullPath, 'utf8'));
      let slug = file.replace(/\.md$/, '');
      if (slug === 'index') {
        slug = '';
      }
      if (parsed.data.permalink) {
        slug = parsed.data.permalink.replace(/^\/|\/$/g, '');
      }

      routes.set(slug, {
        filePath: fullPath,
        type: 'root',
        data: parsed.data,
        content: parsed.content
      });
    } catch (err) {
      console.error('Error reading file for registry:', file, err);
    }
  }

  // 2. Posts
  for (const post of site.posts) {
    const slug = post.url.replace(/^\/|\/$/g, '');
    const parsed = matter(fs.readFileSync(post.filePath, 'utf8'));
    routes.set(slug, {
      filePath: post.filePath,
      type: 'post',
      data: parsed.data,
      content: parsed.content
    });
  }

  return routes;
}

const pageRegistry = buildPageRegistry();

// In-memory HTML cache
const htmlCache = new Map();

// Layout templates cache
const layouts = {
  default: fs.readFileSync(path.join(__dirname, '_layouts', 'default.html'), 'utf8'),
  tool: fs.existsSync(path.join(__dirname, '_layouts', 'tool.html'))
    ? fs.readFileSync(path.join(__dirname, '_layouts', 'tool.html'), 'utf8')
    : null,
  blog: fs.existsSync(path.join(__dirname, '_layouts', 'blog.html'))
    ? fs.readFileSync(path.join(__dirname, '_layouts', 'blog.html'), 'utf8')
    : null
};

// Render page to HTML string
async function renderPage(slug, pageInfo) {
  const pageData = {
    ...pageInfo.data,
    name: path.basename(pageInfo.filePath),
    url: slug === '' ? '/' : '/' + slug
  };

  // Convert markdown body to HTML
  const contentHtml = marked.parse(pageInfo.content || '');

  let finalContent = contentHtml;
  const layoutType = pageData.layout || 'default';

  if (layoutType === 'tool' && layouts.tool) {
    const toolMatter = matter(layouts.tool);
    finalContent = await engine.parseAndRender(toolMatter.content, {
      site,
      page: pageData,
      content: contentHtml
    });
  } else if (layoutType === 'blog' && layouts.blog) {
    const blogMatter = matter(layouts.blog);
    finalContent = await engine.parseAndRender(blogMatter.content, {
      site,
      page: pageData,
      content: contentHtml
    });
  }

  // Top-level layout (default.html)
  const fullHtml = await engine.parseAndRender(layouts.default, {
    site,
    page: pageData,
    content: finalContent
  });

  return fullHtml;
}

// -------------------------------------------------------------
// Middleware & Static Routes
// -------------------------------------------------------------

// Redirect trailing slash (canonical URLs prevent 404s and duplicate content)
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith('/')) {
    const query = req.url.slice(req.path.length);
    const nonTrailing = req.path.slice(0, -1) + query;
    return res.redirect(301, nonTrailing);
  }
  next();
});

// Static assets
app.use('/assets', express.static(path.join(__dirname, 'assets'), { maxAge: '1h' }));
app.use('/downloads', express.static(path.join(__dirname, 'downloads'), { maxAge: '1h' }));

// Robots.txt
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

// CNAME
app.get('/CNAME', (req, res) => {
  res.sendFile(path.join(__dirname, 'CNAME'));
});

// LLMs.txt
app.get('/llms.txt', (req, res) => {
  const p = path.join(__dirname, 'llms.txt');
  if (fs.existsSync(p)) {
    res.sendFile(p);
  } else {
    res.status(404).end();
  }
});

// Sitemap.xml (Dynamic & Complete)
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = site.url || 'https://wanjaaro.com';
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Homepage
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  for (const [slug, item] of pageRegistry.entries()) {
    if (!slug || slug === 'index' || slug === '404' || slug === '404.html') continue;
    const priority = item.type === 'root' ? (slug.endsWith('calculator') ? '0.9' : '0.8') : '0.7';
    xml += `  <url>\n    <loc>${baseUrl}/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  }

  xml += '</urlset>';
  res.type('application/xml').send(xml);
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Main Page Route Handler
app.get('*', async (req, res, next) => {
  try {
    let slug = req.path.replace(/^\/|\/$/g, '');
    if (slug.endsWith('.html')) {
      const stripped = slug.replace(/\.html$/, '');
      if (pageRegistry.has(stripped)) {
        return res.redirect(301, '/' + stripped);
      }
    }

    if (pageRegistry.has(slug)) {
      if (htmlCache.has(slug) && process.env.NODE_ENV === 'production') {
        return res.type('html').send(htmlCache.get(slug));
      }

      const pageInfo = pageRegistry.get(slug);
      const html = await renderPage(slug, pageInfo);
      htmlCache.set(slug, html);
      return res.type('html').send(html);
    }

    // 404 Not Found
    res.status(404);
    if (pageRegistry.has('404')) {
      const pageInfo = pageRegistry.get('404');
      const html = await renderPage('404', pageInfo);
      return res.type('html').send(html);
    } else {
      return res.send('<h1>404 — Page Not Found</h1><p><a href="/">Return to Home</a></p>');
    }
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error on route', req.path, err);
  res.status(500).send('<h1>500 — Internal Server Error</h1><pre>' + (err.message || '') + '</pre>');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Wanjaaro Calculators] Dev server listening on port ${PORT}`);
});
