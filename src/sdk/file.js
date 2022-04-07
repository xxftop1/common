import * as PDFJS from "pdfjs-dist/legacy/build/pdf";
// 设置pdf.worker.js文件的引入地址
PDFJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/legacy/build/pdf.worker.entry.js");
// data是一个ArrayBuffer格式，也是一个buffer流的数据
PDFJS.getDocument(data).promise.then(pdfDoc=>{
    const numPages = pdfDoc.numPages; // pdf的总页数
    // 获取第1页的数据
    pdfDoc.getPage(1).then(page =>{
     // 设置canvas相关的属性
     const canvas = document.getElementById("the_canvas");
     const ctx = canvas.getContext("2d");
     const dpr = window.devicePixelRatio || 1;
     const bsr =
       ctx.webkitBackingStorePixelRatio ||
       ctx.mozBackingStorePixelRatio ||
       ctx.msBackingStorePixelRatio ||
       ctx.oBackingStorePixelRatio ||
       ctx.backingStorePixelRatio ||
       1;
     const ratio = dpr / bsr;
     const viewport = page.getViewport({ scale: 1 });
     canvas.width = viewport.width * ratio;
     canvas.height = viewport.height * ratio;
     canvas.style.width = viewport.width + "px";
     canvas.style.height = viewport.height + "px";
     ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
     const renderContext = {
       canvasContext: ctx,
       viewport: viewport,
     };
     // 数据渲染到canvas画布上
     page.render(renderContext);
    })
})