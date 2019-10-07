<template>
    <div class="custom-tree-container dialogue">
        <div class="block">
            <el-tree
                ref="tree"
                :data="data"
                node-key="ids"
                default-expand-all
                highlight-current
                @node-click="handleNodeClick"
            >
            <div class="custom-tree-node" slot-scope="{ node, data }" style="width:100%;"  @mouseenter.stop="() => {data.isshow = true}" @mouseleave.stop="() => {data.isshow = false}">
                <span>{{ node.label}}</span>
                <i class="el-icon-more" v-show='data.isshow' style="float:right;margin-right:30px;position:relative" @click.stop="() => {flag = true}" @mouseleave.stop="() => {flag = false}">
                    <div style="width:200px;background-color:#fff;position: absolute;border-radius:4px;box-shadow:0px 0px 2px black;font-size:16px;z-index:9999;" v-show="flag">
                        <template>
                            <div class="clear dialog_hover" v-if="data.communicationStatus" @click.stop="organization(data)">
                                <img src="../../mailList/images/department.png" alt="" width="16px" style="float:left">
                                <span style="margin-left:10px;float:left">组织架构管理</span>
                            </div>
                        </template>
                        <template>
                            <div class="clear dialog_hover" v-if="data.teamStatus" @click.stop="pushFrameWork(data)">
                                <i class="el-icon-setting" style="color:#4278BE;font-size:18px"></i>
                                <span style="margin-left:2px;">设置团队信息</span>
                            </div>
                        </template>
                        <template>
                            <div class="clear dialog_hover" v-if="data.communicationStatus && data.adminGrade == 1" @click.stop="subadministrator(data)">
                                <!-- $router.push({name:'subadministrator'}) -->
                                <img src="../../mailList/images/ziguanli.png" width="16px" style="float:left">
                                <span style="margin-left:10px;float:left">设置子管理员</span>
                            </div>
                        </template>
                        <template>
                            <div class="clear dialog_hover" v-if="data.communicationStatus && data.adminGrade == 1" @click.stop="supervisor(data)">
                                <!-- $router.push({name:'supervisor'}) -->
                                <img src="../../mailList/images/guanliyuan.png" width="16px" style="float:left">
                                <span style="margin-left:10px;float:left">设置主管理员</span>
                            </div>
                        </template>
                        <template>
                            <div class="clear dialog_hover" v-if="data.teamStatus" @click.stop="moreSetting(data)">
                                <!-- $router.push({name:'moreSetting'}) -->
                                <img src="../images/Group2.png" alt="" width="16px" style="float:left">
                                <span style="margin-left:10px;float:left">更多设置</span>
                            </div>
                        </template>
                        <div class="clear dialog_hover" @click.stop="myCompany(data)">
                            <!-- $router.push({name:'myCompany'}) -->
                            <img src="../images/Group5.png" alt="" width="16px" style="float:left">
                            <span style="margin-left:10px;float:left">退出团队</span>
                        </div>
                    </div>
                </i>
            </div>
            </el-tree>
        </div>
    </div>
</template>

