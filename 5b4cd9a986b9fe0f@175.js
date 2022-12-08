// https://observablehq.com/@mbostock/comma-separated-tree@175
function _1(md){return(
md`# Comma-Separated Tree

You’ve heard of [comma-separated values (CSV)](https://en.wikipedia.org/wiki/Comma-separated_values)? Well, a comma-separated tree (CST) is similar, with indentation to determine the hierarchy. This gives you a hierarchical data format with the convenience and readability of CSV!

For some real-world examples, see [Tree-o-Matic](/@mbostock/tree-o-matic) and [Treemap-o-Matic](/@mbostock/treemap-o-matic).

Let’s try it out:`
)}

function _source(editor){return(
editor(`World
 Asia
  China,1409517397
  India,1339180127
  Indonesia,263991379
  Pakistan,197015955
  Bangladesh,164669751
  Japan,127484450
  Philippines,104918090
  Vietnam,95540800
 Europe
  Russia,143989754
  Germany,82114224
 Americas
  United States,324459463,#333
  Brazil,209288278
  Mexico,129163276
 Africa
  Nigeria,190886311
  Ethiopia,104957438
  Egypt,97553151`)
)}

function _3(md){return(
md`Each line in the textarea above represents a node in the tree. The depth of the node is determined by the number of leading spaces (the indentation): the root node has depth zero; its direct children have depth one; their children have depth two, and so on. The parent of each node is the closest preceding node with lesser depth.

The fields associated which each node are separated by commas. In this example, the first field is the *name*, the second field is the (optional) *value*, and the third field is the (optional) *color*. But you can use whatever fields you like in your CST.`
)}

function _4(cstParseRows,source){return(
cstParseRows(source)
)}

function _5(md){return(
md`The *cstParseRows* function returns the root *node* for the given *string*. Each *node* is an array of field values, corresponding to the comma-separated values in the input. If the *node* has children, *node*.children is the array of child nodes. If you like, you can specify a *row* function to convert this array of fields for each node into an object.`
)}

function _6(cstParseRows,source){return(
cstParseRows(source, ([name, value, color = "#ddd"]) => ({
  name, 
  value: value === undefined ? undefined : +value, 
  color
}))
)}

function _7(md){return(
md`Alternatively, just as with CSV, you can have a header row that specifies the names of the fields you expect on each node.`
)}

function _sourceWithHeader(editor){return(
editor(`name,value,color
World
 Asia
  China,1409517397
  India,1339180127
  Indonesia,263991379
  Pakistan,197015955
  Bangladesh,164669751
  Japan,127484450
  Philippines,104918090
  Vietnam,95540800
 Europe
  Russia,143989754
  Germany,82114224
 Americas
  United States,324459463,#333
  Brazil,209288278
  Mexico,129163276
 Africa
  Nigeria,190886311
  Ethiopia,104957438
  Egypt,97553151`)
)}

function _9(cstParse,sourceWithHeader){return(
cstParse(sourceWithHeader)
)}

function _10(md){return(
md`## Handling ambiguity

One of the trade-offs in this design is to favor a valid representation, even if ambiguous, over syntax errors. (If you prefer more explicit syntax, try a different hierarchical format such as YAML and JSON.) Missing commas or quotes are treated identically to comma-separated values.

For nonsensical indentation, missing parents are ignored. Below, the children *foo* and *bar* are each indented with two spaces (level 2), but there is no intermediate parent (at level 1) between them and the *root*. Thus, both *foo* and *bar* are treated as direct children of *root*.`
)}

function _malformed1(editor){return(
editor(`root
  foo
  bar`)
)}

function _12(cstParseRows,malformed1){return(
cstParseRows(malformed1)
)}

function _13(md){return(
md`If later a parent is introduced at level 1, such as *baz* below, then an immediately following node at level 2 would be a child of *baz* (like normal), rather than a child of *root* and a sibling of *foo* and *bar*.`
)}

function _malformed2(editor){return(
editor(`root
  foo
  bar
 baz
  quux`)
)}

