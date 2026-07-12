"use client";

import {
  createContext,
  createRef,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { clamp } from "~/lib/utils";

type XY = { x: number; y: number };

export type Blob = {
  position: XY;
  velocity: XY;
  ref: RefObject<HTMLDivElement>;
} & BlobConfig;

export type BlobConfig = {
  solidRadius: number;
  glowRadius: number;
  color: string;
};

export type BackgroundContext = {
  blobs: Blob[];
  mouseBlob: RefObject<HTMLDivElement>;
  paused: boolean;
  assignMouseBlob: (el: HTMLDivElement) => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  toggleSimulation: () => void;
  setPaused: (paused: boolean) => void;
  addBlob: (blob: Blob) => void;
  spawnRandomBlob: () => void;
  spawnRandomBlobWithPosition: (position: XY) => void;
  isMounted: boolean;
  entropy: number;
  setEntropy: (entropy: number) => void;
};

function forEachPair<T>(
  items: readonly T[],
  callback: (first: T, second: T) => void,
) {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      callback(items[i]!, items[j]!);
    }
  }
}

// Resolve a perfectly elastic collision between two blobs.
// Mass is proportional to area (radius^2) so bigger blobs carry more momentum.
function resolveElasticCollision(a: Blob, b: Blob) {
  const dx = b.position.x - a.position.x;
  const dy = b.position.y - a.position.y;
  const distSq = dx * dx + dy * dy;
  const minDist = a.solidRadius + b.solidRadius;

  // Not overlapping (or exactly coincident) -> nothing to do.
  if (distSq > minDist * minDist || distSq === 0) {
    return;
  }

  const distance = Math.sqrt(distSq);
  const nx = dx / distance;
  const ny = dy / distance;

  const massA = a.solidRadius * a.solidRadius;
  const massB = b.solidRadius * b.solidRadius;
  const invA = 1 / massA;
  const invB = 1 / massB;
  const invTotal = invA + invB;

  // Positional correction: push the blobs apart so they no longer overlap,
  // weighted by inverse mass (the lighter blob moves more).
  const overlap = minDist - distance;
  a.position.x -= nx * overlap * (invA / invTotal);
  a.position.y -= ny * overlap * (invA / invTotal);
  b.position.x += nx * overlap * (invB / invTotal);
  b.position.y += ny * overlap * (invB / invTotal);

  // Relative velocity along the collision normal.
  const relVelX = a.velocity.x - b.velocity.x;
  const relVelY = a.velocity.y - b.velocity.y;
  const velAlongNormal = relVelX * nx + relVelY * ny;

  // Already separating -> don't apply an impulse (prevents sticking).
  if (velAlongNormal <= 0) {
    return;
  }

  // Perfectly elastic impulse (coefficient of restitution = 1).
  const impulse = (-2 * velAlongNormal) / invTotal;
  a.velocity.x += impulse * invA * nx;
  a.velocity.y += impulse * invA * ny;
  b.velocity.x -= impulse * invB * nx;
  b.velocity.y -= impulse * invB * ny;
}

const BackgroundProviderContext = createContext<BackgroundContext>({
  blobs: [],
  mouseBlob: createRef<HTMLDivElement>(),
  paused: false,
  pauseSimulation: () => null,
  resumeSimulation: () => null,
  toggleSimulation: () => null,
  assignMouseBlob: () => null,
  addBlob: () => null,
  spawnRandomBlob: () => null,
  spawnRandomBlobWithPosition: () => null,
  isMounted: false,
  entropy: 0,
  setEntropy: () => null,
  setPaused: () => null,
});

