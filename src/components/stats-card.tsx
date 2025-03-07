import { Card } from "./ui/card";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  CircleOff,
  MapPin,
  Building2,
  Activity,
  Grid3x3,
  AlertCircle,
  Combine,
} from "lucide-react";
import { HTMLAttributes, useState } from "react";

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
}

// Define different gradient styles for different stat types
const statCardVariants = cva(
  "transition-all duration-300 h-full rounded-lg flex flex-col justify-between p-4 border overflow-hidden relative group",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700",
        intersections:
          "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800",
        types:
          "bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 border-emerald-200 dark:border-emerald-800",
        statuses:
          "bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border-amber-200 dark:border-amber-800",
        cities:
          "bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-200 dark:border-purple-800",
        counties:
          "bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 border-rose-200 dark:border-rose-800",
        avgIcdFt:
          "bg-gradient-to-br from-cyan-50 to-sky-100 dark:from-cyan-900/30 dark:to-sky-900/30 border-cyan-200 dark:border-cyan-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Icon mapping for different stat types
const iconMapping = {
  Intersections: <Activity className="size-5" />,
  Types: <Grid3x3 className="size-5" />,
  Statuses: <AlertCircle className="size-5" />,
  Cities: <Building2 className="size-5" />,
  Counties: <MapPin className="size-5" />,
  "Avg ICD (ft)": <Combine className="size-5" />,
  default: <CircleOff className="size-5" />,
};

export default function StatCard({
  title,
  value,
  className,
  ...props
}: StatCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  // Determine variant based on title
  const variant = title.toLowerCase().replace(/\s+/g, "") as any;

  // Get the icon for this stat type
  const icon =
    iconMapping[title as keyof typeof iconMapping] || iconMapping.default;

  return (
    <Card
      className={cn(statCardVariants({ variant }), className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {/* Decorative element */}
      <div
        className={cn(
          "absolute -right-6 -top-6 w-16 h-16 rounded-full bg-white/20 dark:bg-white/5 transition-transform duration-500",
          isHovering ? "scale-150" : "scale-100"
        )}
      />

      <div className="flex items-center gap-2 text-muted-foreground dark:text-muted-foreground">
        <div
          className={cn(
            "transition-all duration-300",
            isHovering ? "scale-110 text-foreground dark:text-foreground" : ""
          )}
        >
          {icon}
        </div>
        <span className="text-sm font-medium">{title}</span>
      </div>

      <div className="mt-4 text-2xl font-bold tracking-tight transition-all duration-300">
        {value}
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 h-1 transition-all duration-300",
          variant !== "default"
            ? `bg-${variant === "avgicft" ? "cyan" : variant}-500 dark:bg-${
                variant === "avgicft" ? "cyan" : variant
              }-400`
            : "bg-gray-500 dark:bg-gray-400",
          isHovering ? "w-full" : "w-1/3"
        )}
      />
    </Card>
  );
}
