import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
