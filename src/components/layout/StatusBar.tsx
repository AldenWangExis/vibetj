import { cn } from "@/lib/utils";

export function StatusBar() {
  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex h-8 w-full items-center justify-between",
        "border-t border-border bg-background px-4 font-mono text-xs uppercase tracking-wider text-text-muted select-none"
      )}
    >
      {/* Left: Build Info (Clickable) */}
      <a
        href="https://github.com/AldenWangExis/vibetj"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 hover:text-text-primary transition-colors group"
      >
        <span className="flex items-center gap-1.5">
          <span className="text-text-secondary group-hover:text-accent-green transition-colors">
            git:
          </span>
          <span>main</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-text-secondary group-hover:text-accent-green transition-colors">
            commit:
          </span>
          <span>8a2f9c</span>
        </span>
        <span className="hidden sm:flex items-center gap-1.5">
          <span>v1.0.0</span>
        </span>
      </a>

      {/* Right: System Status */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2 hover:text-text-primary transition-colors cursor-default">
          <span>System: Online</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
          </span>
        </span>
        <span className="hidden sm:flex items-center gap-1.5 hover:text-text-primary transition-colors cursor-default">
          <span>Tianjin:</span>
          <span>14ms</span>
        </span>
        <span className="hidden sm:flex items-center gap-1.5 hover:text-text-primary transition-colors cursor-default">
          <span>UTF-8</span>
        </span>
      </div>
    </footer>
  );
}
