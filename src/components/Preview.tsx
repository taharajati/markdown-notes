import React, { useState, useEffect } from "react";
import { remark } from "remark";
import html from "remark-html";

interface PreviewProps {
  markdown: string;
}

const Preview: React.FC<PreviewProps> = ({ markdown }) => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    remark()
      .use(html)
      .process(markdown)
      .then((file) => setContent(String(file)));
  }, [markdown]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      className="p-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
    />
  );
};

export default Preview;
