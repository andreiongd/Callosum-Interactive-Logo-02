/* 
IMPORTANT DOCUMENTATION:
Why have this “shim” and loading order?

p5.js sketches are “classic” scripts, not ES6 modules. But the SVG 
path parser (svg-path-parser) is published on npm as a Node/CommonJS module. 
Browsers can’t use it directly the way they can use p5.

To bridge the gap, we pull it in through esm.sh, which wraps npm packages 
so the browser can understand them. That’s what parser-shim.js does: 
it imports the npm library as a module, then sticks the functions we 
need (parseSVG, makeAbsolute) onto window as globals.

Because of this, script order matters in index.html:

* Load p5.js (so we can draw).
* Load the shim (so the parser exists).
* Load the helper and sketch code (which expect the parser to already be present).

Without the shim or the correct order, your sketch would crash because 
it would try to call parseSVG() before the browser even knew what that was.
*/

// Load the CJS module via esm.sh
import mod from "https://esm.sh/svg-path-parser@1.1.0?bundle";

/*
// See https://esm.sh/svg-path-parser@1.1.0/es2022/svg-path-parser.bundle.mjs
// esm.sh - svg-path-parser@1.1.0 
// export * from "/svg-path-parser@1.1.0/es2022/svg-path-parser.bundle.mjs";
// export { default } from "/svg-path-parser@1.1.0/es2022/svg-path-parser.bundle.mjs";
*/

// Try all reasonable places the functions could live, then expose clean globals.
const parseSVG =
  mod.parseSVG || mod.default?.parseSVG || mod?.default || mod; // last two are safety nets
const makeAbsolute =
  mod.makeAbsolute || mod.default?.makeAbsolute;

if (typeof parseSVG !== "function" || typeof makeAbsolute !== "function") {
  console.error("svg-path-parser: could not find parseSVG/makeAbsolute in module:", mod);
}

window.svgPathParser = { parseSVG, makeAbsolute };
