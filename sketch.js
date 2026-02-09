// ==================================
// GLOBAL CONFIG (grouped)
// ==================================

// --- Colors ---
// Background pink. Reuse this for "cut-out" shapes.
var bgColor;
// Main ink color (matches logo SVG fill: #040404)
var logoColor;

// InnerSprout stroke settings
var innerSproutWeightStroke = 0;

// --- Assets (raw SVG + reference) ---
var svgStrings; // logofull01.svg
var referenceImage; // CALLOSUM_MARK.png
var edgeTopSvgStrings;
var edgeTopLongSvgStrings;
var edgeTopRightSvgStrings;
var edgeLeftSvgStrings;
var edgeBottomSvgStrings;
var innerSproutSvgStrings;

// --- Parsed SVG polylines ---
var svgViewBox = null;
var svgPathCommands = []; // Commands: Array<Array<cmd>>
var svgPolylines = []; // Pure coordinates: Array<Array<p5.Vector>>
var edgeTopPolylines = [];
var edgeTopLongPolylines = [];
var edgeTopRightPolylines = [];
var edgeLeftPolylines = [];
var edgeBottomPolylines = [];
var innerSproutPolylines = [];

// --- Fit to canvas ---
var svgFitLogo = null;
var svgFitEdges = null;
// Master scale applied to *all* artwork (logo + edges + inner sprout).
// 1.0 = current size, 0.85 = 85% size, etc.
var globalArtworkScale = 0.85;

// User-controlled scales (1.0 = full fit) multiplied by the master scale.
var svgScaleFactorLogo = 0.76 * globalArtworkScale;
var svgScaleFactorEdges = 0.76 * globalArtworkScale; // Edge overlay scale

// --- Deformation system ---
var basePolylines = [];
var deformedPolylines = [];
var pointVelocities = [];
var polylineTolerance = 6;
var deformRadius = 50;
var deformStrength = 0.5;
var returnStrength = 0.50;
var returnElasticity = 2.0; // Extra spring when releasing ( > 1 adds bounce )
var damping = 0.5;

// --- Deformed ranges (logo + edges) ---
var logoRangeStart = 0;
var logoRangeCount = 0;
var edgeTopRangeStart = -1;
var edgeTopRangeCount = 0;
var edgeTopRightRangeStart = -1;
var edgeTopRightRangeCount = 0;
var edgeLeftRangeStart = -1;
var edgeLeftRangeCount = 0;
var edgeBottomRangeStart = -1;
var edgeBottomRangeCount = 0;

// --- Edge motion (ellipse/orbit) ---
var edgeTopCentroid = null;
var edgeTopRightCentroid = null;
var edgeLeftCentroid = null;
var edgeBottomCentroid = null;

var circleScale = 0.62;
var circleScaleX = 0.655;
var circleScaleY = 0.655;
var circleOffsetX = 10;
var circleOffsetY = 0;

var edgeCircleTravel = 0.0;
var edgeCircleSpeed = 0.08;
var edgeTopRightCircleTravel = 0.0;
var edgeTopRightCircleSpeed = 0.08;
var edgeLeftCircleTravel = 0.0;
var edgeLeftCircleSpeed = 0.08;
var edgeBottomCircleTravel = 0.0;
var edgeBottomCircleSpeed = 0.08;
var edgeRotateOffset = true;

// --- Edge follow (mouse attraction along ellipse) ---
// If enabled, mouse X position drives ALL edges toward their min/max degrees:
// - center of canvas => 0
// - left edge => minDeg
// - right edge => maxDeg
var bGlobalMouseXEdgeFollow = true;

var edgeFollowRange = 200; // range around ellipse radius to engage
// Smoothing amounts (no-bounce). Lower = smoother/slower.
var edgeFollowStrength = 0.06;
var edgeFollowReturn = 0.04;
var edgeFollowDamping = 0.7;
var edgeFollowMarkerRadius = 600;
// Proximity-based responsiveness: far = slower, near = faster.
// Final follow speed multiplier is lerp(min..max, hoverWeight).
var edgeFollowSpeedMinMul = 0.75;
var edgeFollowSpeedMaxMul = 2.0;

var edgeTopFollowMinDeg = -60;
var edgeTopFollowMaxDeg = 30;
var edgeTopRightFollowMinDeg = -70;
var edgeTopRightFollowMaxDeg = 10;
var edgeLeftFollowMinDeg = -20;
var edgeLeftFollowMaxDeg = 65;
var edgeBottomFollowMinDeg = -50;
var edgeBottomFollowMaxDeg = 40;

var edgeTopFollowOffset = 0;
var edgeTopFollowVelocity = 0;
var edgeTopRightFollowOffset = 0;
var edgeTopRightFollowVelocity = 0;
var edgeLeftFollowOffset = 0;
var edgeLeftFollowVelocity = 0;
var edgeBottomFollowOffset = 0;
var edgeBottomFollowVelocity = 0;
var edgeBottomAngleOffsetDeg = 2;

// --- Hover phase smoothing ---
var edgePhaseBlendTop = 1;
var edgePhaseBlendTopRight = 1;
var edgePhaseBlendLeft = 1;
var edgePhaseBlendBottom = 1;
var edgePhaseBlendSpeed = 0.1;
var edgeHoverReleaseThreshold = 0.02;
var edgePhaseFreezeTop = 0;
var edgePhaseFreezeTopRight = 0;
var edgePhaseFreezeLeft = 0;
var edgePhaseFreezeBottom = 0;
var edgeHoverWeightTop = 0;
var edgeHoverWeightTopRight = 0;
var edgeHoverWeightLeft = 0;
var edgeHoverWeightBottom = 0;

// --- Edge drawing offsets (baked into deform space) ---
var edgeTopOffsetX = 100;
var edgeTopOffsetY = -639;
var edgeTopRightOffsetX = - 112;
var edgeTopRightOffsetY = -118;
var edgeLeftOffsetX = - 216;
var edgeLeftOffsetY = -350;
var edgeBottomOffsetX = -1175;
var edgeBottomOffsetY = - 597;
var edgeTopExtendY = 0;
var edgeTopRightExtendY = 0;
var edgeLeftExtendX = 0;
var edgeBottomExtendY = 0;
var edgeTopExtendToLongY = 30;
var edgeTopRightExtendToLongY = 30;
var edgeLeftExtendToLongX = 30;
var edgeBottomExtendToLongY = 30;
var edgeTopExtendLerp = .05;
var edgeTopExtendReturnLerp = .03;
var edgeTopExtendBoost = 2.0;

var edgeTopOffsetExtendMulMaxX = 1.015;
var edgeTopOffsetExtendMulMaxY = 1.015;
var edgeTopRightOffsetExtendMulMaxX = 0.99;
var edgeTopRightOffsetExtendMulMaxY = 1.09;
var edgeLeftOffsetExtendMulMaxX = 1.05;
var edgeLeftOffsetExtendMulMaxY = .99;
var edgeBottomOffsetExtendMulMaxX = 1.01;
var edgeBottomOffsetExtendMulMaxY = 0.995;

var bClosestTipOnlyExtend = true;
// Extension profile along an edge (t: base=0, tip=1).
// Start extension later so lower/base sections stay quiet.
var edgeExtendStartT = 0.88;
var edgeExtendFullT = 0.82;
// Tip distance influence should assist, not dominate axis progression.
var edgeExtendTipBias = 0.18;

// --- Edge-specific toggles ---
var edgeTopRightOscillate = true;

// --- UI / rendering flags ---
var bShowReference = false;
var bShowLogoMouseCursor = true;
var logoMouseCursorDiameter = 12;
var logoMouseCursorScale = 0.62;
var logoMouseCursorStrokeWeight = 2;
// Interaction zone around the logo (screen-space).
// Outside this radius, edges/sprouts ease back to rest.
var logoInteractionRadiusMul = 1.25;
var logoInteractionRadiusPxBias = 140;
// Toggle for the debug ellipse overlay (only draws when helpers are enabled).
// NOTE: This must be a boolean; using an undefined identifier here will throw
// a ReferenceError and prevent the entire sketch from loading.
var bShowEllipseOverlay = false;
// Helpers = overlays + marker dots (toggle with 'h')
var bShowHelpers = false;

// --- InnerSprouts (3-layer cut-out) ---
var innerSproutCentroid = null;
var innerSproutBoundsCenter = null;
var bShowInnerSprout = true;
// InnerSprout-specific scale (in logo-space). 1.0 = current.
// Use this if you want the sprouts smaller/larger without affecting the rest.
// Proximity-based responsiveness for innerSprouts (based on mouse distance to pivot)
var innerSproutProximityRadius = 320; // in logo/viewBox units
var innerSproutSpeedMinMul = 0.75;
var innerSproutSpeedMaxMul = 2.0;
var innerSproutScale = 0.99;

// Rest rotations in degrees (each instance uses one when mouse is centered)
// (These are your “base” angles)
var innerSproutRotationDeg01 = -45;
var innerSproutRotationDeg02 = -120;
var innerSproutRotationDeg03 = -160;

// Per-sprout min/max (degrees). Driven by global mouseX mapping:
// - mouse left  => ease toward minDeg
// - mouse right => ease toward maxDeg
// - mouse center => ease toward rest rotation (innerSproutRotationDegXX)
// Defaults: non-zero ranges so you immediately see mouse-driven motion.
// Tweak per sprout.
var innerSproutMinDeg01 = -85;
var innerSproutMaxDeg01 =  0;
var innerSproutMinDeg02 = innerSproutRotationDeg02 - 45;
var innerSproutMaxDeg02 = innerSproutRotationDeg02 + 50;
var innerSproutMinDeg03 = innerSproutRotationDeg03 - 50;
var innerSproutMaxDeg03 = innerSproutRotationDeg03 + 20;

// Auto-sync helper: store the range widths as deltas from rest.
// When you edit a sprout’s rest rotation via keyboard, we keep the same deltas.
var innerSproutMinDelta01 = innerSproutMinDeg01 - innerSproutRotationDeg01;
var innerSproutMaxDelta01 = innerSproutMaxDeg01 - innerSproutRotationDeg01;
var innerSproutMinDelta02 = innerSproutMinDeg02 - innerSproutRotationDeg02;
var innerSproutMaxDelta02 = innerSproutMaxDeg02 - innerSproutRotationDeg02;
var innerSproutMinDelta03 = innerSproutMinDeg03 - innerSproutRotationDeg03;
var innerSproutMaxDelta03 = innerSproutMaxDeg03 - innerSproutRotationDeg03;

// Smoothed (computed) rotations (degrees)
var innerSproutCurrentDeg01 = innerSproutRotationDeg01;
var innerSproutCurrentDeg02 = innerSproutRotationDeg02;
var innerSproutCurrentDeg03 = innerSproutRotationDeg03;
var innerSproutVelDeg01 = 0;
var innerSproutVelDeg02 = 0;
var innerSproutVelDeg03 = 0;
// Smoothing amount (no-bounce). Lower = smoother/slower.
var innerSproutFollowStrength = 0.08;
var innerSproutFollowDamping = 0.75;

// Logo-space offsets (in SVG viewBox units, since we draw under svgFitLogo)
var innerSproutOffsetX = 6;
var innerSproutOffsetY = -80;
var innerSproutOffsetNudgeStep = 2;

