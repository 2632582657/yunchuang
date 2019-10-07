<!--@description: 忘记密码
	@author: 刘钰
    @update: 刘钰(2019-04-26 10:24) -->
<template>
    <div id="forgetPassword">
        <div style="background:#fff;border-bottom:2px solid #4278BE">
            <div class="head">
                <div class="left fl">
                    <div class="logo fl">
                        <!-- 云创logo -->
                        <img src="./images/Group1.png" alt="" height="46px" width="144px">
                    </div>
                    <div class="fl" style="height:46px;width:1px;background:#979797;margin:22px 10px 0 10px;"></div>
                    <div class="title fl">重置登录密码</div>
                </div>
                <div class="head-navigation fr">
                    <router-link :to = "{name:'login', query:{ id:messageCode}}" >登录</router-link>
                    <router-link to = "/register" >注册</router-link>
                    <router-link to ="">帮助中心</router-link>
                    <router-link to ="">提建议</router-link>
                </div>
            </div> 
        </div>
        <div :class="messageCode ? 'form' : 'formdata'">
            <div>
                <div class="form-head">请输入您需要重置登录密码的账户名</div>
                <div class="form-head1"></div>
                <div class="hint phone" v-show="phoneTitle" v-if="messageCode"> {{phoneTitle}} </div>
                <div class="hint phone position" v-show="phoneTitle" v-else> {{phoneTitle}} </div>
                <div class="hint verification" :class="changeColor ? 'active':''"  v-if="messageCode"> {{verificationTitle}} </div>
                <div class="hint verification position" :class="changeColor ? 'active':''" v-else> {{verificationTitle}} </div>
                <div class="hint img" v-if="messageCode">{{imgTitle}}</div>
                <!-- 手机号 -->
                <div class="cell" v-show="messageCode"> 
                    <label for="number">账户名</label>
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
                <!-- 短信 -->
                <div class="cell message" v-show="messageCode">
                    <label for="number">短信验证码</label>
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
                <!-- 图片 -->
                <div class="cell" v-show="imageVerification">
                   <div class="clear">
                        <label for="number">图片验证码</label>
                        <input 
                            type="text" 
                            class="fl phone-code" 
                            :placeholder= placeholderImgCode
                            @blur="checkImgCode('blur', imgVerificationCode)" 
                            @focus="checkImgCode('focus', imgVerificationCode)"
                            v-model="imgVerificationCode" />
                        <div class="btn fl">
                            <img :src='imgVerificateCode' alt="" @click='refresh'>
                        </div>
                    </div>
                </div>
                <!-- 密码 -->   
                <div class="cell phone-code" v-show="!messageCode">
                    <el-form :model="form">
                        <el-form-item label="" :label-width="formLabelWidth">
                            <el-input 
                                type="password" 
                                placeholder="请输入密码" 
                                v-model.trim="eyetxt"  
                                v-if="pwdType"
                                clearable
                                @blur="checkPassword('blur', eyetxt)" 
                                @focus="checkPassword('focus', eyetxt)"
                                ></el-input>
                            <el-input 
                                type="text"  
                                placeholder="请输入密码" 
                                v-model.trim="eyetxt" 
                                v-else
                                clearable
                                @blur="checkPassword('blur', eyetxt)" 
                                @focus="checkPassword('focus', eyetxt)"
                            ></el-input>
                            <img :src="seen ? seenImg : unseenImg" @click="changeType()" class="eye_img" />
                            <!-- <i class="el-icon-close i" alt="" @click="eyetxt = ''"></i> -->
                        </el-form-item>
                        <span v-show="!changeColor" style="font-size:12px;color:#BFC2CC">密码必须包含数字、字母，长度不低于6位</span>
                        <div class= "password-hint" :class="changeColor ? 'active':''">{{passwordTitle}}</div>
                    </el-form>
                </div>

                <div class="save">
                    <input id='submit1' type='button'  :plain="true" value="下一步" @click='login' :disabled = "disabreg" v-if="messageCode" />
                    <input id='submit1' type='button'  :plain="true" value="下一步" @click='validateJyh' :disabled = "disabreg" v-else />
                </div> 
                
            </div>
            
        </div>
        <foot class="foot"></foot>
        <loginDialog :message="phoneNum" :messageDialog="dialogVisible" :flag="flag"></loginDialog>
        <messageDialog :Verificationmessage="Verificationmessage" :noticeDialog="dialogVisibles"></messageDialog>
    </div>
