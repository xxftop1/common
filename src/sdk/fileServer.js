export default {
  /**
   * 以文件流的形式下载文件
   * @param {blob对象} blob 
   */
  downloadFile(res, exportLoading) {

    let name = res.headers['content-disposition'];
    let fileName = '';
    if (name && name.indexOf('filename') > -1) {
      fileName = decodeURI(name.split(';')[1].split('filename=')[1]);
    } else {
      fileName = Date.now();
    }
    const content = res.data
    const blob = new Blob([content]) // 构造一个blob对象来处理数据
    let url = window.URL.createObjectURL(blob)
    if ('download' in document.createElement('a')) {
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName);
      document.body.appendChild(link)
      link.click();
      URL.revokeObjectURL(link.href) // 释放url
      document.body.removeChild(link) // 释放标签
      exportLoading.close();
    } else {
      navigator.msSaveBlob(blob, fileName);
      exportLoading.close();
    }
  },
}
