/**
 * Self-contained HTML graph visualization generator.
 *
 * Produces a single .html file with all CSS + JS inlined.
 * No external dependencies — opens offline in any browser.
 */
// ── Main export ───────────────────────────────────────────────────
export function generateGraphHtml(data) {
    const { nodes, repoName, generatedAt, stats } = data;
    // Compute categories present in data
    const catSet = new Set(nodes.map((n) => n.cat));
    const catsPresent = DEFAULT_CAT_ORDER.filter((c) => catSet.has(c));
    const edgeCount = nodes.reduce((sum, n) => sum + n.imports.length, 0);
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(repoName)} — Code Review Graph</title>
${buildStyles()}
</head>
<body>

${buildHeader(repoName, generatedAt, stats.filesCount, edgeCount, catsPresent.length)}
${buildControls()}

<div class="main">
  <div class="graph-panel" id="graphPanel">
    <canvas class="edge-canvas" id="edgeCanvas"></canvas>
    <div class="graph-canvas" id="graphCanvas"></div>
  </div>
  <div class="detail-panel" id="detailPanel"></div>
</div>

${buildLegend(catsPresent)}
${buildZoomControls()}

<div class="footer">
  <span>github.com/hrconsultnj/composure</span>
</div>

<script>
${buildScript(nodes, catsPresent)}
</script>
</body>
</html>`;
}
// ── Constants ─────────────────────────────────────────────────────
const CATEGORY_META = {
    pages: { label: "Pages", color: "#f37029" },
    api: { label: "API Routes", color: "#ef4444" },
    components: { label: "Components", color: "#8b5cf6" },
    hooks: { label: "Hooks", color: "#06b6d4" },
    lib: { label: "Core Lib", color: "#22c55e" },
    auth: { label: "Auth", color: "#f59e0b" },
    data: { label: "Data Layer", color: "#3b82f6" },
    types: { label: "Types", color: "#eab308" },
    config: { label: "Config", color: "#64748b" },
    tests: { label: "Tests", color: "#22d3ee" },
    styles: { label: "Styles", color: "#f472b6" },
    source: { label: "Source", color: "#94a3b8" },
};
const DEFAULT_CAT_ORDER = [
    "pages", "api", "components", "hooks", "lib",
    "auth", "data", "types", "config", "tests", "styles", "source",
];
export { CATEGORY_META, DEFAULT_CAT_ORDER };
// ── Helpers ───────────────────────────────────────────────────────
function esc(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
function jsonInject(data) {
    return JSON.stringify(data)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");
}
// ── CSS ───────────────────────────────────────────────────────────
function buildStyles() {
    return `<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #0a0e1a; color: #e2e8f0; overflow: hidden; }

  /* ── Header ─────────────────────────────────────────── */
  .header { padding: 16px 28px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .header h1 { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
  .header h1 .logo { width: 26px; height: 26px; border-radius: 6px; background: #f37029; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; color: #0a0e1a; flex-shrink: 0; }
  .header h1 .brand { color: #f37029; }
  .header .sep { color: #334155; font-weight: 300; }
  .header .subtitle { color: #64748b; font-size: 14px; font-weight: 400; }
  .header .stats { margin-left: auto; display: flex; gap: 18px; font-size: 12px; color: #64748b; }
  .header .stats strong { color: #e2e8f0; font-weight: 600; }
  .header .badge { font-size: 10px; color: #22c55e; border: 1px solid rgba(34,197,94,0.3); border-radius: 10px; padding: 2px 10px; background: rgba(34,197,94,0.08); }

  /* ── Controls ───────────────────────────────────────── */
  .controls { padding: 10px 28px; display: flex; gap: 8px; flex-wrap: wrap; border-bottom: 1px solid rgba(255,255,255,0.06); align-items: center; }
  .controls button { padding: 5px 14px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: #64748b; font-size: 11px; cursor: pointer; transition: all 0.15s; font-family: inherit; }
  .controls button:hover, .controls button.active { background: rgba(243,112,41,0.12); border-color: rgba(243,112,41,0.35); color: #f37029; }
  .search-box { margin-left: auto; padding: 5px 14px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: #e2e8f0; font-size: 11px; width: 200px; outline: none; font-family: inherit; }
  .search-box:focus { border-color: rgba(243,112,41,0.4); }
  .search-box::placeholder { color: #334155; }

  /* ── Graph ──────────────────────────────────────────── */
  .main { display: flex; height: calc(100vh - 105px); }
  .graph-panel { flex: 1; position: relative; overflow: auto; cursor: grab; }
  .graph-panel:active { cursor: grabbing; }
  .graph-canvas { position: absolute; top: 0; left: 0; }
  .edge-canvas { position: absolute; top: 0; left: 0; pointer-events: none; }

  /* ── Nodes ──────────────────────────────────────────── */
  .node { position: absolute; width: 190px; height: 34px; border-radius: 7px; cursor: pointer; transition: opacity 0.15s, box-shadow 0.15s; display: flex; align-items: center; gap: 8px; padding: 0 12px; user-select: none; font-size: 11px; font-weight: 500; border: 1px solid transparent; }
  .node:hover { filter: brightness(1.25); box-shadow: 0 0 14px rgba(255,255,255,0.05); }
  .node .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .node .lbl { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
  .node.selected { border-width: 2px; z-index: 5; }
  .node.dimmed { opacity: 0.12; pointer-events: none; }

  /* ── Column headers ─────────────────────────────────── */
  .col-header { position: absolute; font-size: 12px; font-weight: 700; letter-spacing: 0.03em; opacity: 0.8; font-family: 'SF Mono', 'Fira Code', Menlo, monospace; }
  .col-line { position: absolute; height: 2px; opacity: 0.25; border-radius: 1px; }

  /* ── Detail panel ───────────────────────────────────── */
  .detail-panel { width: 380px; border-left: 1px solid rgba(255,255,255,0.08); padding: 0; overflow-y: auto; display: none; flex-shrink: 0; background: rgba(10,14,26,0.85); }
  .detail-panel.open { display: block; }
  .dp-inner { padding: 22px; }
  .dp-title { font-size: 17px; font-weight: 700; margin-bottom: 4px; }
  .dp-path { font-size: 11px; color: #475569; font-family: 'SF Mono', Menlo, monospace; margin-bottom: 14px; word-break: break-all; }
  .dp-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
  .dp-badge { display: inline-block; padding: 2px 10px; border-radius: 10px; font-size: 10px; font-weight: 600; }
  .dp-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 18px; }
  .dp-stat { padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); }
  .dp-stat-label { font-size: 10px; color: #475569; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
  .dp-stat-value { font-size: 18px; font-weight: 700; color: #e2e8f0; margin-top: 2px; }
  .dp-section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; margin: 16px 0 8px; font-weight: 600; }
  .dp-dep-item { padding: 5px 0; font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 8px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.03); }
  .dp-dep-item:hover { color: #f37029; }
  .dp-dep-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .dp-flag { padding: 8px 12px; border-radius: 7px; margin-bottom: 5px; font-size: 11px; line-height: 1.4; }

  /* ── Legend ──────────────────────────────────────────── */
  .legend { position: fixed; bottom: 14px; left: 14px; background: rgba(10,14,26,0.95); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; font-size: 10px; z-index: 10; backdrop-filter: blur(8px); }
  .legend-toggle { display: flex; align-items: center; justify-content: space-between; padding: 7px 12px; cursor: pointer; user-select: none; color: #64748b; font-size: 10px; font-weight: 600; letter-spacing: 0.04em; gap: 8px; }
  .legend-toggle:hover { color: #e2e8f0; }
  .legend-toggle svg { width: 12px; height: 12px; transition: transform 0.2s; }
  .legend-toggle.collapsed svg { transform: rotate(180deg); }
  .legend-body { padding: 0 12px 8px; }
  .legend-body.hidden { display: none; }
  .legend-item { display: flex; align-items: center; gap: 7px; margin: 3px 0; color: #64748b; }
  .legend-color { width: 10px; height: 10px; border-radius: 3px; }

  /* ── Zoom ───────────────────────────────────────────── */
  .zoom-controls { position: fixed; bottom: 14px; right: 14px; display: flex; gap: 4px; z-index: 10; }
  .zoom-controls button { width: 32px; height: 32px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.08); background: rgba(10,14,26,0.95); color: #64748b; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: inherit; backdrop-filter: blur(8px); }
  .zoom-controls button:hover { color: #f37029; border-color: rgba(243,112,41,0.35); }

  /* ── Footer ─────────────────────────────────────────── */
  .footer { position: fixed; bottom: 14px; right: 140px; font-size: 10px; color: #1e293b; z-index: 5; }
</style>`;
}
// ── HTML sections ─────────────────────────────────────────────────
function buildHeader(repoName, generatedAt, filesCount, edgeCount, catCount) {
    return `<div class="header">
  <h1>
    <span class="logo">C</span>
    <span class="brand">Composure</span>
    <span class="sep">—</span>
    <span class="subtitle">Code Review Graph</span>
  </h1>
  <span class="badge">${esc(generatedAt)}</span>
  <div class="stats">
    <span><strong id="statFiles">${filesCount}</strong> files</span>
    <span><strong id="statEdges">${edgeCount}</strong> connections</span>
    <span><strong>${catCount}</strong> categories</span>
  </div>
</div>`;
}
function buildControls() {
    return `<div class="controls" id="controls">
  <input class="search-box" id="searchBox" placeholder="Search files…" type="text" />
</div>`;
}
function buildLegend(cats) {
    const items = cats
        .map((c) => {
        const m = CATEGORY_META[c] ?? { label: c, color: "#94a3b8" };
        return `    <div class="legend-item"><div class="legend-color" style="background:${m.color}"></div> ${esc(m.label)}</div>`;
    })
        .join("\n");
    return `<div class="legend" id="legend">
  <div class="legend-toggle" id="legendToggle">
    <span>Legend</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
  </div>
  <div class="legend-body" id="legendBody">
${items}
  </div>
</div>`;
}
function buildZoomControls() {
    return `<div class="zoom-controls">
  <button id="zoomOut" title="Zoom out">−</button>
  <button id="zoomReset" title="Reset zoom">⟳</button>
  <button id="zoomIn" title="Zoom in">+</button>
</div>`;
}
// ── JavaScript (decomposed into focused template sections) ────────
// NOTE: The functions below return browser-runtime JavaScript as template
// strings. The untyped `const x = {}` patterns are intentional — this is
// client-side JS that runs in the browser, not TypeScript.
/** Data constants, edge/reverse-dep maps, sizing, state variables. */
function buildScriptData(nodes, catsPresent) {
    const colorsObj = {};
    const labelsObj = {};
    for (const c of catsPresent) {
        const m = CATEGORY_META[c] ?? { label: c, color: "#94a3b8" };
        colorsObj[c] = m.color;
        labelsObj[c] = m.label;
    }
    return `
var NODES=${jsonInject(nodes)},COLORS=${jsonInject(colorsObj)},CAT_LABELS=${jsonInject(labelsObj)},CAT_ORDER=${jsonInject(catsPresent)};
var EDGES=[],nodeMap={},reverseDeps={};
NODES.forEach(function(n){nodeMap[n.id]=n;});
NODES.forEach(function(n){(n.imports||[]).forEach(function(t){if(nodeMap[t])EDGES.push({source:n.id,target:t});});});
NODES.forEach(function(n){reverseDeps[n.id]=[];});
EDGES.forEach(function(e){if(reverseDeps[e.target])reverseDeps[e.target].push(e.source);});
var NODE_W=190,NODE_H=34,COL_GAP=220,ROW_GAP=42,PAD_X=44,PAD_Y=52;
var currentFilter="all",selectedNode=null,searchTerm="",zoom=0.85;
`;
}
/** Filter buttons, search input, zoom controls, legend toggle. */
function buildScriptControls() {
    return `
var controlsEl=document.getElementById("controls"),searchBox=document.getElementById("searchBox");
var filterMap={all:"All"};
CAT_ORDER.forEach(function(c){filterMap[c]=CAT_LABELS[c]||c;});
Object.entries(filterMap).forEach(function(kv){
  var key=kv[0],label=kv[1],btn=document.createElement("button");
  btn.textContent=label;btn.dataset.filter=key;
  if(key==="all")btn.classList.add("active");
  btn.addEventListener("click",function(){
    controlsEl.querySelectorAll("button").forEach(function(b){b.classList.remove("active");});
    btn.classList.add("active");currentFilter=key;selectedNode=null;
    document.getElementById("detailPanel").classList.remove("open");render();
  });
  controlsEl.insertBefore(btn,searchBox);
});
searchBox.addEventListener("input",function(e){searchTerm=e.target.value.toLowerCase();render();});
document.getElementById("zoomIn").addEventListener("click",function(){zoom=Math.min(zoom+0.15,2);render();});
document.getElementById("zoomOut").addEventListener("click",function(){zoom=Math.max(zoom-0.15,0.3);render();});
document.getElementById("zoomReset").addEventListener("click",function(){zoom=0.85;render();});
document.getElementById("graphPanel").addEventListener("wheel",function(e){
  if(e.ctrlKey||e.metaKey){e.preventDefault();zoom=Math.max(0.3,Math.min(2,zoom+(e.deltaY<0?0.08:-0.08)));render();}
},{passive:false});
document.getElementById("legendToggle").addEventListener("click",function(){
  document.getElementById("legendBody").classList.toggle("hidden");
  document.getElementById("legendToggle").classList.toggle("collapsed");
});
`;
}
/** Layout algorithm, BFS blast radius, node selection. */
function buildScriptGraphLogic() {
    return `
function layoutNodes(filter){
  var visible=filter==="all"?NODES.slice():NODES.filter(function(n){return n.cat===filter;});
  if(searchTerm)visible=visible.filter(function(n){return n.label.toLowerCase().includes(searchTerm)||n.path.toLowerCase().includes(searchTerm);});
  var groups={},positions={};
  visible.forEach(function(n){(groups[n.cat]=groups[n.cat]||[]).push(n);});
  var cols=(filter==="all"?CAT_ORDER:[filter]).filter(function(c){return groups[c];});
  cols.forEach(function(cat,ci){(groups[cat]||[]).forEach(function(n,ri){positions[n.id]={x:PAD_X+ci*COL_GAP,y:PAD_Y+ri*ROW_GAP};});});
  return{positions:positions,visible:visible,cols:cols};
}
function bfsRadius(startId,maxDepth){
  var visited=new Set([startId]),frontier=[startId];
  for(var d=0;d<maxDepth;d++){
    var next=[];
    frontier.forEach(function(nid){
      var node=nodeMap[nid];
      if(node)(node.imports||[]).forEach(function(t){if(!visited.has(t)){visited.add(t);next.push(t);}});
      (reverseDeps[nid]||[]).forEach(function(s){if(!visited.has(s)){visited.add(s);next.push(s);}});
    });
    frontier=next;if(frontier.length===0)break;
  }
  return visited;
}
function selectNode(id){selectedNode=id;render();}
`;
}
/** Detail panel builder — populates the right sidebar on node click. */
function buildScriptDetailPanel() {
    return `
function buildDetail(node){
  var panel=document.getElementById("detailPanel");panel.innerHTML="";panel.classList.add("open");
  var color=COLORS[node.cat]||"#94a3b8";
  var deps=(node.imports||[]).map(function(i){return nodeMap[i];}).filter(Boolean);
  var consumers=(reverseDeps[node.id]||[]).map(function(i){return nodeMap[i];}).filter(Boolean);
  var radius=bfsRadius(node.id,2);
  var inner=document.createElement("div");inner.className="dp-inner";
  var h2=document.createElement("div");h2.className="dp-title";h2.style.color=color;h2.textContent=node.label;inner.appendChild(h2);
  var fp=document.createElement("div");fp.className="dp-path";fp.textContent=node.path;inner.appendChild(fp);
  var badges=document.createElement("div");badges.className="dp-badges";
  function addBadge(t,bg,fg){var s=document.createElement("span");s.className="dp-badge";s.textContent=t;s.style.background=bg;s.style.color=fg;badges.appendChild(s);}
  addBadge(CAT_LABELS[node.cat]||node.cat,color+"22",color);
  addBadge(node.language,"rgba(255,255,255,0.06)","#94a3b8");
  if(node.isTest)addBadge("test","rgba(34,211,238,0.12)","#22d3ee");
  inner.appendChild(badges);
  var sg=document.createElement("div");sg.className="dp-stats";
  function addStat(l,v){var el=document.createElement("div");el.className="dp-stat";el.innerHTML='<div class="dp-stat-label">'+l+'</div><div class="dp-stat-value">'+v+'</div>';sg.appendChild(el);}
  addStat("Lines",node.lines);addStat("Functions",node.functions);addStat("Imports",deps.length);
  addStat("Imported by",consumers.length);addStat("Blast radius",radius.size);
  if(node.classes>0)addStat("Classes",node.classes);if(node.types>0)addStat("Types",node.types);
  inner.appendChild(sg);
  function addDepSection(title,items){
    if(!items.length)return;
    var st=document.createElement("div");st.className="dp-section-title";st.textContent=title;inner.appendChild(st);
    items.forEach(function(d){
      var li=document.createElement("div");li.className="dp-dep-item";
      li.addEventListener("click",function(){selectNode(d.id);});
      var dot=document.createElement("div");dot.className="dp-dep-dot";dot.style.background=COLORS[d.cat]||"#94a3b8";
      li.appendChild(dot);li.appendChild(document.createTextNode(d.label));inner.appendChild(li);
    });
  }
  addDepSection("Imports",deps);addDepSection("Imported by",consumers);
  if(consumers.length>=5){
    var sev=consumers.length>=10?"critical":"warn";
    var fc={warn:["rgba(251,191,36,0.08)","rgba(251,191,36,0.2)","#fbbf24"],critical:["rgba(239,68,68,0.08)","rgba(239,68,68,0.2)","#ef4444"]}[sev];
    var ft=document.createElement("div");ft.className="dp-section-title";ft.textContent="Review Notes";ft.style.marginTop="20px";inner.appendChild(ft);
    var fl=document.createElement("div");fl.className="dp-flag";fl.style.cssText="background:"+fc[0]+";border:1px solid "+fc[1]+";color:"+fc[2];
    fl.textContent="High fan-in: "+consumers.length+" files depend on this"+(sev==="critical"?" — changes here have wide blast radius":"");inner.appendChild(fl);
  }
  if(deps.length===0&&consumers.length===0){
    var ft2=document.createElement("div");ft2.className="dp-section-title";ft2.textContent="Review Notes";ft2.style.marginTop="20px";inner.appendChild(ft2);
    var fl2=document.createElement("div");fl2.className="dp-flag";fl2.style.cssText="background:rgba(100,116,139,0.08);border:1px solid rgba(100,116,139,0.2);color:#64748b";
    fl2.textContent="Isolated file — no import relationships detected";inner.appendChild(fl2);
  }
  panel.appendChild(inner);
}
`;
}
/** Main render loop — draws nodes, column headers, and canvas edges. */
function buildScriptRender() {
    return `
function render(){
  var layout=layoutNodes(currentFilter),positions=layout.positions,visible=layout.visible,cols=layout.cols;
  var graphCanvas=document.getElementById("graphCanvas");
  var connectedSet=selectedNode?bfsRadius(selectedNode,1):null;
  graphCanvas.innerHTML="";
  cols.forEach(function(cat,ci){
    var color=COLORS[cat]||"#94a3b8";
    var hdr=document.createElement("div");hdr.className="col-header";
    hdr.style.cssText="left:"+(PAD_X+ci*COL_GAP)+"px;top:16px;color:"+color;hdr.textContent=CAT_LABELS[cat]||cat;graphCanvas.appendChild(hdr);
    var line=document.createElement("div");line.className="col-line";
    line.style.cssText="left:"+(PAD_X+ci*COL_GAP)+"px;top:36px;width:"+NODE_W+"px;background:"+color;graphCanvas.appendChild(line);
  });
  visible.forEach(function(n){
    var pos=positions[n.id];if(!pos)return;
    var color=COLORS[n.cat]||"#94a3b8",el=document.createElement("div");el.className="node";
    if(selectedNode===n.id)el.classList.add("selected");
    if(connectedSet&&!connectedSet.has(n.id))el.classList.add("dimmed");
    el.style.cssText="left:"+pos.x+"px;top:"+pos.y+"px;background:"+color+"14;border-color:"+(selectedNode===n.id?color:color+"33")+";color:#e2e8f0";
    var dot=document.createElement("div");dot.className="dot";dot.style.background=color;el.appendChild(dot);
    var lbl=document.createElement("div");lbl.className="lbl";lbl.textContent=n.label;lbl.title=n.path;el.appendChild(lbl);
    el.addEventListener("click",function(e){e.stopPropagation();selectedNode=n.id;buildDetail(n);render();});
    graphCanvas.appendChild(el);
  });
  var maxX=0,maxY=0;
  Object.values(positions).forEach(function(p){if(p.x+NODE_W>maxX)maxX=p.x+NODE_W;if(p.y+NODE_H>maxY)maxY=p.y+NODE_H;});
  maxX+=PAD_X+40;maxY+=PAD_Y+40;
  graphCanvas.style.width=maxX+"px";graphCanvas.style.height=maxY+"px";
  graphCanvas.style.transform="scale("+zoom+")";graphCanvas.style.transformOrigin="0 0";
  var canvas=document.getElementById("edgeCanvas"),dpr=window.devicePixelRatio||1;
  canvas.width=maxX*zoom*dpr;canvas.height=maxY*zoom*dpr;
  canvas.style.width=maxX*zoom+"px";canvas.style.height=maxY*zoom+"px";
  var ctx=canvas.getContext("2d");ctx.scale(dpr*zoom,dpr*zoom);ctx.clearRect(0,0,maxX,maxY);
  EDGES.forEach(function(e){
    var s=positions[e.source],t=positions[e.target];if(!s||!t)return;
    var hl=selectedNode&&(e.source===selectedNode||e.target===selectedNode);
    if(connectedSet&&!hl){ctx.strokeStyle="rgba(255,255,255,0.03)";ctx.lineWidth=1;}
    else if(hl){ctx.strokeStyle="rgba(243,112,41,0.55)";ctx.lineWidth=2.5;}
    else{ctx.strokeStyle="rgba(255,255,255,0.06)";ctx.lineWidth=1.2;}
    var sx=s.x+NODE_W/2,sy=s.y+NODE_H/2,tx=t.x+NODE_W/2,ty=t.y+NODE_H/2,dx=tx-sx;
    ctx.beginPath();ctx.moveTo(sx,sy);ctx.bezierCurveTo(sx+dx*0.4,sy,sx+dx*0.6,ty,tx,ty);ctx.stroke();
  });
}
document.getElementById("graphPanel").addEventListener("click",function(e){
  if(e.target===document.getElementById("graphPanel")||e.target===document.getElementById("edgeCanvas")){
    selectedNode=null;document.getElementById("detailPanel").classList.remove("open");render();
  }
});
render();
`;
}
/** Concatenates all JS sections into the final inline script. */
function buildScript(nodes, catsPresent) {
    return [
        buildScriptData(nodes, catsPresent),
        buildScriptControls(),
        buildScriptGraphLogic(),
        buildScriptDetailPanel(),
        buildScriptRender(),
    ].join("\n");
}
//# sourceMappingURL=html-template.js.map