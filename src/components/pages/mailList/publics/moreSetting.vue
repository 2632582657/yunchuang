<template>
    <div class="moreSetting">
        <div class="moreSetting_content" v-if="isShow">
            <div class="content clear">
               <span> 企业名称：{{ruleForm.teamName}}</span>
            </div>
            <div  class="content">
                所在行业：<span>{{ruleForm.industryName ? ruleForm.industryName : '未设置'}}</span>
            </div>
            <div  class="content">
                人员规模：<span>{{ruleForm.teamScale}}</span>
            </div>
            <div  class="content">
                办公地址：<template v-if="provinceName == ''">
                            <span>未设置</span>
                        </template>
                        <template v-else>
                            <span>{{provinceName}}{{cityName}}{{countryName}}{{address}}</span>
                        </template>
            </div>
            <el-button type="primary" @click="handleSetting" style="width:150px;height:50px;color:#fff;background:#4278BE;border-radius:3px;">设置企业信息</el-button>
        </div>
        <div class="moreSetting_content" v-show="isShowInput">
            <el-form :model="ruleForm" ref="ruleForm"  class="team_ruleForm">
            <el-form-item label="企业名称:" prop="teamName">
                <!-- <el-input v-model="ruleForm.name" style="width: 300px;" placeholder="请输入企业名称"></el-input> -->
                <span>{{ruleForm.teamName}}</span>
            </el-form-item>
            <div  ref="industry">
                <el-form-item label="所在行业:" prop="industryName" class="team_industry">
                    <el-input v-model="ruleForm.industryName" style="width: 330px;" placeholder="请选择行业" v-on:input="searhIndustry"
                    @focus="searhIndustry"></el-input>
                    <div class="tabs_content" v-show="isShowIndustry">
                        <p style="height:15px;font-size:12px;line-height:15px">选择行业</p>
                        <el-input
                            placeholder="请输入内容"
                            v-model="searchInput">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                        <div style="background:#FFFFFF;height:185px" class="clear">
                            <div class="tab_left">
                                <div
                                    style="cursor: pointer;margin-top:20px;"
                                    v-for="(t,index) in tab"
                                    @click="tabClick(index)"
                                    :class="{tabColor:index == tabNum}">{{t.industryName}}
                                </div>
                            </div>
                            <div class="tab_right" >
                                <div style="" v-for="(item,index) in tab" v-if="index == tabNum" class="clear">
                                    <p  v-for="second in item.industryEntityVOList" style="float:left;width:90px;padding:0 5px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;cursor:pointer;margin-top:20px;" @click="selectIndustry(second)">{{second.industryName}}</p>
                                </div>
                            <!-- <div style="text-align:center;line-height:185px">暂无该行业</div> -->
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </div>
            <el-form-item label="人员规模:" prop="personnel">
                <el-select v-model="ruleForm.teamScale" @change="changeTeamScale" placeholder="请选择人员规模" style="width:330px">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="办公地址:" prop="region">
                <template v-if="provinceName == ''">
                    <img src="../images/address.png" alt="" width="14px" class="fl" style="margin:12px 5px 0 0;"> <p class="fl" style="color:#4278BE;cursor: pointer;" @click="departmentVisible = true">添加地址</p>
                </template>
                <template v-else>
                    <span class="region" @click="departmentVisible = true">{{provinceName}}{{cityName}}{{countryName}}{{address}}</span>
                    <!-- <span style="color:#4278BE;cursor: pointer;margin-left:30px" @click="departmentVisible = true">编辑</span> -->
                </template>
            </el-form-item>
            <el-button type="primary" style="width:150px;height:50px;color:#fff;background:#4278BE;border-radius:3px;" @click="submitForm">保存</el-button>
        </el-form>
        </div>
        <el-dialog
            :visible.sync="departmentVisible"
            :before-close="modalClose"
            width="30%" style="margin-top: 12vh;">
            <div
                slot="title"
                class="header-title clear"
                style="border-bottom:1px solid #BFC2CC;height:42px;"
            >
                <div
                    style="width:8px;height:24px;background:#4278BE;float:left;margin-top:4px;margin-left:30px"
                ></div>
                <div
                    style="height:31px;font-size:18px;font-family:MicrosoftYaHei;color:rgba(48,49,51,1);line-height:24px;float:left;margin-left:10px"
                >新增/编辑办公地址</div>
            </div>
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressForm" label-width="100px" class="addressForm">
                <el-form-item label="选择地区" prop="region">
                    <el-cascader
                        ref="cascaderAddr"
                        v-model="addressForm.region"
                        :options="prefecture"
                        @change="handleChange" style="width:300px">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="detailedAddress">
                    <el-input placeholder="必填" v-model="addressForm.detailedAddress" style="width:300px"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    style="width:308px;height:54px;background:#4278BE;color:#fff"
                    @click="handleSubmit"
                >保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import bus from '../../../../modules/bus'
