/**
 * @doc Computer surface embedded straight into the composer.
 *
 * Collapsed: a clean chip-style button that looks like the starter chips —
 * rounded rectangle, border, muted background, text only, no icons.
 * Expanded: a bare browser preview area with no chrome, titles or icons.
 */
import { useComputerLiveView } from "@/lib/computer/liveView";
import { useUserLang } from "@/lib/authI18n";
import { useComposerComputer } from "./ComposerComputerContext";

export function ComposerComputerDock({ className = "" }: { className?: string }) {
  const view = useComputerLiveView();
  const lang = useUserLang();
  const { open, toggle } = useComposerComputer();
  const isAr = lang.startsWith("ar");

  if (!view || (!view.active && !view.url && !view.poster)) return null;

  const title = isAr ? "كمبيوتر ميغسي" : "Megsy Computer";

  return (
    <div
      data-composer-computer
      className={`w-full ${className}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      {open ? (
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-background"
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
            <img
              src={view.poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}
        </div>
      ) : (
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
          className="group inline-flex h-10 w-auto items-center gap-2 rounded-xl border border-border bg-card px-3.5 text-start transition-[background-color,transform] duration-150 hover:bg-muted active:scale-[0.97]"
        >
          <span className="truncate text-[13px] font-medium text-foreground transition-colors">
            {title}
          </span>
        </button>
      )}
    </div>
  );
}

export default ComposerComputerDock;
