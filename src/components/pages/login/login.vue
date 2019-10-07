<!--@description: 验证码登陆
	@author: 刘钰
    @update: 刘钰(2019-04-26 10:24) -->
<template>
    <div id="login">
        <div class="header">
            <img src="./images/Group1.png" alt="" height="47px">
        </div>
        <div class="content"></div>
        <div class="form">
            <div>
                <div class="head">{{messageCode ? '验证码登录' : '账号密码登录'}}</div>
                <region region="中国大陆" v-show="messageCode" @location = "receivePhone"></region>
                <div class="hint phone" v-show="phoneTitle" v-if="messageCode"> {{phoneTitle}} </div>
                <div class="hint phone position" v-show="phoneTitle" v-else> {{phoneTitle}} </div>
                <div class="hint verification" :class="changeColor ? 'active':''"  v-if="messageCode"> {{verificationTitle}} </div>
                <div class="hint verification position" :class="changeColor ? 'active':''" v-else> {{verificationTitle}} </div>
                <div class="hint img" v-show="imageVerification">{{imgTitle}}</div>
				<!-- 手机号-验证码 -->
                <div class="cell"  > 
                    <phone class="fl phone" :phoneNumber = "areaCode" :disabPhone = "true" v-if="messageCode" :value = "true"></phone>
                    <phone class="fl phone" :phoneNumber = "areaCode" :disabPhone = "false" v-else :value = "false"></phone>
                    <input 
                        v-if="messageCode"
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
                    <input 
                        v-else
                        autocomplete="off"
                        :class='phoneChangeColor ? "redBorder": ""'
                        id='number' 
                        type='text' 
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
                <div class="cell" v-if="messageCode">
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
                <!-- 登录密码 -->
                <div class="cell phone-code" v-show="!messageCode">
                    <el-form :model="form">
                        <el-form-item label="" :label-width="formLabelWidth">
                            <el-input 
                                type="password" 
                                :placeholder="placeholderPwd" 
                                v-model="eyetxt"  
                                v-if="pwdType"
                                clearable
                                @blur="checkPassword('blur', eyetxt)" 
                                @focus="checkPassword('focus', eyetxt)"
                                ></el-input>
                            <el-input
                                type="text"  
                                clearable
                                :placeholder="placeholderPwd" 
                                v-model="eyetxt" 
                                v-else 
                                @blur="checkPassword('blur', eyetxt)" 
                                @focus="checkPassword('focus', eyetxt)"
                            ></el-input>
                            <img :src="seen ? seenImg : unseenImg" @click="changeType()" class="eye_img" />

                             <!-- <img src="../register/images/1.png" @click="changeType()" class="eye_img" /> -->
                            <!-- <i class="el-icon-close i" alt="" @click="eyetxt = ''"></i> -->
                        </el-form-item>
                        <div class= "password-hint" :class="changeColor ? 'active':''">{{passwordTitle}}</div>
                    </el-form>
                </div>
                <!-- 图片验证码 -->
                <div class="cell" v-show="imageVerification">
                    <div class="clear">
                        <!-- <label for="number">图片验证码</label> -->
                        <input 
                            type="text" 
                            class="fl phone-code" 
                            :placeholder= placeholderImgCode
                            @blur="checkImgCode('blur', imgVerificationCode)" 
                            @focus="checkImgCode('focus', imgVerificationCode)"
                            v-model="imgVerificationCode" />
                        <div class="btn fl">
                            <img :src='imgVerificateCode' alt="" @click='getImgCode'>
                        </div>
                    </div>
                    <div class="hints"> <p>{{imgInfo}}</p></div>
                </div>
                
                <div class="save">
                    <input id='submit1' type='button'  :plain="true" value="下一步" @click='login' :disabled = "disabreg" v-if="messageCode" />
                    <input id='submit2' type='button'  :plain="true" value="下一步" @click='nextStep' :disabled = "disabreg" v-else />
                    <p v-show="!messageCode" @click="toForgetPassword" class="forgetPassword">忘记密码? </p>
                </div> 
                <div class="jump">
                    <router-link class="title" :to='{name:"register"}' >新用户注册</router-link>
                    <span class="sign">|</span>
                    <span class="title" @click="changeState">{{messageCode ? '账号密码登录' : '手机号验证码登录'}} </span>                        
                </div>
            </div>
        </div>
        <loginDialog :message="phoneNum" :messageDialog="dialogVisible" :flag="flag"></loginDialog>
        <messageDialog :Verificationmessage="Verificationmessage" :noticeDialog="dialogVisibles"></messageDialog>
    </div>
