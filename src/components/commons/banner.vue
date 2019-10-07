<template>
    <div class="swiper-container background-image" :class="banner">
        <div class="swiper-wrapper">
            <div class="swiper-slide"
                v-for="banner in banners"
                :key="banner.id"
            >
                <img :src="banner.images.small" alt="">
            </div>
        </div>
        <div class="swiper-pagination"></div>
    </div>
</template>
<script>
//引入swiper
import Swiper from "swiper"
import "swiper/dist/css/swiper.min.css"
export default {
    props:{
        isLoop:{
            default:true,
            type:Boolean
        },
        banner:{
            default:"my-banner",
            type:String
        }
    },
    data(){
        return {
            banners:[]
        }
    },
    methods:{
        getBanners(){
            //请求数据  axios  
            this.banners = res.data.subjects;
            this.$nextTick(()=>{
                new Swiper("."+this.banner,{
                    lazy:true,
                    loop:this.isLoop,
                    pagination:{
                        el:".swiper-pagination"
                    }
                })
            });

        }
    },
    created(){
       this.getBanners();
    }
}
</script>
<style lang="scss" scoped>
    .swiper-container{
        height:2.5rem;
        img{
            width:100%;
            height:2.5rem;
        }
    }
</style>
