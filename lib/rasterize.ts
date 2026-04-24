// Pre-loads all <img> src and CSS background-image URLs in a DOM node
// and replaces them with inline base64 data URIs so html-to-image captures them correctly.

async function toBase64(url: string): Promise<string> {
  if (url.startsWith("data:")) return url; // already inline
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function inlineAllImages(node: HTMLElement): Promise<void> {
  // 1. Inline <img src>
  const imgs = Array.from(node.querySelectorAll("img")) as HTMLImageElement[];
  await Promise.all(imgs.map(async (img) => {
    try {
      if (img.src && !img.src.startsWith("data:")) {
        img.src = await toBase64(img.src);
      }
    } catch { /* skip failed images */ }
  }));

  // 2. Inline CSS background-image on all elements
  const all = Array.from(node.querySelectorAll("*")) as HTMLElement[];
  all.push(node);
  await Promise.all(all.map(async (el) => {
    try {
      const bg = window.getComputedStyle(el).backgroundImage;
      const match = bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (match && match[1] && !match[1].startsWith("data:")) {
        const b64 = await toBase64(match[1]);
        el.style.backgroundImage = `url("${b64}")`;
      }
    } catch { /* skip */ }
  }));
}
