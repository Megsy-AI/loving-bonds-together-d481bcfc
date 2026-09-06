import { lazy, Suspense, useState } from "react";
import {
  ChevronDown,
  Code2,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  Microscope,
  Presentation,
  Video as VideoIcon,
  X,
} from "lucide-react";
import { BrandIcon, hasBrandIcon } from "@/components/chat/media/BrandIcon";
import { findSlidesTemplate } from "@/lib/slidesTemplates";
import type { MediaModelChoice } from "@/components/chat/media/MediaModelPickerSheet";

const MediaModelPickerSheet = lazy(
  () => import("@/components/chat/media/MediaModelPickerSheet"),
);

interface Props {
  chatMode: string;
  mediaModel?: MediaModelChoice | null;
  setMediaModel?: (m: MediaModelChoice) => void;
  slidesTemplate?: string;
  onOpenTemplatePicker?: () => void;
  onClear: () => void;
  /** Set when the docs agent is active — rendered with the same chip header. */
  isDocsAgent?: boolean;
  /** Set when the dev agent is active — rendered with the same chip header. */
  isDevAgent?: boolean;
}

/** Single source of truth for how every service chip looks/reads. */
const SERVICE_META: Record<
  string,
  { title: string; Icon: React.ElementType }
> = {
  images: { title: "Create image", Icon: ImageIcon },
  video: { title: "Create video", Icon: VideoIcon },
  slides: { title: "Create slides", Icon: Presentation },
  "slides-images": { title: "Create slides", Icon: Presentation },
  code: { title: "Code", Icon: Code2 },
  dev: { title: "Dev", Icon: Code2 },
  "deep-research": { title: "Deep research", Icon: Microscope },
  learning: { title: "Learning", Icon: GraduationCap },
  docs: { title: "Documents", Icon: FileText },
};

/**
 * Activation bar that lives at the top of the composer while an image /
 * video / slides / agent mode is active. It shows the service name AND the
 * contextual pickers (media model, slides template) so the user always sees
 * which model/template will run before sending.
 */
export default function ComposerServicePanel({
  chatMode,
  mediaModel,
  setMediaModel,
  slidesTemplate,
  onOpenTemplatePicker,
  onClear,
  isDocsAgent,
  isDevAgent,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const key = isDocsAgent ? "docs" : isDevAgent ? "dev" : chatMode;
  const meta = SERVICE_META[key];
  if (!meta) return null;

  const title = meta.title;
  const TitleIcon = meta.Icon;

  const isImages = key === "images";
  const isVideo = key === "video";
  const isSlides = key === "slides" || key === "slides-images";
  const showMediaPicker = (isImages || isVideo) && !!setMediaModel;
  const template = isSlides ? findSlidesTemplate(slidesTemplate || "") : null;

  return (
    <div className="pt-1.5 pb-1 px-0.5">
      <div className="flex items-center gap-1.5 rounded-xl border border-foreground/10 bg-foreground/[0.045] pl-2.5 pr-1 py-1">
        {/* Service identity */}
        <span className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-bold text-foreground/70">
          <TitleIcon className="w-3.5 h-3.5" strokeWidth={2.4} />
          {title}
        </span>

        {/* Divider */}
        {showMediaPicker || (isSlides && onOpenTemplatePicker) ? (
          <span aria-hidden className="h-4 w-px shrink-0 bg-foreground/12" />
        ) : null}

        {/* Media model picker — shows the model that will run */}
        {showMediaPicker ? (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            aria-label={isVideo ? "Choose video model" : "Choose image model"}
            aria-haspopup="dialog"
            className="inline-flex h-7 min-w-0 items-center gap-1.5 rounded-lg border border-foreground/10 bg-background px-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-foreground/[0.06] active:scale-[0.97]"
          >
            {hasBrandIcon(mediaModel?.name, mediaModel?.provider) ? (
              <BrandIcon name={mediaModel?.name} provider={mediaModel?.provider} size={14} variant="color" />
            ) : mediaModel?.thumbnail ? (
              <img
                src={mediaModel.thumbnail}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-4 w-4 rounded-sm object-cover"
              />
            ) : isVideo ? (
              <VideoIcon className="w-3.5 h-3.5 text-foreground/70" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5 text-foreground/70" />
            )}
            <span className="max-w-[110px] truncate">
              {mediaModel?.name || (isVideo ? "Video model" : "Image model")}
            </span>
            <ChevronDown className="w-3 h-3 shrink-0 text-foreground/50" strokeWidth={2.4} />
          </button>
        ) : null}

        {/* Slides template picker */}
        {isSlides && onOpenTemplatePicker ? (
          <button
            type="button"
            onClick={() => onOpenTemplatePicker()}
            aria-label="Choose slides template"
            aria-haspopup="dialog"
            className="inline-flex h-7 min-w-0 items-center gap-1.5 rounded-lg border border-foreground/10 bg-background px-2 text-[12px] font-semibold text-foreground transition-colors hover:bg-foreground/[0.06] active:scale-[0.97]"
          >
            {template?.cover ? (
              <img
                src={template.cover}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-4 w-6 rounded-sm object-cover"
              />
            ) : (
              <Presentation className="w-3.5 h-3.5 text-foreground/70" />
            )}
            <span className="max-w-[110px] truncate">{template?.name || "Template"}</span>
            <ChevronDown className="w-3 h-3 shrink-0 text-foreground/50" strokeWidth={2.4} />
          </button>
        ) : null}

        <span className="flex-1" />

        {/* Close */}
        <button
          type="button"
          onClick={onClear}
          aria-label={`Close ${title}`}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-foreground/55 transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <X className="w-3.5 h-3.5" strokeWidth={2.4} />
        </button>
      </div>

      {pickerOpen && showMediaPicker ? (
        <Suspense fallback={null}>
          <MediaModelPickerSheet
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            mode={isVideo ? "video" : "images"}
            selectedSlug={mediaModel?.slug}
            onSelect={(m) => {
              setMediaModel?.(m);
              setPickerOpen(false);
            }}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