// Pivot (logo-space)
var innerSproutUseBoundsPivot = true;
var innerSproutPivotUseAbsolute = false;
var innerSproutPivotX = 0;
var innerSproutPivotY = 0;
var innerSproutPivotOffsetX = 0;
var innerSproutPivotOffsetY = 58;
var bShowInnerSproutPivot = true;
var innerSproutPivotNudgeStep = 1;
var innerSproutPivotNudgeStep2 = 1;

// HUD
var bShowInnerSproutHud = false;
var innerSproutHudX = 24;
var innerSproutHudY = 28;

// p5
p5.disableFriendlyErrors = true;
let bDoExportSvg = false;

// ----------------------------------
function preload() {
  svgStrings = loadStrings("logofull01.svg");
  referenceImage = loadImage("CALLOSUM_MARK.png");
  edgeTopSvgStrings = loadStrings("edgetop03.svg");
  edgeTopLongSvgStrings = loadStrings("edgetop02long.svg");
  innerSproutSvgStrings = loadStrings("innerSprout08.svg");
  edgeTopRightSvgStrings = loadStrings("edgetopright03.svg");
  edgeLeftSvgStrings = loadStrings("edgeleft03.svg");
  edgeBottomSvgStrings = loadStrings("edgetop03.svg");
}

// ----------------------------------
function setup() {
  createCanvas(1728, 1118);
  if (bShowLogoMouseCursor) noCursor();

  bgColor = color("#D69ECF");
  logoColor = color("#392F25");

  makeSvgParser();
  svgViewBox = parseSvgViewBox(svgStrings);
  svgFitLogo = computeContainFit(svgViewBox, width, height, svgScaleFactorLogo);
  svgFitEdges = computeContainFit(svgViewBox, width, height, svgScaleFactorEdges);
  svgPathCommands = getPathCommandsFromSvgStrings(svgStrings);
  svgPolylines = svgCommandsToPolylines(svgPathCommands, polylineTolerance);
  logoRangeStart = 0;
  logoRangeCount = svgPolylines.length;
  edgeTopPolylines = svgCommandsToPolylines(
    getPathCommandsFromSvgStrings(edgeTopSvgStrings),
    polylineTolerance
  );
  edgeTopLongPolylines = svgCommandsToPolylines(
    getPathCommandsFromSvgStrings(edgeTopLongSvgStrings),
    polylineTolerance
  );
  innerSproutPolylines = svgCommandsToPolylines(
    getPathCommandsFromSvgStrings(innerSproutSvgStrings),
    polylineTolerance
  );
  edgeTopRightPolylines = svgCommandsToPolylines(
    getPathCommandsFromSvgStrings(edgeTopRightSvgStrings),
    polylineTolerance
  );

  // edgeTopExtendToLongY is manual (do not auto-calibrate here).

  // IMPORTANT: if we stretch the geometry (edgeTopExtendY), the centroid changes.
  // But our orbit placement uses the centroid as the pivot/anchor.
  // To allow “extend down” without shifting the edge's placement, we:
  // 1) compute centroid BEFORE stretching (pivot centroid)
  // 2) stretch the polyline points after
  edgeTopCentroid = computePolylinesCentroid(edgeTopPolylines);
  edgeTopRightCentroid = computePolylinesCentroid(edgeTopRightPolylines);

  // Capture the pre-stretch "top" anchor.
  const edgeTopAnchorBefore = computeExtremeClusterAverage(edgeTopPolylines, "y", "min", 0.5);
  const edgeTopRightAnchorBefore = computeExtremeClusterAverage(edgeTopRightPolylines, "y", "min", 0.5);

  stretchPolylinesDown(edgeTopPolylines, edgeTopExtendY);
  stretchPolylinesDown(edgeTopRightPolylines, edgeTopRightExtendY);

  // After stretching, we want the edge to *not move* (only extend downward).
  // Centroid recentering helps, but the most visually stable anchor is the
  // “top-most” cluster of points. So we align that cluster back to its
  // pre-stretch position.
  const edgeTopAnchorAfter = computeExtremeClusterAverage(edgeTopPolylines, "y", "min", 0.5);
  if (edgeTopAnchorBefore && edgeTopAnchorAfter) {
    translatePolylines(
      edgeTopPolylines,
      edgeTopAnchorBefore.x - edgeTopAnchorAfter.x,
      edgeTopAnchorBefore.y - edgeTopAnchorAfter.y
    );
  }
  const edgeTopRightAnchorAfter = computeExtremeClusterAverage(edgeTopRightPolylines, "y", "min", 0.5);
  if (edgeTopRightAnchorBefore && edgeTopRightAnchorAfter) {
    translatePolylines(
      edgeTopRightPolylines,
      edgeTopRightAnchorBefore.x - edgeTopRightAnchorAfter.x,
      edgeTopRightAnchorBefore.y - edgeTopRightAnchorAfter.y
    );
  }
  edgeLeftPolylines = svgCommandsToPolylines(
    getPathCommandsFromSvgStrings(edgeLeftSvgStrings),
    polylineTolerance
  );
  edgeBottomPolylines = svgCommandsToPolylines(
    getPathCommandsFromSvgStrings(edgeBottomSvgStrings),
    polylineTolerance
  );
  innerSproutCentroid = computePolylinesCentroid(innerSproutPolylines);
  innerSproutBoundsCenter = computePolylinesBoundsCenter(innerSproutPolylines);
  edgeLeftCentroid = computePolylinesCentroid(edgeLeftPolylines);
  edgeBottomCentroid = computePolylinesCentroid(edgeBottomPolylines);

  // Init smoothed sprout rotations to rest values
  innerSproutCurrentDeg01 = innerSproutRotationDeg01;
  innerSproutCurrentDeg02 = innerSproutRotationDeg02;
  innerSproutCurrentDeg03 = innerSproutRotationDeg03;

  initializeDeformData(svgPolylines);
  mergeEdgePolylinesIntoDeform();
}

// ----------------------------------
function draw() {
  background(bgColor);
  fill(0);


  if (bShowReference && referenceImage) {
    push();
    if (svgFitLogo) {
      translate(svgFitLogo.offsetX*1.15, svgFitLogo.offsetY*1.65);
      scale(svgFitLogo.scale*0.76);
    }
    tint(255, 120);
    // image(referenceImage, 0, 0);
    pop();
  }
 

  if (bDoExportSvg) {
    beginRecordSvg(this, "myOutput.svg");
  }
  
  // Draw the SVG from its commands (including Bezier curves).
  fill(50);
  translate(width / 2, height / 2);
  translate(-width / 2, -height / 2);
 // pre-rotate to counteract bottom edge offset, so deformation is more centered
  noStroke();
  // Update deformation while hovering.
  const localMouseLogo = getLocalMouse(svgFitLogo);
  const localMouseEdges = getLocalMouse(svgFitEdges);
  const isInsideCanvas =
    mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
  const isHovering = isInsideCanvas && isMouseInLogoInteractionZone(mouseX, mouseY);

  updateInnerSproutRotations(localMouseLogo, isHovering);
  // updateDeformedPolylines(localMouseLogo, isHovering);

  noStroke();
  strokeJoin(ROUND);
  strokeCap(ROUND);
  const logoPolys = getEdgeDeformedSlice(logoRangeStart, logoRangeCount, basePolylines);
  push();
  if (svgFitLogo) {
    translate(svgFitLogo.offsetX, svgFitLogo.offsetY);
    scale(svgFitLogo.scale);
  }
  // drawSvg(svgPathCommands); // disabled to avoid filled base shape
  drawPolylines(logoPolys);
  pop();

  drawInnerSproutHud();

  push();
  if (svgFitEdges) {
    translate(svgFitEdges.offsetX, svgFitEdges.offsetY);
    scale(svgFitEdges.scale);
  }
  drawEllipseOverlay();
  drawStaticEdgeOverlays(localMouseEdges, isHovering);
  pop();

  // Draw innerSprout(s) last so they always sit on top of all other artwork.
  // (HUD is also drawn in screen space and will remain on top.)
  push();
  if (svgFitLogo) {
    translate(svgFitLogo.offsetX, svgFitLogo.offsetY);
    scale(svgFitLogo.scale);
  }
  // Draw 3 instances, same offsets + pivot, different rotations.
  // Only show pivot marker on the first instance to avoid clutter.
  const pivotWasShown = bShowInnerSproutPivot;
  drawInnerSproutCenteredInViewBox(innerSproutCurrentDeg01);
  bShowInnerSproutPivot = false;
  drawInnerSproutCenteredInViewBox(innerSproutCurrentDeg02);
  drawInnerSproutCenteredInViewBox(innerSproutCurrentDeg03);
  bShowInnerSproutPivot = pivotWasShown;
  pop();

  drawLogoMouseCursor();

  if (bDoExportSvg) {
    endRecordSvg();
    bDoExportSvg = false;
  }
}

// ----------------------------------
function drawLogoMouseCursor() {
  if (!bShowLogoMouseCursor) return;
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

  const d = Math.max(logoMouseCursorDiameter || 0, 2);

  push();
  resetMatrix();
  translate(mouseX, mouseY);

  noStroke();
  fill(50);
  ellipse(0, 0, d, d);
  pop();
}

// ----------------------------------
function drawInnerSproutHud() {
  if (!bShowInnerSproutHud) return;

  push();
  // Screen-space HUD
  resetMatrix();
  textFont('monospace');
  textSize(16);
  noStroke();
  fill(0, 180);

  const pivotAbsX = (innerSproutPivotUseAbsolute ? innerSproutPivotX : (innerSproutPivotOffsetX));
  const pivotAbsY = (innerSproutPivotUseAbsolute ? innerSproutPivotY : (innerSproutPivotOffsetY));

  const lines = [
    `innerSproutOffsetX: ${innerSproutOffsetX}`,
    `innerSproutOffsetY: ${innerSproutOffsetY}`,
    `sprout01 rest/min/max/current: ${innerSproutRotationDeg01} / ${innerSproutMinDeg01} / ${innerSproutMaxDeg01} / ${Math.round(innerSproutCurrentDeg01)}`,
    `sprout02 rest/min/max/current: ${innerSproutRotationDeg02} / ${innerSproutMinDeg02} / ${innerSproutMaxDeg02} / ${Math.round(innerSproutCurrentDeg02)}`,
    `sprout03 rest/min/max/current: ${innerSproutRotationDeg03} / ${innerSproutMinDeg03} / ${innerSproutMaxDeg03} / ${Math.round(innerSproutCurrentDeg03)}`,
    `innerSproutPivotUseAbsolute: ${innerSproutPivotUseAbsolute}`,
    `innerSproutPivotX: ${innerSproutPivotX}`,
    `innerSproutPivotY: ${innerSproutPivotY}`,
    `innerSproutPivotOffsetX: ${innerSproutPivotOffsetX}`,
    `innerSproutPivotOffsetY: ${innerSproutPivotOffsetY}`,
    '',
    'Position: Arrow keys (Shift = bigger), O = log',
    'Pivot:    I/J/K/L (Shift = bigger), C = log, P = toggle pivot marker',
    'Rotate:   1/2/3 selects sprout, [ and ] adjust rotation (Shift = bigger)',
    'Export:   E',
    'Reference: R',
    'HUD:      H toggles helpers (HUD stays); you can disable HUD in code'
  ];

  // Background panel
  const x = innerSproutHudX;
  const y = innerSproutHudY;
  const lineH = 20;
  const panelW = 560;
  const panelH = lines.length * lineH + 18;
  fill(255, 255, 255, 180);
  rect(x - 14, y - 22, panelW, panelH, 10);
  fill(0, 200);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x, y + i * lineH);
  }
  pop();
}

