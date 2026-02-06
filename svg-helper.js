var theSvgParser;

function makeSvgParser(){
  // Get the parser functions. (See script order in HTML.)
  theSvgParser = window.svgPathParser;
  if (!theSvgParser) {
    console.error("svgPathParser shim not found on window.");
    noLoop();
    return;
  }
}

//-------------------------------------------------
function getPathCommandsFromSvgStrings(svgCodeLines){
  var parseSVG = theSvgParser.parseSVG;
  var makeAbsolute = theSvgParser.makeAbsolute;
  var svgText = svgCodeLines.join("\n");
  var doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  warnOnTransforms(doc);

  var pathEls = Array.from(doc.querySelectorAll("path[d]"));
  let goodCmds = pathEls.map(function (el) {
    var d = el.getAttribute("d") || "";
    var cmds = makeAbsolute(parseSVG(d));  // absolute
    cmds = quadToCubic(cmds);              // Q -> C
    cmds = smoothCubicToCubic(cmds);       // S/s -> C
    cmds = HVtoL(cmds);                    // H/V -> L
    cmds = warnAndFilterUnsupported(cmds); // remove T/S/A (warn)
    return cmds;
  });
  return goodCmds; 
}

//-------------------------------------------------
function warnOnTransforms(svgDoc) {
  const els = [...svgDoc.querySelectorAll("[transform]")];
  if (els.length) {
    console.warn(
      `SVG contains ${els.length} element(s) with 'transform'. ` +
      "This loader assumes flattened, absolute coordinates. " + 
      "Transformed elements may render incorrectly. " +
      "Flatten first (AI: Expand/Flatten Transparency; " + 
      "Inkscape: Object to Path + Apply Transform)."
    );
  }
}

//-------------------------------------------------
function warnAndFilterUnsupported(commands) {
  // Note:
  // - We convert some commands earlier in the pipeline (Q->C, H/V->L, S->C)
  // - After conversion, we expect only M/L/C/Z.
  const supported = new Set(["M","L","C","Z"]);
  const warned = {};
  const out = [];
  for (const c of commands) {
    if (supported.has(c.code)) {
      out.push(c);
    } else {
      if (!warned[c.code]) {
        warned[c.code] = true;
        const msg =
          c.code === "T" ? "Encountered smooth quadratic (T); Skipping." :
          c.code === "S" ? "Encountered smooth cubic (S); Skipping." :
          c.code === "A" ? "Encountered elliptical arc (A); Skipping." :
          `Encountered unsupported command (${c.code}). Skipping.`;
        console.warn(msg);
      }
    }
  }
  return out;
}

//-------------------------------------------------
// Convert smooth cubic Bézier commands (S) into explicit cubic Béziers (C).
// SVG spec: the first control point is the reflection of the previous cubic's
// second control point about the current point; if previous is not C/S,
// then the first control point equals the current point.
function smoothCubicToCubic(commands) {
  const out = [];
  let cx = 0, cy = 0;
  // Track the last cubic control point (the outgoing control point)
  let lastC2x = null, lastC2y = null;
  let prevWasCubic = false;

  for (const cmd of commands) {
    switch (cmd.code) {
      case "M":
        out.push(cmd);
        cx = cmd.x; cy = cmd.y;
        prevWasCubic = false;
        lastC2x = lastC2y = null;
        break;

      case "L":
        out.push(cmd);
        cx = cmd.x; cy = cmd.y;
        prevWasCubic = false;
        lastC2x = lastC2y = null;
        break;

      case "C":
        out.push(cmd);
        // Current point becomes end of curve
        cx = cmd.x; cy = cmd.y;
        // Save outgoing control point
        lastC2x = cmd.x2; lastC2y = cmd.y2;
        prevWasCubic = true;
        break;

      case "S":
      case "s": {
        const c1x = (prevWasCubic && lastC2x != null) ? (2 * cx - lastC2x) : cx;
        const c1y = (prevWasCubic && lastC2y != null) ? (2 * cy - lastC2y) : cy;
        const c2x = cmd.x2;
        const c2y = cmd.y2;
        const x = cmd.x;
        const y = cmd.y;
        out.push({ code: "C", x1: c1x, y1: c1y, x2: c2x, y2: c2y, x, y });

        cx = x; cy = y;
        lastC2x = c2x; lastC2y = c2y;
        prevWasCubic = true;
        break;
      }

      case "Z":
        out.push(cmd);
        prevWasCubic = false;
        lastC2x = lastC2y = null;
        break;

      default:
        // Keep for later filtering/warnings
        out.push(cmd);
        if (cmd.x !== undefined) cx = cmd.x;
        if (cmd.y !== undefined) cy = cmd.y;
        prevWasCubic = false;
        lastC2x = lastC2y = null;
        break;
    }
  }
  return out;
}

//-------------------------------------------------
function quadToCubic(commands) {
  const out = [];
  let cx = 0, cy = 0, sx = 0, sy = 0;
  for (const cmd of commands) {
    switch (cmd.code) {
      case "M":
        out.push(cmd);
        cx = sx = cmd.x; cy = sy = cmd.y;
        break;
      case "L":
        out.push(cmd);
        cx = cmd.x; cy = cmd.y;
        break;
      case "H":
        out.push(cmd);
        cx = cmd.x;
        break;
      case "V":
        out.push(cmd);
        cy = cmd.y;
        break;
      case "Q": {
        const qx = cmd.x1, qy = cmd.y1;
        const x = cmd.x, y = cmd.y;
        const c1x = cx + (2/3)*(qx - cx);
        const c1y = cy + (2/3)*(qy - cy);
        const c2x = x  + (2/3)*(qx - x);
        const c2y = y  + (2/3)*(qy - y);
        out.push({ code: "C", x1: c1x, y1: c1y, x2: c2x, y2: c2y, x, y });
        cx = x; cy = y;
        break;
      }
      case "C":
        out.push(cmd);
        cx = cmd.x; cy = cmd.y;
        break;
      case "Z":
        out.push(cmd);
        cx = sx; cy = sy;
        break;
      default:
        // keep for filtering/warnings; update pen if data present
        out.push(cmd);
        if (cmd.x !== undefined) cx = cmd.x;
        if (cmd.y !== undefined) cy = cmd.y;
        break;
    }
  }
  return out;
}

