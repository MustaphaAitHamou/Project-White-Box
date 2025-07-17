// tools/strip-weird-spaces.js
import fs from "fs";
import glob from "glob";

const BAD = /[\u00A0\u1680\u180E\u2000-\u200F\u2028-\u202F\u205F\u3000\uFEFF]/g;
glob.sync("src/**/*.{js,jsx,ts,tsx}").forEach((file) => {
  const txt = fs.readFileSync(file, "utf8");
  if (!BAD.test(txt)) return;
  fs.writeFileSync(file, txt.replace(BAD, " "));
  console.log("✅ cleaned", file);
});