const DEFAULT_BLOBS = [
  {
    solidRadius: 95,
    glowRadius: 280,
    color: "255, 72, 148",
    velocity: { x: 200, y: -190 },
    position: { x: 1400, y: 500 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 180,
    glowRadius: 520,
    color: "64, 196, 255",
    velocity: { x: 200, y: -190 },
    position: { x: 1000, y: 500 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 28,
    glowRadius: 140,
    color: "255, 196, 48",
    velocity: { x: 200, y: -190 },
    position: { x: 600, y: 500 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 42,
    glowRadius: 210,
    color: "120, 255, 160",
    velocity: { x: 200, y: -190 },
    position: { x: 200, y: 500 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 70,
    glowRadius: 260,
    color: "180, 90, 255",
    velocity: { x: 200, y: -190 },
    position: { x: 1000, y: 1000 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 35,
    glowRadius: 180,
    color: "255, 140, 60",
    velocity: { x: 200, y: -190 },
    position: { x: 600, y: 1000 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 110,
    glowRadius: 340,
    color: "255, 80, 220",
    velocity: { x: 30, y: 300 },
    position: { x: 100, y: 500 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 340,
    glowRadius: 720,
    color: "255, 230, 80",
    velocity: { x: 60, y: 220 },
    position: { x: 1600, y: 500 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 220,
    glowRadius: 480,
    color: "20, 180, 170",
    velocity: { x: 500, y: 300 },
    position: { x: 800, y: 800 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 55,
    glowRadius: 240,
    color: "80, 120, 255",
    velocity: { x: -160, y: 240 },
    position: { x: 400, y: 200 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 260,
    glowRadius: 580,
    color: "255, 60, 90",
    velocity: { x: 180, y: -80 },
    position: { x: 1200, y: 200 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 18,
    glowRadius: 100,
    color: "40, 255, 200",
    velocity: { x: -90, y: 310 },
    position: { x: 300, y: 800 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 145,
    glowRadius: 400,
    color: "200, 255, 60",
    velocity: { x: 280, y: 140 },
    position: { x: 900, y: 150 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 80,
    glowRadius: 300,
    color: "255, 100, 40",
    velocity: { x: -220, y: -150 },
    position: { x: 1500, y: 900 },
    ref: createRef<HTMLDivElement>(),
  },
] satisfies Blob[];

export function BackgroundProvider(props: { children: React.ReactNode }) {
  const mouseBlob = useRef<HTMLDivElement>(null);
  const mouseBubbleLerpSpeed = 20;
  const pausedRef = useRef(false);
  const lastFrameRef = useRef(performance.now());
  const bounceFrameRef = useRef<number>();
  const entropyRef = useRef(1);

  const mouseBlobPosRef = useRef({
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
  });

  const [blobs, setBlobs] = useState<Blob[]>(DEFAULT_BLOBS);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addBlob = useCallback((blob: Blob) => {
    setBlobs((prev) => [...prev, blob]);
  }, []);

  function handleMouseMove(event: MouseEvent) {
    mouseBlobPosRef.current.target.x = event.clientX;
    mouseBlobPosRef.current.target.y = event.clientY;
  }

  useEffect(() => {
    // Set up mouse blob animation (only once)
    function moveMouseBlob() {
      if (!pausedRef.current) {
        mouseBlobPosRef.current.current.x +=
          (mouseBlobPosRef.current.target.x -
            mouseBlobPosRef.current.current.x) /
          mouseBubbleLerpSpeed;
        mouseBlobPosRef.current.current.y +=
          (mouseBlobPosRef.current.target.y -
            mouseBlobPosRef.current.current.y) /
          mouseBubbleLerpSpeed;

        if (mouseBlob.current) {
          mouseBlob.current.style.transform = `translate(${Math.round(mouseBlobPosRef.current.current.x - mouseBlob.current.getBoundingClientRect().width / 2)}px, ${Math.round(mouseBlobPosRef.current.current.y - mouseBlob.current.getBoundingClientRect().height / 2)}px)`;
        }
      }

      requestAnimationFrame(() => {
        moveMouseBlob();
      });
    }

    window.addEventListener("mousemove", handleMouseMove);
    moveMouseBlob();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseBubbleLerpSpeed]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "p") {
        pausedRef.current = !pausedRef.current;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [blobs]);

  // Ambient drift: nudge velocity with a little randomness (in px/s), keeping
  // the speed within a sane range. This is intentionally gentle so it doesn't
  // overwhelm the elastic collisions.
  const applyAmbientDrift = useCallback((blob: Blob, deltaTime: number) => {
    const maxVelocity = entropyRef.current * 400;
    const acceleration = entropyRef.current * 120;

    blob.velocity.x += (Math.random() - 0.5) * acceleration * deltaTime;
    blob.velocity.y += (Math.random() - 0.5) * acceleration * deltaTime;

    blob.velocity.x = clamp(blob.velocity.x, {
      min: -maxVelocity,
      max: maxVelocity,
    });
    blob.velocity.y = clamp(blob.velocity.y, {
      min: -maxVelocity,
      max: maxVelocity,
    });
  }, []);

  // Bounce off the viewport walls, accounting for the blob's radius so it
  // never sinks past the edge, and never gets "stuck" flipping at the boundary.
  const keepInBounds = useCallback((blob: Blob) => {
    const r = blob.solidRadius;
    const maxX = Math.max(r, window.innerWidth - r);
    const maxY = Math.max(r, window.innerHeight - r);

    if (blob.position.x < r) {
      blob.position.x = r;
      blob.velocity.x = Math.abs(blob.velocity.x);
    } else if (blob.position.x > maxX) {
      blob.position.x = maxX;
      blob.velocity.x = -Math.abs(blob.velocity.x);
    }

    if (blob.position.y < r) {
      blob.position.y = r;
      blob.velocity.y = Math.abs(blob.velocity.y);
    } else if (blob.position.y > maxY) {
      blob.position.y = maxY;
      blob.velocity.y = -Math.abs(blob.velocity.y);
    }
  }, []);

  // Single unified simulation step for ALL blobs. Using one loop (instead of a
  // separate requestAnimationFrame per blob) means we compute one correct
  // delta time per frame, integrate every blob, resolve collisions once, then
  // render — which is what makes the physics behave as intended.
  const simulate = useCallback(
    (ts: number) => {
      if (!pausedRef.current) {
        // Cap dt so a backgrounded tab (huge gap) can't make blobs tunnel
        // through each other or the walls on the first frame back.
        const deltaTime = Math.min((ts - lastFrameRef.current) / 1000, 0.05);
        lastFrameRef.current = ts;

        // 1. Integrate velocity + position (velocity is in px/second).
        for (const blob of blobs) {
          applyAmbientDrift(blob, deltaTime);
          blob.position.x += blob.velocity.x * deltaTime;
          blob.position.y += blob.velocity.y * deltaTime;
        }

        // 2. Elastic blob-on-blob collisions.
        forEachPair(blobs, resolveElasticCollision);

        // 3. Keep everyone inside the viewport (after collision separation).
        for (const blob of blobs) {
          keepInBounds(blob);
        }

        // 4. Render.
        for (const blob of blobs) {
          if (blob.ref.current) {
            const rect = blob.ref.current.getBoundingClientRect();
            blob.ref.current.style.transform = `translate(${blob.position.x - rect.width / 2}px, ${blob.position.y - rect.height / 2}px)`;
          }
        }
      } else {
        // While paused, keep the clock current so we don't get a giant dt on
        // resume.
        lastFrameRef.current = ts;
      }

      bounceFrameRef.current = requestAnimationFrame(simulate);
    },
    [blobs, applyAmbientDrift, keepInBounds],
  );

  useEffect(() => {
    lastFrameRef.current = performance.now();
    bounceFrameRef.current = requestAnimationFrame(simulate);

    return () => {
      if (bounceFrameRef.current) {
        cancelAnimationFrame(bounceFrameRef.current);
      }
    };
  }, [simulate]);

  const assignMouseBlob = useCallback((el: HTMLDivElement) => {
    (mouseBlob as { current: HTMLDivElement }).current = el!;
  }, []);

  function getRandomBrightColor() {
    const vals = [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255,
    ];
    vals.sort(() => Math.random() - 0.5);
    return `${vals[0]}, ${vals[1]}, ${vals[2]}`;
  }

  const spawnRandomBlobWithPosition = useCallback(
    (position: XY) => {
      const solidRadius = Math.round(Math.random() * 300) + 50;
      const glowRadius = Math.round(Math.random() * 500) + 200;
      addBlob({
        solidRadius,
        glowRadius: solidRadius + glowRadius,
        color: getRandomBrightColor(),
        velocity: { x: Math.random() * 10 - 5, y: Math.random() * 10 - 5 },
        position: position,
        ref: createRef<HTMLDivElement>(),
      });
    },
    [addBlob],
  );

  const spawnRandomBlob = useCallback(() => {
    spawnRandomBlobWithPosition({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    });
  }, [spawnRandomBlobWithPosition]);

  const values: BackgroundContext = useMemo(
    () => ({
      blobs,
      paused: pausedRef.current,
      spawnRandomBlob,
      mouseBlob,
      assignMouseBlob,
      addBlob,
      spawnRandomBlobWithPosition,
      isMounted,
      setPaused: (paused: boolean) => (pausedRef.current = paused),
      pauseSimulation: () => (pausedRef.current = true),
      resumeSimulation: () => (pausedRef.current = false),
      toggleSimulation: () => (pausedRef.current = !pausedRef.current),
      entropy: entropyRef.current,
      setEntropy: (entropy: number) => (entropyRef.current = entropy),
    }),
    [
      blobs,
      assignMouseBlob,
      addBlob,
      isMounted,
      spawnRandomBlob,
      spawnRandomBlobWithPosition,
    ],
  );

  return (
    <BackgroundProviderContext.Provider value={values}>
      {props.children}
    </BackgroundProviderContext.Provider>
  );
}

export const useBackground = () => {
  const context = useContext(BackgroundProviderContext);
  if (!context) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
};
