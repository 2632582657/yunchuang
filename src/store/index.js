import Vue from "vue"
import Vuex from "vuex"
//注册vuex
Vue.use(Vuex)


//导入模块库
import model from "./model/model"

//store实例化
let store = new Vuex.Store({
    modules:{
        model,
    }
})

export default store