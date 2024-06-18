import { searchPostApi } from "@/api/search.api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

type SearchText = {
  text: string;
};

export const Route = createFileRoute("/_layout-dashboard/search/")({
  validateSearch: (search: Record<string, string>): SearchText => {
    return {
      text: search?.text,
    };
  },
  component: Search,
});

function Search() {
  const { text } = Route.useSearch();
  const { data, error, isLoading, isError } = useQuery({
    queryKey: [`search/${text}`],
    queryFn: () => searchPostApi(text),
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }
  if (!data) {
    return <div>Data not found</div>;
  }
  return {};
}
