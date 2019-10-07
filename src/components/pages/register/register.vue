<!--@description: 注册
	@author: 刘钰
    @update: 刘钰(2019-04-26 10:24) -->
<template>
    <div id="password">
        <div class="header">
            <img src="./images/Group1.png" alt="" height="47px">
        </div>
        <div class="content">

        </div>
        <div class="form">
            <el-form action="" class="form-item" >
                <div class="head">新用户注册</div>
                <region @location = "receivePhone"></region>
                <div class="hint phone" v-show="phoneTitle"> {{phoneTitle}} </div>
                <div class="hint verification" :class="changeColor ? 'active':''"> {{verificationTitle}} </div>
                <div class="hint img" v-show="imageVerification">{{imgTitle}}</div>
				<!-- 手机号 -->
                <div class="cell"> 
                    <phone class="fl phone" :phoneNumber = "areaCode"></phone>
                    <input 
                        :class='phoneChangeColor ? "redBorder": ""'
                        id='number' 
                        type='text' 
                        autocomplete="off"
                        :placeholder = placeholderNum
                        v-model = '_phoneNum' 
                        maxlength="11" 
                        size="11" 
                        @blur="checkPhone('blur', phoneNum)" 
                        @focus="checkPhone('focus', phoneNum)"
                    />
                    <div class="el-icon-check" v-show="sendPhone"></div>
                </div>
                <!-- 短信验证码 -->
                <div class="cell">
                    <input 
                        class="fl phone-code" 
                        type="text" 
                        :placeholder= placeholderMessage
                        @blur="checkMessage('blur', verificationCode)" 
                        @focus="checkMessage('focus', verificationCode)"
                        v-model.trim = "verificationCode" />
                    <input 
                        class="btn fl" 
                        type="button"  
                        v-model = "messageAuthenticationCode"
                        @click='getCodebtn'
                        :disabled = "disab"
                        />
                </div>
                <!-- 图片验证码 -->
                <div class="cell" v-show="imageVerification">
                    <div class="clear">
                        <input 
                            type="text" 
                            class="fl phone-code" 
                            :placeholder= placeholderImgCode
                            @blur="checkImgCode('blur', imgVerificationCode)" 
                            @focus="checkImgCode('focus', imgVerificationCode)"
                            v-model="imgVerificationCode" />
                        <div class="btn fl">
                            <img :src="imgVerificateCode" alt="" @click='getImgCode'>
                        </div>
                    </div>
                    <!-- <div class="hint"> <p></p></div> -->
                </div>
                <router-link class="title" :to = "{name:'login', query:{ id:messageCode} }" tag="div">已有账号，立即登录</router-link>
                <div class="save">
                    <input id='submit1' type='button'  :plain="true" value="下一步" @click="register" :disabled = "disabreg" />
                </div>  
                <div class="foot">
                    注册表示同意
                    <a 
                        v-for ="(protocol,index) in this.protocols"
                        :key="index"
                        :href="protocol.agreementLink" 
                    >
                        {{protocol.agreementName}}
                        <span>{{protocol.punctuation}}</span>
                    </a>
                </div> 
            </el-form>
        </div>
        <loginDialog :message="phoneNum" :messageDialog="dialogVisible" :flag="flag"></loginDialog>
        <messageDialog :Verificationmessage="Verificationmessage" :noticeDialog="dialogVisibles"></messageDialog>
    </div>
</template>

