import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CircleDollarSign,
  File,
  Image,
  LayoutDashboard,
  LayoutGridIcon,
  ListChecks,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";
import { TitleForm } from "./_components/title-form";
import { ShowContainerId } from "./_components/containerid-widget";
import { PackageForm } from "./_components/package-form";
import { MaxCoursesForm } from "./_components/max-courses-form";
import authOptions from "@/lib/auth"; // Ensure this is properly configured
import { DomainForm } from "./_components/domain-form";
import Link from "next/link";
import { ClientMailForm } from "./_components/clientMail-form";
import { ActiveForm } from "./_components/isActive-form";

const ContainerIdPage = async ({
  params,
}: {
  params: { containerId: string };
}) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const container = await db.container.findUnique({
    where: {
      id: params.containerId,
    },
  });

  if (!container) {
    return redirect("/");
  }

  const requiredFields = [container.name, container.imageUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <Link
        href={`/admin/containers`}
        className="mb-6 flex items-center text-sm transition hover:opacity-75"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to container overview
      </Link>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Container setup</h1>
            <span className="text-sm text-slate-700 dark:text-[#ffffff]">
              Complete all required fields {completionText}
            </span>
          </div>
          <Actions disabled={!isComplete} containerId={params.containerId} />
        </div>
        <div className="mt-16 grid grid-cols-3 gap-6 md:grid-cols-2">
       
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutGridIcon} />
              <h2 className="text-xl">Customize your Container</h2>
              <span className="pl-1 text-xs text-rose-600">*required</span>
            </div>
            <TitleForm initialData={container} containerId={container.id} />
            <DomainForm
              // @ts-ignore
              initialData={container}
              containerId={container.id}
            />
            <ShowContainerId initialData={container} />
          </div>
          
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Image} />
              <h2 className="text-xl">Add an Image to your Post</h2>
              <span className="pl-1 text-xs text-rose-600">*required</span>
            </div>
            <PackageForm
              initialData={{ clientPackage: container.clientPackage || "" }}
              containerId={container.id}
              options={[
                { label: "STARTER", value: "STARTER" },
                { label: "COMMUNITY", value: "COMMUNITY" },
                { label: "EXPERT", value: "EXPERT" },
              ]}
            />
            <MaxCoursesForm
              initialData={{ maxCourses: container.maxCourses || 0 }}
              containerId={container.id}
              options={[
                { label: "20", value: 20 },
                { label: "50", value: 50 },
                { label: "Unlimited", value: 1000 },
              ]}
            />
            <ClientMailForm 
              // @ts-ignore
              initialData={container} containerId={container.id}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge variant="danger" icon={AlertTriangle} />
              <h2 className="text-xl">
                <span className="text-rose-600">Important</span>
              </h2>
            </div>
            <ActiveForm initialData={container} containerId={container.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerIdPage;
