import Vue from "vue"

//v-back-top
Vue.directive("back-top",{
    inserted(el,binding,vnode){
        //console.log(el,binding)
        let event_type = binding.arg || "click";
        el.addEventListener(event_type,()=>{
            document.documentElement.scrollTop = 0;
        })
    }
});