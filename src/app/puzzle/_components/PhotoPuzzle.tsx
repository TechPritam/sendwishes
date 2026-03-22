"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState, type DragEvent } from "react";

type PhotoPuzzleProps = {
  imageUrl: string;
  hiddenMessage: string;
};

const GRID = 3;
const PIECES = GRID * GRID;

type DragPayload = {
  fromIndex: number;
};

function shuffle<T>(arr: T[]) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function isSolved(order: number[]) {
  return order.every((pieceIndex, cellIndex) => pieceIndex === cellIndex);
}

function makeInitialOrder() {
  const base = Array.from({ length: PIECES }, (_, i) => i);
  const next = shuffle(base);
  if (!isSolved(next)) return next;

  // Ensure it starts scrambled.
  const fixed = [...next];
  [fixed[0], fixed[1]] = [fixed[1], fixed[0]];
  return fixed;
}

export function PhotoPuzzle({ imageUrl, hiddenMessage }: PhotoPuzzleProps) {
  const [order, setOrder] = useState<number[]>(() => makeInitialOrder());
  const [completed, setCompleted] = useState(false);
  const [draggingFrom, setDraggingFrom] = useState<number | null>(null);

  const liveSolved = useMemo(() => isSolved(order), [order]);

  useEffect(() => {
    if (liveSolved) {
      const t = window.setTimeout(() => setCompleted(true), 250);
      return () => window.clearTimeout(t);
    }
    setCompleted(false);
  }, [liveSolved]);

  function reset() {
    setOrder(makeInitialOrder());
    setCompleted(false);
    setDraggingFrom(null);
  }

  function swapCells(a: number, b: number) {
    setOrder((prev) => {
      const next = [...prev];
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
  }

  const ariaLabel = completed
    ? "Puzzle completed"
    : "Photo puzzle grid. Drag pieces to solve.";

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
      <header className="mx-auto max-w-3xl text-center">
        <p className="glass-pill inline-flex items-center gap-2 text-sm text-rose-700">
          <span className="text-base">♥</span>
          Photo Puzzle Reveal
        </p>
        <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Put the picture back together
        </h1>
        <p className="mt-3 text-pretty text-sm text-zinc-600 sm:text-base">
          Drag a piece onto another to swap them. When it’s perfect, a message
          appears.
        </p>
      </header>

      <div className="glass-card mx-auto mt-10 grid max-w-4xl gap-6 p-6 sm:grid-cols-[1fr_320px] sm:p-8">
        <div className="relative">
          <div
            aria-label={ariaLabel}
            role="application"
            className="glass-panel relative aspect-square w-full overflow-hidden"
          >
            <div
              className="grid h-full w-full"
              style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: PIECES }, (_, cellIndex) => {
                const pieceIndex = order[cellIndex];
                const row = Math.floor(pieceIndex / GRID);
                const col = pieceIndex % GRID;

                const isDragging = draggingFrom === cellIndex;

                return (
                  <div
                    key={cellIndex}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const raw = e.dataTransfer.getData("application/x-puzzle");
                      if (!raw) return;
                      const payload = JSON.parse(raw) as DragPayload;
                      swapCells(payload.fromIndex, cellIndex);
                      setDraggingFrom(null);
                    }}
                    className="relative"
                  >
                    <motion.div
                      className="h-full w-full"
                      animate={{ opacity: completed ? 0 : 1 }}
                      transition={{ duration: 0.35 }}
                      whileHover={!completed ? { scale: 1.02 } : undefined}
                      whileTap={!completed ? { scale: 0.98 } : undefined}
                    >
                      <button
                        type="button"
                        draggable={!completed}
                        onDragStart={(e: DragEvent<HTMLButtonElement>) => {
                          if (completed) return;
                          setDraggingFrom(cellIndex);
                          e.dataTransfer.setData(
                            "application/x-puzzle",
                            JSON.stringify(
                              { fromIndex: cellIndex } satisfies DragPayload,
                            ),
                          );
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        onDragEnd={() => setDraggingFrom(null)}
                        className={
                          "relative h-full w-full overflow-hidden ring-1 transition focus:outline-none focus:ring-2 focus:ring-rose-300 " +
                          (completed
                            ? "cursor-default ring-transparent"
                            : "cursor-grab rounded-none ring-white/30 hover:ring-rose-200")
                        }
                        style={{
                          backgroundImage: `url(${imageUrl})`,
                          backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
                          backgroundPosition: `${(col / (GRID - 1)) * 100}% ${(row / (GRID - 1)) * 100}%`,
                        }}
                        aria-label={`Piece ${pieceIndex + 1}`}
                      >
                        <span className="sr-only">Piece {pieceIndex + 1}</span>
                        {isDragging ? (
                          <span className="absolute inset-0 bg-white/20" />
                        ) : null}
                      </button>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <AnimatePresence>
              {completed ? (
                <motion.div
                  key="full-image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-hidden
                />
              ) : null}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {completed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="glass-panel mt-5 bg-rose-50/70 p-6 ring-rose-200"
              >
                <div className="text-xs font-medium text-rose-700">
                  Hidden message
                </div>
                <div className="mt-2 text-pretty text-base text-zinc-800 sm:text-lg">
                  {hiddenMessage}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <aside className="glass-panel p-5">
          <div className="text-sm font-semibold text-zinc-900">Progress</div>
          <div className="mt-3 text-sm text-zinc-700">
            {liveSolved ? (
              <span className="font-medium text-rose-700">Solved!</span>
            ) : (
              <span>Keep swapping pieces until it matches.</span>
            )}
          </div>

          <div className="glass-soft mt-5 bg-white/70 p-4">
            <div className="text-xs font-medium text-rose-700">Hint</div>
            <div className="mt-2 text-sm text-zinc-700">
              Start with corners and edges, then fill the middle.
            </div>
          </div>

          <motion.button
            type="button"
            onClick={reset}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-rose-600 px-6 text-sm font-semibold text-white shadow-sm shadow-rose-200/50 transition-colors hover:bg-rose-700"
          >
            Scramble again
          </motion.button>

          <div className="mt-4 text-xs text-zinc-500">
            Note: drag-and-drop support varies by device/browser.
          </div>
        </aside>
      </div>
    </div>
  );
}
