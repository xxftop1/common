（new ExcelJS.Workbook().xlsx.load(buffer)).then(workbook=>{
  // 获取excel的第一页的数据
  const ws = workbook.getWorksheet(1);
  // 获取每一行的数据
  const data = ws.getRows(1, ws.actualRowCount);
})


// 渲染页面
import { HotTable } from "@handsontable/vue";
<hot-table  :settings="hotSettings"></hot-table>
hotSettings = {
  language: "zh-CN",
  readOnly: true,
  data: this.data,
  cell: this.cell,
  mergeCells: this.merge,
  colHeaders: true,
  rowHeaders: true,
  height: "calc(100vh - 107px)",
  // contextMenu: true,
  // manualRowMove: true,
  // 关闭外部点击取消选中时间的行为
  outsideClickDeselects: false,
  // fillHandle: {
  //   direction: 'vertical',
  //   autoInsertRow: true
  // },
  // afterSelectionEnd: this.afterSelectionEnd,
  // bindRowsWithHeaders: 'strict',
  licenseKey: "non-commercial-and-evaluation"
}