function _15(cstParseRows,malformed2){return(
cstParseRows(malformed2)
)}

function _16(md){return(
md`---

## Appendix

Here’s the implementation of the parser. It’s available on npm and GitHub as [cstree](https://github.com/mbostock/cstree) under the ISC license.`
)}

function _cstParse(d3,objectConverter,cstParseLines){return(
function cstParse(text, row = object => object) {
  const lines = text.trim().split(/^/gm);
  const [columns] = d3.csvParseRows(lines.shift());
  const object = objectConverter(columns);
  return cstParseLines(lines, (array, i) => row(object(array), i));
}
)}

function _cstParseRows(cstParseLines){return(
function cstParseRows(text, row = array => array) {
  return cstParseLines(text.trim().split(/^/gm), row);
}
)}

function _cstParseLines(d3){return(
function cstParseLines(lines, row) {
  const parents = [];
  let index = -1;
  parents.push({children: []});
  for (let line of lines) {
    const depth = line.match(/^\s*/)[0].length;
    if (depth === line.length) continue; // Skip empty rows.
    line = line.slice(depth); // Trim indentation.
    const value = row(d3.csvParseRows(line)[0], ++index);
    if (value == null) continue; // Filter.
    let parent;
    for (let i = depth; !(parent = parents[i]); --i); // Search for parent.
    if (!parent.children) parent.children = [];
    parent.children.push(parents[depth + 1] = value);
  }
  return parents[0].children.length === 1 ? parents[0].children[0] : parents[0];
}
)}

function _objectConverter(){return(
function objectConverter(columns) {
  return new Function("d", `return {${columns.map((name, i) => {
    return `${JSON.stringify(name)}: d[${i}]`;
  }).join()}}`);
}
)}

function _editor(){return(
function editor(value) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.display = "block";
  textarea.style.boxSizing = "border-box";
  textarea.style.width = "calc(100% + 28px)";
  textarea.style.font = "var(--monospace-font, var(--mono_fonts))";
  textarea.style.minHeight = "60px";
  textarea.style.border = "none";
  textarea.style.padding = "4px 10px";
  textarea.style.margin = "0 -14px";
  textarea.style.background = "rgb(247,247,249)";
  textarea.style.tabSize = 2;
  textarea.style.resize = "none";
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
  textarea.oninput = () => textarea.style.height = `${textarea.value.match(/^/gm).length * 21 + 8}px`;
  textarea.oninput();
  return textarea;
}
)}

function _d3(require){return(
require("d3-dsv@1")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof source")).define("viewof source", ["editor"], _source);
  main.variable(observer("source")).define("source", ["Generators", "viewof source"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["cstParseRows","source"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["cstParseRows","source"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("viewof sourceWithHeader")).define("viewof sourceWithHeader", ["editor"], _sourceWithHeader);
  main.variable(observer("sourceWithHeader")).define("sourceWithHeader", ["Generators", "viewof sourceWithHeader"], (G, _) => G.input(_));
  main.variable(observer()).define(["cstParse","sourceWithHeader"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("viewof malformed1")).define("viewof malformed1", ["editor"], _malformed1);
  main.variable(observer("malformed1")).define("malformed1", ["Generators", "viewof malformed1"], (G, _) => G.input(_));
  main.variable(observer()).define(["cstParseRows","malformed1"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("viewof malformed2")).define("viewof malformed2", ["editor"], _malformed2);
  main.variable(observer("malformed2")).define("malformed2", ["Generators", "viewof malformed2"], (G, _) => G.input(_));
  main.variable(observer()).define(["cstParseRows","malformed2"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("cstParse")).define("cstParse", ["d3","objectConverter","cstParseLines"], _cstParse);
  main.variable(observer("cstParseRows")).define("cstParseRows", ["cstParseLines"], _cstParseRows);
  main.variable(observer("cstParseLines")).define("cstParseLines", ["d3"], _cstParseLines);
  main.variable(observer("objectConverter")).define("objectConverter", _objectConverter);
  main.variable(observer("editor")).define("editor", _editor);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
