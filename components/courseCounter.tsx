"use client";

import { useLanguage } from "@/lib/check-language";
import { useIsAdmin } from "@/lib/roleCheck";
import { Infinity, Info } from "lucide-react";

type ContainerwithamountofCoursesProps = {
  courses: number;
  maxCourses: number;
};

export const CourseCounter = ({
    maxCourses,
    courses,
}: ContainerwithamountofCoursesProps) => {
const currentLanguage = useLanguage();
const isRoleAdmins = useIsAdmin();
const canAccess = isRoleAdmins;
const maxCourseDisplay = maxCourses > 50 ? <><Infinity className="h-5 w-5 ml-1 inline" /></> : maxCourses;

return (
    canAccess && (
        <div className="border rounded-full text-center p-4 text-sm flex items-center w-full border-black dark:border-white text-prima text-slate-400">
            <Info className="h-5 w-5 mr-2" />
            <span>{currentLanguage.search_courseCounter_currentCourses} {courses} / </span>{maxCourseDisplay}
        </div>
    )
  );
};
