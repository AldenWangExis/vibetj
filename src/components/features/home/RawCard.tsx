import { SpotlightCard } from "@/components/ui/SpotlightCard";

export function RawCard() {
  return (
    <SpotlightCard className="h-full p-5 font-mono text-xs relative group cursor-pointer overflow-hidden bg-[#050505] min-h-[180px]">
      <div className="absolute top-5 right-5 text-text-muted/40 border border-border-subtle px-1.5 py-0.5 rounded text-[9px] z-10 bg-[#050505]">
        JSON
      </div>

      <div className="flex flex-col h-full relative overflow-hidden">
        <div className="text-text-muted uppercase tracking-wider text-[10px] mb-2 z-10 bg-[#050505] pb-2 w-full">
          System Context
        </div>

        {/* Scrollable Content Container */}
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute top-0 left-0 w-full transition-transform duration-[3000ms] ease-linear group-hover:-translate-y-1/3">
            <pre className="text-text-code leading-relaxed">
              <code>
                <span className="text-text-muted">{`{`}</span>
                <br />
                <span className="text-text-secondary"> &quot;community&quot;</span>:{" "}
                <span className="text-text-primary">&quot;VibeTJ&quot;</span>,
                <br />
                <span className="text-text-secondary"> &quot;version&quot;</span>:{" "}
                <span className="text-accent-blue">&quot;1.0.0&quot;</span>,
                <br />
                <span className="text-text-secondary"> &quot;status&quot;</span>:{" "}
                <span className="text-accent-green">&quot;online&quot;</span>,
                <br />
                <span className="text-text-secondary"> &quot;role&quot;</span>:{" "}
                <span className="text-text-primary">&quot;system_agent&quot;</span>,
                <br />
                <span className="text-text-secondary"> &quot;mission&quot;</span>:{" "}
                <span className="text-text-primary">&quot;connect_builders&quot;</span>,
                <br />
                <span className="text-text-secondary"> &quot;location&quot;</span>:{" "}
                <span className="text-text-muted">{`{`}</span>
                <br />
                <span className="text-text-secondary"> &quot;city&quot;</span>:{" "}
                <span className="text-text-primary">&quot;Tianjin&quot;</span>,
                <br />
                <span className="text-text-secondary"> &quot;lat&quot;</span>:{" "}
                <span className="text-accent-blue">39.13</span>,
                <br />
                <span className="text-text-secondary"> &quot;lng&quot;</span>:{" "}
                <span className="text-accent-blue">117.20</span>
                <br />
                <span className="text-text-muted"> {`}`}</span>,
                <br />
                <span className="text-text-secondary"> &quot;modules&quot;</span>:{" "}
                <span className="text-text-muted">{`[`}</span>
                <br />
                <span className="text-text-primary"> &quot;map_core&quot;</span>,
                <br />
                <span className="text-text-primary"> &quot;member_graph&quot;</span>,
                <br />
                <span className="text-text-primary"> &quot;lab_runtime&quot;</span>
                <br />
                <span className="text-text-muted"> {`]`}</span>
                <br />
                <span className="text-text-muted">{`}`}</span>
              </code>
            </pre>
          </div>

          {/* Gradient Fade at bottom to suggest more content */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
    </SpotlightCard>
  );
}
