"use client";

import { useEffect, useState } from "react";
import Container from "~/components/Container";
import { FadeIn, FadeInText } from "~/components/fade-in";
import { HStack, VStack } from "~/components/HelperDivs";
import Popup from "~/components/Popup";
import { useMousePosition } from "~/hooks/useMousePosition";
import { useBackground } from "~/providers/BackgroundProvider";

const BlogPage = () => {
  return (
    <VStack y="top" x="center" className="w-full">
      <HeroBanner />
    </VStack>
  );
};

const GradientControls = () => {
  const {
    spawnRandomBlobWithPosition,
    spawnRandomBlob,
    entropy,
    setEntropy,
    resumeSimulation,
    pauseSimulation,
  } = useBackground();
  const [paused, setPaused] = useState(false);
  const mousePosition = useMousePosition();

  useEffect(() => {
    function handleMouseDown() {
      console.log("mouse down");
      // spawnRandomBlob();
      spawnRandomBlobWithPosition({
        x: mousePosition.x,
        y: mousePosition.y,
      });
    }

    window.addEventListener("dblclick", handleMouseDown);
    return () => {
      window.removeEventListener("dblclick", handleMouseDown);
    };
  }, [mousePosition, spawnRandomBlobWithPosition]);

  return (
    <Container>
      <HStack centered gap={10}>
        <button
          onClick={spawnRandomBlob}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Spawn a blob
        </button>
        <input
          type="number"
          value={entropy}
          onChange={(e) => setEntropy(Number(e.target.value))}
        />
        <button onClick={() => setEntropy(entropy + 0.1)}>
          Increase entropy
        </button>
        <button onClick={() => setEntropy(entropy - 0.1)}>
          Decrease entropy
        </button>

        <button
          onClick={() => {
            if (paused) {
              resumeSimulation();
            } else {
              pauseSimulation();
            }
            setPaused((prev) => !prev);
          }}
        >
          {paused ? "Resume simulation" : "Pause simulation"}
        </button>
      </HStack>
    </Container>
  );
};

const HeroBanner = () => {
  return (
    <>
      <VStack centered gap={20} className="h-[100vh] w-full">
        <VStack centered gap={5}>
          <h1 className="whitespace-nowrap text-9xl font-black">
            <Popup scaleIncrease={1.2} pullForce={1 / 10} shrinkOnClick>
              <span className="inline-flex whitespace-nowrap">
                <FadeInText text="Have some fun!" delayBetween={0.05} />
              </span>
            </Popup>
          </h1>
          <FadeIn index={2}>
            <h1 className="text-6xl font-extrabold tracking-tight text-foreground/40">
              {`The controls change the background!`}
            </h1>
          </FadeIn>
        </VStack>
        <GradientControls />
      </VStack>
    </>
  );
};

export default BlogPage;
