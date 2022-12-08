// https://observablehq.com/@mbostock/tree-o-matic@331
import define1 from "./576f8943dbfbd395@114.js";
import define2 from "./5b4cd9a986b9fe0f@175.js";

function _1(md){return(
md`# Tree-o-Matic

Edit the textarea below to update the chart!`
)}

function _chart(tree,data,d3,DOM)
{
  const root = tree(data);

  const svg = d3.select(DOM.svg(500, 500))
      .style("background", "white")
      .style("font", "10px sans-serif");

  const g = svg.append("g");

  const link = g.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
  .selectAll("path")
    .data(root.links())
    .enter().append("path")
      .attr("d", d => `
        M${d.target.y},${d.target.x}
        C${d.source.y + root.dy / 2},${d.target.x}
         ${d.source.y + root.dy / 2},${d.source.x}
         ${d.source.y},${d.source.x}
      `);

  const node = g.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants().reverse())
    .enter().append("g")
      .attr("transform", d => `translate(${d.y},${d.x})`);

  node.append("circle")
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 2.5);

  node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -6 : 6)
      .text(d => d.data.name)
    .filter(d => d.children)
      .attr("text-anchor", "end")
    .clone(true).lower()
      .attr("stroke", "white");

  document.body.appendChild(svg.node());

  const {x, y, width, height} = g.node().getBBox();

  svg.remove()
      .style("max-width", "100%")
      .style("height", "auto")
      .attr("width", width + 10)
      .attr("height", height + 10)
      .attr("viewBox", `${x - 5} ${y - 5} ${width + 10} ${height + 10}`);

  return svg.node();
}


async function _3(html,DOM,rasterize,chart,serialize){return(
html`
${DOM.download(await rasterize(chart), null, "Download as PNG")}
${DOM.download(await serialize(chart), null, "Download as SVG")}
`
)}

function _algorithm(html){return(
html`<select>
  <option selected value="cluster">Cluster
  <option value="cluster-no-separation">Cluster (no separation)
  <option value="tree">Tree
</select>`
)}

function* _source(html)
{
  const textarea = html`<textarea>Coffee
 Tastes
  Sour
   Soury
   Winey
    Tart
    Tangy
  Sweet
  Salt
  Bitter
 Aromas
  Enzymatic
   Fruity
    Citrus
    Berry-like
  Sugar browning
   Nutty
   Carmelly
  Dry distillation`;
  textarea.style.display = "block";
  textarea.style.boxSizing = "border-box";
  textarea.style.width = "calc(100% + 28px)";
  textarea.style.font = "var(--monospace-font, var(--mono_fonts))";
  textarea.style.minHeight = "60px";
  textarea.style.border = "none";
  textarea.style.padding = "4px 10px";
  textarea.style.margin = "0 -14px";
  textarea.style.background = "#f5f5f5";
  textarea.style.tabSize = 2;
  textarea.onkeypress = event => {
    if (event.key !== "Enter" || event.shiftKey || event.altKey || event.metaKey || event.ctrlKey) return;
    let i = textarea.selectionStart;
    let j = textarea.selectionEnd;
    let v = textarea.value;
    if (i === j) {
      let k = 0;
      while (i > 0 && v[--i - 1] !== "\n");
      while (i < j && v[i] === " ") ++i, ++k;
      textarea.value = v.substring(0, j) + "\n" + new Array(k + 1).join(" ") + v.substring(j);
      textarea.selectionStart = textarea.selectionEnd = j + k + 1;
      textarea.dispatchEvent(new CustomEvent("input"));
      event.preventDefault();
    }
  };
  textarea.oninput = () => {
    textarea.style.height = "initial";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  yield textarea;
  textarea.oninput();
}


function _6(md){return(
md`Each line in the textarea above represents a node in the tree. The depth of the node is determined by the number of leading spaces (the indentation): the root node has depth zero; its direct children have depth one; their children have depth two, and so on. The parent of each node is the closest preceding node with lesser depth.`
)}

function _7(md){return(
md`---

## Appendix`
)}

function _data(cstParseRows,source){return(
cstParseRows(source, ([name]) => ({name}))
)}

function _tree(d3,width,algorithm){return(
data => {
  const root = d3.hierarchy(data);
  root.dx = 10;
  root.dy = width / (root.height + 1);
  let layout;
  switch (algorithm) {
    case "cluster": layout = d3.cluster(); break;
    case "cluster-no-separation": layout = d3.cluster().separation(() => 1); break;
    case "tree": layout = d3.tree(); break;
  }
  return layout.nodeSize([root.dx, root.dy])(root);
}
)}

function _width(){return(
954
)}

function _d3(require){return(
require("d3@6")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["tree","data","d3","DOM"], _chart);
  main.variable(observer()).define(["html","DOM","rasterize","chart","serialize"], _3);
  main.variable(observer("viewof algorithm")).define("viewof algorithm", ["html"], _algorithm);
  main.variable(observer("algorithm")).define("algorithm", ["Generators", "viewof algorithm"], (G, _) => G.input(_));
  main.variable(observer("viewof source")).define("viewof source", ["html"], _source);
  main.variable(observer("source")).define("source", ["Generators", "viewof source"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("data")).define("data", ["cstParseRows","source"], _data);
  main.variable(observer("tree")).define("tree", ["d3","width","algorithm"], _tree);
  main.variable(observer("width")).define("width", _width);
  const child1 = runtime.module(define1);
  main.import("rasterize", child1);
  main.import("serialize", child1);
  const child2 = runtime.module(define2);
  main.import("cstParseRows", child2);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
