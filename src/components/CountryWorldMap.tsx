"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { buildHighlightedWorldMapSvg, fetchWorldMapSvg } from "@/lib/world-map";

type CountryWorldMapProps = {
  code: string;
  name: string;
};

function MapStyles({ highlightId }: { highlightId: string }) {
  return (
    <style>{`
      .explore-world-map-svg-${highlightId} path {
        fill: rgba(148, 163, 184, 0.42);
        stroke: rgba(100, 116, 139, 0.35);
        stroke-width: 0.5;
      }
      .explore-world-map-svg-${highlightId} #${highlightId},
      .explore-world-map-svg-${highlightId} #${highlightId} path {
        fill: rgba(56, 189, 248, 1);
        stroke: rgba(224, 242, 254, 0.9);
        stroke-width: 0.65;
        filter: drop-shadow(0 0 7px rgba(56, 189, 248, 0.8));
      }
    `}</style>
  );
}

function MapSvg({
  displaySvg,
  highlightId,
  name,
  className,
}: {
  displaySvg: string;
  highlightId: string;
  name: string;
  className: string;
}) {
  return (
    <div
      className={`explore-world-map-svg explore-world-map-svg-${highlightId} ${className}`.trim()}
      role="img"
      aria-label={`Position de ${name} sur la carte du monde`}
      dangerouslySetInnerHTML={{ __html: displaySvg }}
    />
  );
}

export function CountryWorldMap({ code, name }: CountryWorldMapProps) {
  const [displaySvg, setDisplaySvg] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const highlightId = code.toLowerCase();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchWorldMapSvg().then((raw) => {
      if (cancelled || !raw) {
        if (!cancelled) setDisplaySvg(null);
        return;
      }
      setDisplaySvg(buildHighlightedWorldMapSvg(raw, highlightId));
    });

    return () => {
      cancelled = true;
    };
  }, [highlightId]);

  useEffect(() => {
    setExpanded(false);
  }, [highlightId]);

  useEffect(() => {
    if (!expanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [expanded]);

  return (
    <>
      <div className="explore-world-map">
        <div className="explore-world-map-header">
          <p className="explore-world-map-label">Position mondiale</p>
          {displaySvg && (
            <button
              type="button"
              className="explore-world-map-expand"
              onClick={() => setExpanded(true)}
              aria-label={`Agrandir la carte du monde — ${name}`}
            >
              Agrandir
            </button>
          )}
        </div>
        <div className="explore-world-map-frame">
          {displaySvg ? (
            <>
              <MapStyles highlightId={highlightId} />
              <motion.div
                key={highlightId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <MapSvg
                  displaySvg={displaySvg}
                  highlightId={highlightId}
                  name={name}
                  className="h-full w-full"
                />
              </motion.div>
            </>
          ) : (
            <p className="explore-world-map-fallback text-xs text-dex-muted">
              Carte indisponible
            </p>
          )}
        </div>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {expanded && displaySvg && (
              <motion.div
                className="explore-world-map-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                role="dialog"
                aria-modal="true"
                aria-label={`Carte du monde — ${name}`}
                onClick={() => setExpanded(false)}
              >
                <motion.div
                  className="explore-world-map-modal-panel"
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ duration: 0.25 }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="explore-world-map-modal-header">
                    <p className="explore-world-map-modal-title">
                      Position mondiale — {name}
                    </p>
                    <button
                      type="button"
                      className="explore-world-map-modal-close"
                      onClick={() => setExpanded(false)}
                    >
                      Fermer
                    </button>
                  </div>
                  <div className="explore-world-map-modal-frame">
                    <MapStyles highlightId={highlightId} />
                    <MapSvg
                      displaySvg={displaySvg}
                      highlightId={highlightId}
                      name={name}
                      className="explore-world-map-modal-svg"
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
