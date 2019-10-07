<!--@description: 用户首次打开云创办公系统页面
	@author: 刘钰
    @update: 刘钰(2019-05-09 10:17) -->
<template>
    <div id="home">
		<!-- 视频背景 fixed固定页面 -->
        <video autoplay loop poster="" id="bgvid">  
            <source src="" type="video/mp4">  
        </video>
		<!-- 内容主页 -->
        <div class="homepage">
			<div class="logo">
				<!-- 云创logo -->
				<img src="./images/login_logo.png" alt="">
			</div>
			<ul class="clear">
				<router-link to = "/register" tag="li" >新用户注册</router-link>
				<li @click="toLogin()" tag="li" >登录</li>
			</ul>
			<div class="foot">
				<foot></foot>
			</div>
		</div>
	</div>  
</template>

<script>
import foot from "./publics/foot.vue";
export default {
    components: {
		foot
	},
	data(){
		return{
			isLogin:{
				default:true,
				type:Boolean
			},
			messageCode:true,					
		}
	},
	methods:{
		toLogin(){
			this.$router.push({
				name:"login",
				path:"/login",
				query:{ 
					id:this.messageCode
				},
			})
		}
	},
}
</script>
<style lang="scss" scoped>
    #home{
		padding-top: 300px;
		font-size:18px;
        video#bgvid {   
                position: fixed; 
				right: 0; 
				bottom: 0;  
                z-index: -100;  
                min-width: 100%; 
                min-height: 100%;  
				width: auto; 
				height: auto;  
				background: url('./images/bg.png') no-repeat 100% 100%;
				background-size: cover;
                // background: url(polina.jpg) no-repeat cover;  
		}
		.homepage{
			.logo{
				width: 280px;
				height:92px;
				margin:0px auto;
				// border:1px solid #bbb;
				img{
					// width: 280px;
					height: 82px
				}
			}
			ul{
				width:412px;
				margin:44px auto;
				// border:1px solid #eee;
				text-align: center;
				li:first-child{
					float:left;
					margin-right:30px;
					width:176px;
					height:50px;
					line-height: 50px;
					border:1px solid #4278BE;
					color:#4278BE;
					cursor: pointer;
				}
				li:last-child{
					float:left;
					margin-right:30px;
					width:176px;
					height:50px;
					line-height: 50px;
					background:#4278BE;
					border:1px solid #4278BE;
					color:#fff;
					cursor: pointer;
				}
				li.active{
					background:#4278BE;
					color:#fff;
				}
				li:nth-child(1){
					
				}
				li:nth-child(2){
					
				}
			

			}
			.foot{
				position: fixed;
				bottom: 152px;
				text-align: center;
			}
		}  


       
    }
</style>