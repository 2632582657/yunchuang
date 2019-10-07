<!--@description: 登录之后跳转的首页
    @author: 李瑞军
@update: 李瑞军(2019-05-10 11:41) -->
<template>

    <el-container>
        <el-header style="height: 58px;">
            <AppHeader/>
        </el-header>
        <el-container>
            <NavMenu/>
            <el-main id="elMain">
                <div class="clear">
                    <!-- <img src="../../../assets/logo.png" alt="" width="40px;" style="float:left"> -->
                    <AppBreadcrumb :list="getBreadcrumbs()" style="float:left;margin-left:20px"></AppBreadcrumb>
                </div>
                <router-view  :key="$route.path + $route.query.t"></router-view>
                <shadeSetPassword :close="setPassword"></shadeSetPassword>
                <shadeCompleteInfor></shadeCompleteInfor>
            </el-main>
        </el-container>
        <!-- 设置团队 -->
        <div class="slide_dialog" ref="slide_dialog" @click.stop="showEditTeam = true"  v-show="this.$store.state.model.showEditTeam">
            <h4>设置团队
                <span class="fr closeDialog" @click="$store.commit('showEditTeam',false)">×</span>
            </h4>
            <div style="padding:20px 90px 0 80px">
                <el-form
                    :model="team"
                    :rules="teamRules"
                    ref="teamForm"
                    label-width="100px"
                    class="addMembers"
                    >
                    <el-form-item label="团队名称:" prop="name">
                        <el-input v-model="team.name" placeholder="必填" :disabled="team.teamAuth == 1"></el-input>
                    </el-form-item>
                    <el-form-item label="团队负责人:">
                        <el-input
                            :value="team.department"
                            placeholder="必填"
                            @focus="personDialogVisible = true"
                            readonly>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="团队logo:">
                        <template v-if="fileList != ''">
                            <img :src="fileList" alt="" width="44px" height="44px" style="display:inline-block;vertical-align: middle;">
                        </template>
                        <template v-else>
                            <img src="../index/images/upload.png" alt="" width="15px" style="display:inline-block;vertical-align: middle;">
                        </template>
                        <el-upload
                            class="upload-demo"
                            :headers="head"
                            :http-request='submitUpload'
                            action="http://180.76.51.213:7003"
                        >
                        <!-- :before-upload="beforeUpload" -->
                        <template v-if="fileList != ''">
                            <span style="color:#4278BE">更改</span>
                        </template>
                        <template v-else>
                            <span style="color:#4278BE">上传图片</span>
                        </template>
                        </el-upload>
                        <template v-if="fileList != ''">
                            <span style="font-size:12px;color:#909399"> 建议上传图片尺寸为640*640，大小不超过1M</span>
                        </template>
                        <template v-else>
                            <span style="font-size:12px;color:#909399"> 建议上传图片尺寸为640*640，大小不超过1M</span>
                        </template>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <div class="slide_footer">
                    <el-button class="fr" style="width:80px;height:34px;;background:#4278BE;border-radius:3px;color:#fff;padding:0" @click="handleTeamInfo">保存</el-button>
                </div>
            </div>
        </div>
        <div ref="persondialog">
            <persondialog
                :treeData="data1"
                :defaultProps="{label:'name',children:'children'}"
                :transferTitle="['选择部门人员', '已选择']"
                :managers='team.managers'
                :dialogVisible="personDialogVisible"
                @handlePersonClose="handlePersonClose"
                @handlePsrsonSubmit="handlePsrsonSubmit">
            </persondialog>
        </div>
    </el-container>
</template>

