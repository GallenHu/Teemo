// https://github.com/shadcn-ui/ui/blob/main/apps/www/components/site-header.tsx
import { ThemeSwitch } from "@/components/global/theme-switch";
import { UserLogin } from "./user-login";
import Link from "next/link";

type IconProps = React.HTMLAttributes<SVGElement>;
const IconLogo = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
    <rect width="256" height="256" fill="none" />
    <line
      x1="208"
      y1="128"
      x2="128"
      y2="208"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
    />
    <line
      x1="192"
      y1="40"
      x2="40"
      y2="192"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
    />
  </svg>
);

export function SiteHeader() {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-5">
        <div>
          <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
            <IconLogo className="h-4 w-4 rotate-180" />
            <span className="font-bold hidden lg:inline-block">Teemo</span>
          </Link>
        </div>
        <div className="inline-flex items-center gap-0.5">
          <UserLogin />
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
