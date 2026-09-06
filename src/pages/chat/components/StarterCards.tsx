import {
  ImagePlus,
  Code2,
  Video as VideoIcon,
  Presentation,
  ScanSearch,
  FileText,
} from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";
import { useUserLang } from "@/lib/authI18n";

export interface StarterCardsProps {
  /** Activates the service chip for the picked card. */
  onPick: (prompt: string, mode?: string) => void;
  className?: string;
}

/** Every real service the app offers — no filler. Short labels, no descriptions. */
const CARDS = [
  { id: "image", mode: "images", Icon: ImagePlus, title: "Images", titleAr: "صور" },
  { id: "web", mode: "code", Icon: Code2, title: "Website", titleAr: "موقع" },
  { id: "video", mode: "video", Icon: VideoIcon, title: "Video", titleAr: "فيديو" },
  { id: "slides", mode: "slides", Icon: Presentation, title: "Slides", titleAr: "عرض" },
  { id: "research", mode: "deep-research", Icon: ScanSearch, title: "Research", titleAr: "بحث" },
  { id: "docs", mode: "docs", Icon: FileText, title: "Documents", titleAr: "مستند" },
];

const handleCardClick = (
  c: (typeof CARDS)[number],
  onPick: StarterCardsProps["onPick"],
) => {
  if (c.id === "integrations") {
    window.dispatchEvent(new CustomEvent("megsy:open-integrations"));
    return;
  }
  onPick("", (c as { mode?: string }).mode);
};

const chipClass =
  "group inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card " +
  "px-3.5 hover:bg-muted active:scale-[0.97] " +
  "transition-[background-color,transform] duration-150";

const iconClass =
  "h-4 w-4 shrink-0 text-foreground/70 transition-colors group-hover:text-foreground";
const labelClass =
  "whitespace-nowrap text-[13px] font-medium text-foreground transition-colors";

/** Desktop-only: compact icon chips shown below the composer (no images). */
export function StarterChips({ onPick, className = "" }: StarterCardsProps) {
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key="starter-chips-desktop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`hidden md:flex flex-wrap items-center justify-center gap-2 ${className}`}
      >
        {CARDS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => handleCardClick(c, onPick)}
            className={chipClass}
          >
            <c.Icon className={iconClass} strokeWidth={1.75} />
            <span className={labelClass}>{c.title}</span>
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

export function StarterCards({ onPick, className = "" }: StarterCardsProps) {
  const isAr = useUserLang().startsWith("ar");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`pointer-events-auto relative w-full overflow-hidden md:hidden ${className}`}
    >
      <div
        data-starter-chips-scroll
        dir={isAr ? "rtl" : "ltr"}
        className="flex w-full snap-x snap-proximity gap-2 overflow-x-auto overscroll-x-contain ps-3 pe-8 py-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
      >
        {CARDS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => handleCardClick(c, onPick)}
            className={`snap-start shrink-0 ${chipClass}`}
          >
            <c.Icon className={iconClass} strokeWidth={2} />
            <span className={labelClass}>{isAr ? c.titleAr : c.title}</span>
          </button>
        ))}
      </div>
      {/* Edge fade hints that the row scrolls */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 w-10 ${
          isAr
            ? "left-0 bg-gradient-to-r from-background to-transparent"
            : "right-0 bg-gradient-to-l from-background to-transparent"
        }`}
      />
    </motion.div>
  );
}


export default StarterCards;
