/**
 * @doc Computer surface embedded straight into the composer.
 *
 * Collapsed: one hard, quiet row — a small rectangular preview thumbnail, the
 * label "كومبيوتر ميغسي" with a slowly rotating gold Megsy star, and an
 * up-arrow. Expanded: the input box disappears and only a clean screen area
 * remains, nothing else — no titles, no buttons, no chrome inside.
 */
import { ChevronUp } from "lucide-react";
import MegsyStar from "@/components/branding/MegsyStar";
import { useComputerLiveView } from "@/lib/computer/liveView";
import { useUserLang } from "@/lib/authI18n";
import { useComposerComputer } from "./ComposerComputerContext";

export function ComposerComputerDock({ className = "" }: { className?: string }) {
  const view = useComputerLiveView();
  const lang = useUserLang();
  const { open, toggle } = useComposerComputer();
  const isAr = lang.startsWith("ar");

  if (!view || (!view.active && !view.url && !view.poster)) return null;

  const title = isAr ? "كومبيوتر ميغسي" : "Megsy Computer";

  return (
    <div
      data-composer-computer
      className={`overflow-hidden rounded-xl border border-border/60 bg-background ${className}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={
          open
            ? isAr
              ? "تصغير كومبيوتر ميغسي"
              : "Collapse Megsy Computer"
            : isAr
              ? "تكبير كومبيوتر ميغسي"
              : "Expand Megsy Computer"
        }
        className="flex h-11 w-full items-center gap-2.5 px-2 text-start"
      >
        {/* small preview thumbnail — a still frame, never a live iframe:
            a scaled-down browser never reads as anything but a black blob. */}
        <span className="relative h-7 w-11 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted">
          {view.poster ? (
            <img
              src={view.poster}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center">
              <span
                className={`h-1 w-1 rounded-full bg-muted-foreground/60 ${view.active ? "motion-safe:animate-pulse" : ""}`}
              />
            </span>
          )}
        </span>

        <MegsyStar
          className={`h-3.5 w-3.5 shrink-0 text-[var(--megsy-gold)] ${view.active ? "motion-safe:animate-[spin_4s_linear_infinite]" : ""}`}
        />

        <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-foreground">
          {title}
        </span>

        <ChevronUp
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          className="relative w-full overflow-hidden border-t border-border/60 bg-muted"
          style={{ height: "min(50vh, 360px)" }}
        >
          {view.url ? (
            <iframe
              src={view.url}
              title={title}
              className="absolute inset-0 h-full w-full border-0"
              allow="clipboard-read; clipboard-write"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          ) : view.poster ? (
            <img src={view.poster} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <MegsyStar className="h-6 w-6 text-[var(--megsy-gold)] motion-safe:animate-[spin_4s_linear_infinite]" />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default ComposerComputerDock;