// ----------------------------------
function applyInnerSproutRotationSpring(targetDeg, which, speedMul) {
  let cur = which === 1 ? innerSproutCurrentDeg01 : which === 2 ? innerSproutCurrentDeg02 : innerSproutCurrentDeg03;
  let vel = which === 1 ? innerSproutVelDeg01 : which === 2 ? innerSproutVelDeg02 : innerSproutVelDeg03;
  // No-bounce smoothing (constant max step).
  // Using a constant step (instead of lerp) means smaller ranges finish sooner.
  const maxDelta = getGlobalInnerSproutMaxDeltaDeg() || 1;
  const speed = (speedMul == null) ? 1 : speedMul;
  const maxStep = (maxDelta * innerSproutFollowStrength * speed) / followSettleFactor;
  const slowRadius = maxDelta * 0.45;
  const res = followEaseInOut(cur, targetDeg, maxStep, slowRadius, vel);
  cur = res.pos;
  vel = res.vel;
  if (which === 1) {
    innerSproutCurrentDeg01 = cur;
    innerSproutVelDeg01 = vel;
  } else if (which === 2) {
    innerSproutCurrentDeg02 = cur;
    innerSproutVelDeg02 = vel;
  } else {
    innerSproutCurrentDeg03 = cur;
    innerSproutVelDeg03 = vel;
  }
}

// ----------------------------------
function updateInnerSproutRotations(localMouseLogo, isHovering) {
  // If mouse is outside the canvas, ease back to rest.
  if (!isHovering) {
    applyInnerSproutRotationSpring(innerSproutRotationDeg01, 1, 1);
    applyInnerSproutRotationSpring(innerSproutRotationDeg02, 2, 1);
    applyInnerSproutRotationSpring(innerSproutRotationDeg03, 3, 1);
    return;
  }

  // Proximity-based speed PER SPROUT:
  // For each sprout instance, compute an approximate instance center in logo space
  // (including manual offset + innerSproutScale + that sprout's current rotation).
  // Closer sprout instance => higher speed multiplier.
  function rotatePointAround(px, py, cx, cy, rads) {
    const dx = px - cx;
    const dy = py - cy;
    const cr = Math.cos(rads);
    const sr = Math.sin(rads);
    return {
      x: cx + dx * cr - dy * sr,
      y: cy + dx * sr + dy * cr
    };
  }

  function getSproutInstanceCenter(rotationDeg) {
    if (!innerSproutCentroid) return null;

    const pivotBase = (innerSproutUseBoundsPivot && innerSproutBoundsCenter)
      ? innerSproutBoundsCenter
      : innerSproutCentroid;
    const pivotX = innerSproutPivotUseAbsolute
      ? innerSproutPivotX
      : (pivotBase.x + innerSproutPivotOffsetX);
    const pivotY = innerSproutPivotUseAbsolute
      ? innerSproutPivotY
      : (pivotBase.y + innerSproutPivotOffsetY);

    const centerBase = innerSproutBoundsCenter || innerSproutCentroid;
    let x = centerBase.x + (innerSproutOffsetX || 0);
    let y = centerBase.y + (innerSproutOffsetY || 0);

    // Apply the same scale used during rendering (scale about the pivot).
    const s = (innerSproutScale == null) ? 1 : innerSproutScale;
    if (s !== 1) {
      x = pivotX + (x - pivotX) * s;
      y = pivotY + (y - pivotY) * s;
    }

    // Apply rotation about the pivot.
    const rot = radians(rotationDeg || 0);
    if (rot) {
      const p = rotatePointAround(x, y, pivotX, pivotY, rot);
      x = p.x;
      y = p.y;
    }
    return { x, y };
  }

  function getSproutSpeedMul(rotationDeg) {
    if (!localMouseLogo) return 1;
    const c = getSproutInstanceCenter(rotationDeg);
    if (!c) return 1;
    const d = Math.hypot(localMouseLogo.x - c.x, localMouseLogo.y - c.y);
    const r = Math.max(innerSproutProximityRadius || 1, 1);
    const w = easeSmoothstep(1 - constrain(d / r, 0, 1));
    return lerp(innerSproutSpeedMinMul, innerSproutSpeedMaxMul, w);
  }

  const halfW = width * 0.5 || 1;
  const nx = constrain((mouseX - halfW) / halfW, -1, 1); // [-1..1]
  const amt = easeSmoothstep(Math.abs(nx));

  const t01 = nx >= 0
    ? innerSproutRotationDeg01 + (innerSproutMaxDeg01 - innerSproutRotationDeg01) * amt
    : innerSproutRotationDeg01 + (innerSproutMinDeg01 - innerSproutRotationDeg01) * amt;
  const t02 = nx >= 0
    ? innerSproutRotationDeg02 + (innerSproutMaxDeg02 - innerSproutRotationDeg02) * amt
    : innerSproutRotationDeg02 + (innerSproutMinDeg02 - innerSproutRotationDeg02) * amt;
  const t03 = nx >= 0
    ? innerSproutRotationDeg03 + (innerSproutMaxDeg03 - innerSproutRotationDeg03) * amt
    : innerSproutRotationDeg03 + (innerSproutMinDeg03 - innerSproutRotationDeg03) * amt;

  // Each sprout reacts based on its own proximity to the mouse.
  const s1 = getSproutSpeedMul(innerSproutCurrentDeg01);
  const s2 = getSproutSpeedMul(innerSproutCurrentDeg02);
  const s3 = getSproutSpeedMul(innerSproutCurrentDeg03);

  applyInnerSproutRotationSpring(t01, 1, s1);
  applyInnerSproutRotationSpring(t02, 2, s2);
  applyInnerSproutRotationSpring(t03, 3, s3);
}

// ----------------------------------
// Draw `innerSprout.svg` in the *logo* coordinate system (svgFitLogo).
// Because it uses the same viewBox as logofull01 (0..1080), it will match scale.
// IMPORTANT: To align with logofull01, we draw it in its authored coordinates
// (no extra centering). If you rotate it, we rotate around its centroid.
function drawInnerSproutCenteredInViewBox(rotationDeg) {
  if (!bShowInnerSprout) return;
  if (!innerSproutCentroid || !innerSproutPolylines.length) return;

  push();
  // Make sprout match background (cut-out look) + add outline stroke.
  fill(bgColor);
  stroke(logoColor);
  strokeWeight(innerSproutWeightStroke);
  strokeJoin(ROUND);
  strokeCap(ROUND);

  // Manual alignment nudges (logo coordinate system)
  if (innerSproutOffsetX || innerSproutOffsetY) {
    translate(innerSproutOffsetX, innerSproutOffsetY);
  }

  const pivotBase = (innerSproutUseBoundsPivot && innerSproutBoundsCenter)
    ? innerSproutBoundsCenter
    : innerSproutCentroid;
  const pivotX = innerSproutPivotUseAbsolute ? innerSproutPivotX : (pivotBase.x + innerSproutPivotOffsetX);
  const pivotY = innerSproutPivotUseAbsolute ? innerSproutPivotY : (pivotBase.y + innerSproutPivotOffsetY);

  // Apply innerSprout-only scale around the same pivot used for rotation,
  // so scaling does not cause the sprout to drift.
  const s = (innerSproutScale == null) ? 1 : innerSproutScale;
  if (s !== 1) {
    translate(pivotX, pivotY);
    scale(s);
    translate(-pivotX, -pivotY);
  }

  // Rotate around the sprout's pivot.
  // NOTE: We rotate *after* applying the manual offset so the pivot moves with the sprout.
  const innerSproutRotation = radians(rotationDeg || 0);
  if (innerSproutRotation) {
    translate(pivotX, pivotY);
    rotate(innerSproutRotation);
    translate(-pivotX, -pivotY);
  }

  // Draw with CLOSED shapes when the polyline is already explicitly closed
  // (first point == last point). This ensures fill + stroke render cleanly.
  for (let i = 0; i < innerSproutPolylines.length; i++) {
    const poly = innerSproutPolylines[i];
    if (!poly || poly.length < 2) continue;
    const first = poly[0];
    const last = poly[poly.length - 1];
    const isClosed = first && last && first.x === last.x && first.y === last.y;
    beginShape();
    for (let j = 0; j < poly.length; j++) {
      vertex(poly[j].x, poly[j].y);
    }
    endShape(isClosed ? CLOSE : undefined);
  }

  // Debug pivot marker (draw on top of the shape so it remains visible)
  if (bShowInnerSproutPivot) {
    push();
    stroke(0);
    strokeWeight(3);
    fill(0, 255, 255);
    ellipse(pivotX, pivotY, 30, 30);
    // Crosshair
    line(pivotX - 24, pivotY, pivotX + 24, pivotY);
    line(pivotX, pivotY - 24, pivotX, pivotY + 24);
    pop();
  }
  pop();
}

