import PrivacyPolicyModal from "@/components/modals/privacy-policy-modal";
import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";
import { languageServer } from "@/lib/check-language-server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { HelpCircle, Lock } from "lucide-react";
import Link from "next/link";

export const Sidebar = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const currentLanguage = await languageServer();

  if (!session?.user?.profile?.containerId) {
    // Handle the case where containerId is undefined
    return null;
  }

  const container = await db.container.findUnique({
    where: {
      id: session?.user?.profile?.containerId,
    },
  });

  if (!container) {
    return null;
  }

  const profile = await db.profile.findFirst({
    where: {
      userId: userId!,
    },
  });

  return (
    <div className="-y-auto flex h-full flex-col border-r-2 bg-white shadow-sm dark:bg-[#0A0118]">
      <PrivacyPolicyModal profile={profile} />
      <div className="flex h-[80px] items-center justify-center border-b-2">
        <Logo
          imageUrl={container?.imageUrl || ""}
          imageUrlDark={container?.imageUrlDark || ""}
          link={container?.link || ""}
        />
      </div>
      <div className="flex-grow">
        <SidebarRoutes
          navPrimaryColor={container?.navPrimaryColor || "#ff00ff"}
          navDarkPrimaryColor={container?.navDarkPrimaryColor || "#ff00ff"}
          navBackgroundColor={container?.navBackgroundColor || "#ff00ff"}
          navDarkBackgroundColor={
            container?.navDarkBackgroundColor || "#ff00ff"
          }
          clientPackage={container?.clientPackage!}
        />
      </div>
      {container?.clientPackage != "EXPERT" && (
        <div className="flex flex-col items-center">
          <a
            href="https://clubyte.live"
            className="cursor-pointer"
            target="_blank"
          >
            <div className="flex items-center">
              <span className="text-xs font-medium text-gray-600">Made by</span>
              <svg
                width="100"
                height="60"
                viewBox="0 0 800 450"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="158.181"
                  y="316.554"
                  width="101.815"
                  height="26.9708"
                  transform="rotate(-30 158.181 316.554)"
                  fill="#4A5568"
                />
                <rect
                  x="83.1865"
                  y="257.932"
                  width="117.437"
                  height="26.9708"
                  transform="rotate(30 83.1865 257.932)"
                  fill="#4A5568"
                />
                <rect
                  x="96.5582"
                  y="164.416"
                  width="116.827"
                  height="26.9708"
                  transform="rotate(90 96.5582 164.416)"
                  fill="#4A5568"
                />
                <rect
                  x="185.863"
                  y="128.506"
                  width="118.672"
                  height="26.9708"
                  transform="rotate(150 185.863 128.506)"
                  fill="#4A5568"
                />
                <rect
                  x="172.424"
                  y="105.164"
                  width="100.995"
                  height="26.9708"
                  transform="rotate(30.2293 172.424 105.164)"
                  fill="#4A5568"
                />
                <rect
                  x="120.559"
                  y="188.009"
                  width="59.3358"
                  height="26.9708"
                  transform="rotate(-30 120.559 188.009)"
                  fill="#4A5568"
                />
                <rect
                  x="172.234"
                  y="158.171"
                  width="63.1839"
                  height="27.3268"
                  transform="rotate(30 172.234 158.171)"
                  fill="#4A5568"
                />
                <rect
                  x="199.14"
                  y="253.495"
                  width="63.7129"
                  height="27.8166"
                  transform="rotate(-90 199.14 253.495)"
                  fill="#4A5568"
                />
                <rect
                  x="156.771"
                  y="262.868"
                  width="65.4042"
                  height="26.9708"
                  transform="rotate(-30 156.771 262.868)"
                  fill="#4A5568"
                />
                <rect
                  x="139.302"
                  y="237.139"
                  width="51.3665"
                  height="26.9708"
                  transform="rotate(30 139.302 237.139)"
                  fill="#4A5568"
                />
                <path
                  d="M312.272 270.848C297.4 270.848 286.048 266.712 278.216 258.44C270.472 250.168 266.6 238.42 266.6 223.196C266.6 215.628 267.788 208.896 270.164 203C272.54 197.016 275.796 192 279.932 187.952C284.068 183.816 288.996 180.692 294.716 178.58C300.436 176.468 306.64 175.412 313.328 175.412C317.2 175.412 320.72 175.72 323.888 176.336C327.056 176.864 329.828 177.524 332.204 178.316C334.58 179.02 336.56 179.768 338.144 180.56C339.728 181.352 340.872 181.968 341.576 182.408L335.636 199.04C332.82 197.544 329.52 196.268 325.736 195.212C322.04 194.156 317.816 193.628 313.064 193.628C309.896 193.628 306.772 194.156 303.692 195.212C300.7 196.268 298.016 197.984 295.64 200.36C293.352 202.648 291.504 205.64 290.096 209.336C288.688 213.032 287.984 217.52 287.984 222.8C287.984 227.024 288.424 230.984 289.304 234.68C290.272 238.288 291.768 241.412 293.792 244.052C295.904 246.692 298.632 248.804 301.976 250.388C305.32 251.884 309.368 252.632 314.12 252.632C317.112 252.632 319.796 252.456 322.172 252.104C324.548 251.752 326.66 251.356 328.508 250.916C330.356 250.388 331.984 249.816 333.392 249.2C334.8 248.584 336.076 248.012 337.22 247.484L342.896 263.984C339.992 265.744 335.9 267.328 330.62 268.736C325.34 270.144 319.224 270.848 312.272 270.848ZM382.554 270.32C376.834 270.232 372.17 269.616 368.562 268.472C365.042 267.328 362.226 265.744 360.114 263.72C358.09 261.608 356.682 259.1 355.89 256.196C355.186 253.204 354.834 249.86 354.834 246.164V169.736L374.502 166.568V242.204C374.502 243.964 374.634 245.548 374.898 246.956C375.162 248.364 375.646 249.552 376.35 250.52C377.142 251.488 378.242 252.28 379.65 252.896C381.058 253.512 382.95 253.908 385.326 254.084L382.554 270.32ZM455.867 266.624C452.523 267.592 448.211 268.472 442.931 269.264C437.651 270.144 432.107 270.584 426.299 270.584C420.403 270.584 415.475 269.792 411.515 268.208C407.643 266.624 404.563 264.424 402.275 261.608C399.987 258.704 398.359 255.272 397.391 251.312C396.423 247.352 395.939 242.996 395.939 238.244V199.568H415.607V235.868C415.607 242.204 416.443 246.78 418.115 249.596C419.787 252.412 422.911 253.82 427.487 253.82C428.895 253.82 430.391 253.776 431.975 253.688C433.559 253.512 434.967 253.336 436.199 253.16V199.568H455.867V266.624ZM518.814 233.756C518.814 221.084 514.15 214.748 504.822 214.748C502.798 214.748 500.774 215.012 498.75 215.54C496.814 216.068 495.23 216.728 493.998 217.52V253.292C494.966 253.468 496.198 253.644 497.694 253.82C499.19 253.908 500.818 253.952 502.578 253.952C507.946 253.952 511.994 252.104 514.722 248.408C517.45 244.712 518.814 239.828 518.814 233.756ZM538.878 234.284C538.878 239.828 538.042 244.844 536.37 249.332C534.786 253.82 532.454 257.648 529.374 260.816C526.294 263.984 522.51 266.448 518.022 268.208C513.534 269.88 508.43 270.716 502.71 270.716C500.334 270.716 497.826 270.584 495.186 270.32C492.634 270.144 490.082 269.88 487.53 269.528C485.066 269.176 482.69 268.78 480.402 268.34C478.114 267.812 476.09 267.284 474.33 266.756V169.736L493.998 166.568V201.152C496.198 200.184 498.486 199.436 500.862 198.908C503.238 198.38 505.79 198.116 508.518 198.116C513.446 198.116 517.802 198.996 521.586 200.756C525.37 202.428 528.538 204.848 531.09 208.016C533.642 211.184 535.578 215.012 536.898 219.5C538.218 223.9 538.878 228.828 538.878 234.284ZM613.833 199.568C609.873 212.944 605.737 225.484 601.425 237.188C597.113 248.892 592.405 260.244 587.301 271.244C585.453 275.204 583.605 278.548 581.757 281.276C579.909 284.092 577.885 286.38 575.685 288.14C573.485 289.988 570.977 291.308 568.161 292.1C565.433 292.98 562.221 293.42 558.525 293.42C555.445 293.42 552.585 293.112 549.945 292.496C547.393 291.968 545.281 291.352 543.609 290.648L547.041 274.94C549.065 275.644 550.869 276.128 552.453 276.392C554.037 276.656 555.709 276.788 557.469 276.788C560.989 276.788 563.673 275.82 565.521 273.884C567.457 272.036 569.085 269.44 570.405 266.096C565.917 257.296 561.429 247.44 556.941 236.528C552.453 225.528 548.229 213.208 544.269 199.568H565.125C566.005 203 567.017 206.74 568.161 210.788C569.393 214.748 570.669 218.796 571.989 222.932C573.309 226.98 574.629 230.94 575.949 234.812C577.357 238.684 578.677 242.204 579.909 245.372C581.053 242.204 582.241 238.684 583.473 234.812C584.705 230.94 585.893 226.98 587.037 222.932C588.269 218.796 589.413 214.748 590.469 210.788C591.613 206.74 592.625 203 593.505 199.568H613.833ZM623.717 182.276L643.385 179.108V199.568H667.013V215.936H643.385V240.356C643.385 244.492 644.089 247.792 645.497 250.256C646.993 252.72 649.941 253.952 654.341 253.952C656.453 253.952 658.609 253.776 660.809 253.424C663.097 252.984 665.165 252.412 667.013 251.708L669.785 267.02C667.409 267.988 664.769 268.824 661.865 269.528C658.961 270.232 655.397 270.584 651.173 270.584C645.805 270.584 641.361 269.88 637.841 268.472C634.321 266.976 631.505 264.952 629.393 262.4C627.281 259.76 625.785 256.592 624.905 252.896C624.113 249.2 623.717 245.108 623.717 240.62V182.276ZM677.151 234.812C677.151 228.652 678.075 223.284 679.923 218.708C681.859 214.044 684.367 210.172 687.447 207.092C690.527 204.012 694.047 201.68 698.007 200.096C702.055 198.512 706.191 197.72 710.415 197.72C720.271 197.72 728.059 200.756 733.779 206.828C739.499 212.812 742.359 221.656 742.359 233.36C742.359 234.504 742.315 235.78 742.227 237.188C742.139 238.508 742.051 239.696 741.963 240.752H697.347C697.787 244.8 699.679 248.012 703.023 250.388C706.367 252.764 710.855 253.952 716.487 253.952C720.095 253.952 723.615 253.644 727.047 253.028C730.567 252.324 733.427 251.488 735.627 250.52L738.267 266.492C737.211 267.02 735.803 267.548 734.043 268.076C732.283 268.604 730.303 269.044 728.103 269.396C725.991 269.836 723.703 270.188 721.239 270.452C718.775 270.716 716.311 270.848 713.847 270.848C707.599 270.848 702.143 269.924 697.479 268.076C692.903 266.228 689.075 263.72 685.995 260.552C683.003 257.296 680.759 253.468 679.263 249.068C677.855 244.668 677.151 239.916 677.151 234.812ZM723.351 227.288C723.263 225.616 722.955 223.988 722.427 222.404C721.987 220.82 721.239 219.412 720.183 218.18C719.215 216.948 717.939 215.936 716.355 215.144C714.859 214.352 712.967 213.956 710.679 213.956C708.479 213.956 706.587 214.352 705.003 215.144C703.419 215.848 702.099 216.816 701.043 218.048C699.987 219.28 699.151 220.732 698.535 222.404C698.007 223.988 697.611 225.616 697.347 227.288H723.351Z"
                  fill="#4A5568"
                />
              </svg>
            </div>
          </a>
        </div>
      )}
      <div className="flex items-center justify-center space-x-2 px-5 pb-5">
        <Link
          className="flex items-center text-xs font-semibold text-gray-600 hover:underline"
          href="https://docs.clubyte.live"
          target="_blank"
        >
          <HelpCircle className="mr-1" size={16} />
          {currentLanguage.sidebar_help}
        </Link>
        {/* Separator */}
        <div className="text-gray-600">|</div>
        <Link
          className="flex items-center text-xs font-semibold text-gray-600 hover:underline"
          href="https://clubyte.live/privacy-policy/"
          target="_blank"
        >
          <Lock className="mr-1" size={16} />
          {currentLanguage.sidebar_privacy_policy}
        </Link>
      </div>
    </div>
  );
};
