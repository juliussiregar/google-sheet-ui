import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}