function keyPressed() {
  if (key == "e") {
    bDoExportSvg = true;
  }
  if (key == "r") {
    bShowReference = !bShowReference;
  }
  if (key == "h") {
    bShowHelpers = !bShowHelpers;
  }

  // Sprout rotation editing
  // 1/2/3 selects which sprout you are editing
  // [ and ] adjust the rotation value
  if (key === '1') {
    window.__innerSproutRotSel = 1;
  } else if (key === '2') {
    window.__innerSproutRotSel = 2;
  } else if (key === '3') {
    window.__innerSproutRotSel = 3;
  }
  const sel = window.__innerSproutRotSel || 1;
  const rotStep = keyIsDown(SHIFT) ? 10 : 1;
  if (key === '[') {
    if (sel === 1) {
      innerSproutRotationDeg01 -= rotStep;
      innerSproutMinDeg01 = innerSproutRotationDeg01 + innerSproutMinDelta01;
      innerSproutMaxDeg01 = innerSproutRotationDeg01 + innerSproutMaxDelta01;
    } else if (sel === 2) {
      innerSproutRotationDeg02 -= rotStep;
      innerSproutMinDeg02 = innerSproutRotationDeg02 + innerSproutMinDelta02;
      innerSproutMaxDeg02 = innerSproutRotationDeg02 + innerSproutMaxDelta02;
    } else {
      innerSproutRotationDeg03 -= rotStep;
      innerSproutMinDeg03 = innerSproutRotationDeg03 + innerSproutMinDelta03;
      innerSproutMaxDeg03 = innerSproutRotationDeg03 + innerSproutMaxDelta03;
    }
  } else if (key === ']') {
    if (sel === 1) {
      innerSproutRotationDeg01 += rotStep;
      innerSproutMinDeg01 = innerSproutRotationDeg01 + innerSproutMinDelta01;
      innerSproutMaxDeg01 = innerSproutRotationDeg01 + innerSproutMaxDelta01;
    } else if (sel === 2) {
      innerSproutRotationDeg02 += rotStep;
      innerSproutMinDeg02 = innerSproutRotationDeg02 + innerSproutMinDelta02;
      innerSproutMaxDeg02 = innerSproutRotationDeg02 + innerSproutMaxDelta02;
    } else {
      innerSproutRotationDeg03 += rotStep;
      innerSproutMinDeg03 = innerSproutRotationDeg03 + innerSproutMinDelta03;
      innerSproutMaxDeg03 = innerSproutRotationDeg03 + innerSproutMaxDelta03;
    }
  }

  // --- innerSprout controls ---
  // Position nudging (logo-space)
  // Arrow keys move the *sprout artwork*.
  const posStep = keyIsDown(SHIFT) ? innerSproutOffsetNudgeStep * 5 : innerSproutOffsetNudgeStep;
  if (keyCode === LEFT_ARROW) {
    innerSproutOffsetX -= posStep;
  } else if (keyCode === RIGHT_ARROW) {
    innerSproutOffsetX += posStep;
  } else if (keyCode === UP_ARROW) {
    innerSproutOffsetY -= posStep;
  } else if (keyCode === DOWN_ARROW) {
    innerSproutOffsetY += posStep;
  } else if (key === 'o' || key === 'O') {
    console.log(`[innerSprout offsets] X=${innerSproutOffsetX}, Y=${innerSproutOffsetY}`);
  }

  // Pivot/center nudging (logo-space)
  // I/J/K/L move the *rotation center* (cyan crosshair) without moving the artwork.
  const pivotStep = keyIsDown(SHIFT) ? innerSproutPivotNudgeStep2 * 10 : innerSproutPivotNudgeStep2;
  if (key === 'j' || key === 'J') {
    if (innerSproutPivotUseAbsolute) innerSproutPivotX -= pivotStep;
    else innerSproutPivotOffsetX -= pivotStep;
  } else if (key === 'l' || key === 'L') {
    if (innerSproutPivotUseAbsolute) innerSproutPivotX += pivotStep;
    else innerSproutPivotOffsetX += pivotStep;
  } else if (key === 'i' || key === 'I') {
    if (innerSproutPivotUseAbsolute) innerSproutPivotY -= pivotStep;
    else innerSproutPivotOffsetY -= pivotStep;
  } else if (key === 'k' || key === 'K') {
    if (innerSproutPivotUseAbsolute) innerSproutPivotY += pivotStep;
    else innerSproutPivotOffsetY += pivotStep;
  } else if (key === 'c' || key === 'C') {
    if (innerSproutPivotUseAbsolute) {
      console.log(`[innerSprout pivot ABS] X=${innerSproutPivotX}, Y=${innerSproutPivotY}`);
    } else {
      console.log(`[innerSprout pivot OFFSETS] X=${innerSproutPivotOffsetX}, Y=${innerSproutPivotOffsetY}`);
    }
  } else if (key === 'p' || key === 'P') {
    bShowInnerSproutPivot = !bShowInnerSproutPivot;
  }
}

// ----------------------------------
function initializeDeformData(polylines) {
  basePolylines = [];
  deformedPolylines = [];
  pointVelocities = [];
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i];
    const basePoly = [];
    const defPoly = [];
    const velPoly = [];
    for (let j = 0; j < poly.length; j++) {
      const pt = poly[j];
      basePoly.push(createVector(pt.x, pt.y));
      defPoly.push(createVector(pt.x, pt.y));
      velPoly.push(createVector(0, 0));
    }
    basePolylines.push(basePoly);
    deformedPolylines.push(defPoly);
    pointVelocities.push(velPoly);
  }
}

// ----------------------------------
function mergeEdgePolylinesIntoDeform() {
  edgeTopRangeStart = addPolylinesToDeform(edgeTopPolylines, edgeTopOffsetX, edgeTopOffsetY);
  edgeTopRangeCount = edgeTopPolylines.length;
  edgeTopRightRangeStart = addPolylinesToDeform(edgeTopRightPolylines, edgeTopRightOffsetX, edgeTopRightOffsetY);
  edgeTopRightRangeCount = edgeTopRightPolylines.length;
  edgeLeftRangeStart = addPolylinesToDeform(edgeLeftPolylines, edgeLeftOffsetX, edgeLeftOffsetY);
  edgeLeftRangeCount = edgeLeftPolylines.length;
  edgeBottomRangeStart = addPolylinesToDeform(edgeBottomPolylines, edgeBottomOffsetX, edgeBottomOffsetY);
  edgeBottomRangeCount = edgeBottomPolylines.length;
}

// ----------------------------------
function addPolylinesToDeform(polylines, offsetX, offsetY) {
  const startIndex = basePolylines.length;
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i];
    const basePoly = [];
    const defPoly = [];
    const velPoly = [];
    for (let j = 0; j < poly.length; j++) {
      const pt = poly[j];
      const x = pt.x + offsetX;
      const y = pt.y + offsetY;
      basePoly.push(createVector(x, y));
      defPoly.push(createVector(x, y));
      velPoly.push(createVector(0, 0));
    }
    basePolylines.push(basePoly);
    deformedPolylines.push(defPoly);
    pointVelocities.push(velPoly);
  }
  return startIndex;
}

// ----------------------------------
function computePolylinesCentroid(polylines) {
  let sumX = 0;
  let sumY = 0;
  let count = 0;
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i];
    for (let j = 0; j < poly.length; j++) {
      sumX += poly[j].x;
      sumY += poly[j].y;
      count += 1;
    }
  }
  if (!count) return null;
  return { x: sumX / count, y: sumY / count };
}

// ----------------------------------
function computePolylinesBoundsCenter(polylines) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let found = false;
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i];
    if (!poly || !poly.length) continue;
    for (let j = 0; j < poly.length; j++) {
      const pt = poly[j];
      minX = Math.min(minX, pt.x);
      minY = Math.min(minY, pt.y);
      maxX = Math.max(maxX, pt.x);
      maxY = Math.max(maxY, pt.y);
      found = true;
    }
  }
  if (!found) return null;
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
}

// ----------------------------------
function getPolylinesAxisMinMax(polylines, axis) {
  const axisKey = axis === "x" ? "x" : "y";
  let minV = Infinity;
  let maxV = -Infinity;
  let found = false;
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i];
    if (!poly || !poly.length) continue;
    for (let j = 0; j < poly.length; j++) {
      const v = poly[j][axisKey];
      minV = Math.min(minV, v);
      maxV = Math.max(maxV, v);
      found = true;
    }
  }
  if (!found) return null;
  return { min: minV, max: maxV };
}

// ----------------------------------
function drawEllipseOverlay() {
  if (!bShowEllipseOverlay || !bShowHelpers || !svgViewBox) return;
  const centerX = svgViewBox.minX + svgViewBox.width / 2 + circleOffsetX;
  const centerY = svgViewBox.minY + svgViewBox.height / 2 + circleOffsetY;
  const baseSize = Math.min(svgViewBox.width, svgViewBox.height) * circleScale;
  const ellipseW = Math.min(svgViewBox.width, svgViewBox.height) * circleScaleX;
  const ellipseH = Math.min(svgViewBox.width, svgViewBox.height) * circleScaleY;
  push();
  // outerCircle
  noFill();
  stroke(255, 0, 0, 80);
  strokeWeight(2);
  ellipse(centerX, centerY, ellipseW, ellipseH);
  pop();
}

// ----------------------------------
function findExtremePoint(polylines, axis, direction) {
  let bestPoint = null;
  const axisKey = axis === "x" ? "x" : "y";
  const isMin = direction === "min";
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i];
    if (!poly || !poly.length) continue;
    for (let j = 0; j < poly.length; j++) {
      const pt = poly[j];
      if (!bestPoint) {
        bestPoint = pt;
        continue;
      }
      if (isMin ? pt[axisKey] < bestPoint[axisKey] : pt[axisKey] > bestPoint[axisKey]) {
        bestPoint = pt;
      }
    }
  }
  return bestPoint;
}

// ----------------------------------
// More stable than findExtremePoint(): averages a small cluster of points near the extreme.
// Useful as an "anchor" when geometry changes (e.g. stretching) so we can keep an edge
// visually in place.
function computeExtremeClusterAverage(polylines, axis, direction, epsilon = 0.5) {
  const axisKey = axis === "x" ? "x" : "y";
  const isMin = direction === "min";

  let extreme = isMin ? Infinity : -Infinity;
  let found = false;
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i];
    if (!poly || !poly.length) continue;
    for (let j = 0; j < poly.length; j++) {
      const v = poly[j][axisKey];
      extreme = isMin ? Math.min(extreme, v) : Math.max(extreme, v);
      found = true;
    }
  }
  if (!found || !Number.isFinite(extreme)) return null;

  let sumX = 0;
  let sumY = 0;
  let count = 0;
  const eps = Math.max(epsilon || 0, 0);
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i];
    if (!poly || !poly.length) continue;
    for (let j = 0; j < poly.length; j++) {
      const pt = poly[j];
      if (Math.abs(pt[axisKey] - extreme) <= eps) {
        sumX += pt.x;
        sumY += pt.y;
        count += 1;
      }
    }
  }
  if (!count) return null;
  return { x: sumX / count, y: sumY / count };
}

// ----------------------------------
function getEdgeMarkerPoint(polylines, axis, direction) {
  return findExtremePoint(polylines, axis, direction);
}

// ----------------------------------
function drawEdgeMarker(polylines, axis, direction, size = 18) {
  if (!bShowHelpers) return;
  const pt = findExtremePoint(polylines, axis, direction);
  if (!pt) return;
  push();
  noStroke();
  fill(255, 0, 0);
  ellipse(pt.x, pt.y, size, size);
  pop();
}

// ----------------------------------
function stretchPolylinesDown(polylines, amount) {
  if (!amount) return;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i];
    for (let j = 0; j < poly.length; j++) {
      const y = poly[j].y;
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
  const range = maxY - minY;
  if (range <= 0) return;
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i];
    for (let j = 0; j < poly.length; j++) {
      const pt = poly[j];
      const t = (pt.y - minY) / range;
      pt.y += amount * t;
    }
  }
}

// ----------------------------------
function stretchPolylinesFromExtreme(polylines, axis, direction, amount, tipOverride) {
  if (!amount || !polylines || !polylines.length) return;
  const axisKey = axis === "x" ? "x" : "y";
  const isMin = direction === "min";

  let minV = Infinity;
  let maxV = -Infinity;
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i];
    if (!poly || !poly.length) continue;
    for (let j = 0; j < poly.length; j++) {
      const v = poly[j][axisKey];
      minV = Math.min(minV, v);
      maxV = Math.max(maxV, v);
    }
  }
  const range = maxV - minV;
  if (!Number.isFinite(range) || range <= 0) return;
  const tipData = computeTipDistanceData(polylines, axis, direction, tipOverride);
  if (!tipData) return;

  const sign = isMin ? -1 : 1;
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i];
    if (!poly) continue;
    for (let j = 0; j < poly.length; j++) {
      const pt = poly[j];
      const t = isMin
        ? 1 - (pt[axisKey] - minV) / range
        : (pt[axisKey] - minV) / range;
      const distToTip = Math.hypot(pt.x - tipData.tip.x, pt.y - tipData.tip.y);
      const tipT = 1 - constrain(distToTip / tipData.maxDist, 0, 1);
      const w = remapEdgeExtendWeight(t, tipT);
      pt[axisKey] += sign * amount * w;
    }
  }
}

