"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TaskbarIcon } from "@/lib/storage";

export function SortableIcon({
  icon,
  onClick,
}: {
  icon: TaskbarIcon;
  onClick: (uid: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: icon.uid });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={() => onClick(icon.uid)}
      className="lib-icon" title={`${icon.name} — click to toggle/remove`}>
      <img src={icon.svgDataUri} alt={icon.name} />
      <span>{icon.name}</span>
    </div>
  );
}
