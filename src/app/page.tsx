"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

const Page = () => {
  const router = useRouter();
  useLayoutEffect(() => {
    router.push("/about");
  }, [router]);
  return null;
};

export default Page;
