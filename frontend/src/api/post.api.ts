import httpClient from "@/api/http-client";
import { apiEndpoints } from "@/api/routes";
import { UserRole } from "@/api/routes/types";

/* Add Post */
type AddPostDto = {
  description: string;
  file?: FileList;
};

export const addPostApi = async (values: AddPostDto) => {
  const body = {
    description: values.description.trim(),
    file: values.file && values.file[0],
  };
  const response = await httpClient.post(apiEndpoints.post.add, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.result;
};

/*Delete Post Api*/
export const deletePostApi = async (id: string) => {
  const response = await httpClient.delete(apiEndpoints.post.delete(id));
  return response.data.result;
};

/*Get Post Api*/
export type GetPostResponse = {
  id: string;
  pageId: string;
  file: string;
  title: string;
  description: string;
  updatedAt: string;
  createdAt: string;
  page: {
    id: string;
    name: string;
    image: string;
    description: string;
    updatedAt: string;
    createdAt: string;
    UserPage: {
      pageId: string;
      userId: string;
      updatedAt: string;
      createdAt: string;
      user: {
        id: string;
        name: string;
        email: string;
        isActive: true;
        role: UserRole;
        updatedAt: string;
        createdAt: string;
      };
    }[];
  };
  PostTag: {
    PostId: string;
    tagId: string;
    updatedAt: string;
    createdAt: string;
    tag: {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    };
  }[];
  PostLike: {
    PostId: string;
    userId: string;
    updatedAt: string;
    createdAt: string;
  }[];
};
export const getPostApi = async (id: string): Promise<GetPostResponse> => {
  const response = await httpClient.get(apiEndpoints.post.get(id));
  return response.data.result;
};

/*Get feed Posts Api*/
export type FeedPostResponse = {
  id: string;
  userId: string;
  file: string;
  description: string;
  updatedAt: string;
  createdAt: string;
  _count: {
    PostLike: number;
    PostView: number;
    Comment: number;
  };
  user: {
    id: string;
    email: string;
    mobile: string;
    isActive: true;
    role: UserRole;
    updatedAt: string;
    createdAt: string;
    UserProfile: {
      id: string;
      userId: string;
      name: string;
      profilePhoto: string;
      updatedAt: string;
      createdAt: string;
    };
  };
  PostTag: [
    {
      postId: string;
      tagId: string;
      updatedAt: string;
      createdAt: string;
      tag: {
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
      };
    },
  ];
  PostLike: [
    {
      postId: string;
      userId: string;
      updatedAt: string;
      createdAt: string;
    },
  ];
};

export const getFeedPostsApi = async (
  page: number
): Promise<FeedPostResponse[]> => {
  const response = await httpClient.get(apiEndpoints.post.feed(page));
  return response.data.result;
};

/*Post Like Api */
export const postLikeApi = async (id: string) => {
  const response = await httpClient.post(apiEndpoints.post.like(id));
  return response.data.result;
};

/*Post Save Api */
export const postSaveApi = async (id: string) => {
  const response = await httpClient.post(apiEndpoints.post.save(id));
  return response.data.result;
};

/*Comments Apis*/

/*Find Comments by Post Id Api*/

export type FindCommentsResponse = {
  id: string;
  content: string;
  postId: string;
  userId: string;
  updatedAt: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    mobile: string;
    isActive: true;
    role: UserRole;
    updatedAt: string;
    createdAt: string;
    UserProfile: {
      id: string;
      userId: string;
      name: string;
      profilePhoto: string;
      updatedAt: string;
      createdAt: string;
    };
  };
  LikedComment: {
    userId: string;
    commentId: string;
    updatedAt: string;
    createdAt: string;
  }[];
  _count: {
    LikedComment: 1;
  };
};

export const findCommentsByPostIdApi = async (
  id: string
): Promise<FindCommentsResponse[]> => {
  const response = await httpClient.get(apiEndpoints.post.comments.get(id));
  return response.data.result;
};

/*Like Comment Api*/

export const likeCommentApi = async (id: string) => {
  const response = await httpClient.post(apiEndpoints.post.comments.like(id));
  return response.data.result;
};

/*Add comment Api*/

type AddCommentDto = {
  id: string;
  content: string;
};

export const addCommentApi = async (value: AddCommentDto) => {
  const { id, content } = value;
  const response = await httpClient.post(apiEndpoints.post.comments.add(id), {
    content,
  });
  return response.data.result;
};

/*Update comment api*/
type EditCommentDto = {
  id: string;
  content: string;
};

export const editCommentApi = async (value: EditCommentDto) => {
  const { id, content } = value;
  const response = await httpClient.patch(apiEndpoints.post.comments.edit(id), {
    content,
  });
  return response.data.result;
};

/*Delete comment api*/
type DeleteCommentDto = {
  commentId: string;
  postId: string;
};

export const deleteCommentApi = async (values: DeleteCommentDto) => {
  const response = await httpClient.delete(
    apiEndpoints.post.comments.delete(values.commentId)
  );
  return response.data.result;
};
