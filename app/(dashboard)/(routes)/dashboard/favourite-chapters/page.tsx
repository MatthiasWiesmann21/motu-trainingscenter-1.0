import { getAllChapters } from "@/actions/get-all-chapter";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { redirect } from "next/navigation";
import { languageServer } from "@/lib/check-language-server";
import FavoriteChaptersList from "./_components/favoriteChaptersList";
import GoBackButton from "@/components/goBackButton";

const FavoriteChapters = async () => {
  const session = await getServerSession(authOptions);
  const currentLanguage = await languageServer();

  if (!session?.user) {
    return redirect("/");
  }
  if (!session?.user?.role) {
    session.user.role = session?.user?.profile?.role || "USER";
  }

  const userId = session.user.id;

  const chapters = await getAllChapters({
    userId,
  });

  const container: any = await db.container.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
    },
  });

  return (
    <div className="space-y-4 p-4 dark:bg-[#110524]">
      <GoBackButton buttonText={currentLanguage.goBack_button_text} />
      <FavoriteChaptersList chapters={chapters} colors={container} />
    </div>
  );
};

export default FavoriteChapters;
