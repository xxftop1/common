import {
  removeUserInfo,
  setUserInfo
} from '../sdk/cookie';
import {
  postRequest,
  getRequest
} from '../api/network';
import api from "../sdk/api"
/**
 * 
 * @param {vuex实例} store 
 * @param {qiankun下发的props} props 
 * @param {vue-router实例} router
 * @param {Function} resetRouter - 重置路由方法 暂时不用
 */
function registerGlobalModule(store, props = {}, router = {}) {

  if (!store || !store.hasModule) {
    return;
  }

  // 获取初始化的state
  const initState = props.getGlobalState && props.getGlobalState() || {
    menu: [], //有权限的菜单
    app: [], //子应用
    user: {},
    tabs: [], //底部菜单栏
    activeTab: {} //激活tab
  };

  // 将父应用的数据存储到子应用中，命名空间固定为global
  if (!store.hasModule('global')) {
    const globalModule = {
      namespaced: true,
      state: initState,
      actions: {
        // 子应用改变state并通知父应用
        setGlobalState({
          commit
        }, payload) {
          commit('setGlobalState', payload);
          commit('emitGlobalState', payload);
        },
        // 初始化，只用于mount时同步父应用的数据
        initGlobalState({
          commit
        }, payload) {
          commit('setGlobalState', payload);
        },

        // 登录
        async login({
          commit,
          dispatch
        }, params) {
          const res = await postRequest(api.Login, params);
          if (res && res.data.code === 200) {
            const {
              token,
              userInfo,
              permissionList
            } = res.data.data;
            let data = {
              ...userInfo,
              token
            }
            localStorage.setItem('COMMIN_USER', JSON.stringify(data))
            localStorage.setItem('COMMIN_APP', JSON.stringify(permissionList))
            setUserInfo(JSON.stringify(data), {
              path: '/',
              domain: window.location.hostname
            })
            commit('setUser', data);
            commit('setApp', permissionList);
            dispatch('setGlobalState')
          }
          return Promise.resolve(res);
        },

        /**
         * 获取有权限的菜单
         * @param {*} param0 
         * @param {*} params 
         */
        async getMenu({
          commit,
          dispatch
        }, id) {
          const res = await getRequest(api.UserPermission + `?id=${id}`);
          const {
            code,
            data
          } = res.data;
          if (res && code === 200) {
            localStorage.setItem('COMMIN_MENU', JSON.stringify(data))
            commit('setMenu', data);
            dispatch('setGlobalState')
          }
          //主应用设置到store
          return Promise.resolve(res);
        },


        // 登出
        async logout({
          commit,
          dispatch
        }) {
          try {
            const res = await getRequest(api.Logout);
            const {
              code
            } = res.data;
            if (code && code === 200) {
              removeUserInfo();
              commit('setUser')
              commit('setMenu')
              commit('setApp')
              dispatch('setGlobalState')
              //单独运行
              if (router) {
                router && router.replace && router.replace({
                  name: 'Login'
                })
              } else {
                window.history.replaceState(null, '', '/login')
              }
            }
          } catch (error) {
            console.log(error);
          }
        },

        setActiveTab({
          commit,
          dispatch
        }, tab) {
          commit('setActiveTab', tab);
          dispatch('setGlobalState')
        },

        addTab({
          state,
          commit,
          dispatch
        }, tab) {
          state.tabs.push(tab);
          commit('setActiveTab', tab);
          commit('setTabs', state.tabs);
          dispatch('setGlobalState')
        },
        /**
         *  移出底部菜单
         */
        removeTab({
          state,
          commit,
          dispatch
        }, id) {
          if (typeof id !== "string") id = id.toString();
          let tabs = state.tabs;
          if (tabs.length > 0) {
            let index = tabs.findIndex((ele) => ele.path === id);
            if (index !== -1) {
              tabs.splice(index, 1);
            }
            let nextTab = tabs[index] || tabs[index + 1] || tabs[index - 1];
            commit('setActiveTab', nextTab);
            commit('setTabs', state.tabs);
            dispatch('setGlobalState');
          }
        },
      },

      mutations: {
        setGlobalState(state, payload) {
          // eslint-disable-next-line
          state = Object.assign(state, payload);
        },
        // 通知父应用
        emitGlobalState(state) {
          if (props.setGlobalState) {
            props.setGlobalState(state);
          }
        },
        setUser(state, data) {
          state.user = data || {}
        },
        setMenu(state, data) {
          state.menu = data || null
        },
        setApp(state, appName) {
          state.app = appName
        },
        setTabs(state, data) {
          state.tabs = data || [];
        },
        setActiveTab(state, data) {
          state.activeTab = data || {};
        }
      },
    };
    store.registerModule('global', globalModule);
  } else {
    // 每次mount时，都同步一次父应用数据
    store.dispatch('global/initGlobalState', initState);
  }
};

export default registerGlobalModule;
