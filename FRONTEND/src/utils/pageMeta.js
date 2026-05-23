import { useEffect } from "react";

export const usePageMeta = ({ title, description }) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    document.title = title;

    const descriptionTag =
      document.querySelector('meta[name="description"]') ||
      (() => {
        const meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
        return meta;
      })();

    if (description) {
      descriptionTag.setAttribute("content", description);
    }
  }, [title, description]);
};
