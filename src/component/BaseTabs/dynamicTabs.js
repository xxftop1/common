/* 动态标签栏 */
import keys from "@/utils/keys";

export default {
  state: {
    currentTab: null,
    currentTabIndex: null,
    currentTabId: '',
    tabs: [],
    cacheTabs: [], // 组件缓存
    tabIndex: 0,
  },
  getters: {
    localCacheKey (state, getters, rootState) {
      return keys.dynamicTabKey + '_' + rootState.mode;
    }
  },
  mutations: {
    // 新增或更新
    addTab(state, payload) {
    
      if(typeof payload !== 'object') return;
      let len = state.tabs.length;
      if(payload.id === undefined) {
        payload.id = ++state.tabIndex + '';
      }else{
        payload.id = payload.id + '';
      }
      for (let i = 0; i < len; i++) {
        let tab = state.tabs[i];
        if (tab.id !== undefined &&
          tab.id === payload.id) {
          if(payload.title) tab.title = payload.title;
          if(payload.name) tab.name = payload.name;
          if(tab.params && !payload.params) {
            delete tab.params;
          }
          if(payload.params !== undefined) {
            // 相当于路由params属性
            tab.params = payload.params;
          }
          if(tab.query && !payload.query) {
            delete tab.query;
          }
          if(payload.query !== undefined) {
            // 相当于路由query属性
            tab.query = payload.query;
          }
          state.currentTab = tab;
          state.currentTabId = tab.id;
          state.currentTabIndex = i;
          return;
        }
      }
      state.tabs.push(payload);
      // 在router-view模式下是否缓存（for keep-alive）
      if(payload.isCache && (state.cacheTabs.indexOf(payload.name) === -1)) {
        state.cacheTabs.push(payload.name);
      }
      state.currentTab = payload;
      state.currentTabId = payload.id;
      state.currentTabIndex = len;
    },
    setCurrentTab(state, payload) {
      if(typeof payload !== 'object') return;
      state.currentTab = payload;
      state.currentTabId = payload.id;
      if(payload.index) state.currentTabIndex = payload.index;
    },
    // 本地缓存
    setLocalCache(state, key) {
      localStorage.setItem(key, JSON.stringify(state));
    },
    removeLocalCache(state, key) {
      localStorage.removeItem(key);
    },
    removeTab(state, id) {
      if(typeof id !== 'string') id = id.toString();
      let len = state.tabs.length;
      for(let i = 0 ; i < len; i++) {
        let tab = state.tabs[i];
        if(tab.id === id) {
          if (state.currentTabId === id) {
            let nextTab = state.tabs[i + 1] || state.tabs[i - 1];
            if(nextTab) {
              state.currentTab = nextTab;
              state.currentTabId = nextTab.id;
              state.currentTabIndex = i;
            }
          }
          if(tab.isCache) {
            let cacheIndex = state.cacheTabs.indexOf(tab.name);
            // 检查是否存在多个页面复用一个视图
            let deps = state.tabs.filter(v => v.name === tab.name).map(v => v.id);
            if(cacheIndex > -1 && deps.length < 2) {
              state.cacheTabs.splice(cacheIndex, 1);
            }
          }
          state.tabs.splice(i, 1);
          return;
        }
      }
    },
    // 获取本地缓存
    getLocalTabs(state, key) {
      // 先清空
      this.commit('dynamicTabs/removeAllTabs');
      let tabs = localStorage.getItem(key);
      let payload = (typeof tabs === 'string') ? JSON.parse(tabs) : null;
      if(payload) {
        state.tabs = payload.tabs;
        state.cacheTabs = payload.cacheTabs;
        state.currentTab = payload.currentTab;
        state.currentTabId = payload.currentTabId;
        state.currentTabIndex = payload.currentTabIndex;
        state.tabIndex = payload.tabIndex;
      }
    },
    // 清空内存里的记录
    removeAllTabs(state) {
      state.tabs = [];
      state.cacheTabs = [];
      state.currentTab = null;
      state.currentTabId = '';
      state.currentTabIndex = null;
      state.tabIndex = 0;
    },
  },
  actions: {
    // 添加标签页
    ADD_TAB({commit, getters}, payload) {
      if(typeof payload !== 'object') return;
      let key = getters.localCacheKey;
      commit('getLocalTabs', key); 
      commit('addTab', payload);  
      commit('setLocalCache', key);
    },
    // 移除标签页
    REMOVE_TAB({commit, getters}, tabId) {
      let key = getters.localCacheKey;
      commit('removeTab', tabId);
      commit('setLocalCache', key);
    },
  }
};
