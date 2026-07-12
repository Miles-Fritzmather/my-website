"use client";

import BetterLink from "~/components/BetterLink";
import { VStack } from "~/components/HelperDivs";
import Popup from "~/components/Popup";
import { FadeIn } from "../../components/fade-in";

const ResumePage = () => {
  return (
    <VStack y="top" x="center" className="w-full">
      <HeroBanner />
    </VStack>
  );
};

const HeroBanner = () => {
  return (
    <VStack centered gap={20} className="h-[100vh] w-full">
      <VStack centered gap={5}>
        <h1 className="whitespace-nowrap text-9xl font-black">
          <Popup scaleIncrease={1.2} pullForce={1 / 10} shrinkOnClick>
            <span className="inline-flex whitespace-nowrap">
              {"Resume".split("").map((char, index) => (
                <FadeIn
                  key={index}
                  delayBetween={0.05}
                  index={index}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </FadeIn>
              ))}
            </span>
          </Popup>
        </h1>
        <FadeIn index={2}>
          <h1 className="whitespace-nowrap text-6xl font-extrabold tracking-tight text-foreground/40">
            {`Take a look!`}
          </h1>
          <BetterLink href="/Miles Fritzmather's Resume.pdf" download>
            Download my résumé
          </BetterLink>
        </FadeIn>
      </VStack>
    </VStack>
  );
};

export default ResumePage;