export default {
    name: 'moreSetting',
    data() {
        return {
            ssoManager:'ssoManager',
            tabNum:0,
            adminInfo:JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')),
            companyObj:JSON.parse(window.sessionStorage.getItem('companyObj')),
            isShow: true,
            isShowInput:false,
            isShowIndustry:false,
            departmentVisible:false,
            teamIndustry:'',
            ruleForm: {},
            addressForm: {
                region: '',
                detailedAddress: ''
            },
            addressFormRules: {
                region: [
                    { required: true, message: '请选择地区', trigger: 'change' },
                ],
                detailedAddress: [
                    { required: true, message: '请输入详细', trigger: 'blur' },
                ]
            },
            teamScaleId:'',
            provinceName:'',
            cityName:'',
            countryName:'',
            address:'',
            searchInput: '',
            tab: [],
            options: [{
                value: '1',
                label: '0-19人'
                }, {
                value: '2',
                label: '20-49人'
                }, {
                value: '3',
                label: '50-99人'
                }, {
                value: '4',
                label: '100-499人'
                },
                {
                value: '5',
                label: '500-999人'
                },
                {
                value: '6',
                label: '1000人以上'
            }],
            prefecture: []
        }
    },
    watch: {
        companyObj () {
            this.handleLoadIndustry()
            this.handleGetProperty()
            this.handleCompanyMessage()
        }
    },
    created () {
        this.handleLoadIndustry()
        this.handleGetProperty()
        this.handleCompanyMessage()
    },
    methods: {
        handleSetting () {
            this.isShow = false,
            this.isShowInput = true
        },
        tabClick: function (index) {
            this.tabNum = index;
        },
        submitForm() {
            this.$http({
                method:'POST',
                url: this.ssoManager + '/v1/teamInfo/updateTeamInfoApp',
                data: {
                    teamInfoId:this.ruleForm.teamInfoId,
                    teamName:this.ruleForm.teamName,
                    teamIndustry: this.teamIndustry,
                    teamScale:this.teamScaleId,
                    locationTeamAppDTO: {
                        id:this.ruleForm.locationTeamVO ? this.ruleForm.locationTeamVO.id : null,
                        teamInfoId:this.ruleForm.teamInfoId,
                        provinceId:this.addressForm.region[0],
                        cityId:this.addressForm.region[1],
                        countryId:this.addressForm.region[2],
                        address:this.addressForm.detailedAddress
                    }
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type:'success',
                        message:'修改团队信息成功'
                    })
                    this.handleCompanyMessage()
                    this.isShowInput = false
                    this.isShow = true
                }
            })
        },
        handleCompanyMessage () {
            this.$http({
                method:'GET',
                url: this.ssoManager + '/v1/teamInfo/getTeamInfoForApp',
                params:{
                    teamInfoId:this.companyObj.companyId
                }
            }).then(res => {
                if (res.data.code == 200) {
                    this.ruleForm = res.data.data
                    this.teamScaleId = res.data.data.teamScale
                    this.teamIndustry = res.data.data.teamIndustry
                    this.ruleForm.teamScale = res.data.data.teamScale == 1 ? '0-19人' : res.data.data.teamScale == 2 ? '20-49人' :  res.data.data.teamScale == 3 ? '50-99人' : res.data.data.teamScale == 4 ? '100-499人' : res.data.data.teamScale == 5 ? '500-999人' : '1000人以上'
                    if (res.data.data.locationTeamVO != null) {
                        this.provinceName = res.data.data.locationTeamVO.provinceName
                        this.cityName = res.data.data.locationTeamVO.cityName
                        this.countryName = res.data.data.locationTeamVO.countryName
                        this.address = res.data.data.locationTeamVO.address
                        this.addressForm.region = [res.data.data.locationTeamVO.provinceId,res.data.data.locationTeamVO.cityId,res.data.data.locationTeamVO.countryId]
                        this.addressForm.detailedAddress =  res.data.data.locationTeamVO.address
                    }
                }
            })
        },
        handleChange(value) {
            var arr = this.$refs.cascaderAddr.getCheckedNodes()[0].pathLabels
            this.provinceName = arr[0]
            this.cityName = arr[1]
            this.countryName = arr[2]
        },
        searhIndustry () {
            this.isShowIndustry = true
        },
        handleLoadIndustry () {
            this.$http({
                method:'GET',
                url: this.ssoManager + '/v1/oa/industry/listIndustry',
            }).then(res => {
                if (res.data.code == 200) {
                    this.tab = res.data.data
                }
            })
        },
        handleGetProperty () {
            this.$http({
                method:'GET',
                url: this.ssoManager + '/v1/oa/location/getLocationObject',
            }).then(res => {
                if (res.data.code == 200) {
                    this.prefecture = res.data.data
                }
            })
        },
        changeTeamScale (id) {
            this.teamScaleId = this.options.find((item)=>{
                return item.value === id;
            }).value
        },
        hideIndustry(e) {
            if (!this.$refs.industry.contains(e.target)) {
                this.isShowIndustry = false
            }
        },
        selectIndustry (item) {
            this.teamIndustry = item.id
            this.ruleForm.industryName = item.industryName
            this.isShowIndustry = false
        },
        modalClose() {
            this.departmentVisible = false;
        },
        handleSubmit () {
            this.$refs.addressForm.validate((valid) => {
            if (valid) {
                this.address = this.addressForm.detailedAddress
                this.departmentVisible = false
            } else {
                return false;
            }
            });
        }
    },
    mounted() {
        // document.addEventListener('click',this.hideTitle)
        document.addEventListener('click', this.hideIndustry)
        bus.$on('companyObj',msg => {
            this.companyObj = msg
        })
    },
    beforeDestroy() {
        // document.addEventListener('click',this.hideTitle)
        document.removeEventListener('click', this.hideIndustry)
    }
}
</script>

