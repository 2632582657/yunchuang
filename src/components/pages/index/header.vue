<!--@description: index的子页面
    @author: 李瑞军
@update: 李瑞军(2019-05-10 11:41) -->
<template>
    <el-row class="yc_message">
        <el-col :xs="12" :sm="12" :md="9" :lg="7" :xl="10" class="yc_title">
            <div class="grid-content bg-purple" ref="show_title"  @click.stop="isShow = !isShow" >
                <span class="el-dropdown-link yc_title_show">
                    <div class="fl">{{adminInfo.companyName ? adminInfo.companyName : '暂未加入团队'}}</div>
                    <img src="./images/icon_renzheng.png" alt="" width="21px" class="fl" style="margin:21px 0 0 6px" v-if="adminInfo.teamAuthenticationStatus">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <div class="yc_title_content" v-show="isShow">
                    <p style="height:45px;line-height:45px;font-size:12px;border-bottom:1px solid #BFC2CC;color:#606266;padding:0 20px">在此您可以切换团队，还可以创建、加入或管理团队</p>
                    <ul>
                        <li class="yc_content_hover" v-for="item in options" @click="checkTitle(item)">
                            <div style="float:left;width:18px;height:18px"> 
                                <i class="el-icon-check" v-if="item.companyId == adminInfo.companyId" style="margin-right:20px;font-size:18px"></i>
                            </div>
                            <p style="float:left;margin-left:15px">{{item.companyName}}</p>
                        </li>
                    </ul>
                    <div style="border-top:1px solid #BFC2CC;" class="clear">
                        <div class="yc_team"  @click="addTeam">
                            <i class="el-icon-circle-plus fl" style="color:#4278BE;font-size:20px;margin-right:6px;"></i>
                            <p class="fl">加入团队</p>
                        </div>
                        <div class="yc_team" @click="myCompany" > 
                            <!-- $router.push({name:'frameWork'}) -->
                            <i class="el-icon-s-tools fl" style="color:#BFC2CC;font-size:20px;margin-right:6px;"></i>
                            <p class="fl">我的团队</p>
                        </div>
                    </div>
                </div>
            </div>
            <div style="float:right" class="yc_iconfont" @click="chatWith">
                <i class="el-icon-chat-dot-round" style="font-size:18px"></i>
            </div>
        </el-col>
        <el-col :xs="5" :sm="8" :md="7" :lg="12" :xl="24">
            <div class="grid-content bg-purple-light yc_search" ref="yc_search">
                <el-input
                    placeholder="搜索或键入@查看命令列表"
                    v-model="search"
                    style="height: 32px;"
                ></el-input>
                  <!-- v-on:input="searhInput"
                    @focus="searhInput" -->
                <div class="yc_search_content" v-if="historyShow">
                    <ul class="command">
                        <li
                            v-for="(item,index) in historyData"
                            :key="index"
                            @click="getTokenData(item)"
                        >
                            <div>
                                <i class="el-icon-search"></i>
                                <span style="margin-left:20px">{{ item.name }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="yc_search_content" v-if="searchShow">
                    <div>
                        <div class="yc_search_title">联系人</div>
                        <ul>
                            <li class="yc_content_list">
                                <img src="../../../assets/logo.png" alt>
                                <span>车厘子</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div class="yc_search_title">群聊</div>
                        <ul>
                            <li class="yc_content_list">
                                <img src="../../../assets/logo.png" alt>
                                <span>车厘子的小分队</span>
                            </li>
                        </ul>
                    </div>
                    <span class="divider"></span>
                    <div>
                        <div class="yc_search_title">xxxx类提醒</div>
                        <ul>
                            <li class="yc_content_list">
                                <img src="../../../assets/logo.png" alt>
                                <span>啦啦啦啦啦 车厘子啦啦啦</span>
                            </li>
                        </ul>
                    </div>
                    <span class="divider"></span>
                    <div>
                        <div class="yc_search_title">工作通知</div>
                        <ul>
                            <li class="yc_content_list">
                                <img src="../../../assets/logo.png" alt>
                                <span>车厘子的请假申请</span>
                            </li>
                        </ul>
                    </div>
                    <span class="divider"></span>
                    <div>
                        <div class="yc_search_title">主页中的xxx分类</div>
                        <ul>
                            <li class="yc_content_list">
                                <img src="../../../assets/logo.png" alt>
                                <div style="flex:1">
                                    <p
                                        style="margin-left:10px;white-space: nowrap;
                                        width:''
                                        overflow: hidden;
                                        text-overflow: ellipsis;"
                                    >熟人的世界里，只有人情；陌生人社会里，才有机遇</p>
                                    <p style="margin-left:10px;font-size:12px;color:#ccc">
                                        <span>4月30日</span>
                                        <span>14:42</span>
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="yc_search_content" v-if="instruction">
                    <ul class="command">
                        <template v-if="data.length === 0">
                            <li style="color:#ccc">未找到你请求的匹配项</li>
                        </template>
                        <template v-else>
                            <li
                                v-for="(item,index) in data"
                                :key="index"
                                @click="getTokenData(item)"
                            >
                                <span>{{ item.name }}</span>
                                <span>{{ item.value }}</span>
                            </li>
                        </template>
                    </ul>
                </div>
                <div class="yc_search_content" v-if="directive">@@@@@@@@@@@@@@@@@@@</div>
            </div>
        </el-col>
        <el-col :xs="8" :sm="6" :md="8" :lg="8" :xl="10" style="padding-right:10px;">
            <div
                class="grid-content bg-purple yc_avatar_title"
                style="float:right"
                ref="user_setting"
                @click.stop="showUserSetting = !showUserSetting">
                <div class="yc_avatar">
                    <img :src="adminInfo.iconUrl" alt="" width="44px" height="44px" v-if="adminInfo.iconUrl">
                    <img src="./images/head.png" alt="" width="44px" height="44px" v-else>
                    <span class="yc_status"></span>
                </div>
                <div
                    class="yc_avatar_content"
                    v-show="showUserSetting"
                    @click.stop="showUserSetting = true">
                    <div class="login-user-profile">
                        <div class="clear head_portrait">
                            <div class="fl">
                                <img :src="adminInfo.iconUrl" alt="" width="44px" height="44px" v-if="adminInfo.iconUrl" style="border-radius:3px;">
                                <img src="./images/head.png" alt="" width="44px" height="44px" v-else>
                            </div>
                            <div class="fl" style="margin-left:20px">
                                <p>{{adminInfo.employeeName ? adminInfo.employeeName : '用户名'}}</p>
                                <p class="edit_adminInfo" @click="editAdminInfo = true;loadUserInfo()">编辑个人资料</p>
                            </div>
                        </div>
                    </div>
                    <div class="message_notification clear" @click="messageDialog = true">
                         <!-- @mouseenter="handleRotate" @mouseleave="handleRotate" -->
                        <img src="./images/xinxiaoxi.png" alt="" width="17px" height="16px" class="fl"  style="margin-top:3px;">
                        <div class="fl">新消息通知</div>
                        <img src="./images/xia.png" alt="" width="5px" height="10px" class="fr" style="margin-top:5px;" :class="rotate ? 'arrow-down' : 'arrow'">
                    </div>
                    <div class="edit_phoneNumber" @click="editTelephone = true">
                        <img src="./images/xiugaishoujihao.png" alt="" width="17px" height="16px" class="fl"  style="margin-top:3px;">
                        <div class="fl">修改手机号</div>
                        <img src="./images/xia.png" alt="" width="5px" height="10px" class="fr" style="margin-top:5px;">
                    </div>
                    <div class="change_password" @click="checkPassword">
                        <img src="./images/xiugaimima.png" alt="" width="17px" height="16px" class="fl"  style="margin-top:3px;">
                        <div class="fl">修改密码</div>
                        <img src="./images/xia.png" alt="" width="5px" height="10px" class="fr" style="margin-top:5px;">
                    </div>
                    <div class="change_password"  @click="dialogVisible = true">
                        <img src="./images/guanbi.png" alt="" width="17px" height="16px" class="fl"  style="margin-top:3px;">
                        <div class="fl">退出登录</div>
                        <img src="./images/xia.png" alt="" width="5px" height="10px" class="fr" style="margin-top:5px;">
                    </div>
                </div>
                <el-dialog
                    :visible.sync="dialogVisible">
                    <div
                        slot="title"
                        class="header-title clear"
                        style="border-bottom:1px solid #BFC2CC;height:42px;"
                    >
                        <div
                            style="width:8px;height:20px;background:#4278BE;float:left;margin-top:4px;margin-left:20px"
                        ></div>
                        <div
                            style="width:98px;height:31px;font-size:18px;font-family:MicrosoftYaHei;color:rgba(48,49,51,1);line-height:27px;float:left;margin-left:10px"
                        >提示</div>
                    </div>
                    <span>是否退出登录?</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false" style="width:109px;height:40px;border-radius:3px;border:1px solid rgba(66,120,190,1);color:#4278BE">取 消</el-button>
                        <el-button type="primary" @click="logout" style="width:109px;height:40px;background:#4278BE;color:#fff;border-radius:3px;">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </el-col>
        <div class="messageDialogs">
            <el-dialog
                :visible.sync="messageDialog">
                <div
                    slot="title"
                    class="header-title clear"
                    style="border-bottom:1px solid #BFC2CC;height:42px;"
                >
                <div
                        style="width:8px;height:20px;background:#4278BE;float:left;margin-top:4px;margin-left:20px"
                    ></div>
                    <div
                        style="width:98px;height:31px;font-size:18px;font-family:MicrosoftYaHei;color:rgba(48,49,51,1);line-height:27px;float:left;margin-left:10px"
                    >新消息通知</div>
                </div>
                <span>打开提示音</span>
                <el-switch
                    class="fr"
                    style="margin-right:20px;"
                    v-model="audioStatus"
                    active-color="#4278BE"
                    inactive-color="#FF6565">
                </el-switch>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" style="width:100%;height:40px;background:#4278BE;color:#fff;border-radius:3px;" @click="messageDialog = false">保存</el-button>
                </span>
            </el-dialog>
        </div>
        <div class="editPasswordDialog">
            <el-dialog
                :visible.sync="editPasswordDialog"
                :before-close="closePasswordDialog">
                <div
                    slot="title"
                    class="header-title clear"
                    style="border-bottom:1px solid #BFC2CC;height:42px;"
                >
                    <div
                        style="width:8px;height:20px;background:#4278BE;float:left;margin-top:4px;margin-left:20px"
                    ></div>
                    <div
                        style="width:98px;height:31px;font-size:18px;font-family:MicrosoftYaHei;color:rgba(48,49,51,1);line-height:27px;float:left;margin-left:10px"
                    >修改密码</div>
                </div>
                <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="原密码" prop="password" :error="errorMsg">
                        <el-input v-model.trim="passwordForm.password" type="password"  placeholder="请填写原密码" v-if="pwdType" clearable></el-input>
                        <el-input v-model.trim="passwordForm.password" placeholder="请填写原密码" v-else clearable></el-input>
                        <img :src="seen ? seenImg : unseenImg" @click="changeType()" class="eye_img" />
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword" :error="errPwdMsg">
                        <el-input v-model.trim="passwordForm.newPassword" type="password"  placeholder="请填写新密码" v-if="pwdType1" clearable></el-input>
                        <el-input v-model.trim="passwordForm.newPassword" placeholder="请填写新密码" v-else clearable></el-input>
                        <img :src="seen1 ? seenImg : unseenImg" @click="changeType1()" class="eye_img" />
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPassword">
                        <el-input v-model="passwordForm.confirmPassword" type="password"  placeholder="请填写新密码" v-if="pwdType2" clearable></el-input>
                        <el-input v-model="passwordForm.confirmPassword" placeholder="请填写新密码" v-else clearable></el-input>
                        <img :src="seen2 ? seenImg : unseenImg" @click="changeType2()" class="eye_img" />
                    </el-form-item>
                </el-form>
                <div style="display:none" >{{ exitsVal }}</div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" style="width:100%;height:40px;background:#BFC2CC;color:#909399;border-radius:3px;border:1px solid #BFC2CC" v-show="reg" :disabled="reg" @click="handleSubmitPassword">保存</el-button>
                    <el-button type="primary" style="width:100%;height:40px;background:#4278BE;color:#fff;border-radius:3px;" v-show="!reg" @click="handleSubmitPassword">保存</el-button>
                </span>
            </el-dialog>
        </div>
        <div class="slide_dialog" ref="slide_dialog" @click.stop="editAdminInfo = true"  v-show="editAdminInfo">
            <h4>编辑个人资料
                <span class="fr closeDialog" @click.stop="editAdminInfo = false">×</span>
            </h4>
            <div style="padding:20px 160px 0 80px">
                <el-form :model="adminForm" :rules="adminRules"  ref="adminForm" label-width="80px" class="adminForm">
                    <el-form-item label="头像:" style="margin-bottom:10px" class="adminUpload">
                        <el-upload
                            class="upload-demo"
                            :headers="head"
                            :http-request='submitUpload'
                            action="http://180.76.51.213:7003"
                        >
                        <div v-if="adminForm.fileList != ''" class="adminFile" @mouseenter.stop="changeAvatar = true" @mouseleave.stop="changeAvatar = false">
                            <img :src="adminForm.fileList" alt="" width="82px" height="82px" style="display:block;border-radius:3px;">
                            <div v-show="changeAvatar"  class="fileImg">
                                <img src="./images/bianji.png" alt="" width="18px" style="margin:61px 0 0 61px">
                            </div>
                        </div>
                        <div v-else class="adminFile" @mouseenter.stop="changeAvatar = true" @mouseleave.stop="changeAvatar = false">
                            <img src="./images/head.png" alt="" width="82px" style="display:block;border-radius:3px;">
                            <div  v-show="changeAvatar" class="fileImg">
                                <img src="./images/bianji.png" alt="" width="18px" style="margin:61px 0 0 61px">
                            </div>
                        </div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="姓名:" prop="name">
                        <el-input v-model="adminForm.name" @blur="InitializationName"></el-input>
                    </el-form-item>
                    <el-form-item label="电话:" >
                        <!-- <el-input v-model="adminForm.phone" ></el-input> -->
                        <p style="color:#909399">{{adminForm.phone}}</p>
                    </el-form-item>
                    <el-form-item label="邮箱:" >
                        <!-- <el-input v-model="adminForm.email" ></el-input> -->
                        <p style="color:#909399">{{adminForm.email ? adminForm.email : '暂未设置'}}</p>
                    </el-form-item>
                    <el-form-item label="性别:" prop="radio" style="margin-top:20px">
                        <el-radio-group v-model="adminForm.gender">
                            <el-radio :label="1">男</el-radio>
                            <el-radio :label="0">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <div class="slide_footer">
                    <el-button class="fr" style="width:80px;height:34px;;background:#4278BE;border-radius:3px;color:#fff;padding:0" @click="handleAdminInfo">保存</el-button>
                </div>
            </div>
        </div>
        <div class="editTelephone">
            <el-dialog
                :visible.sync="editTelephone"
                :before-close="closeEditTelephone">
                <div
                    slot="title"
                    class="header-title clear"
                    style="border-bottom:1px solid #BFC2CC;height:42px;"
                >
                <div style="width:8px;height:20px;background:#4278BE;float:left;margin-top:4px;margin-left:20px"></div>
                <div style="width:98px;height:31px;font-size:18px;font-family:MicrosoftYaHei;color:rgba(48,49,51,1);line-height:27px;float:left;margin-left:10px">修改手机号</div>
                </div>
                <el-form :model="telePhoneForm" :rules="telePhoneRule"  ref="telePhoneForm" label-width="100px" class="telePhoneForm">
                    <el-form-item :label="switchStatus ? '新手机' : '原手机'" prop="phone" :error="errorPhone">
                        <el-input v-model="telePhoneForm.phone" type="number" @input="checkPhone"  @blur="checkPhone" @focus="dialogVisibles = false" :placeholder="switchStatus ? '请填写新手机号码' :'请填写原手机号码'"></el-input>
                        <div class="el-icon-check" v-show="sendPhone"></div>
                    </el-form-item>
                    <el-form-item label="验证码" prop="newPassword" :error="errorVerificationCode">
                        <el-input v-model.trim="telePhoneForm.verificationCode" type="number"  placeholder="请填写验证码" class="fl" style="width:200px"></el-input>
                        <input
                            class="btn"
                            :class="disab ? 'btnclor' : ''"
                            type="button"
                            v-model="messageAuthenticationCode"
                            @click='getCodebtn'
                        :disabled = "disab"/>
                    </el-form-item>
                    <div  v-show="imageVerification">
                        <el-form-item label="图片验证码" prop="confirmPassword" :error="imgTitle">
                            <el-input 
                                type="text"
                                class="fl"
                                style="width:200px"
                                placeholder="请输入图片验证码"
                                v-model="imgVerificationCode" />
                            <div class="btn fl">
                                <img :src="imgVerificateCode" alt="" @click='getImgCode'>
                            </div>
                        </el-form-item>
                    </div>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <button type="button" :class="!reg ? 'editTelephoneBtn' : 'disBtn'" @click="handleLogins"  :disabled="reg" v-if="switchStatus">保存</button>
                    <button type="button" :class="!reg ? 'editTelephoneBtn' : 'disBtn'"  @click="handleLogin" :disabled="reg" v-else>下一步</button>
                </span>
            </el-dialog>
        </div>
        <messageDialog :Verificationmessage="Verificationmessage" :noticeDialog="dialogVisibles"></messageDialog>
        <shadeSetPassword :close="setPassword" :editPassword="true"></shadeSetPassword>
    </el-row>
</template>

<script>
import bus from '../../../modules/bus'
import unseen from "../register/images/1.png";
import seen from "../register/images/2.png";
import messageDialog from '../login/publics/messageDialog'
import shadeSetPassword from './publics/shadeSetPassword'
var RongIMLib = require('../../../../static/js/RongIMLib-2.5.0.js')
var Protobuf = require('../../../../static/js/protobuf-2.3.5.min.js')
// var RongIMEmoji = require('../../../../static/js/RongEmoji-2.2.7.js')
var RongIMClient = RongIMLib.RongIMClient
export default {
    name: 'Appheader',
    data() {
        var validatePassword = (rule, value, callback) => {
            var reSpace = /\s/g;
            if (reSpace.test(value)){
                return;
            }
            var reUpper = /[a-zA-Z]/;
            var reLower = /[a-z]/;
            var reNum = /[0-9]/;
            var count = 0;
            if (reLower.test(value)) {
                ++count;
            }
            if (reUpper.test(value)) {
                ++count;
            }
            if (reNum.test(value)) {
                ++count;
            }
            if (value.length < 6) {
                callback(new Error('请输入原密码'));
            } else if (count < 3) {
                callback(new Error('密码必须包含数字、字母，长度不低于6位'));
            } else if (value.length > 19) {
                callback(new Error('密码长度为6 - 18个字符'))
            } else {
                callback();
            }
        };
        var validatePass = (rule, value, callback) => {
            var reSpace = /\s/g;
            if (reSpace.test(value)){
                return;
            }
            var reUpper = /[a-zA-Z]/;
            var reLower = /[a-z]/;
            var reNum = /[0-9]/;
            var count = 0;
            if (reLower.test(value)) {
                ++count;
            }
            if (reUpper.test(value)) {
                ++count;
            }
            if (reNum.test(value)) {
                ++count;
            }
            if (value.length < 6) {
                callback(new Error('请输入新密码'));
            } else if (count < 3) {
                callback(new Error('密码必须包含数字、字母，长度不低于6位'));
            } else if (value.length > 19) {
                callback(new Error('密码长度为6 - 18个字符'))
            }else {
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请再次输入密码'));
            } else if (value !== this.passwordForm.newPassword) {
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        };
        var nametxt = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入姓名'))
            } else {
                var reg =  /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,6}$/
                if (value.length > 1 && reg.test(value)) {
                callback()
                } else {
                return callback(new Error('请输入2-6个汉字'))
                }
            }
        }
        return {
            orgManager:'orgManager',
            ssoManager:'ssoManager',
            isShow: false ||JSON.parse(window.sessionStorage.getItem('showHeader')),
            setPassword: false,
            searchShow: false,
            Verificationmessage:'',
            dialogVisibles:false,
            instruction: false,
            directive: false,
            showUserSetting: false,
            historyShow:false,
            search: '',
            status: '1',
            data: [],
            JsonsData: [
                { id:1, name: '/activity', value: '查询某人的活动' },
                { id:2, name: '/bctivity', value: '查询某人的活动' },
                { id:3, name: '/cctivity', value: '查询某人的活动' },
                { id:4, name: '/dctivity', value: '查询某人的活动' },
                { id:5, name: '/ectivity', value: '查询某人的活动' },
                { id:6, name: '/fctivity', value: '查询某人的活动' },
                { id:7, name: '/gctivity', value: '查询某人的活动' },
                { id:8, name: '/hctivity', value: '查询某人的活动' },
                { id:9, name: '/ictivity', value: '查询某人的活动' },
                { id:10, name: '/activity', value: '查询某人的活动' },
                { id:11, name: '/activity', value: '查询某人的活动' },
                { id:12, name: '/activity', value: '查询某人的活动' },
                { id:13, name: '/activity', value: '查询某人的活动' },
                { id:14, name: '/activity', value: '查询某人的活动' },
                { id:15, name: '/activity', value: '查询某人的活动' },
                { id:16, name: '/activity', value: '查询某人的活动' }
            ],
            rotate:false,
            historyData: [],
            options: [],
            passwordForm:{
                password: '',
                newPassword:'',
                confirmPassword:''
            },
            ifExist:'',                   //验证三个密码是否为空
            passwordRules:{
                password:[
                    { required: true, validator: validatePassword, trigger: 'blur' },
                ],
                newPassword:[
                    { required: true, validator: validatePass, trigger: 'blur' },
                ],
                confirmPassword:[
                    { required: true, validator: validatePass2, trigger: 'blur' },
                ]
            },
            sendPhone:false,
            adminForm:{
                fileList:'',
                name:'',
                phone:'',
                email:'',
                gender:'',
            },
            adminRules:{
                name: { required: true, validator: nametxt, trigger: 'blur' },
            },
            head: {
                Platform: 'H5',
                Access_Token: sessionStorage.getItem('token')
            },
            telePhoneForm:{
                phone:'',
                verificationCode:'',
            },
            telePhoneRule:{
                phone:[
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { min:11, max: 11, message: '请输入手机号码', trigger: 'blur' },
                ]
            },
            areaCode:'86',
            messageAuthenticationCode:"获取验证码",//验证码按钮内容
            imgVerificationCode:'',
            imgVerificateCode:'',
            imageVerification:false,              ////图片验证码隐藏
            disab:false,
            countDownTime:60,
            errorPhone:'',
            errorVerificationCode:'',
            imgTitle:'',
			unseenImg:unseen,	                  //看不见图片
            seenImg :seen,
            pwdType:true, 		                  //此时文本框隐藏，显示密码框
            seen:true,  			              //眼睛显示状态
            pwdType1:true, 		                  //此时文本框隐藏，显示密码框
            seen1:true,  			              //眼睛显示状态
            pwdType2:true, 		                  //此时文本框隐藏，显示密码框
            seen2:true,  			              //眼睛显示状态
            errorMsg:'',                           //旧密码错误提示
            errPwdMsg:'',                         //新密码错误提示
            reg:false,
            changeAvatar:false,                   //头像阴影
            switchStatus:false,                    // 修改手机号   切换下一步 完成按钮
            audioStatus:false,
            messageDialog:false,
            dialogVisible:false,
            editPasswordDialog:false,
            editAdminInfo:false,
            editTelephone:false,
            adminInfo:JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO'))
        }
    },
    created() {
        this.queryCompany()
        this.loadUserInfo()
    },
    components: {
        messageDialog,
        shadeSetPassword,
    },
    computed:{
        exitsVal:function(){
            this.ifExist=Number(Boolean(this.passwordForm.password))+Number(Boolean(this.passwordForm.newPassword))+Number(Boolean(this.passwordForm.confirmPassword));
        }
    },
    watch:{
        switchStatus (newval) {
            this.telePhoneForm.phone = ''
            this.telePhoneForm.verificationCode = ''
            clearTimeout(this.Timeout)
            this.disab = true
            this.reg = true
            this.errorPhone = ''
            this.errorVerificationCode = ''
            this.imgTitle = ''
            this.imageVerification = false
            this.sendPhone = false
            this.countDownTime = 60
            this.messageAuthenticationCode = '获取验证码'
        },
        editTelephone () {
            this.telePhoneForm.phone = ''
            this.telePhoneForm.verificationCode = ''
            clearTimeout(this.Timeout)
            this.disab = true
            this.sendPhone = false
            this.messageAuthenticationCode = '获取验证码'
            this.switchStatus = false
        },
        ifExist(newVal,oldVal){
            if(Number(newVal) === 3){
                this.reg = false
            }else{
                this.reg = true
            }
        }
    },
    methods: {
        closeEditTelephone() {
            this.$refs.telePhoneForm.clearValidate()
            this.$refs.telePhoneForm.resetFields();
            this.editTelephone = false
        },
        closePasswordDialog () {
            this.editPasswordDialog = false
            this.$refs.passwordForm.clearValidate()
            this.$refs.passwordForm.resetFields();
        },
        searhInput() {
            if (window.localStorage.getItem('command') != null) {
                this.historyData = JSON.parse(window.localStorage.getItem('command'))
            }
            if (this.search.slice(0, 1) === '/') {
                this.instruction = true
                this.directive = false
                this.searchShow = false
                this.historyShow = false
                let _search = this.search.toLowerCase()
                let newListData = [] //  用于存放搜索出来数据的新数组
                if (_search) {
                    this.JsonsData.filter(item => {
                        if (item.name.toLowerCase().indexOf(_search) !== -1) {
                            newListData.push(item)
                        }
                    })
                }
                this.data = newListData
            } else if (this.search.slice(0, 1) === '@') {
                this.directive = true
                this.historyShow = false
                this.searchShow = false
                this.instruction = false
            } else if (this.search.trim().length > 0){
                this.directive = false
                this.searchShow = true
                this.historyShow = false
                this.instruction = false
            }else if (this.historyData.length > 0 && this.search.length === 0){
                this.directive = false
                this.searchShow = false
                this.historyShow = true
                this.instruction = false
            }else {
                this.directive = false
                this.searchShow = false
                this.historyShow = false
                this.instruction = false
            }
        },
        queryCompany () {
            this.$http({
                method:'GET',
                url: this.orgManager + '/v1/organization/cerelation/' + this.adminInfo.id,
            }).then(res => {
                if (res.data.code == 200) {
                    this.options = res.data.data
                }
            })
        },
        loadUserInfo () {
            this.$http({
                method:'GET',
                url:this.ssoManager + `/v1/user/userInfo/my/${this.adminInfo.id}`
            }).then(res => {
                // console.log(res.data)
                if (res.data.code == 200) {
                    this.adminForm.fileList = res.data.data.iconUrl
                    this.adminForm.name = res.data.data.employeeName
                    this.adminForm.phone = res.data.data.phone
                    this.adminForm.email = res.data.data.employeeEmail
                    this.adminForm.gender = res.data.data.employeeGender
                    this.adminInfo.iconUrl = res.data.data.iconUrl
                    this.adminInfo.employeeName = res.data.data.employeeName
                    this.adminInfo.phone = res.data.data.phone
                    this.adminInfo.employeeEmail = res.data.data.employeeEmail
                    this.adminInfo.employeeGender = res.data.data.employeeGender
                    window.sessionStorage.teamEmployeeDetailVO = JSON.stringify(this.adminInfo)
                }
            })
        },
        addTeam () {
            this.$router.push({name:'searchTeam'})
            window.sessionStorage.setItem('currentView', 'mailList')
            bus.$emit('pushRefresh','mailList')
        },
        //当用户将文本框置空后，失去焦点时候，显示未修改前的数据
        InitializationName () {
            if (this.adminForm.name == '') {
                this.adminForm.name = this.adminInfo.employeeName
            }
        },
        handleSubmitPassword () {
            this.$refs.passwordForm.validate((valid) => {
            if (valid) {
                this.$http({
                    method:'POST',
                    url: this.ssoManager + '/v1/user/userInfo/updateNewPassword',
                    data:{
                        oldPassword:this.passwordForm.password,
                        newPassword:this.passwordForm.confirmPassword,
                        userId:this.adminInfo.id
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.editPasswordDialog = false
                        this.$message({
                            type:'success',
                            message:'修改密码成功'
                        })
                    }
                    else if (res.data.code == 501103202) {
                        this.errorMsg = String(Math.random())
                        this.$nextTick( () => {
                            this.errorMsg = res.data.message
                        })
                    }else if (res.data.code == 501101304){
                        this.errorMsg = String(Math.random())
                        this.$nextTick( () => {
                            this.errorMsg = res.data.message
                        })
                    }else {
                        this.errorMsg = String(Math.random())
                        this.$nextTick( () => {
                            this.errorMsg = res.data.message
                        })
                    }
                })
                // this.editPasswordDialog = false
                // this.errorMsg = '原密码错误请重新输入'
            } else {
                return false;
            }
            });
        },
        checkPassword () {
            this.$http({
                method:'GET',
                url:this.ssoManager + '/v1/user/userInfo/' + this.adminInfo.id
            }).then(res => {
                if (res.data.data == false) {
                    this.setPassword = true
                }else {
                    this.editPasswordDialog = true
                }
            })
        },
        //密码的显示隐藏
  		changeType:function(){
  			this.seen = !this.seen;//小眼睛的变化
  			this.pwdType=!this.pwdType;//跟着小眼睛变化，密码框隐藏显示文本框，内容就显示了
  		},
         //密码的显示隐藏
  		changeType1:function(){
  			this.seen1 = !this.seen1;//小眼睛的变化
  			this.pwdType1=!this.pwdType1;//跟着小眼睛变化，密码框隐藏显示文本框，内容就显示了
  		},
        //密码的显示隐藏
  		changeType2:function(){
  			this.seen2 = !this.seen2;//小眼睛的变化
  			this.pwdType2=!this.pwdType2;//跟着小眼睛变化，密码框隐藏显示文本框，内容就显示了
  		},
        myCompany () {
            if (this.adminInfo.companyName == '') {
                this.$message({
                    type:'error',
                    message:'请先加入团队'
                })
            }else {
                var obj = {
                    id: this.adminInfo.id,
                    label: this.adminInfo.companyName,
                    companyId:this.adminInfo.companyId,
                }
                window.sessionStorage.setItem('companyObj',JSON.stringify(obj))
                this.$router.push({name:'frameWork'})
                window.sessionStorage.setItem('companyStatus',false)
                bus.$emit('pushRefresh',true)
            }
        },
        handleRotate () {
            this.rotate=!this.rotate
        },
        hideSettingUser(e) {
            if (this.messageDialog || this.editPasswordDialog || this.editTelephone) {
            }else {
                if (!this.$refs.user_setting.contains(e.target)) {
                    this.showUserSetting = false
                }
            }
            if (!this.$refs.yc_search.contains(e.target)) {
                this.searchShow = false
                this.instruction = false
                this.directive = false
                this.historyShow = false
                this.search = ''
            }
            if (!this.$refs.show_title.contains(e.target)) {
                this.isShow = false
            }
            if (!this.$refs.slide_dialog.contains(e.target)) {
                this.editAdminInfo = false
                this.$refs.adminForm.clearValidate()
            }

        },
        chatWith() {
            bus.$emit('navmenuStatus', this.status)
        },
        getTokenData(item) {
            if (window.localStorage.getItem('command') != null) {
                var arr = JSON.parse(window.localStorage.getItem('command'))
                arr.push(item)
                let hash = {};
                const newArr = arr.reduceRight((item, next) => {
                    hash[next.id] ? '' : hash[next.id] = true && item.push(next);
                    return item
                }, []);
                window.localStorage.setItem('command', JSON.stringify(newArr))
            }else {
                window.localStorage.setItem('command', JSON.stringify([item]))
            }
            this.historyShow = false
            this.instruction = false
        },
        checkTitle(item) {
            this.value = item.companyName
            this.$http({
                method:'POST',
                url: this.ssoManager + '/v1/user/base/login/changeUserTeam',
                //  url:'http://192.168.50.193:8012/v1/user/base/login/changeUserTeam',
                data:{
                    phoneNumber:this.adminInfo.phone,
                    teamUserId:this.adminInfo.id,
                    companyId:item.companyId
                }
            }).then(res => {
                if (res.data.code == 200) {
                    window.sessionStorage.functionPermissionList = JSON.stringify(res.data.data.functionPermissionList)
                    window.sessionStorage.teamEmployeeDetailVO = JSON.stringify(res.data.data.teamEmployeeDetailVO)
                    window.sessionStorage.teamAdminRangeVOList = JSON.stringify(res.data.data.teamAdminRangeVOList)
                    window.sessionStorage.userInfoJoinApplyRegVOList = JSON.stringify(res.data.data.userInfoJoinApplyRegVOList)
                }
                this.$router.go(0)
                window.sessionStorage.setItem('showHeader',false)
            })
        },
        handleLogin () {
            this.$http({
                method:"POST",
                url:this.ssoManager + "/v1/user/base/login/smsLogin",
                data:{
                    phoneNumberPrefix:this.areaCode,
                    phoneNumber:this.telePhoneForm.phone, 
                    smsCode:this.telePhoneForm.verificationCode,
                    pictureCode:this.imgVerificationCode,
                },
            }).then(res => {
                if(res.data.sysCode == 200 && res.data.code == 200){
                    this.switchStatus = true
                }//需要短信验证码
                else if(res.data.code == 501102201){
                    this.errorVerificationCode = String(Math.random())
                    this.$nextTick( () => {
                        this.errorVerificationCode = "请输入短信验证码"
                    })
                }//短信验证码错误	
                else if(res.data.code == 501102202 || res.data.code == 501102203){
                    this.errorVerificationCode = String(Math.random())
                    this.$nextTick( () => {
                        this.errorVerificationCode = res.data.message;
                    })
                    this.getImgCode();
                    this.imgVerificationCode = "";
                }//需要图片验证码 	
                else if(res.data.code == 501100102){
                    this.imgTitle = String(Math.random())
                    this.$nextTick( () => {
                        this.imgTitle = "您的验证码错误次数已超过三次,请输入图片验证码";
                    })
                    this.imageVerification = true
                    this.getImgCode();
                }//图片验证码错误	
                else if(res.data.code == 501100103){
                    this.imgTitle = String(Math.random())
                    this.$nextTick( () => {
                        this.imgTitle = "您的验证码错误次数已超过三次,请输入图片验证码";
                    })
                    this.imgVerificationCode = "";
                    this.verificationTitle = "";
                    this.imageVerification = true
                    this.getImgCode();
                }
                else{
                    this.$message.error(res.data.message)
                }
            })
        },
        handleLogins(){
                this.$http({
                    method:"post",
                    // url: this.ssoManager + "/v1/user/base/reg/regUserInfo",
                    url: this.ssoManager + "/v1/user/userInfo/checkNewPhone",
                    data:{
                        phoneNumberPrefix:this.areaCode,
                        phoneNumber:this.adminInfo.phone,
                        newPhoneNumber:this.telePhoneForm.phone,
                        smsCode:this.telePhoneForm.verificationCode,
                        pictureCode:this.imgVerificationCode,
                    },
                }).then(res => {
					if(res.data.sysCode !== 200 || res.data.code !== 200){
                        this.verificationTitle = String(Math.random())
                        this.$nextTick( () => {
                            this.verificationTitle = "校验码短信发送失败"
                        })
					}//注册成功
                    if(res.data.sysCode == 200 && res.data.code == 200){
                        this.editTelephone = false
                        this.$http({
                            method:'POST',
                            url: this.ssoManager + '/v1/user/userInfo/updateUserInfo',
                            data:{
                                id:this.adminInfo.id,
                                iconUrl:this.adminForm.fileList,
                                name:this.adminForm.name,
                                teamUserTel:this.telePhoneForm.phone || this.adminForm.phone,
                                employeeEmail:this.adminForm.email,
                                sex:this.adminForm.gender ? this.adminForm.gender : 1,
                            }
                        }).then(res => {
                            if (res.data.code == 200) {
                                this.$message({
                                    type:'success',
                                    message:res.data.message
                                })
                                window.sessionStorage.teamEmployeeDetailVO = JSON.stringify(res.data.data.teamEmployeeDetailVO)
                                this.adminInfo = res.data.data.teamEmployeeDetailVO
                                this.loadUserInfo()
                                this.switchStatus = false
                                this.editTelephone = false
                                this.editAdminInfo = false
                            }
                        })
                    }//注册失败
                    else if(res.data.code == 501101301){
                        this.$message.error("修改失败")
                    }//需要短信验证码
                    else if(res.data.code == 501101201){
                        this.errorVerificationCode = String(Math.random())
                        this.$nextTick( () => {
                            this.errorVerificationCode = "请输入短信验证码"
                        })
                    }//短信验证码错误	
                    else if(res.data.code == 501101202 || res.data.code == 501101203){
						this.errorVerificationCode = String(Math.random())
                        this.$nextTick( () => {
                            this.errorVerificationCode = ""
                        })
                        this.verificationTitle = String(Math.random())
                        this.$nextTick( () => {
                            this.verificationTitle = res.data.message;
                        })
                        // this.dialogVisible = true
                        // this.Verificationmessage = res.data.message
                        this.changeColor = true;
                        this.getImgCode();
                        this.imgVerificationCode = "";
                    }
                    //需要图片验证码 	
					else if(res.data.code == 501100102){
                        this.imgTitle = String(Math.random())
                        this.$nextTick( () => {
                            this.imgTitle = "您的验证码错误次数已超过三次,请输入图片验证码";
                        })
                        this.imageVerification = true
                        this.getImgCode();
					}//图片验证码错误	
					else if(res.data.code == 501100103){
                        this.imgTitle = String(Math.random())
                        this.$nextTick( () => {
                            this.imgTitle = res.data.message
                        })
                        this.imgVerificationCode = "";
                        this.verificationTitle = "";
                        this.imageVerification = true
                        this.getImgCode();
					}//提示信息手机号码已注册，引导注册
					else if(res.data.code == 501102107){
                        // this.phoneTitle = res.data.message;
                        this.sendPhone = false;
                        this.verificationTitle = "";
                        this.this.errorPhone = String(Math.random())
                        this.$nextTick( () => {
                            this.errorPhone = res.data.message
                        })
                    }
                    else if(res.data.code == 501101102){
                        this.sendPhone = false;
                        this.verificationTitle = "";
                        this.this.errorPhone = String(Math.random())
                        this.$nextTick( () => {
                            this.errorPhone = res.data.message
                        })
                    }
                    else if(res.data.code == 501102106){
                        this.sendPhone = false;
                        this.verificationTitle = "";
                        this.errorPhone = String(Math.random())
                        this.$nextTick( () => {
                            this.errorPhone = res.data.message
                        })
                    }
					else{
						this.$message.error(res.data.message)
					}
                })
        },
        handleAdminInfo () {
            console.log(this.adminForm.gender)
            this.$refs.adminForm.validate((valid) => {
            if (valid) {
                this.$http({
                    method:'POST',
                    url: this.ssoManager + '/v1/user/userInfo/updateUserInfo',
                    data:{
                        id:this.adminInfo.id,
                        iconUrl:this.adminForm.fileList,
                        name:this.adminForm.name,
                        teamUserTel:this.telePhoneForm.phone || this.adminForm.phone,
                        employeeEmail:this.adminForm.email,
                        sex:this.adminForm.gender,
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        this.$message({
                            type:'success',
                            message:res.data.message
                        })
                        window.sessionStorage.teamEmployeeDetailVO = JSON.stringify(res.data.data.teamEmployeeDetailVO)
                        this.adminInfo = res.data.data.teamEmployeeDetailVO
                        this.loadUserInfo()
                        this.switchStatus = false
                        this.editTelephone = false
                        this.editAdminInfo = false
                    }
                })
            } else {
                return false;
            }
            });
        },
        submitUpload: function(content) {//自定义的上传图片的方法
            let formData = new FormData;
            formData.append('file', content.file,content.file.name);
            var that = this
            this.$http({
                method: "POST",
                url: "/uploadManager/v1/feign/upload/uploadFile",
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formData
            }).then(function(response) {
                    if (response.data.code == 200) {
                        that.adminForm.fileList = response.data.data[0].absolutePath
                    }else {
                        this.$message({
                            type:'error',
                            message:'上传图片失败'
                        })
                    }
                })
                .catch(function(error) {
                })
        },
        //验证手机号
        checkPhone () {
            if (this.telePhoneForm.phone.length == 11 ) {
                // errorPhone
                this.$http({
                method:"get",
                // url:"https://result.eolinker.com/7hUBFSf3c24e3ab4d7c9a88a6d8c4566a61bf0d55f38d5a?uri this.ssoManager + =/v1/user/base/phone/reg",
                url: this.ssoManager + "/v1/user/base/reg/phone",
                params:{
                    phoneNumber:this.telePhoneForm.phone,
                    phoneNumberPrefix:this.areaCode,
                },
            }).then( res => {
                if(res.data.sysCode == 200 && res.data.code == 200){
                        this.sendPhone = false;
                        // this.disab = false;
                        if(this.countDownTime == 60){
                            this.disab = false;
                        }
                        if(res.data.data.lock){
                            this.errorPhone = String(Math.random())
                            this.$nextTick( () => {
                                this.errorPhone = '该手机号已锁定，请明日再试'
                            })
                            this.dialogVisibles = true
                            this.disab = true;
                            this.Verificationmessage = '该手机号已锁定，请明日再试'
                        //成功，手机号注册过
                        }else if(res.data.data.reg){
                            this.sendPhone = true;
                        }
                        else if (this.switchStatus == false){
                            this.errorPhone = String(Math.random())
                            this.$nextTick( () => {
                                this.errorPhone = "该手机号未注册"
                                this.disab = true
                            })
                        }
                    }//手机号码无效
                    else if(res.data.code == 501100101){
                        this.errorPhone = String(Math.random())
                        this.$nextTick( () => {
                            this.errorPhone = res.data.message;
                        })
                    }
                    else if (this.switchStatus == false) {
                        this.errorPhone = String(Math.random())
                        this.$nextTick( () => {
                            this.errorPhone = res.data.message;
                        })
                    }
            })
            }else if (this.telePhoneForm.phone.length > 11) {
                this.telePhoneForm.phone = this.telePhoneForm.phone.slice(0,11)
            }
        },
        //获取短信验证码
        getCodebtn:function () {
            this.disab = true;
            if(this.sendPhone && this.switchStatus == false){
                this.Timeout = setTimeout(this.enableCodeBtn,1000);
                if(this.telePhoneForm.phone && this.areaCode){
                    this.$http({
                        method:"get",
                        url:this.ssoManager + "/v1/user/base/login/loginSmsCodeOfSet",
                        // url:"/v1/user/base/reg/getSmsCode",
                        params:{
                            phoneNumber:this.telePhoneForm.phone,
                            phoneNumberPrefix:this.areaCode,
                            pictureCode:this.imgVerificationCode,
                        },
                    }).then( res => {
                        this.errorVerificationCode = String(Math.random())
                        this.$nextTick( () => {
                            this.errorVerificationCode = res.data.message;
                        })
						//验证码发送成功
                        if(res.data.sysCode == 200 && res.data.code == 200){
                            this.errorVerificationCode = String(Math.random())
                            this.$nextTick( () => {
                                this.errorVerificationCode = "校验码短信已发送，有效时间为5分钟，请及时查收"
                            })
                            this.disab = true;
                            this.reg = false;
                            this.errorVerificationCode = String(Math.random())
                            this.$nextTick( () => {
                                this.errorVerificationCode = '';
                            })
                            this.imageVerification = false
                            // this.disabreg = false
                        }//无效手机号码 该手机号码未注册
                        else if(res.data.code == 501100101 || res.data.code == 501102101){
                            this.errorPhone = res.data.message;
                            this.sendPhone = false;
                            this.reg = true
                            this.errorVerificationCode = String(Math.random())
                            this.$nextTick( () => {
                                this.errorVerificationCode = '';
                            })
                        }//短信验证码错误501102202 501102203
                        else if(res.data.code == 501102202 || res.data.code == 501102203){
                            this.telePhoneForm.verificationCode = "";
                            this.getImgCode();
						}//需要图片验证码
						else if(res.data.code == 501100102){
                            this.disab = false;
                            clearTimeout(this.Timeout);
                            this.errorVerificationCode = String(Math.random())
                            this.$nextTick( () => {
                                this.errorVerificationCode = "您获取验证码的次数已超过三次，请输入图片验证码"
                            })
                            this.imageVerification = true;
                            this.imgTitle = "";
                            this.reg = true
							// this.disabreg = true;
                            this.imgVerificateCode = this.$http.defaults.baseURL + this.ssoManager + "/v1/user/base/reg/pictureCode?phoneNumberPrefix=" + this.areaCode + "&phoneNumber=" + this.phoneNum;
                            this.getImgCode() 
						}//图片验证码错误
						else if(res.data.code == 501100103){
                            this.imgTitle = String(Math.random())
                            this.$nextTick( () => {
                                this.imgTitle = res.data.message
                            })
                            this.disab = false
                            clearTimeout(this.Timeout);
                            this.countDownTime = 60
                            this.errorVerificationCode = String(Math.random())
                            this.$nextTick( () => {
                                this.errorVerificationCode = '';
                            })
                            this.imgVerificationCode = "";
                            this.reg = true
                            this.getImgCode() 
						}//提示信息手机号码已注册，引导注册/该手机号码已锁定
						else if(res.data.code == 501102102 || res.data.code == 501102205){
                            this.errorPhone = String(Math.random())
                            this.$nextTick( () => {
                                this.errorPhone = res.data.message;
                            })
                            this.sendPhone = false;
                            clearTimeout(this.Timeout);
                            this.imageVerification = false
                            this.reg = true
                            this.switchStatus = false
                            this.errorVerificationCode = String(Math.random())
                            this.$nextTick( () => {
                                this.errorVerificationCode = '';
                            })
						}//弹框提示短信验证码过于频繁 501102204
						else{
							this.$message.error(res.data.message)
						}
                    })
                }else{
                    return
                }
            }
            if(this.switchStatus == true){
                this.Timeout = setTimeout(this.enableCodeBtn,1000);
                this.$http({
                    method:"get",
                    url:this.ssoManager + "/v1/user/base/reg/getSmsCode",
                    // url:"/v1/user/base/reg/getSmsCode",
                    params:{
                        phoneNumber:this.telePhoneForm.phone,
                        phoneNumberPrefix:this.areaCode,
                        pictureCode:this.imgVerificationCode,
                    },
                }).then( res => {
                    this.errorVerificationCode = String(Math.random())
                        this.$nextTick( () => {
                            this.errorVerificationCode = res.data.message;
                        })
                    //验证码发送成功
                    if(res.data.sysCode == 200 && res.data.code == 200){
                        this.errorVerificationCode = "校验码短信已发送，有效时间为5分钟，请及时查收"
                        this.disab = true;
                        this.reg = false;
                        this.errorVerificationCode = String(Math.random())
                        this.$nextTick( () => {
                            this.errorVerificationCode = '';
                        })
                        this.imageVerification = false
                        // this.disabreg = false
                    }//无效手机号码 该手机号码未注册
                    else if(res.data.code == 501100101 || res.data.code == 501102101){
                        this.errorPhone = res.data.message;
                        this.sendPhone = false;
                        this.reg = true
                        this.errorVerificationCode = String(Math.random())
                        this.$nextTick( () => {
                            this.errorVerificationCode = '';
                        })
                    }//短信验证码错误501102202 501102203
                    else if(res.data.code == 501102202 || res.data.code == 501102203){
                        this.telePhoneForm.verificationCode = "";
                        this.getImgCode();
                    }//需要图片验证码
                    else if(res.data.code == 501100102){
                        this.disab = false;
                        clearTimeout(this.Timeout);
                        this.errorVerificationCode = String(Math.random())
                        this.$nextTick( () => {
                            this.errorVerificationCode = "您获取验证码的次数已超过三次，请输入图片验证码"
                        })
                        this.imageVerification = true;
                        this.imgTitle = "";
                        this.reg = true
                        // this.disabreg = true;
                        this.imgVerificateCode = this.$http.defaults.baseURL + this.ssoManager + "/v1/user/base/reg/pictureCode?phoneNumberPrefix=" + this.areaCode + "&phoneNumber=" + this.phoneNum;
                        this.getImgCode() 
                    }//图片验证码错误
                    else if(res.data.code == 501100103){
                        this.imgTitle = String(Math.random())
                        this.$nextTick( () => {
                            this.imgTitle = res.data.message
                        })
                        this.countDownTime = 60
                        this.errorVerificationCode = String(Math.random())
                        this.$nextTick( () => {
                            this.errorVerificationCode = '';
                        })
                        this.imgVerificationCode = "";
                        this.reg = true
                        this.disab = false
                        clearTimeout(this.Timeout);
                        this.getImgCode() 
                    }//提示信息手机号码已注册，引导注册/该手机号码已锁定
                    else if(res.data.code == 501102102){
                        this.errorPhone = res.data.message;
                        this.sendPhone = false;
                        clearTimeout(this.Timeout);
                        this.imageVerification = false
                        this.reg = true
                        // this.switchStatus = false
                        this.errorVerificationCode = String(Math.random())
                        this.$nextTick( () => {
                            this.errorVerificationCode = '';
                        })
                    }//弹框提示短信验证码过于频繁 501102204
                    else{
                        this.$message.error(res.data.message)
                    }
                })
            }
        },
        enableCodeBtn:function () {
			this.disab = true;
            if(this.countDownTime > 0) {
                this.messageAuthenticationCode =  this.countDownTime + 's';
                this.Timeout = setTimeout(this.enableCodeBtn, 1000);  //1秒后再次调用自己
                this.countDownTime--;
            } else {
                clearTimeout(this.Timeout);
                this.disab=false;
                this.messageAuthenticationCode = "获取验证码";
                this.countDownTime = 60;
            }
        },
        getImgCode(){
            this.$http({
                method:"get",
                url: this.ssoManager + `/v1/user/base/reg/pictureCode?phoneNumberPrefix=${this.areaCode}&phoneNumber=${this.telePhoneForm.phone}`,
            }).then((res) => {
                this.imgVerificateCode =  'data:image/png;base64,' + res.data.data.pictureBase64;
            })
        },
        logout () {
            this.$router.replace({name:'login',path:'/login',query:{id:false}})
            window.sessionStorage.clear()
			//这里直接清空本地存储的融云token和appkey
			if(RongIMClient.getInstance()) {
				RongIMClient.getInstance().disconnect()
			}
			window.localStorage.clear()

		}
    },
    mounted() {
        // document.addEventListener('click',this.hideTitle)
        document.addEventListener('click', this.hideSettingUser)
        bus.$on('adminDetial',obj => {
            this.adminInfo = obj
            this.adminForm.fileList = obj.iconUrl
            this.adminForm.name = obj.employeeName
            this.adminForm.phone = obj.phone
            this.adminForm.email = obj.employeeEmail
            this.adminForm.gender = obj.employeeGender
        })
    },
    beforeDestroy() {
        // document.addEventListener('click',this.hideTitle)
        document.removeEventListener('click', this.hideSettingUser)
    }
}
</script>

