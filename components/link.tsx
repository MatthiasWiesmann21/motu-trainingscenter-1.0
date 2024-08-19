import { db } from "@/lib/db";

const Link = async () => {
  const container: any = await db?.container.findUnique({
    where: {
      id: process?.env?.CONTAINER_ID,
    },
  });
  const favicon = container?.icon;
  return <link rel="icon" href={favicon} sizes="any" />;
};

export default Link;