// ----------------------------------
function clonePolylines(polylines) {
  const copy = [];
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i] || [];
    const polyCopy = [];
    for (let j = 0; j < poly.length; j++) {
      polyCopy.push({ x: poly[j].x, y: poly[j].y });
    }
    copy.push(polyCopy);
  }
  return copy;
}

// ----------------------------------
function getEdgeExtendedPolylinesCentered(polylines, axis, direction, amount, dirX, dirY, tipOverride) {
  if (!amount) return polylines;
  const centroidBefore = computePolylinesCentroid(polylines);
  if (!centroidBefore) return polylines;
  const extended = clonePolylines(polylines);
  const hasDirectionalVector =
    Number.isFinite(dirX) &&
    Number.isFinite(dirY) &&
    (Math.abs(dirX) > 1e-6 || Math.abs(dirY) > 1e-6);
  if (!hasDirectionalVector) {
    stretchPolylinesFromExtreme(extended, axis, direction, amount, tipOverride);
  } else {
    const axisKey = axis === "x" ? "x" : "y";
    const isMin = direction === "min";
    let minV = Infinity;
    let maxV = -Infinity;
    for (let i = 0; i < extended.length; i++) {
      const poly = extended[i];
      if (!poly || !poly.length) continue;
      for (let j = 0; j < poly.length; j++) {
        const v = poly[j][axisKey];
        minV = Math.min(minV, v);
        maxV = Math.max(maxV, v);
      }
    }
    const range = maxV - minV;
    if (Number.isFinite(range) && range > 0) {
      const tipData = computeTipDistanceData(extended, axis, direction, tipOverride);
      if (!tipData) return polylines;
      const invLen = 1 / Math.hypot(dirX, dirY);
      const ux = dirX * invLen;
      const uy = dirY * invLen;
      for (let i = 0; i < extended.length; i++) {
        const poly = extended[i];
        if (!poly) continue;
        for (let j = 0; j < poly.length; j++) {
          const pt = poly[j];
          const t = isMin
            ? 1 - (pt[axisKey] - minV) / range
            : (pt[axisKey] - minV) / range;
          const distToTip = Math.hypot(pt.x - tipData.tip.x, pt.y - tipData.tip.y);
          const tipT = 1 - constrain(distToTip / tipData.maxDist, 0, 1);
          const w = remapEdgeExtendWeight(t, tipT);
          pt.x += ux * amount * w;
          pt.y += uy * amount * w;
        }
      }
    }
  }
  const centroidAfter = computePolylinesCentroid(extended);
  if (centroidAfter) {
    translatePolylines(
      extended,
      centroidBefore.x - centroidAfter.x,
      centroidBefore.y - centroidAfter.y
    );
  }
  return extended;
}

// ----------------------------------
function computeTipDistanceData(polylines, axis, direction, tipOverride) {
  const tip = (tipOverride && Number.isFinite(tipOverride.x) && Number.isFinite(tipOverride.y))
    ? { x: tipOverride.x, y: tipOverride.y }
    : computeExtremeClusterAverage(polylines, axis, direction, 0.75);
  if (!tip) return null;
  let maxDist = 0;
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i];
    if (!poly) continue;
    for (let j = 0; j < poly.length; j++) {
      const pt = poly[j];
      const d = Math.hypot(pt.x - tip.x, pt.y - tip.y);
      if (d > maxDist) maxDist = d;
    }
  }
  if (maxDist <= 1e-6) return null;
  return { tip, maxDist };
}

// ----------------------------------
function remapEdgeExtendWeight(tAxis, tTip) {
  const axisT = constrain(tAxis == null ? 0 : tAxis, 0, 1);
  const tipT = constrain(tTip == null ? axisT : tTip, 0, 1);
  const tipBias = constrain(edgeExtendTipBias || 0, 0, 1);
  const mixed = axisT * (1 - tipBias) + tipT * tipBias;

  const startT = constrain(edgeExtendStartT || 0, 0, 0.99);
  const fullT = constrain(edgeExtendFullT || 1, startT + 0.001, 1);
  if (mixed <= startT) return 0;
  if (mixed >= fullT) return 1;
  const u = (mixed - startT) / (fullT - startT);
  return u * u * (3 - 2 * u);
}

// ----------------------------------
function getEdgeOffsetExtendMul(currentExtend, extendRange, maxMul) {
  const range = Math.max(extendRange || 0, 1e-6);
  const t = constrain((currentExtend || 0) / range, 0, 1);
  return lerp(1, maxMul == null ? 1 : maxMul, t);
}

// ----------------------------------
function translatePolylines(polylines, dx, dy) {
  if (!dx && !dy) return;
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i];
    if (!poly) continue;
    for (let j = 0; j < poly.length; j++) {
      poly[j].x += dx;
      poly[j].y += dy;
    }
  }
}

// ----------------------------------
function getEdgeFollowOffset(edgeKey) {
  if (edgeKey === "top") return edgeTopFollowOffset;
  if (edgeKey === "topRight") return edgeTopRightFollowOffset;
  if (edgeKey === "bottom") return edgeBottomFollowOffset;
  return edgeLeftFollowOffset;
}

// ----------------------------------
function getEdgeHoverWeight(localMouse, polylines, centroid, targetX, targetY, rotation, isHovering, markerAxis, markerDirection, extraRotation = 0, useMarkerProximity = true) {
  if (!isHovering || !localMouse || !polylines || !polylines.length || !centroid) return 0;
  if (useMarkerProximity) {
    const markerPoint = getEdgeMarkerPoint(polylines, markerAxis, markerDirection);
    if (markerPoint) {
      const markerWorld = edgeLocalToWorld(markerPoint, centroid, targetX, targetY, rotation, extraRotation);
      const markerDist = Math.hypot(localMouse.x - markerWorld.x, localMouse.y - markerWorld.y);
      if (markerDist > edgeFollowMarkerRadius) return 0;
      return easeSmoothstep(1 - markerDist / edgeFollowMarkerRadius);
    }
  }
  const localPoint = worldToEdgeLocal(localMouse, centroid, targetX, targetY, rotation, extraRotation);
  const dist = minDistanceToPolylines(polylines, localPoint.x, localPoint.y);
  if (dist > edgeFollowRange) return 0;
  return easeSmoothstep(1 - dist / edgeFollowRange);
}

// ----------------------------------
function getEdgeTipInfluenceGlobal(localMouse, polylines, centroid, targetX, targetY, rotation, markerAxis, markerDirection, extraRotation = 0) {
  if (!localMouse || !polylines || !polylines.length || !centroid) return 0;
  const markerPoint = getEdgeMarkerPoint(polylines, markerAxis, markerDirection);
  if (!markerPoint) return 0;
  const markerWorld = edgeLocalToWorld(markerPoint, centroid, targetX, targetY, rotation, extraRotation);
  const dist = Math.hypot(localMouse.x - markerWorld.x, localMouse.y - markerWorld.y);
  const r = Math.max(edgeFollowMarkerRadius || 1, 1);
  // Global, no cutoff: always > 0, stronger when closer.
  return 1 / (1 + dist / r);
}

// ----------------------------------
function updateEdgePhase(edgeKey, hoverWeight, basePhase) {
  let blend = edgeKey === "top" ? edgePhaseBlendTop :
              edgeKey === "topRight" ? edgePhaseBlendTopRight :
              edgeKey === "left" ? edgePhaseBlendLeft :
              edgePhaseBlendBottom;
  let freeze = edgeKey === "top" ? edgePhaseFreezeTop :
               edgeKey === "topRight" ? edgePhaseFreezeTopRight :
               edgeKey === "left" ? edgePhaseFreezeLeft :
               edgePhaseFreezeBottom;
  const isHoveringEdge = hoverWeight > edgeHoverReleaseThreshold;
  if (isHoveringEdge && blend > 0.99) {
    freeze = basePhase;
  }
  if (isHoveringEdge) {
    blend = Math.max(0, blend - edgePhaseBlendSpeed);
  } else {
    blend = Math.min(1, blend + edgePhaseBlendSpeed);
  }
  const phase = lerp(freeze, basePhase, blend);
  if (edgeKey === "top") {
    edgePhaseBlendTop = blend;
    edgePhaseFreezeTop = freeze;
  } else if (edgeKey === "topRight") {
    edgePhaseBlendTopRight = blend;
    edgePhaseFreezeTopRight = freeze;
  } else if (edgeKey === "left") {
    edgePhaseBlendLeft = blend;
    edgePhaseFreezeLeft = freeze;
  } else {
    edgePhaseBlendBottom = blend;
    edgePhaseFreezeBottom = freeze;
  }
  return phase;
}

// ----------------------------------
function updateEdgeHoverWeight(edgeKey, targetWeight) {
  let current = edgeKey === "top" ? edgeHoverWeightTop :
                edgeKey === "topRight" ? edgeHoverWeightTopRight :
                edgeKey === "left" ? edgeHoverWeightLeft :
                edgeHoverWeightBottom;
  current = lerp(current, targetWeight, edgePhaseBlendSpeed);
  if (edgeKey === "top") {
    edgeHoverWeightTop = current;
  } else if (edgeKey === "topRight") {
    edgeHoverWeightTopRight = current;
  } else if (edgeKey === "left") {
    edgeHoverWeightLeft = current;
  } else {
    edgeHoverWeightBottom = current;
  }
  return current;
}

// ----------------------------------
function worldToEdgeLocal(point, centroid, targetX, targetY, rotation, extraRotation = 0) {
  const dx = point.x - targetX;
  const dy = point.y - targetY;
  const cosR = Math.cos(-rotation);
  const sinR = Math.sin(-rotation);
  const qx = dx * cosR - dy * sinR;
  const qy = dx * sinR + dy * cosR;
  const rx = qx + centroid.x;
  const ry = qy + centroid.y;
  const cosE = Math.cos(-extraRotation);
  const sinE = Math.sin(-extraRotation);
  return {
    x: rx * cosE - ry * sinE,
    y: rx * sinE + ry * cosE
  };
}

// ----------------------------------
function edgeLocalToWorld(localPoint, centroid, targetX, targetY, rotation, extraRotation = 0) {
  const cosE = Math.cos(extraRotation);
  const sinE = Math.sin(extraRotation);
  const ex = localPoint.x * cosE - localPoint.y * sinE;
  const ey = localPoint.x * sinE + localPoint.y * cosE;
  const dx = ex - centroid.x;
  const dy = ey - centroid.y;
  const cosR = Math.cos(rotation);
  const sinR = Math.sin(rotation);
  return {
    x: targetX + dx * cosR - dy * sinR,
    y: targetY + dx * sinR + dy * cosR
  };
}

// ----------------------------------
function minDistanceToPolylines(polylines, x, y) {
  let minDist = Infinity;
  for (let i = 0; i < polylines.length; i++) {
    const poly = polylines[i];
    if (!poly || poly.length < 2) continue;
    for (let j = 0; j < poly.length - 1; j++) {
      const a = poly[j];
      const b = poly[j + 1];
      const dist = distanceToSegment(x, y, a.x, a.y, b.x, b.y);
      if (dist < minDist) minDist = dist;
    }
  }
  return minDist;
}