<script>
import bus from '../../../../modules/bus'
export default {
    name: 'dialogue',
    data() {
        return {
            data: [
                {
                ids: 1,
                label: '通讯录',
                children: [
                        {
                            ids: 2,
                            label: '加入团队',
                            // isshow : false,
                            children: [
                                {
                                    ids: 7,
                                    label: '搜索团队',
                                    path: 'searchTeam',
                                },
                                {
                                    ids: 8,
                                    label: '申请记录',
                                    path: 'applicationRecord',
                                }
                            ]
                        },
                        {
                            ids: 3,
                            label: '我的团队',
                            children: [
                                // {
                                //     id: 5,
                                //     label: JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')).companyName,
                                //     path: 'frameWork',
                                //     isshow : false,
                                // }
                            ]
                        }
                    ]
                }
            ],
            orgManager:'orgManager',
            ssoManager:'ssoManager',
            flag: false,
            currentKey:'',
            teamEmployeeDetailVO:JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')),
            functionPermissionList:JSON.parse(window.sessionStorage.getItem('functionPermissionList')),
            companyList:[]
        }
    },
    watch:{
        currentKey (newval) {
            this.$refs.tree.setCurrentKey(newval);
        },
    },
    created () {
        this.queryCompany()
        this.iterations(this.data,this.$store.state.model.currentKey)
    },
    methods: {
        handleNodeClick(obj) {
            if (obj.path == 'frameWork') {
                this.$router.push({name:obj.path,query:{t:Date.now()}})
                window.sessionStorage.setItem('companyStatus',false)
                window.sessionStorage.setItem('showHeader',false)
                window.sessionStorage.setItem('companyObj',JSON.stringify(obj))
                bus.$emit('companyObj',obj)
                this.$route.matched[3] ? this.$route.matched[3].meta.label = obj.label : ''
            }else {
                this.$router.push({name:obj.path});
                this.$store.commit('showEditTeam',false)
                this.$store.commit('showEditmember',false)
            }
        },
        queryCompany () {
            this.$http({
                method:'GET',
                url: this.orgManager + '/v1/organization/cerelation/' + this.teamEmployeeDetailVO.employeeId,
            }).then(res => {
                if (res.data.code == 200) {
                    this.companyList = res.data.data
                    var flag = this.companyList.some(item => {
                        return item.adminGrade != 0 
                    })
                    if (flag) {
                        this.data[0].children.unshift({
                            ids: 9,
                            label: '加入团队申请',
                            path:'addTeam',
                        })
                        this.companyList.forEach((first,index) => {
                            if (first.teamAdminVO != null) {
                                this.data[0].children[2].children.push({
                                    ids:10+index,
                                    id: first.employeeId,
                                    label: first.companyName,
                                    path: 'frameWork',
                                    companyId:first.companyId,
                                    departmentId:first.departmentId,
                                    departmentName:first.departmentName,
                                    logoUrl:first.logoUrl,
                                    isshow : false,
                                    employeeJob:first.employeeJob,
                                    adminGrade:first.adminGrade,
                                    communicationStatus:first.teamAdminVO.functionPermissionList[0].permissionState,
                                    teamStatus:first.teamAdminVO.functionPermissionList[1].permissionState
                                })
                            }else {
                                this.data[0].children[2].children.push({
                                    ids:10+index,
                                    id: first.employeeId,
                                    label: first.companyName,
                                    path: 'frameWork',
                                    companyId:first.companyId,
                                    departmentId:first.departmentId,
                                    departmentName:first.departmentName,
                                    logoUrl:first.logoUrl,
                                    employeeJob:first.employeeJob,
                                    isshow : false,
                                    communicationStatus:false,
                                    teamStatus:false
                                })
                            }
                        })
                    }else {
                        this.companyList.forEach((item,index) => {
                            this.data[0].children[1].children.push({
                                ids:10+index,
                                id: item.employeeId,
                                label: item.companyName,
                                companyId:item.companyId,
                                departmentId:item.departmentId,
                                departmentName:item.departmentName,
                                logoUrl:item.logoUrl,
                                employeeJob:item.employeeJob,
                                path: 'frameWork',
                                isshow : false,
                            })
                        })
                    }
                }
            })
        },
        pushFrameWork (data) {
            this.$store.commit('showEditTeam',true)
            bus.$emit('companyObj',data)
            window.sessionStorage.setItem('companyObj',JSON.stringify(data))
        },
        organization (data) {
            this.$store.commit('showEditTeam',false)
            window.sessionStorage.setItem('companyStatus',true)
            window.sessionStorage.setItem('showHeader',false)
            window.sessionStorage.setItem('companyObj',JSON.stringify(data))
            this.$router.push({name:'frameWork',query:{ t:Date.now()}})
            bus.$emit('companyObj',data)
            this.$route.matched[3] ? this.$route.matched[3].meta.label = data.label : ''
        },
        subadministrator (data) {
            this.$router.push({name:'subadministrator'})
            bus.$emit('companyObj',data)
            window.sessionStorage.setItem('companyObj',JSON.stringify(data))
        },
        supervisor (data){
            this.$router.push({name:'supervisor'})
            bus.$emit('companyObj',data)
            window.sessionStorage.setItem('companyObj',JSON.stringify(data))
        },
        moreSetting (data) {
            this.$router.push({name:'moreSetting'})
            bus.$emit('companyObj',data)
            window.sessionStorage.setItem('companyObj',JSON.stringify(data))
        },
        myCompany (data) {
            this.$router.push({name:'myCompany'})
            bus.$emit('companyObj',data)
            window.sessionStorage.setItem('companyObj',JSON.stringify(data))
        },
        iterations(data,msg) {
            for (var j = 0; j < data.length; j++) {
                if (data[j].path == msg) {
                    this.currentKey = (data[j]).id
                }
                if(data[j].children != undefined && data[j].children.length > 0){
                    this.iterations(data[j].children,msg)
                }
            }
        },
    },
    mounted () {
        this.$nextTick(function(){
            this.$refs.tree.setCurrentKey(this.currentKey);
        })
    },
}
</script>

<style lang="scss">
.dialogue .el-tree-node__content {
    height: 38px;
}
.dialogue .el-tree-node>.el-tree-node__children {
    overflow: visible;
}
.dialogue .dialog_hover {
    padding:10px 15px;
    box-sizing: border-box
}
.dialogue .dialog_hover:hover {
    background: #D8D8D8
}
</style>
