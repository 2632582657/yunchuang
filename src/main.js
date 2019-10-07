// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import AppBreadcrumb from './components/commons/appBreadcrumd.vue'
import clickOutSide from './directive/directive'


//注册面包屑为全局组件
Vue.component('AppBreadcrumb', AppBreadcrumb)
//引入axios模块
import axios from "axios"
// axios.defaults.baseURL= 'http://api.ycteam.work';
// axios.defaults.baseURL= 'http://192.168.50.64:8013'
// axios.defaults.baseURL= 'http://192.168.10.12:8012'  //测试服务器
// axios.defaults.baseURL= 'http://192.168.50.193:8012';//董浩宇
// axios.defaults.baseURL= 'http://192.168.50.64:8013';//王璐秋
// axios.defaults.baseURL= 'http://192.168.50.102:7006';//于任伟
// axios.defaults.baseURL= 'http://192.168.75.1:7005';//王佳翌
axios.defaults.baseURL= 'http://192.168.10.12:7003';//开发
// axios.defaults.baseURL= 'http://192.168.50.192:7003';//测试地址
// axios.defaults.baseURL= 'http://180.76.51.213:7003';//生产
// axios.defaults.baseURL= 'http://192.168.50.64:8012';
// axios.defaults.baseURL= 'http://192.168.10.12:8012';




axios.defaults.headers.post['Content-Type'] = "application/json";
axios.defaults.headers['Sign'] = "";//签名
axios.defaults.headers['Platform'] = "H5";//请求头确认当前平台
axios.defaults.headers['Timestamp'] = new Date().getTime();//请求头确认当前平台
axios.defaults.headers['Device'] = "";
// axios.defaults.headers['userId'] = "1565684389080161";
Vue.prototype.$http = axios;

// axios.defaults.timeout = 5000; // 超时时间


// http request 拦截器
axios.interceptors.request.use(
   	config => {
		if (sessionStorage.getItem('token')) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
			config.headers.common['Access_Token'] = sessionStorage.getItem('token');
		}
		return config;
   	},
   	err => {
       return Promise.reject(err);
   	});

// http response 拦截器
axios.interceptors.response.use(
	function (response) {
		if (response.data.sysCode === 500100104 || response.data.sysCode === 500100101) {
			window.sessionStorage.removeItem('token'); // 删除已经失效或过期的token（不删除也可以，因为登录后覆盖）
			router.replace({
				path: '/homePage' // 到登录页重新获取token
			})
		} else if (response.data.token) { // 判断token是否存在，如果存在说明需要更新token
			window.sessionStorage.token = res.data.data.token; // 覆盖原来的token(默认一天刷新一次)
		}
		return response;
	},
	error => {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					// 401 清除token信息并跳转到登录页面
					window.sessionStorage.removeItem('token');
					router.replace({
						path: '/homePage',
						query: {redirect: router.currentRoute.fullPath}
					})
			}
			if (error.response.data.sysCode === 500100104 || error.response.data.sysCode === 500100101) {
				window.sessionStorage.removeItem('token'); // 删除已经失效或过期的token（不删除也可以，因为登录后覆盖）
				router.replace({
					path: '/homePage' // 到登录页重新获取token
				})
			} else if (error.response.data.token) { // 判断token是否存在，如果存在说明需要更新token
				window.sessionStorage.token = res.data.data.token; // 覆盖原来的token(默认一天刷新一次)
			}
			return error.response;
		}
		// console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
		return Promise.reject(error)  // 返回接口返回的错误信息
	}
	);

//引入store
import store from "./store"

//引入redirective
import "./modules/directive"

//引入全局样式main.scss文件
import "./stylesheets/main.scss"

/* 当前插件：Element-Ui animate.css ECharts swiper*/
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);



//引入animate.css
import "animate.css"

//引用vue-echarts图表折线图等，在 webpack 环境下指向 components/ECharts.vue
import ECharts from 'vue-echarts'
// 注册组件后即可使用
Vue.component('v-chart', ECharts)

//引入swiper的css
import "swiper/dist/css/swiper.min.css"



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, 
  components: { App },
  template: '<App/>'
})
