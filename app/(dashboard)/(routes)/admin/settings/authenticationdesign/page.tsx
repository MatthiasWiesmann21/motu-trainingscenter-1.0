import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { ArrowLeft, Image, LayoutGridIcon } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { DarkSignUpImageForm } from "./_components/signUp-Image-form-dark";
import { languageServer } from "@/lib/check-language-server";
import { isAdmin, isClientAdmin, isOperator } from "@/lib/roleCheckServer";
import { isOwner } from "@/lib/owner";
import Link from "next/link";
import authOptions from "@/lib/auth";
import { SignInImageForm } from "./_components/signIn-Image-form";
import { DarkSignInImageForm } from "./_components/signIn-Image-form-dark";
import { SignUpImageForm } from "./_components/signUp-Image-form";
import { ForgetPasswordImageForm } from "./_components/forgetPassword-Image-form";
import { DarkForgetPasswordImageForm } from "./_components/forgetPassword-Image-form-dark";

const AuthenticationDesignPage = async () => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const currentLanguage = await languageServer();
    
    
    if (!userId) {
        return redirect("/admin/customize");
    }

    const isRoleClientAdmin = await isClientAdmin();
    const isRoleAdmins = await isAdmin();
    const isRoleOperator = await isOperator();
    const canAccess = isRoleAdmins || isRoleOperator || isRoleClientAdmin || await isOwner(userId);

    if (!canAccess) {
        return redirect("/admin/customize");
    }

    const container = await db.container.findUnique({
        where: {
            id: session?.user?.profile?.containerId,
        }
    });

    if (!container) {
        return redirect("/");
    }

    const requiredFields = [
        container.link,
        container.imageUrl,
        container.imageUrlDark,
    ];
    
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <div className="p-6">
            <Link
                href={"/admin/settings"}
                className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {currentLanguage.settings_backToAdminSettings_button_text}
            </Link>
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        {currentLanguage?.customize_authDesignSettings_title}
                    </h1>
                    <span className="text-sm text-slate-700 dark:text-[#ffffff]">
                        {currentLanguage?.customize_customizeContainer_requiredFields} {completionText}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutGridIcon} />
                        <h2 className="text-xl">
                            {currentLanguage?.customize_authDesignSettings_signUp_title}
                        </h2>
                        <span className="pl-1 text-xs text-rose-600">{currentLanguage?.requiredFields}</span>
                    </div>
                    <SignUpImageForm
                        initialData={container}
                        containerId={container.id}
                    />
                    <DarkSignUpImageForm
                        initialData={container}
                        containerId={container.id}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={Image} />
                        <h2 className="text-xl">
                            {currentLanguage.customize_authDesignSettings_signIn_title}
                        </h2>
                        <span className="pl-1 text-xs text-rose-600">{currentLanguage?.requiredFields}</span>
                    </div>
                    <SignInImageForm
                        initialData={container}
                        containerId={container.id}
                    />
                    <DarkSignInImageForm
                        initialData={container}
                        containerId={container.id}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={Image} />
                        <h2 className="text-xl">
                            {currentLanguage.customize_authDesignSettings_forgetPassword_title}
                        </h2>
                        <span className="pl-1 text-xs text-rose-600">{currentLanguage?.requiredFields}</span>
                    </div>
                    <ForgetPasswordImageForm
                        initialData={container}
                        containerId={container.id}
                    />
                    <DarkForgetPasswordImageForm
                        initialData={container}
                        containerId={container.id}
                    />
                </div>
            </div>
        </div>
    );
}

export default AuthenticationDesignPage;
