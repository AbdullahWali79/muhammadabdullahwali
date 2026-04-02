const { URL } = require('url');

const parseMetaTag = (html, attributeNames = [], name) => {
  for (const attr of attributeNames) {
    const regex = new RegExp(`<meta[^>]+(?:property|name)\\s*=\\s*['\"]${attr}['\"][^>]*content\\s*=\\s*['\"]([^'\"]+)['\"][^>]*>`, 'i');
    const match = html.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }

    // Support attributes in reverse order in the tag
    const regexAlt = new RegExp(`<meta[^>]+content\\s*=\\s*['\"]([^'\"]+)['\"][^>]+(?:property|name)\\s*=\\s*['\"]${attr}['\"][^>]*>`, 'i');
    const matchAlt = html.match(regexAlt);
    if (matchAlt && matchAlt[1]) {
      return matchAlt[1].trim();
    }
  }

  if (name) {
    const regex = new RegExp(`<meta[^>]+name\\s*=\\s*['\"]${name}['\"][^>]*content\\s*=\\s*['\"]([^'\"]+)['\"][^>]*>`, 'i');
    const match = html.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return '';
};

const parseLinkTag = (html, relNames = []) => {
  for (const relName of relNames) {
    const regex = new RegExp(`<link[^>]+rel\\s*=\\s*['\"][^'\"]*${relName}[^'\"]*['\"][^>]*href\\s*=\\s*['\"]([^'\"]+)['\"][^>]*>`, 'i');
    const match = html.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }

    // Support href before rel
    const regexAlt = new RegExp(`<link[^>]+href\\s*=\\s*['\"]([^'\"]+)['\"][^>]*rel\\s*=\\s*['\"][^'\"]*${relName}[^'\"]*['\"][^>]*>`, 'i');
    const matchAlt = html.match(regexAlt);
    if (matchAlt && matchAlt[1]) {
      return matchAlt[1].trim();
    }
  }

  return '';
};

const resolveUrl = (input, pageUrl) => {
  if (!input) return '';
  try {
    return new URL(input, pageUrl).href;
  } catch (e) {
    return input;
  }
};

const hostnameToTitle = (hostname = '') => {
  const cleanHost = String(hostname).replace(/^www\./i, '');
  const firstPart = cleanHost.split('.')[0] || cleanHost;
  return firstPart
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const buildFallbackImageUrl = (pageUrl) => {
  try {
    const host = new URL(pageUrl).hostname;
    return `https://logo.clearbit.com/${host}`;
  } catch (e) {
    return '';
  }
};

const extractImageUrl = (html, pageUrl) => {
  let image = parseMetaTag(html, ['og:image', 'og:image:secure_url', 'twitter:image', 'image_src'], 'image');
  if (image) {
    return resolveUrl(image, pageUrl);
  }

  const icon = parseLinkTag(html, ['apple-touch-icon', 'icon', 'shortcut icon']);
  if (icon) {
    return resolveUrl(icon, pageUrl);
  }

  const imgMatch = html.match(/<img[^>]+src=['\"]([^'\"]+)['\"][^>]*>/i);
  if (imgMatch && imgMatch[1]) {
    return resolveUrl(imgMatch[1], pageUrl);
  }

  return '';
};

module.exports = async (req, res) => {
  const url = req.query.url || (req.body && req.body.url);

  if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ success: false, message: 'Invalid URL provided.' });
  }

  let response;
  let html = '';
  let partial = false;
  let message = '';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      redirect: 'follow',
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (response.ok) {
      html = await response.text();
    } else {
      partial = true;
      message = `Remote site blocked metadata fetch with status ${response.status}.`;
    }
  } catch (error) {
    partial = true;
    message = `Metadata fetch fallback used: ${error.message}`;
    console.error('fetch-url-meta error:', error);
  }

  let title = '';
  let description = '';
  let image = '';

  if (html) {
    title = parseMetaTag(html, ['og:title', 'twitter:title'], null);
    if (!title) {
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      title = titleMatch ? titleMatch[1].trim() : '';
    }

    description = parseMetaTag(html, ['og:description', 'twitter:description'], 'description');
    image = extractImageUrl(html, url);
  }

  let hostTitle = '';
  try {
    hostTitle = hostnameToTitle(new URL(url).hostname);
  } catch (e) {
    hostTitle = '';
  }

  if (!title) {
    title = hostTitle || 'Untitled Product';
    partial = true;
  }

  if (!description) {
    description = `Official page for ${hostTitle || 'this product'}.`;
    partial = true;
  }

  if (!image) {
    image = buildFallbackImageUrl(url);
    if (image) {
      partial = true;
    }
  }

  return res.status(200).json({
    success: true,
    url,
    title: title || '',
    description: description || '',
    image: image || '',
    partial,
    message
  });
};
