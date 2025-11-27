import { SpotlightCard } from "@/components/ui/SpotlightCard";

export function RawCard() {
  return (
    <SpotlightCard className="h-full p-6 font-mono text-xs relative group cursor-pointer overflow-hidden bg-[#050505] min-h-[180px]">
      <div className="absolute top-6 right-6 text-text-muted/50 text-[10px] border border-border-subtle px-1.5 py-0.5 rounded">
        JSON
      </div>

      <div className="flex flex-col h-full">
        <div className="text-text-muted uppercase tracking-wider text-[10px] mb-4">
          System Context
        </div>

        <div className="relative flex-1">
          <pre className="text-text-code leading-relaxed">
            <code>
              <span className="text-text-muted">{`{`}</span>
              <br />
              <span className="text-text-secondary"> &quot;role&quot;</span>:{" "}
              <span className="text-accent-green">&quot;system&quot;</span>,
              <br />
              <span className="text-text-secondary"> &quot;status&quot;</span>:{" "}
              <span className="text-accent-blue">&quot;initializing&quot;</span>,
              <br />
              <span className="text-text-secondary"> &quot;mission&quot;</span>:{" "}
              <span className="text-text-primary">&quot;connect_builders&quot;</span>,
              <br />
              <span className="text-text-secondary"> &quot;location&quot;</span>:{" "}
              <span className="text-text-primary">&quot;Tianjin_CN&quot;</span>
              <br />
              <span className="text-text-muted">{`}`}</span>
            </code>
          </pre>

          {/* Blinking cursor effect at the end */}
          <div className="absolute bottom-1 left-1 w-2 h-4 bg-accent-green animate-cursor-blink opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>
    </SpotlightCard>
  );
}
