import type { ISiteItem } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SiteItem({ name, url, icon }: ISiteItem) {
  return (
    <a
      href={url}
      target="_blank"
      className="decoration-none cursor-pointer text-black text-sm"
    >
      <div className="relative inline-flex items-center gap-2 w-[7rem] h-[2rem] px-[1rem] bg-slate-100 hover:bg-gray-200 rounded-md">
        <Avatar className="w-4 h-4">
          <AvatarImage src={icon} alt={name} />
          <AvatarFallback className="bg-neutral-400" delayMs={600}>
            {name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>

        <span className="max-w-[4rem] truncate">{name}</span>
      </div>
    </a>
  );
}
