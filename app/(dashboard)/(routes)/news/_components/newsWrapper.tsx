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
import { Separator } from "@/components/ui/separator";
import { PostFavoriteCard } from "./postFavorite-card";
import { CaptionsOff, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "@/components/scroll-area";

type PostWithProgressWithCategory = Post & {
  category: Category | null;
  likesCount: number;
  favoritesCount: number;
  currentLike: boolean;
  currentFavorite: boolean;
  commentsWithLikes: any;
  commentsCount: number;
};

interface NewsWrapperProps {
  searchParams: {
    categoryId: string;
  };
  categories: any;
  ThemeColor: string;
  DarkThemeColor: string;
  profileImage: string;
  profileRole: string;
  currentProfileId: string;
}

const NewsWrapper = ({
  searchParams,
  categories,
  ThemeColor,
  DarkThemeColor,
  profileImage,
  profileRole,
  currentProfileId,
}: NewsWrapperProps) => {
  const { categoryId } = searchParams;
  const [posts, setPosts] = useState<PostWithProgressWithCategory[]>([]);
  const [isLoading, setLoading] = useState(false);
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const { onOpen } = useModal();

  const currentLanguage = useLanguage();

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

  const favoritePosts = posts?.filter((post) => post?.currentFavorite);

  return (
    <div className="space-y-4 px-4 pt-4 dark:bg-[#110524]">
      <div className="flex w-full flex-col items-start justify-center md:flex-row md:space-x-4">
        {/* Main Newsfeed Section */}
        <div className="w-full flex-grow">
          <Categories
            items={categories}
            ThemeColor={ThemeColor}
            DarkThemeColor={DarkThemeColor}
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
              courseId={item?.courseId ?? ""}
              liveEventId={item?.liveEventId ?? ""}
              colorCode={item?.category?.colorCode!}
              likesCount={item?.likesCount}
              favoritesCount={item?.favoritesCount}
              currentLike={item?.currentLike}
              currentFavorite={item?.currentFavorite}
              commentsWithLikes={item?.commentsWithLikes}
              commentsCount={item?.commentsCount}
              updateLikeComment={getPosts}
              profileImage={profileImage}
              currentProfileId={currentProfileId}
              ThemeColor={ThemeColor}
              DarkThemeColor={DarkThemeColor}
            />
          ))}
          <div className="loading-indicator" />
          {isLoading ? (
            <div className="flex min-h-screen items-center justify-center">
              {theme === "dark" ? (
                <ClubyteLoader
                  className="h-64 w-64"
                  theme="dark"
                  color="110524"
                />
              ) : (
                <ClubyteLoader
                  className="h-64 w-64"
                  theme="light"
                  color="ffffff"
                />
              )}
            </div>
          ) : (
            !isLoading &&
            posts?.length === 0 && (
              <div className="mt-10 flex flex-col items-center justify-center text-sm text-muted-foreground">
              <CaptionsOff className="h-8 w-8 text-slate-500 dark:text-slate-600" />
              <p className="text-md mt-2 font-medium">
                {currentLanguage.news_no_posts_found}
              </p>
            </div>
            )
          )}
        </div>

        {/* My Favorites Section (hidden on mobile) */}
        <div className="top-10 w-full">
          {profileRole === "ADMIN" || profileRole === "CLIENT ADMIN" ? (
            <Button
              className="inline-flex hidden items-center border-2 lg:inline-flex"
              variant="outline"
              onClick={() => onOpen("createPost")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>{currentLanguage.post_createPost_button_text}</span>
            </Button>
          ) : (
            <div className="mb-[61px]"></div>
          )}
          {favoritePosts.length > 0 && (
            <div className="hidden w-full max-w-xl rounded-lg p-2 outline outline-slate-200 dark:outline-[#1e293b] lg:block">
              <h1 className="mb-2 text-2xl font-medium">
                {currentLanguage.news_myFavorites_title}
              </h1>
              <Separator />
              {favoritePosts?.map((item) => (
                <PostFavoriteCard
                  key={item?.id}
                  id={item?.id}
                  imageUrl={item?.imageUrl ?? ""}
                  category={item?.category?.name ?? ""}
                  description={item?.description ?? ""}
                  createdAt={new Date(item?.publishTime!).toDateString()}
                  publisherName={item?.publisherName!}
                  publisherImageUrl={item?.publisherImageUrl!}
                  colorCode={item?.category?.colorCode!}
                  likesCount={item?.likesCount}
                  favoritesCount={item?.favoritesCount}
                  currentLike={item?.currentLike}
                  currentFavorite={item?.currentFavorite}
                  commentsWithLikes={item?.commentsWithLikes}
                  commentsCount={item?.commentsCount}
                  updateLikeComment={getPosts}
                  profileImage={profileImage}
                  currentProfileId={currentProfileId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise?.resolve(NewsWrapper), { ssr: false });