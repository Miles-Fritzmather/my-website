import { AllSocials } from "~/components/basics/socials";
import Container from "~/components/Container";
import { FadeInText } from "~/components/fade-in";
import { VStack } from "~/components/HelperDivs";
import Popup from "~/components/Popup";
import { cn } from "~/lib/utils";

export default function AboutHero() {
  return (
    <VStack y="top" x="center" className="w-full">
      <VStack centered gap={20} className="h-[100vh] w-full">
        <VStack centered gap={5}>
          <p
            className={cn(
              "text-6xl font-extrabold tracking-tight text-foreground/40",
            )}
          >
            {`What's up! I'm`}
          </p>
          <h1 className="whitespace-nowrap text-9xl font-black">
            <Popup scaleIncrease={1.2} pullForce={1 / 10} shrinkOnClick>
              <span className="inline-flex whitespace-nowrap">
                <FadeInText text="Miles Fritzmather" delayBetween={0.05} />
              </span>
            </Popup>
          </h1>
        </VStack>
        <Container
          className="max-w-[1000px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <p className="text-center text-2xl">
            I&apos;m Miles Fritzmather, a student at the&nbsp;
            <span className="font-black italic">
              University of Texas at Austin
            </span>
            &nbsp;studying Computer Science and Mathematics. I build software
            and open-source student tools with&nbsp;
            <span className="font-black italic">Longhorn Developers</span>, and
            I&apos;m working on Accutime — a full-stack time tracking product for
            lawyers. Take a look around and see what I&apos;ve been up to!
          </p>
        </Container>
        <AllSocials />
      </VStack>
    </VStack>
  );
}
