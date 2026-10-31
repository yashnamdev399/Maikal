// Frontend and backend are served from the same origin (Railway)
// /api routes are handled by Express directly
const BASE = '/api';

export const getToken = () => localStorage.getItem('maikal_token');

// In-memory cache for public GET requests: key -> { data, time }
const cache = new Map();
const CACHE_TTL = 45 * 1000; // 45 seconds

// Client-side image compression before upload (prevents huge multi-MB uploads)
async function compressImage(file) {
  if (!file || !file.type || !file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/png') {
    return file;
  }
  // If file is already tiny (< 150KB), leave it untouched
  if (file.size < 150 * 1024) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxDim = 1400;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob && blob.size < file.size) {
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        0.82
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

async function request(method, path, body, isFormData = false) {
  const token = getToken();

  // Return cached result for public GET requests
  if (method === 'GET' && !token) {
    const cached = cache.get(path);
    if (cached && (Date.now() - cached.time < CACHE_TTL)) {
      return cached.data;
    }
  }

  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  let reqBody = body;
  if (isFormData && body instanceof FormData) {
    // Compress any image files in the FormData
    const compressedFd = new FormData();
    for (const [key, value] of body.entries()) {
      if (value instanceof File && value.type.startsWith('image/')) {
        const comp = await compressImage(value);
        compressedFd.append(key, comp, comp.name);
      } else {
        compressedFd.append(key, value);
      }
    }
    reqBody = compressedFd;
  } else if (body && !isFormData) {
    reqBody = JSON.stringify(body);
  }

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: reqBody,
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Request failed');

  // Cache successful public GET responses
  if (method === 'GET' && !token) {
    cache.set(path, { data, time: Date.now() });
  } else if (method !== 'GET') {
    // Invalidate cache immediately on create/update/delete
    cache.clear();
  }

  return data;
}

export const api = {
  get:    (path)             => request('GET',    path),
  post:   (path, body)       => request('POST',   path, body),
  put:    (path, body)       => request('PUT',    path, body),
  delete: (path)             => request('DELETE', path),
  upload: (method, path, fd) => request(method,  path, fd, true),
  clearCache: ()             => cache.clear(),
};
