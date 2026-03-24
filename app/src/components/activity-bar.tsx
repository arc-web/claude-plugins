import { Icon } from "@iconify/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Activity } from "@/lib/types";

interface ActivityBarProps {
  activity: Activity;
  onActivityChange: (activity: Activity) => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

const ITEMS: { id: Activity; icon: string; label: string }[] = [
  { id: "explorer", icon: "ph:tree-structure", label: "Explorer" },
  { id: "graph", icon: "ph:graph", label: "Graph" },
  { id: "legend", icon: "ph:palette", label: "Legend" },
];

export function ActivityBar({ activity, onActivityChange, isDark, onThemeToggle }: ActivityBarProps) {
  return (
    <div className="flex flex-col items-center w-12 border-r border-border bg-background shrink-0">
      <div className="flex flex-col items-center gap-1 pt-2 flex-1">
        {ITEMS.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger
              onClick={() => onActivityChange(item.id)}
              className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                activity === item.id
                  ? "text-foreground bg-accent border-l-2 border-primary"
                  : "text-muted-foreground hover:text-muted-foreground"
              }`}
            >
              <Icon icon={item.icon} width={22} />
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="pb-3">
        <Tooltip>
          <TooltipTrigger
            onClick={onThemeToggle}
            className="w-10 h-10 flex items-center justify-center rounded-md text-muted-foreground hover:text-muted-foreground transition-colors"
          >
            <Icon icon={isDark ? "ph:moon" : "ph:sun"} width={20} />
          </TooltipTrigger>
          <TooltipContent side="right">Toggle theme</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
