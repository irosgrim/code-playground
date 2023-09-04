const page = (html = "", css = "", js = "") => {
    return `
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My experiment</title>
        <style>
        ${css}
        </style>
    </head>
    <body>
        ${html}
        <script>
        ${js}
        </script>
    </body>
    </html>
`;
};

let t;
const debounce = (cb, ms = 500) => {
    clearTimeout(t);
    t = setTimeout(cb, ms);
}

document.addEventListener("DOMContentLoaded", () => {
  const preview = document.getElementById("preview");
  const resizer = document.getElementById("resizer");
  const mainContainer = document.getElementById("main");
  const left = document.getElementById("editors");
  const right = document.getElementById("preview-wrapper");
  const previewSize = document.getElementById("preview-size");

  const htmlEditor = CodeMirror(document.querySelector('#html'), {
    lineNumbers: true,
    tabSize: 2,
    value: "",
    mode: "text/html",
    theme: "mdn-like",
    autoCloseTags: true,
    autoCloseBrackets: true,
  });

  const cssEditor = CodeMirror(document.querySelector('#css'), {
    lineNumbers: true,
    tabSize: 2,
    value: "",
    mode: "css",
    theme: "mdn-like",
    autoCloseBrackets: true,
  });

  const jsEditor = CodeMirror(document.querySelector('#js'), {
    lineNumbers: true,
    tabSize: 2,
    value: "",
    mode: "javascript",
    theme: "mdn-like",
    autoCloseBrackets: true,
  });

  [htmlEditor, cssEditor, jsEditor].forEach((editor, index) => {
      const modes = ['html', 'css', 'js'];
      editor.on("keyup", () => {
          const currentEditor = modes[index];
          const debounceAmount = {
              html: 1000,
              css: 1000,
              js: 3000,
          };
          const out = page(htmlEditor.getValue(), cssEditor.getValue(), jsEditor.getValue());
          debounce(() => {
              preview.src = "data:text/html;charset=utf-8," + encodeURIComponent(out);
          }, debounceAmount[currentEditor]);
      });
  });

  let isHorizontalResize = false;

  const handleMouseMove = (event, parentElement, leftElement, middleElement, rightElement) => {
    if (isHorizontalResize) {
      const leftWidth = event.clientX - parentElement.offsetLeft;
      const rightWidth = parentElement.offsetWidth - leftWidth - middleElement.offsetWidth;

      leftElement.style.flexGrow = 0;
      leftElement.style.width = `${leftWidth}px`;

      rightElement.style.flexGrow = 0;
      rightElement.style.width = `${rightWidth}px`;
      previewSize.innerText = `${rightWidth}px`;
    }
  };

  const mouseMoveFunction = (e) => handleMouseMove(e, mainContainer, left, resizer, right);
  const mouseUpFunction = () => {
    isHorizontalResize = false;
    previewSize.classList.add("hidden");
    document.removeEventListener("mousemove", mouseMoveFunction);
    document.removeEventListener("mouseup", mouseUpFunction);
  };

  resizer.addEventListener("mousedown", (event) => {
    isHorizontalResize = true;
    previewSize.classList.remove("hidden");
    document.addEventListener("mousemove", mouseMoveFunction);
    document.addEventListener("mouseup", mouseUpFunction);
  });

});