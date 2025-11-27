import Image from "next/image";
import { MemberProfile } from "@/types";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

interface ActiveBuildersCardProps {
  profiles: MemberProfile[];
}

export function ActiveBuildersCard({ profiles }: ActiveBuildersCardProps) {
  const displayProfiles = profiles.slice(0, 7);

  return (
    <SpotlightCard className="h-full flex flex-col justify-between p-6 group cursor-pointer min-h-[200px]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted font-mono uppercase tracking-wider">
            Active Builders
          </span>
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
          </div>
        </div>
        <div className="text-3xl font-bold text-text-primary tracking-tight">
          {profiles.length} Members
        </div>
      </div>

      <div className="flex -space-x-3 overflow-hidden py-6 pl-1">
        {displayProfiles.map((profile) => (
          <div
            key={profile.github}
            className="relative h-10 w-10 rounded-full border-2 border-background bg-surface transition-transform duration-300 hover:z-10 hover:scale-110"
          >
            <Image
              src={profile.avatarUrl}
              alt={profile.displayName}
              fill
              className="rounded-full object-cover transition-all duration-500
                filter grayscale sepia hue-rotate-[170deg] brightness-75 contrast-[1.2] opacity-80
                group-hover:filter-none group-hover:opacity-100"
              sizes="40px"
            />
          </div>
        ))}
      </div>

      <div className="text-xs text-accent-green font-mono mt-auto flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 bg-accent-green rounded-[1px]"></span>
        Latest PR merged 2h ago
      </div>
    </SpotlightCard>
  );
}
