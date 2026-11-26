/* =========================================================
   试卷清单（加新试卷只改这里）
   1. 把新试卷的数据文件放到 data/ 里，例如 data/H11005.js
   2. 在下面的列表里加上它的编号，例如 ['H11004', 'H11005']
   网页和检查工具都会按这个顺序读取。
   ========================================================= */
HSK.manifest = ['H11004'];

(function () {
  for (var i = 0; i < HSK.manifest.length; i++) {
    document.write('<script src="data/' + encodeURIComponent(HSK.manifest[i]) + '.js"><\/script>');
  }
})();