// ----------------------------------
function distanceToSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const abLenSq = abx * abx + aby * aby;
  if (abLenSq === 0) return Math.hypot(px - ax, py - ay);
  const t = constrain((apx * abx + apy * aby) / abLenSq, 0, 1);
  const cx = ax + abx * t;
  const cy = ay + aby * t;
  return Math.hypot(px - cx, py - cy);
}

// ----------------------------------
function drawStaticEdgeOverlays(localMouse, isHovering) {
  const topPolys = getEdgeDeformedSlice(edgeTopRangeStart, edgeTopRangeCount, edgeTopPolylines);
  const topRightPolys = getEdgeDeformedSlice(edgeTopRightRangeStart, edgeTopRightRangeCount, edgeTopRightPolylines);
  const leftPolys = getEdgeDeformedSlice(edgeLeftRangeStart, edgeLeftRangeCount, edgeLeftPolylines);
  const bottomPolys = getEdgeDeformedSlice(edgeBottomRangeStart, edgeBottomRangeCount, edgeBottomPolylines);
  if (!topRightPolys.length) return;
  if (!leftPolys.length) return;
  if (!bottomPolys.length) return;

  let rawHoverTop = 0;
  let rawHoverTopRight = 0;
  let rawHoverLeft = 0;
  let rawHoverBottom = 0;

  if (svgViewBox && isHovering) {
    const centerXPre = svgViewBox.minX + svgViewBox.width / 2 + circleOffsetX;
    const centerYPre = svgViewBox.minY + svgViewBox.height / 2 + circleOffsetY;
    const radiusXPre = (Math.min(svgViewBox.width, svgViewBox.height) * circleScaleX) / 2;
    const radiusYPre = (Math.min(svgViewBox.width, svgViewBox.height) * circleScaleY) / 2;

    if (topPolys.length && edgeTopCentroid) {
      const baseAngle = Math.atan2(edgeTopCentroid.y - centerYPre, edgeTopCentroid.x - centerXPre);
      const currentOffset = getEdgeFollowOffset("top");
      const basePhase = easePingPong(frameCount * edgeCircleSpeed);
      const anglePre = baseAngle + edgeCircleTravel * basePhase + currentOffset;
      const targetXPre = centerXPre + Math.cos(anglePre) * radiusXPre;
      const targetYPre = centerYPre + Math.sin(anglePre) * radiusYPre;
      rawHoverTop = getEdgeTipInfluenceGlobal(localMouse, topPolys, edgeTopCentroid, targetXPre, targetYPre, anglePre - baseAngle, "y", "min");
    }

    if (edgeTopRightOscillate && edgeTopRightCentroid) {
      const baseAngle = Math.atan2(edgeTopRightCentroid.y - centerYPre, edgeTopRightCentroid.x - centerXPre);
      const currentOffset = getEdgeFollowOffset("topRight");
      const basePhase = easePingPong(frameCount * edgeTopRightCircleSpeed);
      const anglePre = baseAngle + edgeTopRightCircleTravel * basePhase + currentOffset;
      const targetXPre = centerXPre + Math.cos(anglePre) * radiusXPre;
      const targetYPre = centerYPre + Math.sin(anglePre) * radiusYPre;
      rawHoverTopRight = getEdgeTipInfluenceGlobal(localMouse, topRightPolys, edgeTopRightCentroid, targetXPre, targetYPre, anglePre - baseAngle, "y", "min");
    }

    if (edgeLeftCentroid) {
      const baseAngle = Math.atan2(edgeLeftCentroid.y - centerYPre, edgeLeftCentroid.x - centerXPre);
      const currentOffset = getEdgeFollowOffset("left");
      const basePhase = easePingPong(frameCount * edgeLeftCircleSpeed);
      const anglePre = baseAngle + edgeLeftCircleTravel * basePhase + currentOffset;
      const targetXPre = centerXPre + Math.cos(anglePre) * radiusXPre;
      const targetYPre = centerYPre + Math.sin(anglePre) * radiusYPre;
      rawHoverLeft = getEdgeTipInfluenceGlobal(localMouse, leftPolys, edgeLeftCentroid, targetXPre, targetYPre, anglePre - baseAngle, "x", "min");
    }

    if (edgeBottomCentroid) {
      const baseAngle = Math.atan2(edgeBottomCentroid.y - centerYPre, edgeBottomCentroid.x - centerXPre) + radians(edgeBottomAngleOffsetDeg);
      const currentOffset = getEdgeFollowOffset("bottom");
      const basePhase = easePingPong(frameCount * edgeBottomCircleSpeed);
      const anglePre = baseAngle + edgeBottomCircleTravel * basePhase + currentOffset;
      const targetXPre = centerXPre + Math.cos(anglePre) * radiusXPre;
      const targetYPre = centerYPre + Math.sin(anglePre) * radiusYPre;
      rawHoverBottom = getEdgeTipInfluenceGlobal(localMouse, bottomPolys, edgeBottomCentroid, targetXPre, targetYPre, anglePre - baseAngle, "y", "min", radians(-135));
    }
  }

  let closestEdgeKey = null;
  if (bClosestTipOnlyExtend) {
    const weights = {
      top: rawHoverTop,
      topRight: rawHoverTopRight,
      left: rawHoverLeft,
      bottom: rawHoverBottom
    };
    let bestW = 0;
    for (const key in weights) {
      if (weights[key] > bestW) {
        bestW = weights[key];
        closestEdgeKey = key;
      }
    }
  }

  if (topPolys.length && edgeTopCentroid && svgViewBox) {
    const centerX = svgViewBox.minX + svgViewBox.width / 2 + circleOffsetX;
    const centerY = svgViewBox.minY + svgViewBox.height / 2 + circleOffsetY;
    const radiusX = (Math.min(svgViewBox.width, svgViewBox.height) * circleScaleX) / 2;
    const radiusY = (Math.min(svgViewBox.width, svgViewBox.height) * circleScaleY) / 2;
    const baseAngle = Math.atan2(
      edgeTopCentroid.y - centerY,
      edgeTopCentroid.x - centerX
    );
    const currentOffset = getEdgeFollowOffset("top");
    const basePhase = easePingPong(frameCount * edgeCircleSpeed);
    const anglePre = baseAngle + edgeCircleTravel * basePhase + currentOffset;
    const targetXPre = centerX + Math.cos(anglePre) * radiusX;
    const targetYPre = centerY + Math.sin(anglePre) * radiusY;
    const hoverWeight = updateEdgeHoverWeight("top", rawHoverTop);
    const extendHoverTop = (!bClosestTipOnlyExtend || closestEdgeKey === "top") ? hoverWeight : 0;
    const targetTopExtend = edgeTopExtendToLongY * edgeTopExtendBoost * extendHoverTop;
    const topLerp = targetTopExtend < edgeTopExtendY ? edgeTopExtendReturnLerp : edgeTopExtendLerp;
    edgeTopExtendY = lerp(edgeTopExtendY, targetTopExtend, topLerp);
    const topPolysRender = getEdgeExtendedPolylinesCentered(
      topPolys,
      "y",
      "min",
      edgeTopExtendY
    );
    const phase = updateEdgePhase("top", hoverWeight, basePhase);
    const followOffset = updateEdgeFollower(
      baseAngle,
      localMouse,
      centerX,
      centerY,
      isHovering,
      "top",
      hoverWeight
    );
    const angle = baseAngle + edgeCircleTravel * phase + followOffset;
    const targetX = centerX + Math.cos(angle) * radiusX;
    const targetY = centerY + Math.sin(angle) * radiusY;
    const topOffsetMulX = getEdgeOffsetExtendMul(edgeTopExtendY, edgeTopExtendToLongY * edgeTopExtendBoost, edgeTopOffsetExtendMulMaxX);
    const topOffsetMulY = getEdgeOffsetExtendMul(edgeTopExtendY, edgeTopExtendToLongY * edgeTopExtendBoost, edgeTopOffsetExtendMulMaxY);
    const topNudgeX = edgeTopOffsetX * (topOffsetMulX - 1);
    const topNudgeY = edgeTopOffsetY * (topOffsetMulY - 1);
    push();
    translate(targetX + topNudgeX, targetY + topNudgeY);
    if (edgeRotateOffset) {
      rotate(angle - baseAngle);
    }
    translate(-edgeTopCentroid.x, -edgeTopCentroid.y);
    drawPolylines(topPolysRender);
    drawEdgeMarker(topPolysRender, "y", "min");
    pop();
  } else if (topPolys.length) {
    drawPolylines(topPolys);
    drawEdgeMarker(topPolys, "y", "min");
  }

  if (edgeTopRightOscillate && edgeTopRightCentroid && svgViewBox) {
    const centerX = svgViewBox.minX + svgViewBox.width / 2 + circleOffsetX;
    const centerY = svgViewBox.minY + svgViewBox.height / 2 + circleOffsetY;
    const radiusX = (Math.min(svgViewBox.width, svgViewBox.height) * circleScaleX) / 2;
    const radiusY = (Math.min(svgViewBox.width, svgViewBox.height) * circleScaleY) / 2;
    const baseAngle = Math.atan2(
      edgeTopRightCentroid.y - centerY,
      edgeTopRightCentroid.x - centerX
    );
    const currentOffset = getEdgeFollowOffset("topRight");
    const basePhase = easePingPong(frameCount * edgeTopRightCircleSpeed);
    const anglePre = baseAngle + edgeTopRightCircleTravel * basePhase + currentOffset;
    const targetXPre = centerX + Math.cos(anglePre) * radiusX;
    const targetYPre = centerY + Math.sin(anglePre) * radiusY;
    const hoverWeight = updateEdgeHoverWeight("topRight", rawHoverTopRight);
    const extendHoverTopRight = (!bClosestTipOnlyExtend || closestEdgeKey === "topRight") ? hoverWeight : 0;
    const targetTopRightExtend = edgeTopRightExtendToLongY * edgeTopExtendBoost * extendHoverTopRight;
    const topRightLerp = targetTopRightExtend < edgeTopRightExtendY ? edgeTopExtendReturnLerp : edgeTopExtendLerp;
    edgeTopRightExtendY = lerp(edgeTopRightExtendY, targetTopRightExtend, topRightLerp);
    const topRightMarker = findExtremePoint(topRightPolys, "y", "min");
    const topRightCentroidNow = computePolylinesCentroid(topRightPolys);
    const topRightDirX = (topRightMarker && topRightCentroidNow)
      ? (topRightMarker.x - topRightCentroidNow.x)
      : 0;
    const topRightDirY = (topRightMarker && topRightCentroidNow)
      ? (topRightMarker.y - topRightCentroidNow.y)
      : -1;
    const topRightPolysRender = getEdgeExtendedPolylinesCentered(
      topRightPolys,
      "y",
      "min",
      edgeTopRightExtendY,
      topRightDirX,
      topRightDirY
    );
    const phase = updateEdgePhase("topRight", hoverWeight, basePhase);
    const followOffset = updateEdgeFollower(
      baseAngle,
      localMouse,
      centerX,
      centerY,
      isHovering,
      "topRight",
      hoverWeight
    );
    const angle = baseAngle + edgeTopRightCircleTravel * phase + followOffset;
    const targetX = centerX + Math.cos(angle) * radiusX;
    const targetY = centerY + Math.sin(angle) * radiusY;
    const topRightOffsetMulX = getEdgeOffsetExtendMul(edgeTopRightExtendY, edgeTopRightExtendToLongY * edgeTopExtendBoost, edgeTopRightOffsetExtendMulMaxX);
    const topRightOffsetMulY = getEdgeOffsetExtendMul(edgeTopRightExtendY, edgeTopRightExtendToLongY * edgeTopExtendBoost, edgeTopRightOffsetExtendMulMaxY);
    const topRightNudgeX = edgeTopRightOffsetX * (topRightOffsetMulX - 1);
    const topRightNudgeY = edgeTopRightOffsetY * (topRightOffsetMulY - 1);
    const rotation = edgeRotateOffset ? angle - baseAngle : 0;
    push();
    translate(targetX + topRightNudgeX, targetY + topRightNudgeY);
    if (edgeRotateOffset) {
      rotate(angle - baseAngle);
    }
    translate(-edgeTopRightCentroid.x, -edgeTopRightCentroid.y);
    drawPolylines(topRightPolysRender);
    drawEdgeMarker(topRightPolysRender, "y", "min");
    pop();
  } else {
    drawPolylines(topRightPolys);
    drawEdgeMarker(topRightPolys, "y", "min");
  }
  if (edgeLeftCentroid && svgViewBox) {
    const centerX = svgViewBox.minX + svgViewBox.width / 2 + circleOffsetX;
    const centerY = svgViewBox.minY + svgViewBox.height / 2 + circleOffsetY;
    const radiusX = (Math.min(svgViewBox.width, svgViewBox.height) * circleScaleX) / 2;
    const radiusY = (Math.min(svgViewBox.width, svgViewBox.height) * circleScaleY) / 2;
    const baseAngle = Math.atan2(
      edgeLeftCentroid.y - centerY,
      edgeLeftCentroid.x - centerX
    );
    const currentOffset = getEdgeFollowOffset("left");
    const basePhase = easePingPong(frameCount * edgeLeftCircleSpeed);
    const anglePre = baseAngle + edgeLeftCircleTravel * basePhase + currentOffset;
    const targetXPre = centerX + Math.cos(anglePre) * radiusX;
    const targetYPre = centerY + Math.sin(anglePre) * radiusY;
    const hoverWeight = updateEdgeHoverWeight("left", rawHoverLeft);
    const extendHoverLeft = (!bClosestTipOnlyExtend || closestEdgeKey === "left") ? hoverWeight : 0;
    const targetLeftExtend = edgeLeftExtendToLongX * edgeTopExtendBoost * extendHoverLeft;
    const leftLerp = targetLeftExtend < edgeLeftExtendX ? edgeTopExtendReturnLerp : edgeTopExtendLerp;
    edgeLeftExtendX = lerp(edgeLeftExtendX, targetLeftExtend, leftLerp);
    const leftMarker = findExtremePoint(leftPolys, "x", "min");
    const leftCentroidNow = computePolylinesCentroid(leftPolys);
    const leftDirX = (leftMarker && leftCentroidNow)
      ? (leftMarker.x - leftCentroidNow.x)
      : -1;
    const leftDirY = (leftMarker && leftCentroidNow)
      ? (leftMarker.y - leftCentroidNow.y)
      : 0;
    const leftPolysRender = getEdgeExtendedPolylinesCentered(
      leftPolys,
      "x",
      "min",
      edgeLeftExtendX,
      leftDirX,
      leftDirY
    );
    const phase = updateEdgePhase("left", hoverWeight, basePhase);
    const followOffset = updateEdgeFollower(
      baseAngle,
      localMouse,
      centerX,
      centerY,
      isHovering,
      "left",
      hoverWeight
    );
    const angle = baseAngle + edgeLeftCircleTravel * phase + followOffset;
    const targetX = centerX + Math.cos(angle) * radiusX;
    const targetY = centerY + Math.sin(angle) * radiusY;
    const leftOffsetMulX = getEdgeOffsetExtendMul(edgeLeftExtendX, edgeLeftExtendToLongX * edgeTopExtendBoost, edgeLeftOffsetExtendMulMaxX);
    const leftOffsetMulY = getEdgeOffsetExtendMul(edgeLeftExtendX, edgeLeftExtendToLongX * edgeTopExtendBoost, edgeLeftOffsetExtendMulMaxY);
    const leftNudgeX = edgeLeftOffsetX * (leftOffsetMulX - 1);
    const leftNudgeY = edgeLeftOffsetY * (leftOffsetMulY - 1);
    const rotation = edgeRotateOffset ? angle - baseAngle : 0;
    push();
    translate(targetX + leftNudgeX, targetY + leftNudgeY);
    if (edgeRotateOffset) {
      rotate(angle - baseAngle);
    }
    translate(-edgeLeftCentroid.x, -edgeLeftCentroid.y);
    drawPolylines(leftPolysRender);
    drawEdgeMarker(leftPolysRender, "x", "min");
    pop();
  } else {
    drawPolylines(leftPolys);
    drawEdgeMarker(leftPolys, "x", "min");
  }
  if (edgeBottomCentroid && svgViewBox) {
    const centerX = svgViewBox.minX + svgViewBox.width / 2 + circleOffsetX;
    const centerY = svgViewBox.minY + svgViewBox.height / 2 + circleOffsetY;
    const radiusX = (Math.min(svgViewBox.width, svgViewBox.height) * circleScaleX) / 2;
    const radiusY = (Math.min(svgViewBox.width, svgViewBox.height) * circleScaleY) / 2;
    const baseAngle = Math.atan2(
      edgeBottomCentroid.y - centerY,
      edgeBottomCentroid.x - centerX
    ) + radians(edgeBottomAngleOffsetDeg);
    const currentOffset = getEdgeFollowOffset("bottom");
    const basePhase = easePingPong(frameCount * edgeBottomCircleSpeed);
    const anglePre = baseAngle + edgeBottomCircleTravel * basePhase + currentOffset;
    const targetXPre = centerX + Math.cos(anglePre) * radiusX;
    const targetYPre = centerY + Math.sin(anglePre) * radiusY;
    const hoverWeight = updateEdgeHoverWeight("bottom", rawHoverBottom);
    const extendHoverBottom = (!bClosestTipOnlyExtend || closestEdgeKey === "bottom") ? hoverWeight : 0;
    const targetBottomExtend = edgeBottomExtendToLongY * edgeTopExtendBoost * extendHoverBottom;
    const bottomLerp = targetBottomExtend < edgeBottomExtendY ? edgeTopExtendReturnLerp : edgeTopExtendLerp;
    edgeBottomExtendY = lerp(edgeBottomExtendY, targetBottomExtend, bottomLerp);
    const bottomPolysRender = getEdgeExtendedPolylinesCentered(
      bottomPolys,
      "y",
      "min",
      edgeBottomExtendY
    );
    const phase = updateEdgePhase("bottom", hoverWeight, basePhase);
    const followOffset = updateEdgeFollower(
      baseAngle,
      localMouse,
      centerX,
      centerY,
      isHovering,
      "bottom",
      hoverWeight
    );
    const angle = baseAngle + edgeBottomCircleTravel * phase + followOffset;
    const targetX = centerX + Math.cos(angle) * radiusX;
    const targetY = centerY + Math.sin(angle) * radiusY;
    const bottomOffsetMulX = getEdgeOffsetExtendMul(edgeBottomExtendY, edgeBottomExtendToLongY * edgeTopExtendBoost, edgeBottomOffsetExtendMulMaxX);
    const bottomOffsetMulY = getEdgeOffsetExtendMul(edgeBottomExtendY, edgeBottomExtendToLongY * edgeTopExtendBoost, edgeBottomOffsetExtendMulMaxY);
    const bottomNudgeX = edgeBottomOffsetX * (bottomOffsetMulX - 1);
    const bottomNudgeY = edgeBottomOffsetY * (bottomOffsetMulY - 1);
    const rotation = edgeRotateOffset ? angle - baseAngle : 0;
    push();
    translate(targetX + bottomNudgeX, targetY + bottomNudgeY);
    if (edgeRotateOffset) {
      rotate(angle - baseAngle);
    }
    translate(-edgeBottomCentroid.x, -edgeBottomCentroid.y);
    rotate(radians(-135));
    drawPolylines(bottomPolysRender);
    drawEdgeMarker(bottomPolysRender, "y", "min");
    pop();
  } else {
    drawPolylines(bottomPolys);
    drawEdgeMarker(bottomPolys, "y", "min");
  }

}

