import mime from "mime-standard";

const mimesByExt = new Map();

const mimes = Object.keys(mime) as [keyof typeof mime];

mimes.forEach((key) => {
  const exts = mime[key];
  if (exts) for (const ext of exts) mimesByExt.set(ext, key);
});

export default {
  lookup: (src: string) => {
    const ext = URL.parse(src)?.pathname.match(/\.(\w+)$/)![1];
    return mimesByExt.get(ext);
  },
};
