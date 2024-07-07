import MarkdownIt from "markdown-it";

export const formatText = (text?: string): string => {
  if (text) {
    const md = MarkdownIt();
    return md.render(text);
  }
  return "";
};
