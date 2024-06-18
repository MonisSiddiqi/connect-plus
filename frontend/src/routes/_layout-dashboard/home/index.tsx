import { createFileRoute } from "@tanstack/react-router";
import { PostFeed } from "../-components/post-feed";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeedPostsApi } from "@/api/post.api";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";

import { ShareThoughts } from "./-components/share-thoughts";

export const Route = createFileRoute("/_layout-dashboard/home/")({
  component: HomePage,
});

function HomePage() {
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => getFeedPostsApi(pageParam),
    initialPageParam: 1,
    getNextPageParam: (_, pages) => pages.length + 1,
  });

  const lastRef = useRef<HTMLDivElement>(null);
  const { entry, ref } = useIntersection({
    root: lastRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry]);

  const postData = data?.pages.flatMap((page) => page);

  return (
    <div className="w-full flex justify-between pt-4">
      <div className="w-full flex flex-col gap-4 pb-4">
        <ShareThoughts />
        {postData?.map((item, i) => {
          if (i === postData.length - 1) {
            return (
              <div ref={ref} key={item.id}>
                <PostFeed key={item.id} {...item} />
              </div>
            );
          }
          return (
            <div key={item.id}>
              <PostFeed
                key={item.id}
                PostTag={item.PostTag}
                _count={item._count}
                createdAt={item.createdAt}
                description={item.description}
                file={item.file}
                id={item.id}
                updatedAt={item.updatedAt}
                PostLike={item.PostLike}
                user={item.user}
                userId={item.userId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
