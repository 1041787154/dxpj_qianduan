// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'lib-flexible/flexible'

import 'element-ui/lib/theme-chalk/index.css';
//import dialog_redLine from '@/components/dialog_redLine'
if(location.hostname ==='202.206.249.16'){
	axios.defaults.baseURL = process.env.API_PATH_DEV
}else if(location.hostname ==='localhost'){
	axios.defaults.baseURL = process.env.API_PATH_DEV
}else if(location.hostname ==='202.206.249.16'){
	axios.defaults.baseURL = process.env.API_PATH_TEST
}else if(location.hostname ==='202.206.249.16'){
	axios.defaults.baseURL = process.env.API_PATH_PROD
}


Vue.use(ElementUI);


Vue.config.productionTip = false

Vue.prototype.$ajax = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
//const loading={
//  install:function(Vue){
//      Vue.component('loading',dialog_redLine)
//  }  //'Loading'这就是后面可以使用的组件的名字，install是默认的一个方法
//};
//export default loading;
//Vue.use(loading);
