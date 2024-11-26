import type { ISiteItem } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SiteItem({ name, url, icon }: ISiteItem) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="inline-flex items-center gap-3 px-5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md cursor-default"
    >
      <Avatar className="w-4 h-4 cursor-move">
        <AvatarImage src={icon} alt={name} />
        <AvatarFallback className="bg-neutral-400" delayMs={600}>
          {name.slice(0, 1)}
        </AvatarFallback>
      </Avatar>

      <a href={url} target="_blank" className="decoration-none cursor-pointer">
        <div className="text-black text-sm">{name}</div>
      </a>
    </div>
  );
}
