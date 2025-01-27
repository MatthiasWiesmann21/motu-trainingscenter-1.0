import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { isOwner } from "@/lib/owner";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { languageServer } from "@/lib/check-language-server";
import authOptions from "@/lib/auth";

import { Chart } from "./_components/chart";
import GoBackButton from "@/components/goBackButton";
import { db } from "@/lib/db";
import { DataCard } from "./_components/data-chart";

const PostAnalyticsPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  
  const currentLanguage = await languageServer();

  if (!userId) {
    return redirect("/search");
  }

  const isRoleAdmins = await isAdmin();
  const isRoleOperator = await isOperator();
  const isRoleClientAdmin = await isClientAdmin();
  const canAccess = isRoleAdmins || isRoleOperator || isRoleClientAdmin || isOwner(userId);

  if (!canAccess) {
    return redirect("/search");
  }

  const posts = await db.post.findMany({
    where: {
      containerId: session?.user?.profile?.containerId,
    },
    include: {
      comments: true,
      likes: true,
      category: true,
    }
  });

  const totalPosts = posts.length;
  const postsWithComments = posts.filter(post => post.comments.length > 0).length;
  const avgCommentsPerPost = Math.round(
    posts.reduce((acc, post) => acc + post.comments.length, 0) / totalPosts
  ) || 0;

  const postEngagementData = posts.map(post => ({
    name: post.title || "Untitled",
    total: post.comments.length,
  }));

  const postLikesData = posts.map(post => ({
    name: post.title || "Untitled",
    total: post.likes.length,
  }));

  return (
    <div className="p-6">
      <GoBackButton buttonText={currentLanguage.goBack_button_text} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <DataCard
          label={currentLanguage.analytic_posts_totalPosts_label}
          value={totalPosts}
        />
        <DataCard
          label={currentLanguage.analytic_posts_totalPostsLikes_label}
          value={postsWithComments}
        />
        <DataCard
          label={currentLanguage.analytic_posts_avgCommentsPosts_label}
          value={avgCommentsPerPost}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
        <Chart data={postEngagementData} label={currentLanguage.analytic_posts_postEngagement_label} />
        <Chart data={postLikesData} label={currentLanguage.analytic_posts_postLikeEngagement_label} />
      </div>
    </div>
  );
};

export default PostAnalyticsPage;