<script>
import region from "./publics/region.vue";
import phone from "./publics/phone.vue";
import loginDialog from '../login/publics/loginDialog'
import messageDialog from '../login/publics/messageDialog'
export default {
    components: {
        region,phone,loginDialog,messageDialog
	},
    data(){
        return {
            ssoManager:'ssoManager',
            phoneNum:"",                          //手机号
            phoneChangeColor:"",                  //手机号失去焦点边框颜色变化
            phoneTitle:"",                        //手机号提示信息
            areaCode:"86",                        //手机区号
            placeholderNum:"请输入手机号",         //手机号默认
            placeholderMessage:"请输入短信验证码", //短信验证码默认
            changeColor:false,                    //验证码底部提示颜色
            placeholderImgCode:"请输入图片验证码", //图片验证码默认
            countDownTime:60,                     //再次发送验证码间隔
            messageAuthenticationCode:"获取验证码",//验证码按钮内容
            verificationCode:"",                  //验证码用户输入内容
            verificationTitle:"",                 //验证码用户输入后提示
            imageVerification:false,              //图片验证码隐藏
			imgVerificationCode:"",               //图片验证码用户输入内容
			imgTitle:"您的账号存在风险，请输入图片验证码",//图片验证提示信息
            disab:true,                           //60S内禁止用户再次点击
            disabreg:true,                        //注册下一步禁止用户点击
            sendPhone:false,                      //手机号验证成功标志
            reg:false,                            //手机号，验证码成功标志
            time:0,                               //请求次数限制
			messageCode:true,                     //跳转登陆传参=>布尔值
            imgVerificateCode:"",   			  //图片验证码
            Timeout:"",                           //关闭延时器
            protocols:[],                         //协议
            dialogVisible:false,
            flag:false,
            dialogVisibles:false,
            Verificationmessage:'',
			rongCloudToken:''						//接收融云token
        }

    },
    watch:{
        phoneNum:function(val){
            if(val.length == 11){
                this.disab = false
                this.getPhone()
            }else {
                this.disab = true
                this.sendPhone = false
            }
        }
    },
    computed: {
        _phoneNum: {
        set: function(value) {
            this.phoneNum = value;
        },
        get: function() {
            return this.phoneNum.replace(/[^0-9]+/g,'')
        }
        }
    },
    methods: {
        //验证手机号
        checkPhone(type, value){
            this.sendPhone = false;
            this.dialogVisible = false
			// this.disab = true;
            if(type == "blur"){
                this.placeholderNum = "请输入手机号";
                if(value == ""){
                    this.phoneTitle="手机号不能为空";
                    this.phoneChangeColor = true;
                }else{
                    this.getPhone();
                }
            }else{
                this.phoneChangeColor = false;
                this.placeholderNum = "";
                this.phoneTitle = "";
            }
        },
        //验证手机号
        getPhone(){
            this.$http({
                method:"get",
                // url:"https://result.eolinker.com/7hUBFSf3c24e3ab4d7c9a88a6d8c4566a61bf0d55f38d5a?uri this.ssoManager + =/v1/user/base/phone/reg",
                url: this.ssoManager + "/v1/user/base/reg/phone",
                params:{
                    phoneNumber:this.phoneNum,
                    phoneNumberPrefix:this.areaCode,
                },
            }).then( res => {
                // console.log(res)
                if(res.data.sysCode == 200 && res.data.code == 200){
                    this.sendPhone = true;
                    this.disab = false;
                    this.phoneChangeColor = false;
                    this.verificationTitle = "";
                    this.imgTitle = "";
                    this.imageVerification = false
                    if(res.data.data.lock){
                        // this.$message.error("该手机号已锁定，请明日再试")
                        this.dialogVisibles = true
                        this.Verificationmessage = '该手机号已锁定，请明日再试'
                        this.phoneChangeColor = true;
                        this.sendPhone = false;
                    }else if(res.data.data.reg){
                        // this.$message.error("该手机号已注册，请直接登录")
                        this.dialogVisible = true,
                        this.flag = false
                        this.phoneChangeColor = true;
                        this.sendPhone = false;
                    }
                }//手机号码无效
                else if(res.data.code == 501100101){
                    this.phoneTitle = res.data.message;
                    this.phoneChangeColor = true;
                }else{
                    this.phoneTitle = res.data.message;
                    this.phoneChangeColor = true;
                }
            })
        },
        //获取区号
        receivePhone(val){
            this.areaCode = val;
        },
        //短信验证码获得失去焦点
        checkMessage(type, value){
            if(type == "blur"){
			   	this.placeholderMessage = '请输入短信验证码';
				if(this.verificationCode && this.sendPhone){
					if(!this.imageVerification){
						this.disabreg = false;
						this.reg = true;
					}else if(this.imgVerificationCode){
                        this.disabreg = false;
						this.reg = true;
                    }
				}
            }else{
               this.placeholderMessage = "" ;
               
            }
        },
        //获取图片验证码 this.$http.defaults.baseURL this.$http.defaults.baseURL +
        // "/userManag this.ssoManager + e/v1/user/base/reg/pictureCode?phoneNumberPrefix=" + this.areaCode + "&phoneNumber=" + this.phoneNum;
        getImgCode(){
            this.$http({
                method:"get",
                url: this.ssoManager + `/v1/user/base/reg/pictureCode?phoneNumberPrefix=${this.areaCode}&phoneNumber=${this.phoneNum}`,
            }).then((res) => {
                this.imgVerificateCode =  'data:image/png;base64,' + res.data.data.pictureBase64;
            })
        },
        //图片验证码获得失去焦点
        checkImgCode(type, value){
            if(type == "blur"){
                this.placeholderImgCode = '请输入图片验证码' ;
				if(this.verificationCode && this.sendPhone && this.imgVerificationCode){
					this.disabreg = false;
					this.reg = true;
				}
            }else{
                this.placeholderImgCode = "" ;
                this.imgTitle = "";
            }
        },
        //验证码
        getCodebtn:function () {
            if(this.sendPhone){
				this.changeColor = false;
                this.disab = true;
                this.Timeout = setTimeout(this.enableCodeBtn,1000);
                if(this.phoneNum && this.areaCode){
                    this.$http({
                        method:"get",
                        url: this.ssoManager + "/v1/user/base/reg/getSmsCode",
                        params:{
                            phoneNumber:this.phoneNum,
                            phoneNumberPrefix:this.areaCode,
                            pictureCode:this.imgVerificationCode,
                        },
                    }).then( res => {
                        this.verificationTitle = res.data.message;
						if(res.data.sysCode !== 200 || res.data.code !== 200){
                            this.verificationCode = "";
                            this.verificationTitle = "网络问题，校验码短信发送失败"
						}//注册成功
                        if(res.data.sysCode == 200 && res.data.code == 200){
                            this.verificationTitle = "校验码短信已发送，有效时间为5分钟，请及时查收"
                            this.changeColor = false;
                            this.imgVerificationCode = "";
                            this.countDownTime = 60
                            this.imageVerification = false
                            this.disabreg = false
						 	this.verificationTitle = "";
                        }//短信验证码错误
                        else if(res.data.code == 501101202 || res.data.code == 501101203){
                            this.verificationCode = "";
                            this.changeColor = true;
                            this.getImgCode() 
						}//需要图片验证码 
						else if(res.data.code == 501100102){
                            this.verificationTitle = "您获取验证码的次数已超过三次，请输入图片验证码"
                            this.imageVerification = true;
                            this.imgTitle = "";
							this.disabreg = true;
                            this.getImgCode()
                            this.disab = false
                            clearTimeout(this.Timeout);
                            this.messageAuthenticationCode = '获取验证码'
                            this.imgVerificateCode = this.$http.defaults.baseURL + this.ssoManager + "/v1/user/base/reg/pictureCode=" + this.areaCode + "&phoneNumber=" + this.phoneNum;
						}//图片验证码错误	
						else if(res.data.code == 501100103){
                            this.imgTitle = res.data.message
                            this.verificationTitle = "";
                            this.imgVerificationCode = "";
                            this.disab = false
                            this.countDownTime = 60
                            clearTimeout(this.Timeout);
                            this.messageAuthenticationCode = '获取验证码'
                            this.getImgCode() 
						}//提示信息手机号码已注册，引导注册/该手机号码已锁定	
						else if(res.data.code == 501101101 || res.data.code == 501101102 || res.data.code == 501101204){
                            // this.phoneTitle = res.data.message;
                            this.sendPhone = false;
                            this.verificationTitle = "";
                            // this.$message.error(res.data.message)
                            this.dialogVisibles = true
                            this.Verificationmessage = res.data.message
                        }
                        else if(res.data.code == 501102101){
                            this.verificationCode = "";
                            this.verificationTitle = "网络问题，校验码短信发送失败"
						}
						else{
                            //弹框提示短信验证码过于频繁
							this.$message.error(res.data.message)
						}
                    })
                }else{
                    return
                }                
            }
        },
        enableCodeBtn:function () {
			this.disab = true;
            if(this.countDownTime > 0) {
                this.messageAuthenticationCode = this.countDownTime + 's';
                this.Timeout = setTimeout(this.enableCodeBtn, 1000);  //1秒后再次调用自己
                this.countDownTime--;
            } else {
                this.disab=false;
                this.messageAuthenticationCode = "获取验证码";
                this.countDownTime = 60;
            }
        },
        //注册
        register(){
            if(this.reg){
                this.$http({
                    method:"post",
                    // url: this.ssoManager + "/v1/user/base/reg/regUserInfo",
                    url: this.ssoManager + "/v1/user/base/reg/regUserInfo",
                    data:{
                        phoneNumberPrefix:this.areaCode,
                        phoneNumber:this.phoneNum, 
						smsCode:this.verificationCode, 
						pictureCode:this.imgVerificationCode,              
                    },
                }).then(res => {
					if(res.data.sysCode !== 200 || res.data.code !== 200){
                        this.verificationTitle = "校验码短信发送失败"
					}//注册成功
                    if(res.data.sysCode == 200 && res.data.code == 200){
                        this.verificationCode = "";
                        this.verificationTitle = "";                        
                        this.changeColor = false;
                        var that = this;
                        this.$message({
                            message: '恭喜你，注册成功',
                            type: 'success',
                            duration:2000,
                            onClose(){
                                that.$router.push({name:'newUserPage'})
                            }
                        });
						window.sessionStorage.rongCloudToken = JSON.stringify(res.data.data.rongCloudToken)
						window.sessionStorage.functionPermissionList = JSON.stringify(res.data.data.functionPermissionList)
                        window.sessionStorage.teamEmployeeDetailVO = JSON.stringify(res.data.data.teamEmployeeDetailVO)
                        window.sessionStorage.userInfoJoinApplyRegVOList = JSON.stringify(res.data.data.userInfoJoinApplyRegVOList)
                        window.sessionStorage.token = res.data.data.token;
                    }//注册失败
                    else if(res.data.code == 501101301){
                        this.$message.error("注册失败")
                    }//需要短信验证码
                    else if(res.data.code == 501101201){
                        this.verificationCode = "请输入短信验证码"
                    }//短信验证码错误	
                    else if(res.data.code == 501101202 || res.data.code == 501101203){
						this.verificationCode = "";
                        this.verificationTitle = res.data.message;
                        // this.dialogVisible = true
                        // this.Verificationmessage = res.data.message
                        this.changeColor = true;
                        this.getImgCode();
                        this.imgVerificationCode = "";
                    }
                    //需要图片验证码 	
					else if(res.data.code == 501100102){
                        this.verificationTitle = "您的验证码错误次数已超过三次,请输入图片验证码";
						this.imgTitle = "";
						this.imageVerification = true;
                        this.disabreg = true;
                        this.disab = false
                        clearTimeout(this.Timeout);
                        this.messageAuthenticationCode = '获取验证码'
                        this.getImgCode();
					}//图片验证码错误	
					else if(res.data.code == 501100103){
						this.imgTitle = res.data.message
                        this.imgVerificationCode = "";
                        this.verificationTitle = ""
                        this.getImgCode() 
					}//提示信息手机号码已注册，引导注册
					else if(res.data.code == 501101101){
                        // this.phoneTitle = res.data.message;
                        this.sendPhone = false;
                        this.verificationTitle = "";
                        this.dialogVisible = true,
                        this.Verificationmessage = res.data.message
                        this.flag = false
                        // this.$message({
                        // message: '该手机号码已注册',
                        // type: 'warning'
                        // });
                    }
                    else if(res.data.code == 501101102){
                        // this.phoneTitle = res.data.message;
                        this.sendPhone = false;
                        this.verificationTitle = "";
                        // this.$message.error(res.data.message)
                        this.dialogVisibles = true
                        this.Verificationmessage = res.data.message
                    }
					else{
						this.$message.error(res.data.message)
					}
                    
                })                
            }
        },
        //获取协议
        getProtocol(){
            this.$http({
                method:"get",
                url: this.ssoManager + "/v1/user/base/reg/agreement"
            }).then(res => {
                this.protocols = res.data.data.regAgreementList;
                this.protocols.punctuation = ["、","和",""];
                for(var i in this.protocols){
                    this.protocols[i].punctuation = this.protocols.punctuation[i];
                }
            })
        }
    },
    mounted() {
        this.getProtocol()
    },
    beforeDestroy() {
        clearTimeout(this.Timeout)
    },
}
</script>
<style lang="scss" scoped>
// @import "../../../stylesheets/main.scss";
    #password{
        background: rgba(248, 248, 248, 1);
        height: 100%;
        ::-webkit-input-placeholder { /* Chrome/Opera/Safari */ 
			color: #BFC2CC
		}
		::-moz-placeholder { /* Firefox 19+ */  
			color: #BFC2CC
		}
		:-ms-input-placeholder { /* IE 10+ */ 
		    color: #BFC2CC
		}
		:-moz-placeholder { /* Firefox 18- */ 
		    color: #BFC2CC
		}
        .header {
            padding: 14px 50px;
            box-sizing: border-box;
            height: 80px;
            background: #fff;
            border-bottom: 2px solid #4278BE
        }
        .content {
            position:absolute;
            left:162px;
            top: 30px;
            width: 955px;
            height: 877px;
            background: url('./images/Group.png')  no-repeat 100% 100%;
        }
        .el-dialog {
            width:450px !important;
            height:180px !important;
            background:rgba(248,248,248,1);
            border-radius:3px !important;
        }
        .el-dialog__close {
            display: none;
        }
        .form{
            position:absolute; 
            top:173px;
            right:162px;
            width:472px;
            height:555px;
            background: #fff;
            box-shadow:5px 5px 27px 0px rgba(63,72,82,0.2);
            // margin:-250px 0 0 -300px;            
            border-radius: 8px;
            &>div{
                padding:20px 150px;
            }
            .form-item{
                padding:64px 86px;
                .el-cascader{
                    width:100%;
                    margin-top:30px;
                }
            }
            // border:1px solid #DCDFE6;
            .hint{
                position:absolute;
                left:244px;
                color:#FF6565;
                font-size:12px;
            }
            .hint.phone{
                top:227px;
            }
            .hint.verification{
                top:286px;
                left: 127px;
                color:#FF6565;
            }
            .hint.verification.active{
                color:rgb(233, 106, 22);
            }
            .hint.img{
                top:347px;
                left: 120px;
            }
            .head{
                text-align: center;
                font-size:24px;
                color:#303133
            }
            .cell{
                height:40px;
                line-height:40px;
                border-radius: 3px;
                margin:20px 0;//每个模块之间的间距
                //禁用样式
                input[disabled]{
                    background:#EDEFF2;
                    color:#DCDFE6;
                }
                &>.phone{
                    margin-right:20px;
                    width: 80px;
                }
                .el-icon-check{
                    position:relative;
                    top:-40px;
                    right:-310px;
                    font-size:12px;
                }
                label{
                    display:block;
                    float:left;
                    width:70px;
                }
                input{
                    text-align: center;
                    width:200px;
                    height:40px;
                    border-radius: 3px;
                    border:1px solid #DCDFE6;
                }
                .btn{
                    width:98px;
                    height:40px;
                    padding: 0;
                    line-height: 40px;
                    border-radius: 5px;
                    border: 1px solid #DCDFE6;
                    background: #fff;
                    color:#303133;
                    cursor: pointer;
                }
                .phone-code{
                    width:180px;
                    border-radius: 3px;
                    margin-right:20px;
                }
                .redBorder{
                    border:1px solid #FF6565;
                }

            }
            .title{
                width:108px;
                margin:auto;
                color:#4278BE;
                font-size:12px;
                cursor: pointer;
            }
            .save{
                text-align: center;
                //禁用样式
                input[disabled]{
                    background:#EDEFF2;
                    color:#DCDFE6;
                }
                input{
                    width:300px;
                    height:40px;
                    margin:28px auto;
                    border:0;
                    line-height: 40px;
                    border-radius:3px;
                    background:#4278BE;
                    color:#fff;
                    font-size:16px;
                    cursor: pointer;
                }
            } 
            .foot{
                font-size:12px;
                a{
                    color:#4278BE;
                    span{
                        color:#666;
                    }
                }

            }
        }
    }
</style>