//-------------------------------------------------
function HVtoL(commands) {
  const out = [];
  let cx = 0, cy = 0, sx = 0, sy = 0;
  for (const cmd of commands) {
    if (cmd.code === "M") {
      out.push(cmd);
      cx = sx = cmd.x; cy = sy = cmd.y;
    } else if (cmd.code === "L") {
      out.push(cmd);
      cx = cmd.x; cy = cmd.y;
    } else if (cmd.code === "H") {
      cx = cmd.x;
      out.push({ code: "L", x: cx, y: cy });
    } else if (cmd.code === "V") {
      cy = cmd.y;
      out.push({ code: "L", x: cx, y: cy });
    } else if (cmd.code === "C") {
      out.push(cmd);
      cx = cmd.x; cy = cmd.y;
    } else if (cmd.code === "Z") {
      out.push(cmd);
      cx = sx; cy = sy;
    } else {
      out.push(cmd);
      if (cmd.x !== undefined) cx = cmd.x;
      if (cmd.y !== undefined) cy = cmd.y;
    }
  }
  return out;
}


//-------------------------------------------------
function drawSvg(commands) {
  for (var i = 0; i < svgPathCommands.length; i++) {
    drawSvgPathCommands(svgPathCommands[i]);
  }
}
  

//-------------------------------------------------
function drawSvgPathCommands(commands) {
  let inShape = false;
  for (let i = 0; i < commands.length; i++) {
    const c = commands[i];
    if (c.code === "M") {
      if (inShape) {
        endShape();
        inShape = false;
      }
      beginShape();
      vertex(c.x, c.y);
      inShape = true;
    } else if (c.code === "L") {
      vertex(c.x, c.y);
    } else if (c.code === "C") {
      bezierVertex(c.x1, c.y1, c.x2, c.y2, c.x, c.y);
    } else if (c.code === "Z") {
      if (inShape) {
        endShape(CLOSE);
        inShape = false;
      }
    } else {
      console.warn("Unhandled draw cmd", c);
    }
  }
  if (inShape) {
    endShape();
    inShape = false;
  }
}



//-------------------------------------------------
/**
 * Convert SVG path commands into polylines (arrays of p5.Vector).
 * - Keeps M/L/Z as-is (no resampling on straight segments).
 * - Flattens C (cubic Bézier) so that each generated 
 *   chord length <= tolerance.
 * - Returns Array< Array<p5.Vector> >.
 *
 * Assumes commands are absolute and limited to M/L/C/Z by your pipeline.
 */
function svgCommandsToPolylines(commands, tolerance) { 
  const polylines = [];
  let poly = null; // current polyline

  function addPoint(x, y) {
    if (!poly) poly = [];
    const last = poly[poly.length - 1];
    if (!last || last.x !== x || last.y !== y) {
      poly.push(new p5.Vector(x, y));
    }
  }
  
  for (var j = 0; j < commands.length; j++) {
    let path = commands[j]; 
    
    for (let i = 0; i < path.length; i++) {
      const c = path[i];

      if (c.code === "M") {
        if (poly && poly.length) polylines.push(poly);
        poly = [];
        addPoint(c.x, c.y);

      } else if (c.code === "L") {
        // keep straight lines exactly
        addPoint(c.x, c.y);

      } else if (c.code === "C") {
        if (!poly || poly.length === 0) {
          // if a C appears without a prior M, 
          // start at its end (defensive)
          poly = [];
          addPoint(c.x, c.y);
          continue;
        }

        const p0 = poly[poly.length - 1]; // current pen
        const p1x = c.x1, p1y = c.y1;
        const p2x = c.x2, p2y = c.y2;
        const p3x = c.x,  p3y = c.y;

        // Upper bound on arc length = control polygon length
        const ctrlLen =
          dist(p0.x, p0.y, p1x, p1y) +
          dist(p1x, p1y, p2x, p2y) +
          dist(p2x, p2y, p3x, p3y);

        const n = Math.max(1, Math.ceil(ctrlLen / tolerance)); // segments
        for (let k = 1; k <= n; k++) {
          const t = k / n;
          const x = bezierPoint(p0.x, p1x, p2x, p3x, t);
          const y = bezierPoint(p0.y, p1y, p2y, p3y, t);
          addPoint(x, y);
        }

      } else if (c.code === "Z") {
        if (poly && poly.length) {
          const first = poly[0];
          const last  = poly[poly.length - 1];
          if (last.x !== first.x || last.y !== first.y) {
            poly.push(first.copy()); // explicit closure
          }
          polylines.push(poly);
          poly = null;
        }
      }
    }

    if (poly && poly.length) {
      polylines.push(poly);
    }
    
  }
  return polylines;
}



//-------------------------------------------------
/**
 * Render polylines produced by svgCommandsToPolylines().
 * @param {Array<Array<p5.Vector>>} polylines
 */
function drawPolylines(polylines) {
  if (polylines && polylines.length){
    for (let i = 0; i < polylines.length; i++) {
      const poly = polylines[i];
      if (!poly || poly.length < 2) continue;

      beginShape();
      for (let j = 0; j < poly.length; j++) {
        const pt = poly[j];
        vertex(pt.x, pt.y);
      }
      endShape();
    }
  }
}


