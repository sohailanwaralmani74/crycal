const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const matter = require('gray-matter');
const { marked } = require('marked');
const { Liquid } = require('liquidjs');

marked.setOptions({ gfm: true, breaks: true });

const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy directory recursively helper
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy static assets
copyDir(path.join(__dirname, 'assets'), path.join(distDir, 'assets'));
copyDir(path.join(__dirname, 'downloads'), path.join(distDir, 'downloads'));

const staticFiles = ['robots.txt', 'CNAME', 'llms.txt', 'wanjaaro.webp'];
for (const file of staticFiles) {
  const p = path.join(__dirname, file);
  if (fs.existsSync(p)) {
    fs.copyFileSync(p, path.join(distDir, file));
  }
}

// Load config, data, posts
const siteConfig = yaml.load(fs.readFileSync(path.join(__dirname, '_config.yml'), 'utf8')) || {};
const categories = yaml.load(fs.readFileSync(path.join(__dirname, '_data', 'categories.yml'), 'utf8')) || {};
const tools = yaml.load(fs.readFileSync(path.join(__dirname, '_data', 'tools.yml'), 'utf8')) || [];

const posts = [];
const postsDir = path.join(__dirname, '_posts');
if (fs.existsSync(postsDir)) {
  const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  for (const file of postFiles) {
    const fullPath = path.join(postsDir, file);
    const parsed = matter(fs.readFileSync(fullPath, 'utf8'));
    const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
    const slug = dateMatch ? dateMatch[2] : file.replace('.md', '');
    const dateStr = dateMatch ? dateMatch[1] : (parsed.data.date || '');
    posts.push({
      ...parsed.data,
      title: parsed.data.title || slug,
      slug,
      date: dateStr,
      url: parsed.data.permalink || ('/' + slug),
      categories: parsed.data.category ? [parsed.data.category] : (parsed.data.categories || []),
      filePath: fullPath
    });
  }
}
posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

const site = {
  ...siteConfig,
  url: siteConfig.url || 'https://wanjaaro.com',
  data: { categories, tools },
  posts
};

const engine = new Liquid({
  root: [__dirname, path.join(__dirname, '_layouts'), path.join(__dirname, '_includes')],
  extname: '.html',
  jekyllInclude: true,
  dynamicPartials: false
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

const layouts = {
  default: fs.readFileSync(path.join(__dirname, '_layouts', 'default.html'), 'utf8'),
  tool: fs.existsSync(path.join(__dirname, '_layouts', 'tool.html'))
    ? fs.readFileSync(path.join(__dirname, '_layouts', 'tool.html'), 'utf8')
    : null,
  blog: fs.existsSync(path.join(__dirname, '_layouts', 'blog.html'))
    ? fs.readFileSync(path.join(__dirname, '_layouts', 'blog.html'), 'utf8')
    : null
};

async function renderPage(slug, filePath, pageData, content) {
  const page = {
    ...pageData,
    name: path.basename(filePath),
    url: slug === '' ? '/' : '/' + slug
  };

  // Pre-render Liquid tags inside page content (e.g. {% include %})
  const renderedContent = await engine.parseAndRender(content || '', { site, page });

  const contentHtml = marked.parse(renderedContent);
  let finalContent = contentHtml;
  const layoutType = page.layout || 'default';

  if (layoutType === 'tool' && layouts.tool) {
    const toolMatter = matter(layouts.tool);
    finalContent = await engine.parseAndRender(toolMatter.content, { site, page, content: contentHtml });
  } else if (layoutType === 'blog' && layouts.blog) {
    const blogMatter = matter(layouts.blog);
    finalContent = await engine.parseAndRender(blogMatter.content, { site, page, content: contentHtml });
  }

  return await engine.parseAndRender(layouts.default, { site, page, content: finalContent });
}

async function buildAll() {
  console.log('Building all pages...');
  const routes = new Map();

  // Root markdown files
  const rootFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.md') && !f.startsWith('.'));
  for (const file of rootFiles) {
    const fullPath = path.join(__dirname, file);
    const parsed = matter(fs.readFileSync(fullPath, 'utf8'));
    let slug = file.replace(/\.md$/, '');
    if (slug === 'index') slug = '';
    if (parsed.data.permalink) slug = parsed.data.permalink.replace(/^\/|\/$/g, '');
    routes.set(slug, { filePath: fullPath, data: parsed.data, content: parsed.content });
  }

  // Posts
  for (const post of site.posts) {
    const slug = post.url.replace(/^\/|\/$/g, '');
    const parsed = matter(fs.readFileSync(post.filePath, 'utf8'));
    routes.set(slug, { filePath: post.filePath, data: parsed.data, content: parsed.content });
  }

  let count = 0;
  for (const [slug, item] of routes.entries()) {
    try {
      const html = await renderPage(slug, item.filePath, item.data, item.content);
      if (slug === '') {
        fs.writeFileSync(path.join(distDir, 'index.html'), html);
      } else if (slug === '404' || slug === '404.html') {
        fs.writeFileSync(path.join(distDir, '404.html'), html);
      } else {
        // Write both /slug.html and /slug/index.html to guarantee 0 broken links on any host
        fs.writeFileSync(path.join(distDir, `${slug}.html`), html);
        const subDir = path.join(distDir, slug);
        fs.mkdirSync(subDir, { recursive: true });
        fs.writeFileSync(path.join(subDir, 'index.html'), html);
      }
      count++;
    } catch (err) {
      console.error(`Error rendering page: ${slug}`, err);
    }
  }

  // Generate sitemap.xml
  const baseUrl = site.url || 'https://wanjaaro.com';
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  for (const [slug, item] of routes.entries()) {
    if (!slug || slug === 'index' || slug === '404' || slug === '404.html') continue;
    const priority = '0.8';
    xml += `  <url>\n    <loc>${baseUrl}/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  }
  xml += '</urlset>';
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);

  console.log(`Successfully built ${count} pages into /dist and generated sitemap.xml!`);
}

buildAll().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
