import { fetchPosts } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 5;

export function useInfinitePostsData() {
    const QueryClient = useQueryClient();

    return useInfiniteQuery({
        queryKey: QUERY_KEYS.post.list,
        queryFn: async ({ pageParam }) => {
            const from = pageParam * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;
            const posts = await fetchPosts({ from, to });

            posts.forEach((post) => {
                QueryClient.setQueryData(QUERY_KEYS.post.byId(post.id), post);
            });

            return posts.map((post) => post.id);
        },

        initialPageParam: 0,

        // 사용자가 최하단에 닿아서 다음 페이지 번호를 알아야할때
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < PAGE_SIZE) return undefined;
            return allPages.length;
        },

        // 리페칭 방지
        staleTime: Infinity,
    });
}
