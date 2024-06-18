import httpClient from "@/api/http-client";
import { apiEndpoints } from "./routes";

/*Search Post api*/
export type SearchPostResponse = {
  id: string;
  pageId: string;
  file: string;
  title: string;
  description: string;
  updatedAt: string;
  createdAt: string;
  _count: {
    PostView: number;
  };
  PostTag: {
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
  }[];
};

export const searchPostApi = async (
  text: string
): Promise<SearchPostResponse[]> => {
  const response = await httpClient.get(apiEndpoints.search.posts, {
    params: text,
  });
  return response.data.result;
};