<script>
import '../../../stylesheets/main.scss'
import AppHeader from './header'
import NavMenu from './navmenu'
import shadeSetPassword from './publics/shadeSetPassword'
import shadeCompleteInfor from './publics/shadeCompleteInfor'
import persondialog from '../../commons/persondialog'
import bus from '../../../modules/bus'
export default {
    name: 'Layout',
    components: {
        AppHeader,
        NavMenu,
        shadeSetPassword,
        shadeCompleteInfor,
        persondialog
    },
    data() {
        return {
            orgManager:'orgManager',
            setPassword: false,
            showEditTeam:false,
            data1:[],
            // companyId: this.$store.state.model.companyObj.companyId,
            personDialogVisible:false,
            head: {
                Platform: 'H5',
                Access_Token: sessionStorage.getItem('token')
            },
            //设置团队
            team: {
                name: '',
                department: '',
                managers:[],
                teamAuth:'',
            },
            teamRules: {
                name: [
                    {
                        required: true,
                        message: '请输入团队名称',
                        trigger: 'blur'
                    },
                ],
            },
             //设置团队
            fileList: '',
            teamPrincipalDTOList:[],
            companyObj:JSON.parse(window.sessionStorage.getItem('companyObj')) || JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')),
        }
    },
    watch:{
        companyObj () {
            this.handleDatas()
            this.handleCompanyInfor()
        }
    },
    created () {
        this.handleDatas()
        this.handleCompanyInfor()
    },
    methods: {
        getBreadcrumbs() {
            const breads = []
            this.$route.matched.forEach(route => {
                if (route.meta.label == 'TeamName') {
                    breads.push({
                        label: this.companyObj.label || this.companyObj.companyName,
                        icon: route.meta.icon,
                    })
                }else {
                    breads.push({
                        label: route.meta.label,
                        icon: route.meta.icon,
                    })
                }
            })
            return breads
        },
        handleDatas () {
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/department/queryAddressBook2',
                data: {
                    companyId:this.companyObj.companyId
                },
            }).then(res => {
                if (res.data.code == 200) {
                    this.data1 = res.data.data.children ? res.data.data.children : []
                    // this.iterations(this.data1)
                }
            })
        },
        handleCompanyInfor () {
            if (this.companyId != '') {
                this.$http({
                method: 'GET',
                url: this.orgManager + '/v1/organization/team/' + this.companyObj.companyId,
                }).then(res => {
                    if (res.data.code == 200) {
                        this.team.name = res.data.data.departmentVO.companyName
                        if (res.data.data.teamMnagerList.length != 0) {
                            var str = ''
                            res.data.data.teamMnagerList.forEach (item => {
                                str+= item.department + '-' + item.employeeName + '、'
                            })
                            this.team.department = str.slice(0,-1)
                        }else {
                            this.team.department = ''
                        }
                        //  = res.data.data.departmentVO.departmentName
                        this.fileList = res.data.data.departmentVO.logoUrl
                        this.team.teamAuth = res.data.data.teamAuth
                        this.team.managers = res.data.data.teamMnagerList
                    }
                })
            }
        },
        handlePersonClose () {
            this.personDialogVisible = false
        },
        handlePsrsonSubmit (value) {
            var str = ''
            var arr = []
            if (value.length != 0) {
                value.forEach(item => {
                    str+= item.parent + '-' + item.name + '、'
                    this.team.department = str.slice(0,-1)
                    arr.push({employeeId:item.employeeId,teamManager:'1'})
                })
                this.teamPrincipalDTOList = arr
            }else {
                this.team.department = ''
                this.teamPrincipalDTOList = []
            }
            this.personDialogVisible = false
        },
        handleTeamInfo () {
            this.$http({
                method:'POST',
                url:this.orgManager + '/v1/organization/team/setUpTeam',
                data:{
                    companyId:this.companyObj.companyId,
                    companyName:this.team.name,
                    teamAuth:this.team.teamAuth,
                    logoUrl:this.fileList,
                    teamPrincipalDTOList:this.teamPrincipalDTOList
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type:'success',
                        message:res.data.message
                    })
                    this.$store.commit('showEditTeam',false)
                }else {
                    this.$message({
                        message: res.data.message,
                        type: 'error'
                    });
                }
            })
        },
        submitUpload: function(content) {//自定义的上传图片的方法
            let formData = new FormData;
            formData.append('file', content.file,content.file.name);
            // formData.append("fileType", "1");
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
                        that.fileList = response.data.data[0].absolutePath
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
        beforeUpload (file) {
            let _this = this
            const is1M = file.size / 1024 / 1024 < 1; // 限制小于1M
            // const isSize = new Promise(function (resolve, reject) {
            // let width = 640; // 限制图片尺寸为640X640
            // let height = 640;
            // let _URL = window.URL || window.webkitURL;
            // let img = new Image();
            // img.onload = function () {
            //     let valid = img.width === width && img.height === height;
            //     valid ? resolve() : reject();
            // }
            //     img.src = _URL.createObjectURL(file);
            // }).then(() => {
            //     return file;
            // }, () => {
            //     _this.$message.error('建议上传图片尺寸为640*640，大小不超过1M')
            //     return Promise.reject();
            // });
            if (!is1M) {
                _this.$message.error('建议上传图片尺寸为640*640，大小不超过1M')
            }
            // return isSize&is1M
            return is1M
        },
        handleHideSlide(e) {
            if (this.personDialogVisible === true) {
            }else{
                if (!this.$refs.slide_dialog.contains(e.target) && !this.$refs.persondialog.contains(e.target) ) {
                    this.showEditTeam = false
                    this.$store.commit('showEditTeam',false)
                    // this.team.department = ''
                    this.teamPrincipalDTOList = []
                }
            }
        },
    },
    mounted() {
        document.addEventListener('click', this.handleHideSlide)
        bus.$on('companyObj',msg => {
            this.companyObj = msg
        })
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleHideSlide)
    },
    beforeRouteEnter(to, from, next) {
        if (from.fullPath == '/register') {
            next(vm => {
                vm.setPassword = true
            })
        } else {
            next()
        }
    }
}
</script>
<style lang="scss">
.el-container {
    height: 100%;
    position: relative;
}

