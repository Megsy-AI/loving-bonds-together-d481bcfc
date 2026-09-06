import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { promptUpgrade } from "@/lib/upgradeMoment";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useDynamicModels } from "@/hooks/useModels";
import { Check, Image as ImageIcon, Video as VideoIcon, Lock } from "lucide-react";
import { glassModelMenu, glassModelMenuStyle } from "@/components/model-picker/glassModelMenuStyles";
import { BrandIcon, hasBrandIcon } from "@/components/chat/media/BrandIcon";
import { useUserPlan } from "@/hooks/useUserPlan";
import { isFreeModel, isPaidUser } from "@/lib/subscriptionGating";
import { filterImageModels, filterVideoModels } from "@/lib/mediaModelPolicy";
import { isUnlimitedMediaModel, mediaModelBadge } from "@/lib/mediaQuota";

/**
 * Neutral monogram used when a model has no brand icon or thumbnail.
 * (Previously these fell back to the Megsy logo, which made third-party
 * video models look like our own products.)
 */
function ModelMonogram({ name, size = 64 }: { name: string; size?: number }) {
  const letter = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center rounded-xl bg-foreground/8 text-foreground/70 font-black"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
    >
      {letter}
    </span>
  );
}



export interface MediaModelChoice {
  slug: string;
  name: string;
  provider: string;
  credits: number;
  thumbnail?: string;
  type: "image" | "video";
  isPremium?: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "images" | "video";
  selectedSlug?: string;
  onSelect: (model: MediaModelChoice) => void;
}

export default function MediaModelPickerSheet({
  open,
  onOpenChange,
  mode,
  selectedSlug,
  onSelect,
}: Props) {
  const { models, loading } = useDynamicModels();
  const { plan } = useUserPlan();
  const paid = isPaidUser(plan);
  const navigate = useNavigate();


  const filtered = useMemo(() => {
    const target = mode === "video" ? ["video", "video-i2v"] : ["image"];
    const scoped = models.filter((m) => target.includes(m.type as string));
    return (mode === "video" ? filterVideoModels(scoped) : filterImageModels(scoped))
      .sort((a, b) => {
        const fa = a.isFeatured ? 1 : 0;
        const fb = b.isFeatured ? 1 : 0;
        if (fa !== fb) return fb - fa;
        return (a.credits || 0) - (b.credits || 0);
      });
  }, [models, mode]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[68dvh] rounded-t-[28px] border-0 bg-background p-0"
      >
        <SheetHeader className="px-5 pb-1 pt-4">
          <SheetTitle className="text-center text-[15px] font-semibold text-foreground">
            {mode === "video" ? "Video model" : "Image model"}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(68dvh-64px)]">
          <div className="px-3 pb-8 pt-1">
            {loading && (
              <div className="py-10 text-center text-sm text-muted-foreground">Loading…</div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No models available right now
              </div>
            )}
            {filtered.map((m) => {
              const active = m.slug === selectedSlug;
              const modelIsFree =
                mode === "video" ? isUnlimitedMediaModel(m) : isFreeModel(m.slug || m.id);
              const locked = !modelIsFree && !paid;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    if (locked) {
                      promptUpgrade(m.name);
                      onOpenChange(false);
                      navigate("/pricing");
                      return;
                    }
                    onSelect({
                      slug: m.slug || m.id,
                      name: m.name,
                      provider: m.provider,
                      credits: m.credits,
                      thumbnail: m.thumbnailUrl || m.iconUrl,
                      type: mode === "video" ? "video" : "image",
                      isPremium: !!m.isPremium,
                    });
                    toast.success(`Selected: ${m.name}`);
                  }}
                  className="flex w-full flex-col items-center gap-0.5 rounded-2xl px-4 py-3.5 text-center transition-colors active:bg-foreground/[0.05]"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-[17px] font-medium text-foreground">{m.name}</span>
                    {locked && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-foreground/8 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                        <Lock className="h-2.5 w-2.5" /> Pro
                      </span>
                    )}
                    {active && <Check className="h-4 w-4 text-foreground" strokeWidth={2.4} />}
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    {mediaModelBadge(m, mode === "video" ? "video" : "image")}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
