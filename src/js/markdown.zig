pub const HTML_TO_MARKDOWN_JS: []const u8 =
    \\function toMd(el) {
    \\  if (!el) return "";
    \\  if (el.nodeType === 3) return el.textContent;
    \\  let tag = el.tagName ? el.tagName.toLowerCase() : "";
    \\  let childrenText = Array.from(el.childNodes || []).map(toMd).join("");
    \\  if (tag === "h1") return "# " + childrenText + "\n\n";
    \\  if (tag === "h2") return "## " + childrenText + "\n\n";
    \\  if (tag === "p") return childrenText + "\n\n";
    \\  if (tag === "a") return "[" + childrenText + "](" + (el.getAttribute("href")||"") + ")";
    \\  return childrenText;
    \\}
;