</template>

<script>
import region from "../register/publics/region.vue";
import phone from "../register/publics/phone.vue";
import unseen from "../register/images/1.png";
import seen from "../register/images/2.png";
import loginDialog  from './publics/loginDialog'
import messageDialog from './publics/messageDialog'
export default {
    components: {
        region,phone,loginDialog,messageDialog
    },
    data(){
        return {
            ssoManager:'ssoManager',
            messageCode:JSON.parse(this.$route.query.id),//控制显示不同登录方式
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
            placeholderPwd:'请输入登录密码',
            tentative:"",                         //密码验证不为空
            forgetPassword:true,	              //为忘记密码传参
            dialogVisible:false,
            flag:false,
            dialogVisibles:false,
            Verificationmessage:'',
            imgInfo:'',
        }
    },
    created() {
        // this.getImgCode();
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
            // this.disab = true;
            this.dialogVisible = false
            this.dialogVisibles = false
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
        getImgCode(){
            this.$http({
                method:"get",
                url:this.ssoManager + `/v1/user/base/reg/pictureCode?phoneNumberPrefix=${this.areaCode}&phoneNumber=${this.phoneNum}`,
                // url:`/v1/user/base/reg/pictureCode?phoneNumberPrefix=${this.areaCode}&phoneNumber=${this.phoneNum}`,
            }).then((res) => {
                // console.log(res.data.data.pictureBase64)
                this.imgVerificateCode =  'data:image/png;base64,' + res.data.data.pictureBase64;
            })
        },
        //图片验证码获得失去焦点
        checkImgCode(type, value){
            this.disabreg = false
            if(type == "blur"){
                this.placeholderImgCode = '请输入图片验证码' ;
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
                this.placeholderImgCode = "" ;
                this.imgTitle = "";
            }
        },
        //验证码
        getCodebtn:function () {
            if(this.sendPhone){
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
                        this.changeColor = false;
                        this.disab = true;
                        this.Timeout = setTimeout(this.enableCodeBtn,1000);
                        this.verificationTitle = res.data.message;
						//验证码发送成功
                        if(res.data.sysCode == 200 && res.data.code == 200){
                            this.verificationTitle = "校验码短信已发送，有效时间为5分钟，请及时查收"
                            this.changeColor = false;
                            // this.imgVerificationCode = "";
                            this.verificationTitle = "";
                            this.imageVerification = false
                            this.disabreg = false
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
							this.disabreg = true;
                            this.imgVerificateCode = this.$http.defaults.baseURL + this.ssoManager + "/v1/user/base/reg/pictureCode?phoneNumberPrefix=" + this.areaCode + "&phoneNumber=" + this.phoneNum;
                            this.getImgCode() 
						}//图片验证码错误
						else if(res.data.code == 501100103){
                            this.imgTitle = res.data.message
                            this.disab = false;
                            this.disabreg = true;
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
        enableCodeBtn:function () {
			this.disab = true;
            if(this.countDownTime > 0) {
                this.messageAuthenticationCode =  this.countDownTime + 's';
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
            this.imgVerificateCode += "&d=" + Math.random();
        },
        //登录
        login(){
            if(this.reg){
                this.$http({
                    method:"POST",
                    url:this.ssoManager + "/v1/user/base/login/smsLogin",
                    // url:"/v1/user/base/login/smsLogin",
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
                        this.$message({
                            message: '登录成功',
                            type: 'success',
                            duration:1000,
                        });
						window.sessionStorage.rongCloudToken = JSON.stringify(res.data.data.rongCloudToken)
                        window.sessionStorage.functionPermissionList = JSON.stringify(res.data.data.functionPermissionList)
                        window.sessionStorage.teamEmployeeDetailVO = JSON.stringify(res.data.data.teamEmployeeDetailVO)
                        window.sessionStorage.teamAdminRangeVOList = JSON.stringify(res.data.data.teamAdminRangeVOList)
                        window.sessionStorage.token = res.data.data.token;
                        window.sessionStorage.userInfoJoinApplyRegVOList = JSON.stringify(res.data.data.userInfoJoinApplyRegVOList)
                        this.$router.push({name:'newUserPage'})
                    }//需要短信验证码
                    else if(res.data.code == 501102201){
                        this.verificationTitle = "请输入短信验证码"
                    }//短信验证码错误	
                    else if(res.data.code == 501102202 || res.data.code == 501102203){
						this.verificationCode = "";
						this.verificationTitle = res.data.message;
                        this.changeColor = true;
                        this.getImgCode();
                        this.imgVerificationCode = "";
                    }//需要图片验证码
					else if(res.data.code == 501100102){
                        this.verificationTitle = "您的验证码错误次数已超过三次,请输入图片验证码";
                        this.imgTitle = "";
						this.imageVerification = true;
                        // this.disabreg = true;
                        this.getImgCode();
					}//图片验证码错误	
					else if(res.data.code == 501100103){
						this.imgTitle = res.data.message
                        this.imgVerificationCode = "";
                        this.verificationTitle = "";
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
                clearTimeout(this.Timeout);
                // this.phoneNum = "";                          //手机号
                this.phoneChangeColor = "";                  //手机号失去焦点边框颜色变化
                this.phoneTitle = "";                        //手机号提示信息
                this.areaCode = "86";                        //手机区号
                this.placeholderNum = "请输入手机号";         //手机号默认
                this.placeholderMessage = "请输入短信验证码"; //短信验证码默认
                this.changeColor = false;                    //验证码底部提示颜色
                this.placeholderImgCode = "请输入图片验证码"; //图片验证码默认
                this.countDownTime = 60;                     //再次发送验证码间隔
                this.messageAuthenticationCode = "获取验证码";//验证码按钮内容
                this.verificationCode = "";                  //验证码用户输入内容
                this.verificationTitle = "";                 //验证码用户输入后提示
                this.imageVerification = false;              //图片验证码隐藏
                this.imgVerificationCode = "";               //图片验证码用户输入内容
                this.imgTitle = "您的账号存在风险，请输入图片验证码";//图片验证提示信息
                this.disabreg = true;                        //注册下一步禁止用户点击
                if (this.sendPhone) {
                    this.sendPhone = true;                      //手机号验证成功标志
                    this.disab = false;                           //60S内禁止用户再次点击
                }else {
                    this.sendPhone = false;
                     this.disab = true
                }
                this.reg = false;                            //手机号，验证码成功标志
                this.time = 0;                               //请求次数限制
                this.imgVerificateCode = "";   			  //图片验证码
                this.Timeout = "";                           //关闭延时器  
        },
        //跳转忘记密码
        toForgetPassword(){
            this.$router.push({
                name:"forgetPassword",
                path:"/forgetPassword",
				query:{ 
					id:this.forgetPassword
				}
            })
        },
  		//密码的显示隐藏
  		changeType:function(){
  			this.seen = !this.seen;//小眼睛的变化
  			this.pwdType=!this.pwdType;//跟着小眼睛变化，密码框隐藏显示文本框，内容就显示了
  		},

		//密码得失焦点
		checkPassword(type, value){
            //失去焦点
            if (this.phoneNum.length == 11) {
                this.disabreg = false
            }
            if(type == "blur"){
                this.placeholderPwd = '请输入登录密码'
				if(this.eyetxt == ""){
					this.passwordTitle = "请输入登录密码"
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
                this.placeholderPwd = ''
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
		//下一步
		nextStep(){
			if(this.tentative){
				this.$http({
					method:"post",
                    url:this.ssoManager + "/v1/user/base/login/passwordLogin",
                    // url:"/v1/user/base/login/passwordLogin",
					data:{
                        phoneNumberPrefix:this.areaCode,
                        phoneNumber:this.phoneNum, 
						password:this.eyetxt, 
						pictureCode:this.imgVerificationCode,  
					}
				}).then( res => {
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
								message: '登录成功',
								center: true,
                                type:"success",
                                duration:1000,
                                });
						window.sessionStorage.rongCloudToken = JSON.stringify(res.data.data.rongCloudToken)
						window.sessionStorage.functionPermissionList = JSON.stringify(res.data.data.functionPermissionList)
                        window.sessionStorage.teamEmployeeDetailVO = JSON.stringify(res.data.data.teamEmployeeDetailVO)
                        window.sessionStorage.teamAdminRangeVOList = JSON.stringify(res.data.data.teamAdminRangeVOList)
                        window.sessionStorage.token = res.data.data.token;
                        window.sessionStorage.userInfoJoinApplyRegVOList = JSON.stringify(res.data.data.userInfoJoinApplyRegVOList)
                        this.$router.push({name:'newUserPage'})
					}else if(res.data.code == 501101304){
                        this.passwordTitle = res.data.message;
                        this.changeColor = true;
                        this.imgInfo = ''
                        this.getImgCode();
                    }
                    else if(res.data.code == 501100102){
                        this.passwordTitle = res.data.message;
                        this.imageVerification = true;
                        // this.disabreg = true;
                        this.imgInfo = ''
                        this.getImgCode();
                    }
                    else if(res.data.code == 501100103){
                        this.imgInfo = res.data.message
                        // this.passwordTitle = res.data.message;
                        // this.imageVerification = true;
                        // // this.disabreg = true;
                        this.getImgCode();
					}
					else if(res.data.code == 501101303){
                        // this.$message.error(res.data.message)
                        this.passwordTitle = res.data.message;
                        this.imgInfo = ''
                        this.getImgCode();

					}else{
                        // this.$message.error(res.data.message)
                        this.getImgCode();
                        this.passwordTitle = res.data.message;
                        this.imgInfo = ''
                    }
				})
			}
			// this.dialogFormVisible = false
		}

    },
    mounted() {
    },
}
</script>
<style lang="scss">
// @import "../../../stylesheets/main.scss";
    #login{
        background: #F8F8F8;
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
            height: 730px;
            width: 955px;
            position: absolute;
            top: 117px;
            left: 161px;
            background: url('./images/bg.png') no-repeat 100% 100%;
        }
        .form{
            position:absolute; 
            top:200px;
            right:161px;                      
            width:472px;
            height:522px;
            background:rgba(255,255,255,1);
            box-shadow:5px 5px 27px 0px rgba(63,72,82,0.2);
            border-radius:3px;
            &>div{
                padding:64px 85px;
            }
            .el-select .el-input__inner {
                width: 87px !important;
                border-radius: 3px;
            }
            .el-input__inner {
                width: 300px !important;
            }
            .el-cascader{
                width:100%;
            }
            .form-item{
                padding:20px 150px;
            }
            .hint{
                position:absolute;
                left:242px;
                color:#FF6565;
                font-size:12px;
            }
            .hint.phone{
                top:226px;
            }
            .hint.phone.position{
                top:166px;
            }
            .hint.verification{
                left: 126px;
                top:290px;
                color:#FF6565;
            }
            .hint.verification.positon{
                // top:230px;
            }
            .hint.verification.active{
                color:#FF6565;
            }
            .hint.img{
                left: 123px;
                top:348px;
            }
            .hints {
                position: absolute;
                left: 123px;
                top: 274px;
                color: #FF6565;
                font-size: 12px;
            }
            .head{
                text-align: center;
                font-size:24px;
                color: #303133;
                margin-bottom: 30px;
            }
            .cell{
                height:40px;
                line-height:40px;
                border-radius: 5px;
                margin:20px 0;//每个模块之间的间距
                //禁用样式
                input[disabled]{
                    background:rgba(237,239,242,1);
                    color:#BFC2CC;
                }
                &>.phone{
                    margin-right:20px;
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
                    // padding-left: 10px;
                    text-align: center;
                    width:200px;
                    height:40px;
                    // border:1px solid #eee;
                    border-radius: 3px;
                    border: 1px solid #BFC2CC;
                }
                .btn{
                    width:100px;
                    height:40px;
                    // border:1px solid blue;
                    border-radius: 3px;
                    background:#fff;
                    color:#303133;
                    cursor: pointer;
                }
                .phone-code{
                    width:182px;
                    margin-right:20px;
                    border-radius: 3px;
                }
                .redBorder{
                    border:1px solid #FF6565;
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
                    right:-28px;
                    height:15px;
                    width:21px;
                }
                .el-icon-close.i{
                    position:absolute;
                    top:15px;
                    right:15px;
                }
                .password-hint{
                    color:#FF6565;
                    font-size:12px;
                    margin-top:-33px;
                    margin-left: 103px;
                }
                .password-hint.active{
                    color:#FF6565;
                }
                .el-button.el-button--primary{
                    width:200px;
                }
            }
            .title{
                width:150px;
                margin:auto;
                color:#4278BE;
                font-size:12px;
                cursor: pointer;
            }
            .save{
                text-align: center;
                //禁用样式
                input[disabled]{
                    background:rgba(237,239,242,1);
                    color:#BFC2CC;
                }
                input{
                    width:300px;
                    height:40px;
                    margin:15px auto;
                    border:0;
                    border-radius:3px;
                    background:#4278BE;
                    color:white;
                    font-size:16px;
                    cursor: pointer;
                }
                p{
                    text-align:left;
                    color:#4278BE;
                    font-size:12px;
                    cursor: pointer;
                }
            } 
            .jump{
                position: absolute;
                bottom: 50px;
                left: 140px;
                text-align: center;
                .title{
                    width:150px;
                    margin:50px 10px;
                    color:#4278BE;
                    font-size:12px;
                    cursor: pointer;
                }   
                .sign{
                    color:#ddd;
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
