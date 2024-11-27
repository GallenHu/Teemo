import type { ISiteItem } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SiteItem({
  name,
  url,
  icon,
  changeable = true,
}: ISiteItem & { changeable?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={changeable ? setNodeRef : undefined}
      style={style}
      {...attributes}
      {...listeners}
      className="relative inline-flex items-center gap-3 w-[120px] px-4  bg-gray-100 hover:bg-gray-200 rounded-md cursor-default group"
    >
      <Avatar className={`w-4 h-4 ${changeable ? "cursor-move" : ""}`}>
        <AvatarImage src={icon} alt={name} />
        <AvatarFallback className="bg-neutral-400" delayMs={600}>
          {name.slice(0, 1)}
        </AvatarFallback>
      </Avatar>

      <a
        href={url}
        target="_blank"
        className="decoration-none cursor-pointer text-black text-sm py-1.5"
      >
        {name}
      </a>
    </div>
  );
}
