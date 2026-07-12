import Link from "next/link";
import { FaEnvelope, FaFileAlt, FaGithub, FaLinkedin } from "react-icons/fa";
import Container from "../Container";
import { HStack } from "../HelperDivs";
import Popup from "../Popup";

type Social = {
  icon: React.ElementType;
  link: string;
  download: boolean;
  label: string;
};

const socials: Record<string, Social> = {
  github: {
    icon: FaGithub,
    link: "https://github.com/Miles-Fritzmather",
    download: false,
    label: "Miles Fritzmather on GitHub",
  },
  linkedin: {
    icon: FaLinkedin,
    link: "https://www.linkedin.com/in/miles-fritzmather/",
    download: false,
    label: "Miles Fritzmather on LinkedIn",
  },
  email: {
    icon: FaEnvelope,
    link: "mailto:miles.fritzmather@gmail.com",
    download: false,
    label: "Email Miles Fritzmather",
  },
  resume: {
    icon: FaFileAlt,
    link: "/Miles Fritzmather's Resume.pdf",
    download: true,
    label: "Download Miles Fritzmather's resume",
  },
};

export const AllSocials = ({
  ignore = [],
}: {
  ignore?: (keyof typeof socials)[];
}) => {
  return (
    <HStack className="text-4xl text-primary/50">
      {Object.entries(socials)
        .filter(([key]) => !ignore.includes(key))
        .map(([key, info], index) => (
          <Popup key={key} scaleIncrease={1.3} pullForce={1 / 5} shrinkOnClick>
            <Container
              className="rounded-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                download={info.download}
                aria-label={info.label}
              >
                <info.icon size={40} aria-hidden />
              </Link>
            </Container>
          </Popup>
        ))}
    </HStack>
  );
};

export default socials;
