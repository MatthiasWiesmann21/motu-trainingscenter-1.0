"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { PostCard } from "./post-card";
import { Category, Post } from "@prisma/client";
import { useLanguage } from "@/lib/check-language";
import { Categories } from "./categories";
import ClubyteLoader from "@/components/ui/clubyte-loader";
import { useTheme } from "next-themes";

type PostWithProgressWithCategory = Post & {
  category: Category | null;
  likesCount: number;
  currentLike: boolean;
  commentsWithLikes: any;
  commentsCount: number;
};

interface NewsWrapperProps {
  searchParams: {
    categoryId: string;
  };
  categories: any;
  ThemeOutlineColor: string;
  DarkThemeOutlineColor: string;
}

const NewsWrapper = ({
  searchParams,
  categories,
  ThemeOutlineColor,
  DarkThemeOutlineColor,
}: NewsWrapperProps) => {
  const { categoryId } = searchParams;
  const [posts, setPosts] = useState<PostWithProgressWithCategory[]>([]);
  const [isLoading, setLoading] = useState(false);
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const currentLanguage = useLanguage();

  const updateLikeComment = (post: any) => {
    const tempPost = posts?.map((each) =>
      each?.id === post?.id ? post : each
    );
    setPosts(tempPost);
  };

  const getPosts = async (reset = false) => {
    setLoading(true);
    const response = await axios?.get(
      categoryId
        ? `/api/posts?page=${reset ? 1 : page}&categoryId=${categoryId}`
        : `/api/posts?page=${reset ? 1 : page}`
    );
    const newPosts = response?.data?.data ?? [];

    if (reset) {
      setPosts(newPosts);
      setPage(1);
    } else {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    }

    setLoading(false);
    setPage((prevPage) => prevPage + 1);
    setHasMore(newPosts.length > 0);
  };

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    getPosts(true);
  }, [categoryId]);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          getPosts();
        }
      },
      { threshold: 1 }
    );

    if (observer?.current) {
      // @ts-ignore
      observer?.current?.observe(document?.querySelector(".loading-indicator"));
    }

    return () => {
      if (observer?.current) {
        observer?.current?.disconnect();
      }
    };
  }, [hasMore, isLoading, categoryId]);

  return (
    <div className="space-y-4 px-4 pt-4 dark:bg-[#110524]">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl">
          <Categories
            items={categories}
            ThemeOutlineColor={ThemeOutlineColor}
            DarkThemeOutlineColor={DarkThemeOutlineColor}
          />
          {posts?.map((item) => (
            <PostCard
              key={item?.id}
              id={item?.id}
              title={item?.title}
              imageUrl={item?.imageUrl ?? ""}
              category={item?.category?.name ?? ""}
              description={item?.description ?? ""}
              createdAt={new Date(item?.publishTime!).toDateString()}
              publisherName={item?.publisherName!}
              publisherImageUrl={item?.publisherImageUrl!}
              colorCode={item?.category?.colorCode!}
              likesCount={item?.likesCount}
              currentLike={item?.currentLike}
              commentsWithLikes={item?.commentsWithLikes}
              commentsCount={item?.commentsCount}
              updateLikeComment={updateLikeComment}
            />
          ))}
        </div>
        <div className="loading-indicator" />
        {isLoading ? (
          <div className="flex min-h-screen items-center justify-center">
            {theme === "dark" ? (
              <ClubyteLoader className="w-64 h-64" theme="dark" color="110524" />
            ) : (
              <ClubyteLoader className="w-64 h-64" theme="light" color="ffffff" />
            )}
          </div>
        ) : (
          !isLoading &&
          posts?.length === 0 && (
            <div className="mt-10 text-center text-sm text-muted-foreground">
              {currentLanguage.news_no_posts_found}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default dynamic(() => Promise?.resolve(NewsWrapper), { ssr: false });