<style lang="scss">
.yc_title {
    /* float: left; */
    /* overflow: hidden; */
}
.yc_message {
    .el-dialog__header {
        padding: 20px 0 10px;
    }
    .el-dialog__body {
        padding: 20px;
    }
}
.yc_title .el-input__inner {
    border: none;
    color: #ffffff;
    font-size: 15px;
    // font-weight: 700px;
    background-color: #4278be;
    // height:20px;
}
.yc_title .yc_title_show {
    position: relative;
    float: left;
    margin-left: 20px;
    font-size: 14px;
    font-weight: 600;
    line-height: 58px;
    cursor: pointer;
}

.yc_title_content {
    position: absolute;
    width:400px;
    height:392px;
    background:rgba(248,248,248,1);
    box-shadow:1px 1px 4px 0px rgba(191,194,204,0.7);
    top: 58px;
    left:0px;
    z-index: 9999;
}
.yc_title_content ul {
    height: 300px;
    overflow: auto;
    color: #303133;
}
.yc_title_content .yc_content_hover {
    height: 45px;
    line-height: 45px;
    padding: 0 20px;
    border-bottom: 1px solid #BFC2CC;
    overflow: hidden;
}
.yc_title .yc_team {
    height:46px;
    width:200px;
    padding:12px 54px;
    color:#303133;
    float:left;
    border-right:1px solid #BFC2CC;
    box-sizing: border-box;
}
.yc_title .yc_team:last-child {
    border-right:none;
}
.yc_title .yc_team:hover {
    cursor: pointer;
}
.yc_title_content ul::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}
.yc_title_content ul::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #535353;
}
.yc_title_content ul::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
}
.divider {
    display: block;
    padding-right: 20px;
    margin-left: 20px;
    box-sizing: border-box;
    width: 94%;
    border-bottom: 1px #ccc solid;
}
.yc_content_hover:hover {
    cursor: pointer;
}
.yc_iconfont {
    margin-left: 30px;
    margin-right: 30px;
    line-height: 60px;
}
.yc_iconfont a {
    color: #ffffff;
}
.yc_avatar {
    position: relative;
    height: 45px;
    width: 45px;
    background-color: #ffffff;
    border-radius: 3px;
}
.yc_status {
    position: absolute;
    display: block;
    width: 12px;
    height: 12px;
    bottom: -1px;
    right: -1px;
    border-radius: 50%;
    background-color: #58b358;
}
.yc_search {
    position: relative;
    margin-bottom: 10px;
}
.yc_search_content {
    position: absolute;
    width: 100%;
    top: 40px;
    border-radius: 5px;
    background-color: #ffffff;
    color: black;
    z-index: 99999;
}
.yc_search_title {
    margin: 10px 0px;
    padding: 0 20px;
    color: #ccc;
}
.yc_content_list {
    display: flex;
    overflow: hidden;
    padding: 8px 20px;
}
.yc_content_list img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
}
.yc_content_list > span {
    line-height: 40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.yc_content_list:hover {
    background-color: #cccccc;
}
.yc_avatar_title {
    position: relative;
    height: 58px;
    padding: 6px 10px 0 10px;
    box-sizing: border-box;
    .el-dialog{
        width:409px !important;
        height:209px !important;
        margin-top: 30vh !important;
    }
}
.yc_avatar_content {
    position: absolute;
    width: 400px;
    top: 58px;
    left: -340px;
    background-color: #ffffff;
    color: black;
    z-index: 9;
    box-shadow:0px 2px 22px 0px rgba(58, 65, 74, 0.2);
}
.yc_avatar_title:hover {
    background-color: #5a5c98;
}
.command {
    max-height: 418px;
    overflow: auto;
    padding-top: 10px;
}
.command li {
    height: 38px;
    padding: 0 20px;
    line-height: 38px;
}
.command li>span:first-child {
    float: left;
}
.command li>span:last-child {
    float: right;
}
.command li:hover {
    background-color: #edebe9;
}
.command::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}
.command::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #4278BE;
}
.command::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #F8F8F8;
}
.head_portrait {
    padding: 16px 0 10px 20px;
    border-bottom: 1px solid #EDEFF2;
}
.message_notification {
    cursor: pointer;
    height: 55px;
    box-sizing: border-box;
    padding: 16px 20px;
    border-bottom: 1px solid #EDEFF2;
    div{
        margin-left: 18px;
    }
}
.edit_phoneNumber {
    cursor: pointer;
    height: 55px;
    box-sizing: border-box;
    padding: 16px 20px;
    border-bottom: 1px solid #EDEFF2;
    div{
        margin-left: 18px;
    }
}
.change_password {
    cursor: pointer;
    height: 55px;
    box-sizing: border-box;
    padding: 16px 20px;
    border-bottom: 1px solid #EDEFF2;
    div{
        margin-left: 18px;
    }
}
.yc_avatar_content .Logout {
    width:100%;
    background: #4278BE;
    color: #fff;
}
.yc_avatar_content .Logout:hover{
    width:100%;
    background: #4278BE;
    color: #fff;
}
.edit_adminInfo {
    margin-top:5px
}
.edit_adminInfo:hover{
    cursor: pointer;
    color:#2AA1E1
}
.arrow{
    transition: all 0.2s
}
.arrow-down {
    transform:rotate(90deg);
    transition: all 0.2s;
}
.messageDialogs {
    .el-dialog {
        width:409px !important;
        height:272px !important;
        margin-top: 30vh !important;
    }
    .el-dialog__header {
        padding: 20px 0 10px;
    }
    .el-dialog__body {
        padding: 20px;
    }
    .el-dialog__footer {
        padding: 60px 20px 20px;
    }
    .el-dialog__close {
        display: block !important;
        margin-top: 6px;
    }
}
.editTelephone{
    .telePhoneForm{
        height: 200px;
        position: relative;
    }
    .el-form-item__error {
        left: 17px;
    }
    .el-icon-check {
        position: absolute;
        right: -27px;
        top: 11px;
    }
    .el-dialog {
        width:496px !important;
        height:383px !important;
        margin-top: 30vh !important;
    }
    .el-dialog__header {
        padding: 20px 0 10px;
    }
    .el-dialog__body {
        padding: 20px 76px 0 20px;
    }
    .el-dialog__footer {
        position: relative;
        padding: 15px 20px 20px;
    }
    .el-dialog__close {
        display: block !important;
        margin-top: 6px;
    }
    .el-form-item {
        margin-bottom: 18px;
    }
    .editTelephoneBtn {
        position: absolute;
        bottom: -30px;
        left: 96px;
        width:308px;
        height:44px;
        background:#4278BE;
        color:#fff;
        border: 1px solid #4278BE;
        border-radius:3px;
    }
    .disBtn {
        position: absolute;
        bottom: -30px;
        left: 96px;
        width:308px;
        height:44px;
        border-radius:3px;
        border: 1px solid #EDEFF2;
        background: #EDEFF2;
        color:#909399;
    }
    // .disBtns {
    //     position: absolute;
    //     bottom: -30px;
    //     left: 96px;
    //     border-radius:3px;
    //     border: 1px solid #EDEFF2;
    //     background: #EDEFF2;
    //     color:#909399;
    // }
    .disBtn:hover{
        position: absolute;
        cursor: not-allowed;
        bottom: -30px;
        left: 96px;
        width:308px;
        height:44px;
        border-radius:3px;
        border: 1px solid #EDEFF2;
        background: #EDEFF2;
        color:#909399;
    }
    .btn{
        float: left;
        width:88px;
        margin: 0px 0 0 10px;
        height:40px;
        border-radius:3px;
        border:1px solid #BFC2CC;
        background: #FFFFFF;
        color:#606266;
        cursor: pointer;
    }
    .btnclor {
        background: #EDEFF2;
        color:#909399;
    }
}
.editPasswordDialog {
    .el-dialog {
        width:496px !important;
        height:383px !important;
        background:rgba(255,255,255,1);
        border-radius:3px;
        margin-top: 30vh !important;
    }
    .el-dialog__header {
        padding: 20px 0 10px;
    }
    .el-dialog__body {
        padding: 20px 95px 0 55px;;
    }
    .el-dialog__footer {
        padding: 35px 110px 20px;
    }
    .el-dialog__close {
        display: block !important;
        margin-top: 6px;
    }
    .eye_img{
        position:absolute;
        top:12px;
        right:-30px;
        width:21px;
    }
    .el-form-item__error {
        left: 16px;
    }
}
.slide_dialog {
    position:fixed;
    width:600px;
    height:100%;
    background:#FFFFFF;
    box-shadow:0px 2px 22px 0px rgba(58, 65, 74, 0.2);
    right:0;
    top:0;
    z-index: 9;
    overflow:auto;
    .adminForm {
        .el-input__inner {
            height: 30px;
        }
        .el-form-item__content {
            line-height: 25px;
        }
        .el-form-item {
            margin-bottom: 15px;
        }
        .el-form-item__label {
            line-height: 26px;
        }
        .adminUpload .el-form-item__label{
            line-height: 80px;
        }
        .adminFile {
            position: relative;
            height: 82px;
            width: 82px;
        }
        .fileImg {
            position: absolute;
            height: 82px;
            width: 82px;
            top: 0;
            left:0px;
            background:rgba(0,0,0,0.3);
            border-radius:3px;
        }
    }
}
.slide_dialog h4 {
    padding: 24px 0 17px 40px;
    font-size: 20px;
    border-bottom: 1px solid #EDEFF2;
    color: #303133;
    .closeDialog{
        cursor: pointer;
        color:#BFC2CC;
        margin-right:20px;  
    }
}
.slide_footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: 8px 20px;
    box-sizing: border-box;
    border-top:1px solid #EDEFF2;
}
</style>