<style lang="scss">
.moreSetting {
    position: relative;
    padding: 0 0  0 20px;
    height: 100%;
    box-sizing: border-box;
    .el-dialog {
        width: 466px !important;
        height: 376px !important;
    }
    .el-dialog__header {
        padding: 20px 0 10px;
    }
    .el-dialog__body {
        box-sizing: border-box;
        padding: 17px 20px 30px 20px;
        .el-input__inner {
            height: 30px;
            line-height: 30px
        }
    }
    .el-dialog__headerbtn .el-dialog__close {
        display: none
    }
    .dialog-footer {
        padding: 10px 54px 20px;
    }
}

.moreSetting .el-tabs__header {
    margin: 0;
}
.moreSetting .el-tabs__item {
    color: #4278BE;
    font-size:18px;
}
.moreSetting .el-tabs__active-bar {
    height:5px;
    background:rgba(66,120,190,1);
}
.moreSetting .el-tabs__content{
    height: 100%;
    width: 100%;
    padding: 18px 0 0 20px;
    box-sizing: border-box;
    background-color: rgba(255,255,255,1);
}
.moreSetting .el-tab-pane {
    height: 100%;
}
.moreSetting .team_ruleForm {
    .el-input__inner{
        height: 30px;
        line-height: 30px;
    }
    .el-form-item {
        margin-bottom: 15px;
    }
}
.moreSetting .el-tabs {
    height: 100%;
}
.moreSetting .tabColor {
    color: #4278BE;
}
.moreSetting .moreSetting_content {
    padding: 10px 0 0 20px;
    color: #303133;
    height: 100%;
    background: #fff;
    .content {
        margin-bottom: 30px;
    }
}
.moreSetting .team_industry {
    position: relative;
}
.moreSetting  .tabs_content {
    position: absolute;
    width:330px;
    height:290px;
    top:36px;
    left: 71px;
    padding: 14px 13px 35px 13px;
    box-sizing: border-box;
    background:rgba(248,248,248,1);
    border-radius:3px;
    z-index: 9999;
}
.moreSetting .region {
    cursor: pointer;
}
.moreSetting .region:hover {
    color:#4278BE
}
.moreSetting .tab_left{
    float: left;
    width:120px;
    height: 100%;
    line-height: 20px;
    // text-align: center;
    overflow: auto;
    border-right: 1px solid #EDEFF2;
}
.moreSetting .tab_left::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 10px;
}
.moreSetting .tab_left::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #4278BE;
}
.moreSetting .tab_left::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ffffff;
}
.moreSetting .tab_right{
    float: left;
    width:182px;
    line-height: 20px;
    height: 100%;
    // text-align: center;
    overflow: auto;
}
.moreSetting .tab_right::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 10px;
}
.moreSetting .tab_right::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #F8F8F8;
}
.moreSetting .tab_right::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ffffff;
}

</style>

