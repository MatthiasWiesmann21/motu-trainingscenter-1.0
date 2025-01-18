import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { getPosts } from "@/actions/get-posts";
import { isOwner } from "@/lib/owner";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { languageServer } from "@/lib/check-language-server";
import authOptions from "@/lib/auth";

import { Chart } from "./_components/chart";
import GoBackButton from "@/components/goBackButton";
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

  const posts = await getPosts({});

  const totalPosts = posts.length;
  const postsWithComments = posts.filter(post => post.comments.length > 0).length;
  const avgCommentsPerPost = Math.round(
    posts.reduce((acc, post) => acc + post.comments.length, 0) / totalPosts
  ) || 0;

  const postEngagementData = posts.map(post => ({
    name: post.title || "Untitled",
    total: post.comments.length,
  }));

  return (
    <div className="p-6">
      <GoBackButton buttonText={currentLanguage.goBack_button_text} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <DataCard
          label="Total Posts"
          value={totalPosts}
        />
        <DataCard
          label="Posts with Comments"
          value={postsWithComments}
        />
        <DataCard
          label="Avg. Comments per Post"
          value={avgCommentsPerPost}
        />
      </div>
      <Chart data={postEngagementData} />
    </div>
  );
};

export default PostAnalyticsPage;