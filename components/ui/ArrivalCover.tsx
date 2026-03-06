"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { RocketScene } from "@/components/three/RocketScene";

const STORAGE_KEY = "portfolio-arrival-dismissed";
const UNLOCK_KEY = "portfolio-site-unlocked";
const SNAP_THRESHOLD = 0.72;
const STEP1_FADEOUT_MS = 500;
const SNAP_DURATION_MS = 280;
const BOUNCE_BACK_DURATION_MS = 420;
const BOUNCE_BACK_OVERSHOOT = -0.04; // progress briefly goes slightly negative for "bounce down"
const SCROLL_IDLE_MS = 100;
const POLL_INTERVAL_MS = 50;
const ACTION_WORD_INTERVAL_MS = 4000;
const DELTA_RATE = 0.0022;
const ACTION_WORDS = ["Scroll", "Swipe", "Drag"] as const;

export function ArrivalCover() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [arrivalDismissed, setArrivalDismissed] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<"idle" | "fadeOut" | "cover">("idle");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [step2ContentVisible, setStep2ContentVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSnapping, setIsSnapping] = useState(false);
  const [isBouncingBack, setIsBouncingBack] = useState(false);
  const [actionWordIndex, setActionWordIndex] = useState(0);
  const coverRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const snapStartRef = useRef(0);
  const snapStartTimeRef = useRef(0);
  const lastScrollInputRef = useRef(0);
  const isSnappingRef = useRef(false);
  const isBouncingBackRef = useRef(false);

  const showStep1 = unlocked === false || transitionPhase === "fadeOut";
  const showStep2 = unlocked === true && !arrivalDismissed;
  const visible = showStep2;

  // Step 1 → Step 2: reveal arrow/text and gradients after mount
  useEffect(() => {
    if (!showStep2 || transitionPhase !== "cover") return;
    const t = setTimeout(() => setStep2ContentVisible(true), 50);
    return () => clearTimeout(t);
  }, [showStep2, transitionPhase]);

  // On mount: read unlock + arrival state and sync document class (prevents flash)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const un = sessionStorage.getItem(UNLOCK_KEY) === "1";
      const dis = sessionStorage.getItem(STORAGE_KEY) === "1";
      setUnlocked(un);
      setArrivalDismissed(dis);
      if (un && !dis) setTransitionPhase("cover");
      if (dis) {
        document.documentElement.classList.remove("arrival-cover-active");
        document.documentElement.classList.add("arrival-dismissed");
      }
    } catch {
      setUnlocked(false);
    }
  }, []);

  // Lock scroll and keep page at top while Step 1 or Step 2 is showing
  useEffect(() => {
    if (!showStep1 && !showStep2) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [showStep1, showStep2]);

  // Rotate first word: Scroll → Swipe → Drag every 4s
  useEffect(() => {
    if (visible !== true) return;
    const id = setInterval(() => {
      setActionWordIndex((i) => (i + 1) % ACTION_WORDS.length);
    }, ACTION_WORD_INTERVAL_MS);
    return () => clearInterval(id);
  }, [visible]);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    document.body.style.overflow = "";
    document.documentElement.classList.remove("arrival-cover-active");
    document.documentElement.classList.add("arrival-dismissed");
    setArrivalDismissed(true);
  }, []);

  const handleUnlockSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setPasswordError("");
      const value = password.trim();
      if (!value) return;
      try {
        const res = await fetch("/api/unlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: value }),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setPasswordError(data.error || "Invalid password");
          return;
        }
        sessionStorage.setItem(UNLOCK_KEY, "1");
        setTransitionPhase("fadeOut");
        setTimeout(() => {
          setUnlocked(true);
          setTransitionPhase("cover");
        }, STEP1_FADEOUT_MS);
      } catch {
        setPasswordError("Something went wrong");
      }
    },
    [password]
  );

  const prefersReducedMotion = useRef(false);
  const progressRef = useRef(0);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);
  useEffect(() => {
    isSnappingRef.current = isSnapping;
  }, [isSnapping]);
  useEffect(() => {
    isBouncingBackRef.current = isBouncingBack;
  }, [isBouncingBack]);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mq.matches;
  }, []);

  // Bounce back to 0 when user releases before threshold (gravity)
  const startBounceBack = useCallback(() => {
    if (visible !== true) return;
    if (isSnappingRef.current || isBouncingBackRef.current) return;
    const startP = progressRef.current;
    if (startP >= SNAP_THRESHOLD || startP <= 0) return;
    isBouncingBackRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsBouncingBack(true);
    const startTime = performance.now();
    const duration = prefersReducedMotion.current ? 150 : BOUNCE_BACK_DURATION_MS;
    const run = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Ease-out then slight overshoot: 0..0.75 -> back to 0, 0.75..0.9 -> overshoot, 0.9..1 -> settle at 0
      let value: number;
      if (t < 0.75) {
        value = startP * (1 - t / 0.75);
      } else if (t < 0.9) {
        const local = (t - 0.75) / 0.15;
        value = BOUNCE_BACK_OVERSHOOT * local;
      } else {
        const local = (t - 0.9) / 0.1;
        value = BOUNCE_BACK_OVERSHOOT * (1 - local);
      }
      setProgress(value);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(run);
      } else {
        setProgress(0);
        setIsBouncingBack(false);
      }
    };
    rafRef.current = requestAnimationFrame(run);
  }, [visible]);

  const startBounceBackRef = useRef(startBounceBack);
  startBounceBackRef.current = startBounceBack;

  // Map raw delta to progress; near threshold we snap away (or instant if reduced-motion)
  const applyDelta = useCallback(
    (delta: number) => {
      if (visible !== true || isSnapping || isBouncingBack) return;
      setProgress((p) => {
        const next = Math.min(1, p + delta * DELTA_RATE);
        if (next >= SNAP_THRESHOLD && next < 1) {
          setIsSnapping(true);
          if (prefersReducedMotion.current) {
            setProgress(1);
            dismiss();
            setIsSnapping(false);
            return 1;
          }
          snapStartRef.current = next;
          snapStartTimeRef.current = performance.now();
          const duration = SNAP_DURATION_MS;
          rafRef.current = requestAnimationFrame(function snapAnim(now: number) {
            const elapsed = now - snapStartTimeRef.current;
            const t = Math.min(1, elapsed / duration);
            const eased = 1 - (1 - t) * (1 - t);
            const value = snapStartRef.current + (1 - snapStartRef.current) * eased;
            setProgress(value);
            if (value < 1) {
              rafRef.current = requestAnimationFrame(snapAnim);
            } else {
              setIsSnapping(false);
              dismiss();
            }
          });
          return next;
        }
        if (next >= 1) {
          dismiss();
          return 1;
        }
        return next;
      });
    },
    [visible, isSnapping, isBouncingBack, dismiss]
  );

  const applyDeltaRef = useRef(applyDelta);
  applyDeltaRef.current = applyDelta;

  // Single effect: wheel + touch + poll. Only depends on [visible] so it never re-runs and clears the interval.
  useEffect(() => {
    if (visible !== true) return;

    const onWheel = (e: WheelEvent) => {
      // Scroll down (deltaY < 0): treat as "go back" and bounce back if we're in the middle
      if (e.deltaY < 0) {
        const p = progressRef.current;
        if (p > 0 && p < SNAP_THRESHOLD) {
          e.preventDefault();
          startBounceBackRef.current();
        }
        return;
      }
      e.preventDefault();
      window.scrollTo(0, 0);
      lastScrollInputRef.current = Date.now();
      applyDeltaRef.current(e.deltaY);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const delta = touchStartY - y;
      if (delta > 0) {
        e.preventDefault();
        window.scrollTo(0, 0);
        lastScrollInputRef.current = Date.now();
        applyDeltaRef.current(delta * 1.2);
      }
      touchStartY = y;
    };
    const tryBounceBack = () => {
      if (progressRef.current > 0 && progressRef.current < SNAP_THRESHOLD) {
        startBounceBackRef.current();
      }
    };

    let lastMouseY = 0;
    let isDragging = false;
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as Node | null;
      if (coverRef.current?.querySelector("[data-arrival-canvas-wrap]")?.contains(target)) return;
      isDragging = true;
      lastMouseY = e.clientY;
      lastScrollInputRef.current = Date.now();
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = lastMouseY - e.clientY;
      if (delta > 0) {
        window.scrollTo(0, 0);
        lastScrollInputRef.current = Date.now();
        applyDeltaRef.current(delta * 1.2);
      }
      lastMouseY = e.clientY;
    };
    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        tryBounceBack();
      }
    };

    const poll = () => {
      if (isDragging) return;
      const now = Date.now();
      const idle = now - lastScrollInputRef.current;
      const p = progressRef.current;
      if (
        lastScrollInputRef.current > 0 &&
        idle >= SCROLL_IDLE_MS &&
        p > 0 &&
        p < SNAP_THRESHOLD &&
        !isBouncingBackRef.current &&
        !isSnappingRef.current
      ) {
        startBounceBackRef.current();
      }
    };

    // Capture phase so we get wheel before canvas/other elements
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", tryBounceBack, { passive: true });
    window.addEventListener("touchcancel", tryBounceBack, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    const intervalId = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", tryBounceBack);
      window.removeEventListener("touchcancel", tryBounceBack);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      clearInterval(intervalId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  const y = -progress * 100;
  const glowHeight = Math.min(40, progress * 55);
  const conicGlowOpacity = Math.min(1, progress * 2.2);
  const edgeGlowHeight = 20 + progress * 12;
  const edgeGlowOpacity = 0.28 + progress * 0.14;

  if (!showStep1 && !showStep2) return null;

  // Single wrapper so the black cover never unmounts – prevents flash when transitioning from password to cover
  return (
    <div
      ref={coverRef}
      className="arrival-cover fixed inset-0 z-[150] flex flex-col items-center justify-between bg-black"
      style={
        showStep2
          ? {
              transform: `translate3d(0, ${y}%, 0)`,
              willChange: progress > 0 ? "transform" : "auto",
            }
          : undefined
      }
      aria-hidden
    >
      <div className="flex flex-1 items-center justify-center w-full shrink-0">
        <div
          data-arrival-canvas-wrap
          className="arrival-cover-canvas-wrap relative h-[400px] min-h-[400px] w-full max-w-[400px] overflow-hidden bg-black md:h-[520px] md:min-h-[520px] md:max-w-[520px]"
          style={{ width: "min(90vw, 520px)" }}
        >
          <div className="relative z-0 h-full w-full">
            <RocketScene
              className="h-full w-full"
              controls={true}
              pointerEvents="auto"
              fillParent
              hideBackground
              transparentBackground
              sceneScale={1.2}
              scenePositionX={0}
            />
          </div>
          <div className="arrival-cover-canvas-overlay" aria-hidden />
        </div>
      </div>

      {showStep1 && (
        <form
          onSubmit={handleUnlockSubmit}
          className={`arrival-step1-form relative z-10 flex flex-col items-center gap-2 pb-20 md:pb-24 ${
            transitionPhase === "fadeOut" ? "arrival-step1-fade-out" : ""
          }`}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            placeholder="Enter password"
            className="arrival-step1-input w-full max-w-[280px] rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center text-white placeholder:text-center placeholder:text-white/50 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
            autoComplete="current-password"
            aria-label="Site password"
          />
          <div className="arrival-step1-error min-h-[1.25rem] flex flex-col justify-end">
            {passwordError && (
              <p className="text-xs text-red-400/90" role="alert">
                {passwordError}
              </p>
            )}
          </div>
        </form>
      )}

      {showStep2 && (
        <>
          <div
            className="arrival-cover-glow absolute bottom-0 left-0 right-0 pointer-events-none bg-gradient-to-t from-[var(--color-accent)]/40 via-[var(--color-accent)]/10 to-transparent"
            style={{ height: `${glowHeight}vh` }}
          />
          <div
            className="arrival-cover-edge-glow"
            style={{ height: `${edgeGlowHeight}px`, opacity: edgeGlowOpacity }}
            aria-hidden
          >
            <div className="arrival-cover-edge-glow-inner" />
          </div>
          <div
            className="arrival-cover-conic-glow"
            style={{ opacity: conicGlowOpacity }}
            aria-hidden
          >
            <div className="arrival-cover-conic-glow-inner" />
          </div>
          <div
            className={`arrival-step2-content relative z-10 flex flex-col items-center gap-3 pb-12 md:pb-16 ${
              step2ContentVisible ? "arrival-step2-content-visible" : ""
            }`}
          >
            <span className="arrival-cover-arrow arrival-cover-arrow-float inline-block text-white/90" aria-hidden>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </span>
            <p className="arrival-cover-action-line text-center text-white/70 tracking-wide">
              <span key={actionWordIndex} className="arrival-cover-action-word">
                {ACTION_WORDS[actionWordIndex]}
              </span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
