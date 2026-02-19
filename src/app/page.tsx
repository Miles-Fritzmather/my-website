"use client";

import { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    window.location.href = window.location.href.replace(/\/$/, "") + "/about";
  }, []);
  return null;
};

export default Page;
