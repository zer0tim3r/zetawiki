import axios from "axios";

// ----------------------------------------------------------------------

type RESTReply = {
  c: Number,
  d: any
}

const REST_API_USER = "https://sunrin.wiki"

const axiosInstance = axios.create({ baseURL: process.env.HOST_API_KEY || '' });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || { c: 503, d: 'Service Unavailable' })
);

export default axiosInstance;

export function getDocument(title: string, params?: object) {
  return axiosInstance.get(`/document/${encodeURIComponent(title)}`, {
    params
  }).then(r => (r.data as RESTReply).d, () => null);
}

export function historyDocument(title: string) {
  return axiosInstance.get(`/history/${encodeURIComponent(title)}`).then(r => (r.data as RESTReply).d, () => null);
}

export function contributeUser(user: string) {
  return axiosInstance.get(`/contribute/${user}`).then(r => (r.data as RESTReply).d, () => null);
}

export function getRecent(): Promise<any[]> {
  return axiosInstance.get("/recent").then(r => (r.data as RESTReply).d, () => null);
}

export function queryDocumentAPI(title: string) {
  return axiosInstance.get(`${REST_API_USER}/api/document`, {
    params: {
      title
    }
  }).then(r => (r.data as RESTReply).d, () => null);
}

export function putDocumentAPI(title: string, content: string) {
  return axiosInstance.put(`${REST_API_USER}/api/document/${encodeURIComponent(title)}`, content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  }).then(r => (r.data as RESTReply).c === 200, () => false);
}

export function moveDocumentAPI(_id: number, title: string) {
  return axiosInstance.post(`${REST_API_USER}/api/document/${_id}`, title, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  }).then(r => (r.data as RESTReply).c === 200, () => false);
}