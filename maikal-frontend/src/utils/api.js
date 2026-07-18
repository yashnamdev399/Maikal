// In dev: Vite proxies /api → http://localhost:5000
// In prod: React is served by the same Express server, so /api works directly
const BASE = '/api';

export const getToken = () => localStorage.getItem('maikal_token');

async function request(method, path, body, isFormData = false) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  get:    (path)             => request('GET',    path),
  post:   (path, body)       => request('POST',   path, body),
  put:    (path, body)       => request('PUT',    path, body),
  delete: (path)             => request('DELETE', path),
  upload: (method, path, fd) => request(method,  path, fd, true),
};
