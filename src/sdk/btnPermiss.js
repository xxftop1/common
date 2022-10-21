import Vue from 'vue';
import store from 'xxfcommon/src/store';

const has = {
  install(Vue) {
    Vue.directive('has', {
      //ele：为绑定的元素标签    bindings：绑定相关的信息
      // 当被绑定的元素插入到 DOM 中时…
      bind(ele, bindings) {
        debugger
        let hasPemission = false;
        const prev = process.env.VUE_APP_KEYS ? process.env.VUE_APP_KEYS : "COMMON";
        const menuId = sessionStorage.getItem(prev + '-MENU-ID');
        const BtnData = JSON.parse(sessionStorage.getItem(prev + '-MENU-BTN'));
        const value = bindings.value;
        /**
         * csop 需要判断一下当前项目阶段是否已完成
         * 已完成不管是否有权限 除了查看按钮其他都不显示
         */
        let currentProjectState;
        if (window.location.pathname.includes('sub-csop')) {
          const currentProjectInfo = JSON.parse(sessionStorage.getItem(prev + '-CURRENT-PROJECTINFO'));
          const temp = sessionStorage.getItem('COMMON-CHILD-MENUURI');
          if (temp) {
            const currentProjectId = temp.split("/").pop();
            currentProjectState = currentProjectInfo[currentProjectId];
          }
        }
        if (currentProjectState && currentProjectState === '4') {
          hasPemission = false;
        } else if (!value && currentProjectState !== '4') {
          /**
           * 弹窗里的权限：阶段是未完成，权限值是空的情况默认显示
           */
          hasPemission = true;
        } else {
          if (menuId && BtnData) {
            const data = BtnData[menuId];
            if (data && data.length > 0) {
              let permissions = []
              permissions = data.map(ele => ele.component);
              if (typeof value === 'string') {
                hasPemission = permissions.includes(value)
              } else if (value instanceof Array) {
                hasPemission = permissions.some(v => value.includes(v));
              }
            }
          } else {
            /**
             * 可能有些菜单忘记动态维护权限，默认显示
             */
            hasPemission = true;
          }
        }
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
