// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import Vuex from 'vuex'
import store from './vuex/store'
Vue.use(Vuex);
Vue.use(infiniteScroll);  //全局注册使用

Vue.config.productionTip = false

Vue.use(VueLazyload,{
	loading:"/static/img/loading-svg/loading-balls.svg"
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
