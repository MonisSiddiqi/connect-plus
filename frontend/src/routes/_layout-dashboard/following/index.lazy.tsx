import { createLazyFileRoute } from "@tanstack/react-router";
import { FollowingPageCard } from "./-components/following-page-card";
import { followingPageData } from "@/data/data"

export const Route = createLazyFileRoute("/_layout-dashboard/following/")({
  component: FollowingPage,
});

function FollowingPage() {



  return (
    <div className="bg-white grid grid-cols-2 2xl:grid-cols-3 gap-10 p-4">

      {followingPageData.map(({ id, name, views, description, thumbnails }) => {
        return (
          <FollowingPageCard id={id} name={name} views={views} description={description} thumbnails={thumbnails} />
        )
      })}
    </div>
  )
}

export default FollowingPage
