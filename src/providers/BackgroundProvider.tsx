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

const SMALL_BLOBS = [
  {
    solidRadius: 100,
    glowRadius: 300,
    color: "255, 100, 100",
    velocity: { x: 200, y: -190 },
    position: { x: 1400, y: 500 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 100,
    glowRadius: 300,
    color: "255, 100, 255",
    velocity: { x: 30, y: 300 },
    position: { x: 100, y: 500 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 300,
    glowRadius: 600,
    color: "255, 255, 120",
    velocity: { x: 60, y: 220 },
    position: { x: 1600, y: 500 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 200,
    glowRadius: 400,
    color: "0, 100, 100",
    velocity: { x: 500, y: 300 },
    position: { x: 800, y: 800 },
    ref: createRef<HTMLDivElement>(),
  },
] satisfies Blob[];

const DEFAULT_BLOBS = [
  {
    solidRadius: 100,
    glowRadius: 300,
    color: "255, 100, 255",
    velocity: { x: 30, y: 300 },
    position: { x: 100, y: 500 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 200,
    glowRadius: 400,
    color: "0, 100, 100",
    velocity: { x: 500, y: 300 },
    position: { x: 800, y: 800 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 150,
    glowRadius: 350,
    color: "255, 120, 60",
    velocity: { x: -200, y: 180 },
    position: { x: 600, y: 400 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 250,
    glowRadius: 500,
    color: "80, 200, 255",
    velocity: { x: 120, y: -250 },
    position: { x: 1200, y: 700 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 180,
    glowRadius: 320,
    color: "200, 80, 255",
    velocity: { x: -150, y: -100 },
    position: { x: 400, y: 300 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 300,
    glowRadius: 600,
    color: "255, 255, 120",
    velocity: { x: 60, y: 220 },
    position: { x: 1600, y: 500 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 120,
    glowRadius: 280,
    color: "100, 255, 180",
    velocity: { x: -80, y: 260 },
    position: { x: 900, y: 200 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 100,
    glowRadius: 300,
    color: "100, 100, 255",
    velocity: { x: -300, y: 10 },
    position: { x: 740, y: 500 },
    ref: createRef<HTMLDivElement>(),
  },
  {
    solidRadius: 100,
    glowRadius: 300,
    color: "255, 100, 100",
    velocity: { x: 200, y: -190 },
    position: { x: 1400, y: 500 },
    ref: createRef<HTMLDivElement>(),
  },
] satisfies Blob[];

export function BackgroundProvider(props: { children: React.ReactNode }) {
  const mouseBlob = useRef<HTMLDivElement>(null);
  const mouseBubbleLerpSpeed = 20;
  const pausedRef = useRef(false);
  const lastFrameRef = useRef(performance.now());
  const lastCollisionFrameRef = useRef(performance.now());
  const bounceFrameRef = useRef<number>();
  const entropyRef = useRef(1);

  const mouseBlobPosRef = useRef({
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
  });

  const [blobs, setBlobs] = useState<Blob[]>(SMALL_BLOBS);
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

  const bounceOffOthers = useCallback(
    (timestamp: number) => {
      const deltaTime = (timestamp - lastCollisionFrameRef.current) / 1000;
      lastCollisionFrameRef.current = timestamp;

      forEachPair(blobs, (blob, otherBlob) => {
        const dx = otherBlob.position.x - blob.position.x;
        const dy = otherBlob.position.y - blob.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const touchingDistance = blob.solidRadius + otherBlob.solidRadius;

        if (distance === 0 || distance > touchingDistance) {
          return;
        }

        const nx = dx / distance;
        const ny = dy / distance;
        const overlap = touchingDistance - distance;
        const k = 0.3;
        const force = k * overlap;

        blob.velocity.x -= force * nx * deltaTime;
        blob.velocity.y -= force * ny * deltaTime;
        otherBlob.velocity.x += force * nx * deltaTime;
        otherBlob.velocity.y += force * ny * deltaTime;
        //TODO: remove this
      });

      bounceFrameRef.current = requestAnimationFrame(bounceOffOthers);
    },
    [blobs],
  );

  const keepInBounds = useCallback((blob: Blob) => {
    if (blob.position.x < 0 || blob.position.x > window.innerWidth) {
      blob.velocity.x = -blob.velocity.x;
    }
    if (blob.position.y < 0 || blob.position.y > window.innerHeight) {
      blob.velocity.y = -blob.velocity.y;
    }

    blob.position.x = clamp(blob.position.x, {
      min: 0,
      max: window.innerWidth,
    });
    blob.position.y = clamp(blob.position.y, {
      min: 0,
      max: window.innerHeight,
    });
  }, []);

  const updateBubbleVelocity = useCallback(
    (blob: Blob, deltaTime: number) => {
      const maxVelocity = entropyRef.current * 1.5;
      const acceleration = entropyRef.current * 20;

      // Gradually change velocity with smooth randomness
      blob.velocity.x += (Math.random() - 0.5) * acceleration * deltaTime;
      blob.velocity.y += (Math.random() - 0.5) * acceleration * deltaTime;

      // Clamp velocity to prevent too fast movement
      blob.velocity.x = clamp(blob.velocity.x, {
        min: -maxVelocity,
        max: maxVelocity,
      });
      blob.velocity.y = clamp(blob.velocity.y, {
        min: -maxVelocity,
        max: maxVelocity,
      });
    },
    [entropyRef],
  );

  const updateBlob = useCallback(
    (blob: Blob, ts: number) => {
      if (!pausedRef.current) {
        const deltaTime = (ts - lastFrameRef.current) / 1000;
        lastFrameRef.current = ts;

        // Update velocity over time
        updateBubbleVelocity(blob, deltaTime);

        // Update position based on velocity
        blob.position.x += blob.velocity.x;
        blob.position.y += blob.velocity.y;

        keepInBounds(blob);
        // bounceOffOthers(blob, deltaTime);

        if (blob.ref.current) {
          const rect = blob.ref.current.getBoundingClientRect();
          blob.ref.current.style.transform = `translate(${blob.position.x - rect.width / 2}px, ${blob.position.y - rect.height / 2}px)`;
        }
      }

      requestAnimationFrame((ts) => updateBlob(blob, ts));
    },
    [updateBubbleVelocity, keepInBounds],
  );

  useEffect(() => {
    // Start animations for each blob
    lastFrameRef.current = performance.now();
    blobs.forEach((blob) => {
      requestAnimationFrame((ts) => updateBlob(blob, ts));
    });
    bounceFrameRef.current = requestAnimationFrame(bounceOffOthers);

    return () => {
      if (bounceFrameRef.current) {
        cancelAnimationFrame(bounceFrameRef.current);
      }
    };
  }, [blobs, updateBlob, bounceOffOthers]);

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
