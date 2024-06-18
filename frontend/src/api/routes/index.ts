export const apiEndpoints = {
  auth: {
    login: "/api/v1/auth/login",
    register: "/api/v1/auth/register",
  },
  post: {
    feed: (page: number) => `/api/v1/post/feed/?page=${page}`,
    add: `/api/v1/post`,
    edit: (id: string) => `/api/v1/post/${id}`,
    delete: (id: string) => `/api/v1/post/${id}`,
    get: (id: string) => `/api/v1/post/${id}`,
    like: (id: string) => `/api/v1/post/like/${id}`,
    save: (id: string) => `/api/v1/post/save/${id}`,
    comments: {
      get: (id: string) => `/api/v1/post/comment/${id}`,
      like: (id: string) => `api/v1/post/comment/like/${id}`,
      add: (id: string) => `api/v1/post/comment/${id}`,
      edit: (id: string) => `api/v1/post/comment/${id}`,
      delete: (id: string) => `api/v1/post/comment/${id}`,
    },
  },
  user: {
    me: "api/v1/user/me",
  },
  search: {
    posts: "api/v1/search/post",
  },
};