.el-header{
    padding: 0px !important;
    background: #4278BE;
    color: #f1f1f1;
}

.el-aside {
    background: #33344a;
}

.el-main {
    // overflow: hidden;
    background-color: #F8F8F8;
    flex-basis:1px;
    padding: 20px 0 20px 20px;
    box-sizing: border-box;
}

.el-row {
    display: flex;
    align-items: center;
}
.el-radio__input.is-checked .el-radio__inner {
    border-color: #4278BE !important;
    background: #4278BE !important;
}
.el-radio__input.is-checked+.el-radio__label {
    color: #4278BE !important;
}
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #4278BE !important;;
    border-color: #4278BE !important;;
}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #4278BE !important;;
    border-color: #4278BE !important;
}
.el-checkbox__input.is-checked+.el-checkbox__label {
    color: #4278BE !important;
}
.el-tabs__item {
    color: #4278BE !important;
    font-size: 18px;
}
.el-menu {
    height: 100%;
}
.el-container .slide_dialog {
    position:fixed;
    width:600px;
    height:100%;
    background:#FFFFFF;
    box-shadow:0px 2px 22px 0px rgba(58, 65, 74, 0.2);
    right:0;
    top:0;
    overflow: auto;
    z-index: 9
}
.el-container  .el-dialog__close {
    display: none;
}
.el-container .slide_dialog h4 {
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
.el-container .addMembers .el-input__inner {
    height: 30px;
    border: 1px solid #BFC2CC;
}
.el-container .addMembers .el-textarea__inner {
    border: 1px solid #BFC2CC;
    height: 108px;
}
.el-container .addMembers .el-form-item {
    margin-bottom: 15px;
}
.el-container .slide_footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: 8px 20px;
    box-sizing: border-box;
    border-top:1px solid #EDEFF2;
}
.el-container .upload-demo {
    display: inline-block;
}
.el-container .el-input__inner {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    // width: 323px;
}
.el-container .el-upload-list {
    display: none
}
.el-container .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
}
// .el-container  .el-date-editor.el-input, .el-date-editor.el-input__inner {
//     width: 312px;
// }
</style>