</template>

<script>
import region from "../register/publics/region";
import foot from "../register/publics/foot";
import unseen from "../register/images/1.png";
import seen from "../register/images/2.png";
import loginDialog  from './publics/loginDialog'
import messageDialog from './publics/messageDialog'
export default {
    components: {
        region,
        foot,
        loginDialog,
        messageDialog
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
            imgTitle:"",//图片验证提示信息
            disab:true,                           //60S内禁止用户再次点击
            disabreg:true,                        //注册下一步禁止用户点击
            sendPhone:false,                      //手机号验证成功标志
            reg:false,                            //手机号，验证码成功标志
            time:0,                               //请求次数限制
			messageCode:true,                     //跳转登陆传参=>布尔值
            imgVerificateCode:"",   			  //图片验证码
            Timeout:"",                           //关闭延时器  
			formLabelWidth: '',                   //密码框宽度
			seen:true,  			              //眼睛显示状态
			unseenImg:unseen,	                  //看不见图片
			seenImg :seen,		                  //看得见密码图片
			eyetxt:"",                            //密码框用户输入内容
			pwdType:true, 		                  //此时文本框隐藏，显示密码框
			disabNext:true,   	                  //下一步按钮禁用 
			changeColor:false, 	                  //密码提示信息颜色
			passwordTitle:"",                     //密码提示信息
            form:{},                               
            tentative:"",                         //密码验证不为空
            dialogVisible:false,
            flag:false,
            dialogVisibles:false,
            Verificationmessage:'',
			rongCloudToken:''						//接收融云token


            // messageCode:true,//跳转到登录传参
            // imageVerifyTime:true,//图片验证码次数

            // userName: "",
            // password: "",
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
    methods: {
        //验证手机号
        checkPhone(type, value){
			this.sendPhone = false;
            this.disab = true;
            if(type == "blur"){
                this.placeholderNum = "请输入手机号";
                if(value == ""){
                    this.phoneTitle="手机号不能为空";
                    this.phoneChangeColor = true;
                }else{
                    this.getPhone()
                    // else{
                    //     this.phoneTitle="请选择地区"
                    // }
                }
            }else if(type == "focus"){
                this.phoneChangeColor = false;
                this.placeholderNum = "";
                this.phoneTitle = "";
            }
        },
        getPhone() {
            if(this.areaCode){
                this.$http({
                    method:"get",
                    // url:"/v1/user/base/reg/phone",
                    url:this.ssoManager + "/v1/user/base/reg/phone",
                    params:{
                        phoneNumber:this.phoneNum,
                        phoneNumberPrefix:this.areaCode,
                    },
                }).then( res => {
                    // console.log(res)
                    if(res.data.sysCode == 200 && res.data.code == 200){
                        this.imgTitle = "";
                        this.verificationTitle = "";
                        this.phoneChangeColor = true;
                        this.sendPhone = false;
                        if(this.countDownTime == 60){
                            this.disab = false;
                        }    
                        if(res.data.data.lock){
                            this.dialogVisibles = true
                            this.Verificationmessage = '该手机号已锁定，请明日再试'
                        //成功，手机号注册过
                        }else if(res.data.data.reg){
                            this.phoneChangeColor = false;
                            this.sendPhone = true;
                        }else {
                            // this.$message.error("请先注册手机号")
                            this.dialogVisible = true
                            this.flag = true
                        }
                    }//手机号码无效
                    else if(res.data.code == 501100101){
                        this.phoneTitle = res.data.message;
                        this.phoneChangeColor = true;
                    }else{
                        this.phoneTitle = res.data.message;
                        this.phoneChangeColor = true;
                        this.disabreg = true
                    }
                })
            }
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
        //图片验证码获得失去焦点
        checkImgCode(type, value){
            if(type == "blur"){
                this.placeholderImgCode = '请输入图片验证码' ;
                if(!value){
					// this.imgTitle = "请输入图片验证码";
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
                        url:this.ssoManager + "/v1/user/base/login/loginSmsCode",
                        // url:"/v1/user/base/reg/getSmsCode",
                        params:{
                            phoneNumber:this.phoneNum,
                            phoneNumberPrefix:this.areaCode,
                            pictureCode:this.imgVerificationCode,
                        },
                    }).then( res => {
                        this.verificationTitle = res.data.message;
						//验证码发送成功
                        if(res.data.sysCode == 200 && res.data.code == 200){
                            this.verificationTitle = "校验码短信已发送，有效时间为5分钟，请及时查收"
                            this.changeColor = false;
                            this.imgVerificationCode = "";
                            this.verificationTitle = "";
                            this.disabreg = false
                            this.imageVerification = false
                        }//无效手机号码 该手机号码未注册
                        else if(res.data.code == 501100101 || res.data.code == 501102101){
                            this.phoneTitle = res.data.message;
                            this.sendPhone = false;
                            this.verificationTitle = "";
                        }//短信验证码错误501102202 501102203
                        else if(res.data.code == 501102202 || res.data.code == 501102203){
                            this.verificationCode = "";
                            this.changeColor = true;
                            this.getImgCode(); 
						}//需要图片验证码 
						else if(res.data.code == 501100102){
                            this.disab = false;
                            clearTimeout(this.Timeout);
                            this.verificationTitle = "您获取验证码的次数已超过三次，请输入图片验证码"
                            this.imageVerification = true;
                            this.imgTitle = "";
							// this.disabreg = true;
                            this.imgVerificateCode = this.$http.defaults.baseURL + this.ssoManager + "/v1/user/base/reg/pictureCode?phoneNumberPrefix=" + this.areaCode + "&phoneNumber=" + this.phoneNum;
                            this.getImgCode() 
						}//图片验证码错误
						else if(res.data.code == 501100103){
                            this.imgTitle = res.data.message
                            this.disab = false;
                            clearTimeout(this.Timeout);
                            this.countDownTime = 60
                            this.verificationTitle = "";
                            this.imgVerificationCode = "";
                            this.getImgCode() 
						}//提示信息手机号码已注册，引导注册/该手机号码已锁定
						else if(res.data.code == 501102102){
                            this.phoneTitle = res.data.message;
                            this.sendPhone = false;
                            this.verificationTitle = "";
                            this.dialogVisibles = true
                            this.Verificationmessage = res.data.message

						}//弹框提示短信验证码过于频繁 501102204
						else{
							this.$message.error(res.data.message)
						}
                    })
                }else{
                    return
                }                
            }
        },
        getImgCode(){
            this.$http({
                method:"get",
                url:this.ssoManager + `/v1/user/base/reg/pictureCode?phoneNumberPrefix=${this.areaCode}&phoneNumber=${this.phoneNum}`,
            }).then((res) => {
                this.imgVerificateCode =  'data:image/png;base64,' + res.data.data.pictureBase64;
            })
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
        //点击刷新图片
        refresh(){
            // this.imgVerificateCode += "&d=" + Math.random();
            this.getImgCode()
        },
        validateJyh(){//校验关联用户名
            var reSpace = /\s/g;
            if (reSpace.test(this.eyetxt)){
                return;
            }
            var reUpper = /[a-zA-Z]/;
            var reLower = /[a-z]/;
            var reNum = /[0-9]/;
            var count = 0;
            if (reLower.test(this.eyetxt)) {
                ++count;
            }
            if (reUpper.test(this.eyetxt)) {
                ++count;
            }
            if (reNum.test(this.eyetxt)) {
                ++count;
            }
            if (count < 3) {
                this.passwordTitle = '密码必须包含数字、字母，长度不低于6位'
                this.changeColor = true
            } else if (this.eyetxt.length < 6) {
                this.passwordTitle = '密码长度至少6位'
                this.changeColor = true
            } else if (this.eyetxt.length > 19) {
                this.passwordTitle = '密码长度最高18位'
                this.changeColor = true
            } else {
                this.nextStep()
            }
        },
        //下一步
        login(){
            if(this.reg){
                this.$http({
                    method:"POST",
                    url:this.ssoManager + "/v1/user/base/login/smsLogin",
                    data:{
                        phoneNumberPrefix:this.areaCode,
                        phoneNumber:this.phoneNum, 
						smsCode:this.verificationCode, 
						pictureCode:this.imgVerificationCode,
                    },
                }).then(res => {
					//登录成功
                    if(res.data.sysCode == 200 && res.data.code == 200){
                        this.verificationCode = "";
                        this.verificationTitle = "";
                        this.changeColor = false;
                        this.messageCode = false
						window.sessionStorage.rongCloudToken = JSON.stringify(res.data.data.rongCloudToken)
                        window.sessionStorage.functionPermissionList = JSON.stringify(res.data.data.functionPermissionList)
                        window.sessionStorage.teamEmployeeDetailVO = JSON.stringify(res.data.data.teamEmployeeDetailVO)
                        window.sessionStorage.teamAdminRangeVOList = JSON.stringify(res.data.data.teamAdminRangeVOList)
                        window.sessionStorage.token = res.data.data.token;
                        window.sessionStorage.userInfoJoinApplyRegVOList = JSON.stringify(res.data.data.userInfoJoinApplyRegVOList)
                    }//需要短信验证码
                    else if(res.data.code == 501102201){
                        this.verificationTitle = "请输入短信验证码"
                    }//短信验证码错误	
                    else if(res.data.code == 501102202 || res.data.code == 501102203){
						this.verificationCode = "";
						this.verificationTitle = res.data.message;
                        this.changeColor = true;
                        // this.refresh();
                        this.getImgCode(); 
                        this.imgVerificationCode = "";
                    }//需要图片验证码 	
					else if(res.data.code == 501100102){
                        this.verificationTitle = "您的验证码错误次数已超过三次,请输入图片验证码";
                        this.imgTitle = "";
						this.imageVerification = true;
                        this.disabreg = true;
                        this.getImgCode();
                        this.imgVerificateCode = this.$http.defaults.baseURL + this.ssoManager + "/v1/user/base/reg/pictureCode=" + this.areaCode + "&phoneNumber=" + this.phoneNum;
					}//图片验证码错误	
					else if(res.data.code == 501100103){
						this.imgTitle = res.data.message
                        this.imgVerificationCode = "";
                        this.verificationTitle = "";
                        // this.refresh();
                        this.getImgCode(); 
					}
					else{
						this.$message.error(res.data.message)
					}
                    
                })                
            }
        },
        //改变登录方式
        changeState(){
                this.$router.push({
                    name:"login",
                    path:"/login",
                    query:{
                        id:!this.messageCode
                    }
                });
                this.messageCode = !this.messageCode;
                //重置数据状态
                this.disabreg = true;                        //注册下一步禁止用户点击
                this.time = 0;                               //请求次数限制
        },
  		//密码的显示隐藏
  		changeType:function(){
  			this.seen = !this.seen;//小眼睛的变化
  			this.pwdType=!this.pwdType;//跟着小眼睛变化，密码框隐藏显示文本框，内容就显示了
  		},
		//密码得失焦点
		checkPassword(type, value){
			//失去焦点
            if(type == "blur"){
				if(this.eyetxt == ""){
					this.passwordTitle = "请输入密码"
                    this.changeColor = true;
				}else{
                    this.tentative = true;
                    this.disabNext = false;
                    if(this.phoneNum && this.eyetxt){
                        if(!this.imageVerification){

                            this.disabreg = false;
                            this.reg = true;
                        }else if(this.imgVerificationCode){
                            this.disabreg = false;
                            this.reg = true;
                        }
                    }

				}
			}else{
                this.disabNext = false;
                this.passwordTitle = "";
                if(this.eyetxt){
                    if(this.phoneNum && this.eyetxt){
                        if(!this.imageVerification){

                            this.disabreg = false;
                            this.reg = true;
                        }else if(this.imgVerificationCode){
                            this.disabreg = false;
                            this.reg = true;
                        }
                    }
                }
			}
		},
		//完成
		nextStep(){
			if(this.tentative){
				this.$http({
					method:"post",
					url:this.ssoManager + "/v1/user/userInfo/forgetPassword",
					data:{
                        phone:this.phoneNum, 
                        password:this.eyetxt, 
                        // phoneNumberPrefix:this.areaCode,
                        // phoneNumber:this.phoneNum,
                        // smsCode:this.verificationCode,
                        // pictureCode:this.imgVerificationCode
					}
				}).then( res => {
					console.log(res)
                // 200 成功 
                // 501100101="无效手机号码"  
                // 501103101="该手机号码未注册"  
                // 501103201="该用户未设置密码"  
                // 501103102="该帐户存在风险，今日锁定账号"  
                // 501103103="建议您更换登录方式或找回密码"  
                // 501103202="密码加密失败" 
                // 501103203="密码错误"  
                // 501100102= "需要图片验证码" 
                // 501100103="图片验证码错误"
					
					if(res.data.sysCode == 200 && res.data.code == 200){
						this.passwordTitle = "";
						this.$message({
								message: '设置成功',
								center: true,
								type:"success"
                                });
                        this.$router.push({name:'newUserPage'})
					}else if(res.data.code == 501101304){
                        this.passwordTitle = res.data.message;
                        this.changeColor = true;
					}//该用户已设置密码
					else if(res.data.code == 501101302){
						this.$message({
							message:"您已设置密码",
							type:'warning'
						})
					}//密码加密失败
					else if(res.data.code == 501101303){
						this.$message.error(res.data.message)

					}else{
                        this.$message.error(res.data.message)
                        // this.$alert(res.data.message, {
                        //      confirmButtonText: '知道了',
                        //      center:true,
                        // });
                    }
				})
			}
			// this.dialogFormVisible = false
		},

        // forgetNext(){
        //     this.messageCode = false;
        //     this.$http({
        //         method:"post",
        //         url:"/userManagthis.ssoManager + e/v1/user/base/reg",
        //         data:{
        //             userName:this.userName,
        //             password:this.password,                 
        //         },
        //     }).then(res => {
        //         console.log(res)
        //     })
        // },
        // complate(){

        // }

    },
}
</script>
<style lang="scss" scoped>
// @import "../../../stylesheets/main.scss";
    #forgetPassword{
        background:#eee;
        height:100%;
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
        .head{
            height:89px;
            width: 1000px;
            margin: 0 auto;
            background:#fff;
            .left{
                width:500px;
                .logo{
                    // width:110px;
                    height:100px;
                    margin-top:20px;
                    text-align: center;
                    line-height:100px;
                    img{
                        
                    }
                }
                .title{
                    margin-top:40px;
                    font-size:16px;
                }
            }

            .head-navigation{
                margin-top:40px;
                width:300px;
                text-align:right;
                a {
                    color:#4278BE;
                    padding:0 15px;
                }
            }

        }
        .formdata {
            position:relative;
            margin:200px auto;
            width:454px;
            height:318px;
            border:1px solid #eee;
            background:#fff;
            // @include rounded(8px);
            border-radius: 3px;
            .form-head{
                // padding:20px 20px;
                border-left: 10px solid #4278BE;
                padding: 0 0 10px 8px;
                color:#303133;
                height: 18px;
                margin: 30px 0 20px 20px;
                box-sizing: border-box;
                font-size:14px;
            }
            .el-form {
                padding: 0 78px;
            }
            .el-form-item {
                margin-bottom: 0px;
            }
            .form-head1 {
                height: 1px;
                width: 100%;
                background: #BFC2CC;
            }
            .hint{
                position:absolute;
                left:125px;
                font-size: 12px;
                color:red;
            }
            .hint.phone{
                top:144px;
            }
            .hint.phone.position{
                top:138px;
            }
            .hint.verification{
                top:285px;
            }
            .hint.verification.positon{
                // top:230px;
            }
            .hint.verification.active{
                color:rgb(233, 106, 22);
            }
            .hint.img{
                top:200px;
            }
            .head{
                text-align: center;
                // font-size:30px;
            }
            .cell{
                height:40px;
                line-height:40px;
                // @include rounded(5px);
                border-radius: 3px;
                margin:30px 0;//每个模块之间的间距
                input[disabled]{
                    background:#EDEFF2;
                    color:#DCDFE6;
                }
                label{
                    display:block;
                    float:left;
                    margin-right:20px;
                    color:#303133;
                    width:100px;
                    text-align: right;
                }
                input{
                    width:270px;
                    height:40px;
                    border:1px solid #eee;
                    padding-left:15px;
                }
                .btn{
                    width:100px;
                    height:40px;
                    // border:1px solid blue;
                    // @include rounded(5px);
                    border-radius: 3px;
                    background:#fff;
                    color:#303133;
                }
                .phone-code{
                    width:160px;
                    margin-right:10px;
                }
                .passwordCode{
                    width:300px;
                    margin-right:20px;
                }


                .el-dialog{
                    width:400px;
                }
                .el-dialog__footer{
                    text-align: center;
                }
                .eye_img{
                    position:absolute;
                    top:12px;
                    right:-30px;
                    width:21px;
                }
                .el-icon-close.i{
                    position:absolute;
                    top:13px;
                    right:15px;
                }
                .password-hint{
                    color:#bbb;
                    font-size:12px;
                    margin-left: 16px;
                    margin-top:-6px;
                }
                .password-hint.active{
                    color:rgb(245, 107, 52);
                }
                .el-button.el-button--primary{
                    width:200px;
                }
            }
            .save{
                text-align: center;
                //禁用样式
                input[disabled]{
                    background:#EDEFF2;
                    color:#BFC2CC;
                }
                input{
                    width:300px;
                    height:40px;
                    margin:20px auto;
                    border:0;
                    border-radius:3px;
                    background:#4278BE;
                    color:white;
                    font-size:18px;
                    cursor: pointer;
                }
                p{
                    text-align:left;
                    color:rgb(60, 60, 214);
                    font-size:12px;
                    cursor: pointer;
                }
            } 
            .jump{
                margin-top:30px;
                .title{
                    width:150px;
                    margin:50px 30px;
                    color:blue;
                    font-size:12px;
                    cursor: pointer;
                }   
                .sign{
                    color:#ddd;
                }             
            }
        }
        .form{
            position:relative;
            margin:200px auto;
            width:450px;
            height:398px;
            border:1px solid #eee;
            background:#fff;
            // @include rounded(8px);
            border-radius: 3px;
            // &>div{
            //     padding:20px 100px;
            // }
            .form-head{
                // padding:20px 20px;
                border-left: 10px solid #4278BE;
                padding: 0 0 10px 8px;
                color:#303133;
                height: 18px;
                margin: 30px 0 20px 20px;
                box-sizing: border-box;
                font-size:14px;
            }
            .form-head1 {
                height: 1px;
                width: 100%;
                background: #BFC2CC;
            }
            .hint{
                position:absolute;
                left:135px;
                font-size: 12px;
                color:#FF6565;
            }
            .hint.phone{
                top:144px;
            }
            .hint.phone.position{
                top:138px;
            }
            .hint.verification{
                top:212px;
            }
            .hint.verification.positon{
                // top:230px;
            }
            .hint.verification.active{
                color:rgb(233, 106, 22);
            }
            .hint.img{
                top:281px;
            }
            .head{
                text-align: center;
                // font-size:30px;
            }
            .cell{
                height:40px;
                line-height:40px;
                // @include rounded(5px);
                border-radius: 3px;
                margin:30px 0;//每个模块之间的间距
                input[disabled]{
                    background:#EDEFF2;
                    color:#DCDFE6;
                }
                label{
                    display:block;
                    float:left;
                    margin-right:20px;
                    color:#303133;
                    width:100px;
                    text-align: right;
                }
                input{
                    width:270px;
                    height:40px;
                    border:1px solid #eee;
                    padding-left:15px;
                    border-radius: 3px;
                }
                .btn{
                    width:100px;
                    height:40px;
                    // border:1px solid blue;
                    // @include rounded(5px);
                    border-radius: 3px;
                    background:#fff;
                    color:#303133;
                }
                .phone-code{
                    width:160px;
                    margin-right:10px;
                }
                .passwordCode{
                    width:300px;
                    margin-right:20px;
                }


                .el-dialog{
                    width:400px;
                }
                .el-dialog__footer{
                    text-align: center;
                }
                .eye_img{
                    position:absolute;
                    top:12px;
                    right:-30px;
                    width:21px;
                }
                .el-icon-close.i{
                    position:absolute;
                    top:15px;
                    right:15px;
                }
                .password-hint{
                    color:#bbb;
                    font-size:12px;
                    margin-top:-20px;
                }
                .password-hint.active{
                    color:rgb(245, 107, 52);
                }
                .el-button.el-button--primary{
                    width:200px;
                }
            }
            .save{
                position: absolute;
                bottom: 20px;
                left: 73px;
                text-align: center;
                //禁用样式
                input[disabled]{
                    background:#EDEFF2;
                    color:#BFC2CC;
                }
                input{
                    width:300px;
                    height:40px;
                    margin:20px auto;
                    border:0;
                    border-radius:3px;
                    background:#4278BE;
                    color:white;
                    font-size:18px;
                    cursor: pointer;
                }
                p{
                    text-align:left;
                    color:rgb(60, 60, 214);
                    font-size:12px;
                    cursor: pointer;
                }
            } 
            .jump{
                margin-top:30px;
                .title{
                    width:150px;
                    margin:50px 30px;
                    color:blue;
                    font-size:12px;
                    cursor: pointer;
                }   
                .sign{
                    color:#ddd;
                }             
            }
        }
        .foot{
            font-size:12px;
            a{
                color:blue;
                span{
                    color:#666;
                }
            }
        }
    }
</style>
