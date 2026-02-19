import { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    window.location.href = "/about";
  }, []);
  return null;
};

export default Page;
