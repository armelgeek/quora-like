export const API_ENDPOINTS = {
  endpoint: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
    version: "v1",
  },
  blog: {
    list: "/blogs",
    detail: (id: string) => `/blogs/${id}`,
    create: "/blogs",
    update: (id: string) => `/blogs/${id}`,
    delete: (id: string) => `/blogs/${id}`,
  }
};
