<template>
    <div class="create_team">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="团队信息" name="first">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="team_ruleForm">
                    <el-form-item label="团队名称" prop="name">
                        <el-input v-model="ruleForm.name" style="width: 300px;" placeholder="请输入团队名称"></el-input>
                    </el-form-item>
                    <div  ref="industry">
                        <el-form-item label="行业" prop="industry" class="team_industry">
                            <el-input v-model="ruleForm.industry" style="width: 300px;" placeholder="请选择行业" v-on:input="searhIndustry"
                            @focus="searhIndustry"></el-input>
                            <div class="tabs_content" v-show="isShow">
                                <p style="height:15px;font-size:12px;line-height:15px">选择行业</p>
                                <el-input
                                    placeholder="请输入内容"
                                    v-model="searchInput">
                                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                                </el-input>
                                <div style="background:#FFFFFF;height:185px" class="clear">
                                    <div class="tab_left">
                                        <div
                                            style="cursor: pointer;"
                                            v-for="(t,index) in tab"
                                            @click="tabClick(index)"
                                            :class="{tabColor:index == tabNum}">{{t.industryName}}
                                        </div>
                                    </div>
                                    <div class="tab_right" >
                                        <div v-for="(item,index) in tab" v-if="index == tabNum">
                                            <div v-for="second in item.industryEntityVOList">
                                                <div style="text-align:center" class="clear">
                                                    <p style="float:left;width:90px;cursor: pointer;" @click="selectIndustry(second)">{{second.industryName}}</p>
                                                </div>
                                            </div>
                                            <!-- <div style="text-align:center;line-height:185px">暂无该行业</div> -->
                                        </div>
                                </div>
                                </div>
                            </div>
                        </el-form-item>
                    </div>
                    <el-form-item label="人员规模" prop="personnel">
                        <el-select v-model="ruleForm.personnel" placeholder="请选择人员规模" style="width:300px">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="地区" prop="region">
                        <el-cascader
                            v-model="ruleForm.region"
                            :options="prefecture"
                            @change="handleChange" style="width:300px"></el-cascader>
                    </el-form-item>
                    <el-form-item label="职位" prop="position">
                        <el-input v-model="ruleForm.position" style="width: 300px;" placeholder="请输入职位"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')" style="width:150px;height:50px;color:#fff;background:#4278BE;border-radius:3px;">创建团队</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: 'createTeam',
    data() {
        return {
            activeName: 'first',
            ruleForm: {
                name: '',               // 团队名称
                industry: '',           // 行业
                personnel: '',          // 人员规模
                region: '',             // 地区
                position: '',           // 职位
            },
            searchInput: '',
            isShow: false,
            tab: [],
            tabNum: 0,
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
            rules: {
                name: [
                    { required: true, message: '请输入团队名称', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    industry: [
                        { required: true, message: '请选择行业', trigger: 'change' }
                    ],
                    personnel: [
                        { required: true, message: '请选择人员规模  ', trigger: 'change' }
                    ],
                    region: [
                        { required: true, message: '请选择地区', trigger: 'change' }
                    ],
                    position: [
                        { required: true, message: '请选择职位', trigger: 'change' }
                    ],
            },
            prefecture: []
        }
    },
    created () {
        this.handleLoadIndustry()
        this.handleGetProperty()
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab)
        },
        submitForm() {
            this.$refs.ruleForm.validate((valid) => {
            if (valid) {
                alert('submit!');
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        handleChange(value) {
            console.log(value);
        },
        tabClick: function (index) {
            this.tabNum = index;
        },
        handleLoadIndustry () {
            this.$http({
                method:'GET',
                url:'/v1/oa/industry/listIndustry',
            }).then(res => {
                if (res.data.code == 200) {
                    this.tab = res.data.data
                }
            })
        },
        handleGetProperty () {
            this.$http({
                method:'GET',
                url:'/v1/oa/location/getLocationObject',
            }).then(res => {
                if (res.data.code == 200) {
                    this.prefecture = res.data.data
                }
            })
        },
        searhIndustry () {
            this.isShow = true
        },
        hideIndustry(e) {
            if (!this.$refs.industry.contains(e.target)) {
                this.isShow = false
            }
        },
        selectIndustry (item) {
            this.ruleForm.industry = item.industryName
            this.isShow = false
        }
    },
    mounted() {
        // document.addEventListener('click',this.hideTitle)
        document.addEventListener('click', this.hideIndustry)
    },
    beforeDestroy() {
        // document.addEventListener('click',this.hideTitle)
        document.removeEventListener('click', this.hideIndustry)
    }
}
</script>

<style lang="scss">
.create_team {
    padding: 0 20px;
    height: 100%;
    box-sizing: border-box;
}
.create_team .el-tabs__header {
    margin: 0;
}
.create_team .el-tabs__item {
    color: #4278BE;
    font-size:18px;
}
.create_team .el-tabs__active-bar {
    height:5px;
    background:rgba(66,120,190,1);
}
.create_team .el-tabs__content{
    height: 100%;
    width: 100%;
    background-color: rgba(255,255,255,1);
}
.create_team .team_ruleForm {
    margin-top: 20px;
}
.create_team  .el-input__inner {
    height: 30px;
}
.create_team .el-tabs {
    height: 100%;
}
.create_team .tabColor {
    color: #4278BE;
}
.create_team .team_industry {
    position: relative;
}
.create_team  .tabs_content {
    position: absolute;
    width:300px;
    height:290px;
    top:36px;
    padding: 14px 13px 35px 13px;
    box-sizing: border-box;
    background:rgba(248,248,248,1);
    border-radius:3px;
    z-index: 9999;
}
.create_team .tab_left{
    float: left;
    width:91px;
    height: 100%;
    text-align: center;
    overflow: auto;
    border-right: 1px solid #EDEFF2;
}
.create_team .tab_left::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 10px;
}
.create_team .tab_left::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #4278BE;
}
.create_team .tab_left::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ffffff;
}
.create_team .tab_right{
    float: left;
    width:182px;
    height: 100%;
    // text-align: center;
    overflow: auto;
}
.create_team .tab_right::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 10px;
}
.create_team .tab_right::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #F8F8F8;
}
.create_team .tab_right::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ffffff;
}
</style>
