import Vue from 'vue';

const has = {
  install(Vue) {
    Vue.directive('has', {
      //ele：为绑定的元素标签    bindings：绑定相关的信息
      // 当被绑定的元素插入到 DOM 中时…
      inserted(ele, bindings) {
        let hasPemission = false;
        const menuId = sessionStorage.getItem('COMMIN_MENU_ID');
        const BtnData = JSON.parse(sessionStorage.getItem('COMMIN_MENU_BTN'));
        if (menuId && BtnData) {
          let permissions = []
          permissions = BtnData[menuId].map(ele => ele.component);
          hasPemission = permissions.includes(bindings.value)
        }
        //bindings.expression为使用按钮的标识
        if (!hasPemission) { //页面中默认三个按钮都展示，没有相应权限时，删除此按钮
          // ele.parentNode.removeChild(ele) 会报错，找不到节点，因为bind函数执行的时候，页面节点还没有完全挂载完,利用宏任务解决：
          setTimeout(() => {
            ele.parentNode.removeChild(ele)
          }, 0)
        }

      }
    })
  }
}
export default has;