// ----------------------------------
function easePingPong(timeValue) {
  const t = (Math.sin(timeValue) + 1) * 0.5;
  return t * t * (3 - 2 * t);
}

// ----------------------------------
function easeSmoothstep(t) {
  const clamped = constrain(t, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

// ----------------------------------
// Helper: convert our old “lerp factor” style smoothing into a constant max-step.
// This makes smaller distances arrive earlier (e.g. -20 finishes before -30),
// while keeping the same user-tuned strength values.
//
// For a classic exponential smoother, ~4.6 time constants gets you to ~1% error.
// We use this to derive a per-frame step size from a typical max distance.
var followSettleFactor = 4.6;

function moveTowards(current, target, maxStep) {
  const d = target - current;
  if (Math.abs(d) <= maxStep) return target;
  return current + Math.sign(d) * maxStep;
}

// Like moveTowards(), but eases-in near the target.
// - Still distance-based overall (so smaller targets finish sooner)
// - Step size scales down as you get close, giving a more “lerp-like” feel
function moveTowardsEased(current, target, maxStep, slowRadius) {
  const d = target - current;
  const ad = Math.abs(d);
  // Only snap when we're extremely close (avoid visible "pop" at the end)
  if (ad <= 1e-6) return target;

  const r = Math.max(slowRadius || 0, 0.000001);
  const t = constrain(ad / r, 0, 1); // far=1, near=0
  // Ease curve for step scaling (smoothstep)
  const s = t * t * (3 - 2 * t);

  // Ease the step down smoothly as we approach the target.
  // Also: don't step past the target.
  const easedStep = maxStep * s;
  const step = Math.min(ad, easedStep);
  return current + Math.sign(d) * step;
}

// Ease-in-out follower (no bounce, no overshoot) that preserves the
// distance-based "stagger" behaviour.
//
// - maxStep: sets top speed (derived from your existing strength values)
// - slowRadius: how close we start easing-out
// - velocity: per-follower state so motion can ease-in at the start
function followEaseInOut(current, target, maxStep, slowRadius, velocity) {
  const d = target - current;
  const ad = Math.abs(d);
  if (ad <= 1e-6) {
    return { pos: target, vel: 0 };
  }

  // Ease-out based on remaining distance
  const r = Math.max(slowRadius || 0, 0.000001);
  const t = constrain(ad / r, 0, 1); // far=1, near=0
  const easeOut = t * t * (3 - 2 * t);
  const desiredSpeed = maxStep * easeOut;
  const desiredVel = Math.sign(d) * desiredSpeed;

  // Ease-in (speed ramp) via velocity smoothing
  const accel = 0.25;
  velocity = lerp(velocity || 0, desiredVel, accel);

  // Move, clamped so we never overshoot the target
  const step = Math.min(ad, Math.abs(velocity));
  const next = current + Math.sign(d) * step;
  if (Math.abs(target - next) <= 1e-6) {
    return { pos: target, vel: 0 };
  }
  return { pos: next, vel: velocity };
}

function getGlobalEdgeFollowMaxOffsetRad() {
  return Math.max(
    Math.abs(radians(edgeTopFollowMinDeg)),
    Math.abs(radians(edgeTopFollowMaxDeg)),
    Math.abs(radians(edgeTopRightFollowMinDeg)),
    Math.abs(radians(edgeTopRightFollowMaxDeg)),
    Math.abs(radians(edgeLeftFollowMinDeg)),
    Math.abs(radians(edgeLeftFollowMaxDeg)),
    Math.abs(radians(edgeBottomFollowMinDeg)),
    Math.abs(radians(edgeBottomFollowMaxDeg))
  );
}

function getGlobalInnerSproutMaxDeltaDeg() {
  return Math.max(
    Math.abs(innerSproutMinDeg01 - innerSproutRotationDeg01),
    Math.abs(innerSproutMaxDeg01 - innerSproutRotationDeg01),
    Math.abs(innerSproutMinDeg02 - innerSproutRotationDeg02),
    Math.abs(innerSproutMaxDeg02 - innerSproutRotationDeg02),
    Math.abs(innerSproutMinDeg03 - innerSproutRotationDeg03),
    Math.abs(innerSproutMaxDeg03 - innerSproutRotationDeg03)
  );
}

// ----------------------------------
// Map mouseX in screen space to an edge offset in radians.
// - mouse at canvas center => 0
// - mouse at left edge => minOffsetRad
// - mouse at right edge => maxOffsetRad
function globalMouseXToEdgeOffset(minOffsetRad, maxOffsetRad) {
  const halfW = width * 0.5 || 1;
  const nx = constrain((mouseX - halfW) / halfW, -1, 1); // [-1..1]
  const amt = easeSmoothstep(Math.abs(nx));
  return nx >= 0 ? maxOffsetRad * amt : minOffsetRad * amt;
}

// ----------------------------------
function updateEdgeFollower(baseAngle, localMouse, centerX, centerY, isHovering, edgeKey, hoverWeight) {
  const w = constrain(hoverWeight || 0, 0, 1);
  const speedMul = lerp(edgeFollowSpeedMinMul, edgeFollowSpeedMaxMul, w);

  // New: global mouse-X driven follow (affects all edges, regardless of proximity).
  if (bGlobalMouseXEdgeFollow) {
    if (!isHovering) {
      return applyEdgeFollowSpring(0, edgeKey, speedMul);
    }

    let minOffset = 0;
    let maxOffset = 0;
    if (edgeKey === "top") {
      minOffset = radians(edgeTopFollowMinDeg);
      maxOffset = radians(edgeTopFollowMaxDeg);
    } else if (edgeKey === "topRight") {
      minOffset = radians(edgeTopRightFollowMinDeg);
      maxOffset = radians(edgeTopRightFollowMaxDeg);
    } else if (edgeKey === "left") {
      minOffset = radians(edgeLeftFollowMinDeg);
      maxOffset = radians(edgeLeftFollowMaxDeg);
    } else if (edgeKey === "bottom") {
      minOffset = radians(edgeBottomFollowMinDeg);
      maxOffset = radians(edgeBottomFollowMaxDeg);
    }

    const targetOffset = globalMouseXToEdgeOffset(minOffset, maxOffset);
    return applyEdgeFollowSpring(targetOffset, edgeKey, speedMul);
  }

  // Legacy: local angle-based follow (only engages when hovering near the edge)
  if (!localMouse || !isHovering || !hoverWeight) {
    return applyEdgeFollowSpring(0, edgeKey, speedMul);
  }
  const dx = localMouse.x - centerX;
  const dy = localMouse.y - centerY;
  const mouseAngle = Math.atan2(dy, dx);
  let delta = normalizeAngle(mouseAngle - baseAngle);
  if (edgeKey === "top") {
    const minOffset = radians(edgeTopFollowMinDeg);
    const maxOffset = radians(edgeTopFollowMaxDeg);
    delta = constrain(delta, minOffset, maxOffset);
  } else if (edgeKey === "topRight") {
    const minOffset = radians(edgeTopRightFollowMinDeg);
    const maxOffset = radians(edgeTopRightFollowMaxDeg);
    delta = constrain(delta, minOffset, maxOffset);
  } else if (edgeKey === "left") {
    const minOffset = radians(edgeLeftFollowMinDeg);
    const maxOffset = radians(edgeLeftFollowMaxDeg);
    delta = constrain(delta, minOffset, maxOffset);
  } else if (edgeKey === "bottom") {
    const minOffset = radians(edgeBottomFollowMinDeg);
    const maxOffset = radians(edgeBottomFollowMaxDeg);
    delta = constrain(delta, minOffset, maxOffset);
  }
  return applyEdgeFollowSpring(delta * hoverWeight, edgeKey, speedMul);
}

// ----------------------------------
function applyEdgeFollowSpring(targetOffset, edgeKey, speedMul) {
  let offset = edgeKey === "top" ? edgeTopFollowOffset :
               edgeKey === "topRight" ? edgeTopRightFollowOffset :
               edgeKey === "bottom" ? edgeBottomFollowOffset :
               edgeLeftFollowOffset;
  let velocity = edgeKey === "top" ? edgeTopFollowVelocity :
                 edgeKey === "topRight" ? edgeTopRightFollowVelocity :
                 edgeKey === "bottom" ? edgeBottomFollowVelocity :
                 edgeLeftFollowVelocity;
  // No-bounce smoothing (constant max step).
  // Using a constant step (instead of lerp) means smaller ranges finish sooner.
  const speed = (speedMul == null) ? 1 : speedMul;
  const amtBase = targetOffset === 0 ? edgeFollowReturn : edgeFollowStrength;
  const amt = amtBase * speed;
  const maxRange = getGlobalEdgeFollowMaxOffsetRad() || 0.001;
  const maxStep = (maxRange * amt) / followSettleFactor;
  const slowRadius = maxRange * 0.45;
  const res = followEaseInOut(offset, targetOffset, maxStep, slowRadius, velocity);
  offset = res.pos;
  velocity = res.vel;
  if (edgeKey === "top") {
    edgeTopFollowOffset = offset;
    edgeTopFollowVelocity = velocity;
  } else if (edgeKey === "topRight") {
    edgeTopRightFollowOffset = offset;
    edgeTopRightFollowVelocity = velocity;
  } else if (edgeKey === "bottom") {
    edgeBottomFollowOffset = offset;
    edgeBottomFollowVelocity = velocity;
  } else {
    edgeLeftFollowOffset = offset;
    edgeLeftFollowVelocity = velocity;
  }
  return offset;
}

// ----------------------------------
function normalizeAngle(angle) {
  let a = angle;
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

// ----------------------------------
function getEdgeDeformedSlice(rangeStart, rangeCount, fallbackPolylines) {
  if (rangeStart < 0 || rangeCount <= 0) {
    return fallbackPolylines;
  }
  return deformedPolylines.slice(rangeStart, rangeStart + rangeCount);
}

// ----------------------------------
function getLocalMouse(fit) {
  const activeFit = fit || svgFitLogo;
  if (!activeFit) return { x: mouseX, y: mouseY };
  return {
    x: (mouseX - activeFit.offsetX) / activeFit.scale,
    y: (mouseY - activeFit.offsetY) / activeFit.scale
  };
}

// ----------------------------------
function isMouseInLogoInteractionZone(mx, my) {
  if (!svgFitLogo || !svgViewBox) return true;
  const centerLogoX = svgViewBox.minX + svgViewBox.width * 0.5;
  const centerLogoY = svgViewBox.minY + svgViewBox.height * 0.5;
  const centerScreenX = svgFitLogo.offsetX + centerLogoX * svgFitLogo.scale;
  const centerScreenY = svgFitLogo.offsetY + centerLogoY * svgFitLogo.scale;
  const baseRadius = Math.min(svgViewBox.width, svgViewBox.height) * 0.5 * svgFitLogo.scale;
  const radius = Math.max(1, baseRadius * logoInteractionRadiusMul + logoInteractionRadiusPxBias);
  const d = Math.hypot(mx - centerScreenX, my - centerScreenY);
  // Safety fallback: if radius math is too small, don't block all interaction.
  if (!Number.isFinite(radius) || radius < 40) return true;
  return d <= radius;
}

// ----------------------------------
function updateDeformedPolylines(localMouse, isHovering) {
  updatePolylineSet(
    basePolylines,
    deformedPolylines,
    pointVelocities,
    localMouse,
    isHovering,
    logoRangeStart,
    logoRangeCount
  );
}

// ----------------------------------
function updatePolylineSet(baseSet, deformSet, velocitySet, localMouse, isHovering, rangeStart, rangeCount) {
  const startIndex = rangeStart != null ? rangeStart : 0;
  const endIndex = rangeCount != null ? startIndex + rangeCount : deformSet.length;
  for (let i = startIndex; i < endIndex; i++) {
    const defPoly = deformSet[i];
    const basePoly = baseSet[i];
    const velPoly = velocitySet[i];
    for (let j = 0; j < defPoly.length; j++) {
      const pos = defPoly[j];
      const base = basePoly[j];
      const vel = velPoly[j];

      const elasticity = isHovering ? 1 : returnElasticity;
      const spring = p5.Vector.sub(base, pos).mult(returnStrength * elasticity);
      vel.add(spring);

      if (isHovering) {
        const dx = localMouse.x - pos.x;
        const dy = localMouse.y - pos.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < deformRadius * deformRadius) {
          const dist = Math.sqrt(distSq) || 1;
          const falloff = 1 - dist / deformRadius;
          vel.add(dx * deformStrength * falloff, dy * deformStrength * falloff);
        }
      }

      vel.mult(damping);
      pos.add(vel);
    }
  }
}

// ----------------------------------
function updateEdgeDeformationRange(localMouseWorld, centroid, targetX, targetY, rotation, rangeStart, rangeCount, isHovering) {
  if (!localMouseWorld || !centroid) return;
  const localMouse = worldToEdgeLocal(localMouseWorld, centroid, targetX, targetY, rotation);
  updatePolylineSet(
    basePolylines,
    deformedPolylines,
    pointVelocities,
    localMouse,
    isHovering,
    rangeStart,
    rangeCount
  );
}

// ----------------------------------
function parseSvgViewBox(svgCodeLines) {
  const svgText = svgCodeLines.join("\n");
  const match = svgText.match(/viewBox\s*=\s*"([^"]+)"/i);
  if (!match) {
    console.warn("SVG viewBox not found. Fit-to-canvas disabled.");
    return null;
  }
  const parts = match[1].trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || parts.some((v) => Number.isNaN(v))) {
    console.warn("SVG viewBox invalid. Fit-to-canvas disabled.");
    return null;
  }
  return { minX: parts[0], minY: parts[1], width: parts[2], height: parts[3] };
}

// ----------------------------------
function computeContainFit(viewBox, targetW, targetH, userScale = 1) {
  if (!viewBox || viewBox.width === 0 || viewBox.height === 0) return null;
  const scale = Math.min(targetW / viewBox.width, targetH / viewBox.height) * userScale;
  const offsetX = (targetW - viewBox.width * scale) / 2 - viewBox.minX * scale;
  const offsetY = (targetH - viewBox.height * scale) / 2 - viewBox.minY * scale;
  return { scale, offsetX, offsetY };
}

// ----------------------------------
