export function LegalContent({ title, content }) {
  return <main className="legal-page"><div className="container legal-copy"><p className="eyebrow">JC NIVA — Digital Craftsmanship</p><h1>{title}</h1><article>{content.split(/\r?\n/).map((line, index) => {
    if (!line.trim()) return null;
    if (line.startsWith("# ")) return null;
    if (line.startsWith("## ")) return <h2 key={index}>{line.slice(3)}</h2>;
    if (line.startsWith("### ")) return <h3 key={index}>{line.slice(4)}</h3>;
    if (line.startsWith("* ")) return <p className="legal-list" key={index}>• {line.slice(2)}</p>;
    if (line.startsWith("**Last updated:")) return <p className="updated" key={index}>{line.replaceAll("**", "")}</p>;
    if (line.startsWith("**") && line.endsWith("**")) return <p className="legal-strong" key={index}>{line.replaceAll("**", "")}</p>;
    if (line === "---" || line.startsWith("====")) return null;
    return <p key={index}>{line.replaceAll("**", "")}</p>;
  })}</article></div></main>;
}
