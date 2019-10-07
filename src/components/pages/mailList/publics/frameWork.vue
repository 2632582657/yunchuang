<template>
    <div class="frameWork_team">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="组织架构" name="first">
                <div style="height:100%">
                    <div class="frameWork_left fl">
                        <el-input
                            placeholder="请输入内容"
                            prefix-icon="el-icon-search"
                            clearable
                            v-model="searchFrameWork"
                            v-on:input="searhInput"
                            @focus="searhInput">
                        </el-input>
                        <div class="system1">
                            <h5  v-show="searchPeople">组织架构</h5>
                            <!-- 默认组织架构 -->
                            <div v-show="searchPeople">
                                <el-tree
                                    :data="data"
                                    node-key="id"
                                    default-expand-all
                                    @node-click="handleNodeClick"
                                    @node-drop="handleDrop"
                                    :expand-on-click-node="false"
                                    draggable
                                    >
                                    <div class="custom-tree-node" slot-scope="{ node, data }" style="width:100%;"  @mouseenter.stop="() => {data.updateTime = true }" @mouseleave.stop="() => {data.updateTime = false}">
                                        <span style="display:block;max-width:185px;float:left;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{ data.departmentName }}</span>
                                        <span style="margin-left:7px;color:#BFC2CC">({{ data.sum}})</span>
                                        <template v-if="data.first === false">
                                            <i class="el-icon-more" v-if="companyStatus"  v-show='data.updateTime' style="margin-left:10px;position:relative" @click.stop="() => {flag = true}" @mouseleave="() => {flag = false}">
                                                <div style="width:200px;background-color:#fff;position: absolute;border-radius:4px;box-shadow:0px 0px 2px black;font-size:16px;z-index:99999;" v-show="flag">
                                                    <div class="clear dialog_hover" @click.stop="handleBottomDepartment(data)">
                                                        <img src="../images/Group 15.png" alt="" width="16px" style="float:left">
                                                        <span style="margin-left:10px;float:left">新建下级部门</span>
                                                    </div>
                                                    <!-- <div class="clear dialog_hover" @click.stop="handleSetTeam(data)">
                                                        <img src="../images/Shape 2.png" alt="" width="16px" style="float:left">
                                                        <span style="margin-left:10px;float:left">设置团队</span>
                                                    </div> -->
                                                </div>
                                            </i>
                                        </template>
                                        <template v-else>
                                            <i class="el-icon-more"  v-if="companyStatus"   v-show='data.updateTime' style="margin-left:10px;position:relative" @click.stop="() => {flag = true}" @mouseleave="() => {flag = false}">
                                                <div style="width:200px;background-color:#fff;position: absolute;border-radius:4px;box-shadow:0px 0px 2px black;font-size:16px;z-index:999;" v-show="flag">
                                                    <div class="clear dialog_hover" v-if="companyStatus" @click.stop="handleBottomDepartment(data)">
                                                        <img src="../images/Group 15.png" alt="" width="16px" style="float:left">
                                                        <span style="margin-left:10px;float:left" >新建下级部门</span>
                                                    </div>
                                                    <div class="clear dialog_hover" v-if="companyStatus" @click.stop="handleCenterDepartment(data)">
                                                        <img src="../images/copy.png" alt="" width="16px" style="float:left">
                                                        <span style="margin-left:10px;float:left">新建同级部门</span>
                                                    </div>
                                                    <div class="clear dialog_hover" v-if="companyStatus" @click.stop="handleEditDepartment(data)">
                                                        <img src="../images/Shape 2.png" alt="" width="16px" style="float:left">
                                                        <span style="margin-left:10px;float:left">编辑部门</span>
                                                    </div>
                                                    <div class="clear dialog_hover" v-if="companyStatus"  @click.stop="handleQueryDepartment(data)">
                                                        <i class="el-icon-view" style="color:#4278BE"></i>
                                                        <span style="margin-left:7px">查看部门</span>
                                                    </div>
                                                    <div class="clear dialog_hover" v-if="companyStatus" @click.stop="removeDepartments(data)">
                                                        <img src="../images/Group 14.png" alt="" width="16px" style="float:left">
                                                        <span style="margin-left:10px;float:left">删除部门</span>
                                                    </div>
                                                </div>
                                            </i>
                                        </template>
                                    </div>
                                </el-tree>
                            </div>
                            <!-- 搜索内容 -->
                            <div class="system2">
                                <div style="padding-left:17px;" v-show="searchContent">
                                    <p style="padding:15px 0;border-bottom:1px solid #EDEFF2;color:#909399">成员</p>
                                    <div style="padding:8px 0;cursor: pointer;" v-for="(item,index) in queryEmployee" :key="index">
                                        <template v-if="companyStatus">
                                            <div class="clear" @click="handleEditPer(item)">
                                                <img :src="item.iconUrl" width="54px" height="54px" alt="" class="fl" v-if="item.iconUrl" style="border-radius:2px;">
                                                <img src="../images/h.png" width="54px" alt="" class="fl" v-else style="border-radius:2px;">
                                                <div class="fl" style="margin-left:14px">
                                                    <p v-html="item.employeeName"></p>
                                                    <p v-html="item.phone" style="font-size:12px"></p>
                                                    <!-- <p style="font-size:12px;color:#909399">{{item.phone}}</p> -->
                                                    <span>{{item.employeeJob ? item.employeeJob : '暂无部门' }}</span>
                                                </div>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="clear" @click="handleLookPer(item)">
                                                <img :src="item.iconUrl" width="54px" height="54px" alt="" class="fl" v-if="item.iconUrl" style="border-radius:2px;">
                                                <img src="../images/h.png" width="54px" alt="" class="fl" v-else style="border-radius:2px;">
                                                <div class="fl" style="margin-left:14px">
                                                    <p v-html="item.employeeName"></p>
                                                    <p v-html="item.phone" style="font-size:12px"></p>
                                                    <span>{{item.employeeJob ? item.employeeJob : '暂无职位' }}</span>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                                <div v-show="departmentContent">
                                    <div style="height:8px;width:100%;background:#F8F8F8"></div>
                                    <div  style="padding:0px 17px 17px 17px;cursor: pointer;">
                                        <!-- queryDepartment -->
                                        <p style="padding:15px 0;border-bottom:1px solid #EDEFF2;color:#909399;">部门</p>
                                        <div style="border-bottom:1px solid #EDEFF2;padding:8px 0;" v-for="(item,index) in queryDepartment" :key="index">
                                            <template v-if="companyStatus">
                                                <div  @click.stop="handleEditDepartment(item)" class="clear" style="align-items:center; display: -webkit-flex;">
                                                    <img src="../images/h.png" width="40px" alt="" class="fl" style="border-radius:2px;">
                                                    <span v-html="item.departmentName" class="fl" style="margin-left:14px;width:218px"></span>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div class="clear" style="align-items:center; display: -webkit-flex;">
                                                    <img src="../images/h.png" width="40px" alt="" class="fl" style="border-radius:2px;">
                                                    <span v-html="item.departmentName" class="fl" style="margin-left:14px;width:218px"></span>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                                <div v-show="queryEmployee.length === 0 && queryDepartment.length === 0 && searchPeople == false" style="font-size:14px;color:#909399;padding:20px 84px">
                                    未搜索到相关部门与人员
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="frameWork_right">
                        <template v-if="companyStatus">
                            <div style="float:right;margin-bottom:20px;">
                                <div style="display: inline-block;position: relative;">
                                    <el-button style="background:#4278BE;color:#fff;width:120px;" @click.stop="showAdding = !showAdding">+添加</el-button>
                                    <div style="position:absolute;top:39px;left:0;z-index:8;background:#F8F8F8;width:120px" v-show="showAdding">
                                        <div class="clear frameWork_right_department" @click.stop="addDepartment">
                                            <img src="../images/department.png" alt="" class="fl" style="margin-top:2px">
                                            <p class="fl" style="margin-left:15px">部门</p>
                                        </div>
                                        <div class="clear frameWork_right_department" @click.stop="addMember">
                                            <img src="../images/member.png" alt="" class="fl" style="margin-top:2px">
                                            <p class="fl" style="margin-left:15px">成员</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <el-table
                            class="el-table"
                            ref="multipleTable"
                            :data="organizational "
                            border
                            :header-cell-style="{
                            'text-align':'left',
                            'color': '#303133',
                            'font-size':'16px'
                            }"
                            :cell-style="{
                            'text-align':'left',
                            'color': '#606266',
                            'font-size':'14px'
                            }"
                            tooltip-effect="dark"
                            :row-class-name="tableRowClassName"
                            style="width: 100%">
                            <el-table-column align="center" label="姓名" prop="employeeName" :show-overflow-tooltip="true">
                                <!-- <template slot-scope="scope">{{ scope.row.customerName }}</template> -->
                            </el-table-column>
                            <el-table-column align="center" prop="employeeJob" label="职位" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <div>{{scope.row.employeeJob ? scope.row.employeeJob : '暂未设置'}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="phone" label="手机号" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column align="center" prop="department" label="所属部门" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <div>{{scope.row.department ? scope.row.department : '暂未设置'}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作">
                                <template slot-scope="scope">
                                    <el-button size="mini" icon="el-icon-view" @click="handleLookPer(scope.row)"></el-button>
                                    <el-button size="mini" icon="el-icon-edit" v-if="companyStatus"  @click="handleEditPer(scope.row)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                            class="el-pagination"
                            @size-change="handleSizeChange"
                            @current-change="getMyCustomer"
                            :current-page.sync="currentPage"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalCount"
                        ></el-pagination>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="container_slide">
            <!-- 添加成员 -->
            <div class="slide_dialog" ref="slide_dialog" @click.stop="showAddmember = true"  v-show="showAddmember">
                <h4>添加成员<span class="fr closeDialog" @click.stop="showAddmember = false">×</span></h4>
                <div style="overflow:auto;position:absolute;top:68px;bottom:51px">
                    <div style="padding:20px 90px 0 68px">
                    <el-form
                        :model="ruleForm"
                        :rules="rules"
                        ref="ruleForm"
                        label-width="100px"
                        class="addMembers"
                        >
                        <el-form-item label="成员姓名:" prop="name">
                            <el-input v-model="ruleForm.name" placeholder="必填"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码:" prop="telephone">
                            <el-input v-model.number="ruleForm.telephone" placeholder="必填" maxlength="11" @input.native="handleSearchMember"></el-input>
                        </el-form-item>
                        <el-form-item label="所属部门:" prop="department">
                            <el-input
                                :value="ruleForm.department"
                                placeholder="必填"
                                @focus="showdepartment"
                                readonly>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="负责部门:" prop="departments">
                            <el-input
                                :value="ruleForm.departments"
                                placeholder="选填"
                                @focus="showDialog"
                                readonly>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="职位:" prop="position">
                            <el-input v-model="ruleForm.position" placeholder="选填"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱:" prop="email">
                            <el-input v-model="ruleForm.email" placeholder="选填"></el-input>
                        </el-form-item>
                        <el-form-item label="性别:" prop="gender">
                            <el-radio-group v-model="ruleForm.gender">
                                <el-radio :label="1">男</el-radio>
                                <el-radio :label="0">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="工号:" prop="number">
                            <el-input v-model="ruleForm.number" placeholder="选填"></el-input>
                        </el-form-item>
                        <el-form-item label="办公地点:" prop="location">
                            <el-input v-model="ruleForm.location" placeholder="选填"></el-input>
                        </el-form-item>
                        <el-form-item label="入职时间:" prop="time">
                            <!-- <el-input v-model="ruleForm.time" placeholder="必填"></el-input> -->
                            <el-date-picker
                                v-model="ruleForm.time"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                type="date"
                                placeholder="选择入职时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="描述:" prop="desc">
                            <el-input type="textarea" v-model="ruleForm.desc" placeholder="请填写......" maxlength="200" show-word-limit></el-input>
                        </el-form-item>
                    </el-form>
                    <p style="padding:0 19px 20px 100px;font-size:12px;color:#909399">提示：添加成员后，该成员可以通过手机号+短信验证码方式登录平台并确认加入团队</p>
                </div>
                </div>
                <div class="slide_footer">
                    <el-button class="fr" style="width:80px;height:34px;background:#4278BE;border-radius:3px;color:#fff;padding:0" :disabled = "openIsDisabled" @click="handleSubmitMember">保存</el-button>
                </div>
            </div>
            <!-- 编辑查看成员 -->
            <div class="slide_dialog"  ref="slide_dialog" @click.stop="showEditmember = true"  v-show="this.$store.state.model.showEditmember">
                <h4>{{  editMember.showLook ? '编辑成员' : '查看成员'  }}<span class="fr closeDialog" @click="$store.commit('showEditmember',false)">×</span></h4>
                <div style="overflow:auto;position:absolute;top:68px;bottom:51px">
                    <div style="padding:20px 90px 0px 80px">
                    <el-form
                        :model="editMember"
                        :rules="editMemberRules"
                        ref="editMember"
                        label-width="100px"
                        class="addMembers"
                        >
                        <el-form-item label="成员姓名:" prop="employeeName">
                            <!-- <el-input v-model="editMember.employeeName" placeholder="必填"></el-input> -->
                            <template v-if="editMember.showLook">
                                <el-input v-model="editMember.employeeName" placeholder="必填"></el-input>
                            </template>
                            <template v-else>
                                <el-input v-model="editMember.employeeName" placeholder="必填" readonly></el-input>
                            </template>
                        </el-form-item>
                        <el-form-item label="手机号码:" prop="phone">
                            <el-input v-model="editMember.phone" placeholder="必填" disabled></el-input>
                            <p style="font-size:10px;color:#909399;line-height:0px;margin-top:8px">已在职的用户，无法修改手机号，请让员工自行在手机上修改</p>
                        </el-form-item>
                        <el-form-item label="所属部门:" prop="department">
                            <template v-if="editMember.showLook">
                                <el-input
                                    :value="editMember.department"
                                    placeholder="必填"
                                    @focus="showdepartment"
                                    readonly>
                                </el-input>
                            </template>
                            <template v-else>
                                <el-input
                                    :value="editMember.department"
                                    readonly>
                                </el-input>
                            </template>
                        </el-form-item>
                        <el-form-item label="负责部门:" prop="departments">
                            <template v-if="editMember.showLook">
                                <el-input
                                    :value="editMember.responsibleDepartment"
                                    placeholder="选填"
                                    @focus="showEditDialog(editMember.responsibleDepartments)"
                                    readonly>
                                </el-input>
                            </template>
                            <template v-else>
                                <el-input
                                    :value="editMember.responsibleDepartment"
                                    readonly>
                                </el-input>
                            </template>
                        </el-form-item>
                        <el-form-item label="状态:">
                            {{editMember.employeeStatus ? '在职' : '离职'}}
                        </el-form-item>
                        <el-form-item label="职位:" prop="position">
                            <!-- <el-input v-model="editMember.employeeJob" placeholder="选填"></el-input> -->
                            <template v-if="editMember.showLook">
                                <!-- <el-input v-model="editMember.employeeName" placeholder="选填"></el-input> -->
                                <el-input v-model="editMember.employeeJob" placeholder="选填"></el-input>
                            </template>
                            <template v-else>
                                <el-input v-model="editMember.employeeJob" placeholder="选填" readonly></el-input>
                                <!-- <el-input v-model="editMember.employeeName" placeholder="选填" readonly></el-input> -->
                            </template>
                        </el-form-item>
                        <el-form-item label="邮箱:" prop="email">
                            <!-- <el-input v-model="editMember.employeeEmail" placeholder="选填"></el-input> -->
                            <template v-if="editMember.showLook">
                                <el-input v-model="editMember.employeeEmail" placeholder="选填"></el-input>
                            </template>
                            <template v-else>
                                <el-input v-model="editMember.employeeEmail" placeholder="选填" readonly></el-input>
                            </template>
                        </el-form-item>
                        <el-form-item label="性别:" prop="gender">
                            <el-radio-group v-model="editMember.employeeGender">
                                <el-radio :label="1">男</el-radio>
                                <el-radio :label="0">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="工号:" prop="number">
                            <template v-if="editMember.showLook">
                                <el-input v-model="editMember.employeeNo" placeholder="选填"></el-input>
                            </template>
                            <template v-else>
                                <el-input v-model="editMember.employeeNo" placeholder="选填" readonly></el-input>
                            </template>
                        </el-form-item>
                        <el-form-item label="办公地点:" prop="location">
                            <template v-if="editMember.showLook">
                                <el-input v-model="editMember.employeeOfficeLocation" placeholder="选填"></el-input>
                            </template>
                            <template v-else>
                                <el-input v-model="editMember.employeeOfficeLocation" placeholder="选填" readonly></el-input>
                            </template>
                        </el-form-item>
                        <el-form-item label="入职时间:" prop="time">
                            <!-- <el-input v-model="editMember.employeeEntryTime" placeholder="必填"></el-input> -->
                            <template v-if="editMember.showLook">
                                <el-date-picker
                                    v-model="editMember.employeeEntryTime"
                                    value-format="yyyy-MM-dd"
                                    format="yyyy-MM-dd"
                                    type="date"
                                    placeholder="选择入职时间">
                                </el-date-picker>
                            </template>
                            <template v-else>
                                <el-date-picker
                                    v-model="editMember.employeeEntryTime"
                                    value-format="yyyy-MM-dd"
                                    format="yyyy-MM-dd"
                                    type="date"
                                    readonly
                                    placeholder="选择入职时间">
                                </el-date-picker>
                            </template>
                        </el-form-item>
                        <el-form-item label="描述:" prop="desc">
                            <template v-if="editMember.showLook">
                                <el-input type="textarea" v-model="editMember.employeeDescribe" placeholder="请填写......" maxlength="200" show-word-limit></el-input>
                            </template>
                            <template v-else>
                                <el-input type="textarea" v-model="editMember.employeeDescribe" placeholder="请填写......" maxlength="200" show-word-limit readonly></el-input>
                            </template>
                        </el-form-item>
                    </el-form>
                </div>
                <div>
                    <p style="padding:0px 89px 20px 182px;font-size:12px;color:#909399;">提示：添加成员后，该成员可以通过手机号+短信验证码方式登录平台并确认加入团队</p>
                </div>
                </div>
                <!-- 标记离职按钮 -->
                <template v-if="editMember.employeeStatus == 1">
                    <div class="slide_footer" v-show="editMember.showLook">
                        <el-button class="fr" style="width:80px;height:34px;background:#4278BE;border-radius:3px;color:#fff;padding:0" @click="handlePreservationMember">保存</el-button>
                        <el-button class="fr" style="width:80px;height:34px;border:1px solid #4278BE;border-radius:3px;color:#4278BE;margin-right:24px;margin-left: 0px;padding:0" @click="handleQuit">标记离职</el-button>
                        <el-button class="fr" style="width:80px;height:34px;border:1px solid #4278BE;border-radius:3px;color:#4278BE;margin-right:24px;margin-left: 0px;padding:0" @click="removeMember">删除成员</el-button>
                    </div>
                </template>
                <template v-if="editMember.employeeStatus == 0">
                    <!-- 标记入职按钮 -->
                    <div class="slide_footer" v-show="editMember.showLook">
                        <el-button class="fr" style="width:80px;height:34px;background:#4278BE;border-radius:3px;color:#fff;padding:0"  @click="handlePreservationMember">保存</el-button>
                        <el-button class="fr" style="width:80px;height:34px;border:1px solid #4278BE;border-radius:3px;color:#4278BE;margin-right:24px;margin-left: 0px;padding:0" @click="handleEntry">标记入职</el-button>
                        <el-button class="fr" style="width:80px;height:34px;border:1px solid #4278BE;border-radius:3px;color:#4278BE;margin-right:24px;margin-left: 0px;padding:0" @click="removeMember">删除成员</el-button>
                    </div>
                </template>
            </div>
            <!-- 编辑部门 -->
            <div class="slide_dialog" ref="slide_dialog" @click.stop="showEditDepartment = true"  v-show="showEditDepartment">
                <h4>{{ editDepartmentForm.showLook ? '编辑部门' : '查看部门'}}<span class="fr closeDialog" @click.stop="showEditDepartment = false">×</span></h4>
                <div style="padding:20px 90px 0 80px">
                    <el-form
                        :model="editDepartmentForm"
                        :rules="departmentRules"
                        ref="EditdepartmentForm"
                        label-width="100px"
                        class="addMembers"
                        >
                        <el-form-item label="部门名称:" prop="departmentName">
                            <el-input v-model="editDepartmentForm.departmentName" placeholder="必填"></el-input>
                        </el-form-item>
                        <el-form-item label="上级部门:" prop="department">
                            <template v-if="editDepartmentForm.showLook">
                                <el-input
                                    :value="editDepartmentForm.superDepartmentName"
                                    placeholder="必填"
                                    @focus="showdepartment"
                                    readonly>
                                </el-input>
                            </template>
                            <template v-else>
                                <el-input
                                    :value="editDepartmentForm.superDepartmentName"
                                    readonly>
                                </el-input>
                            </template>
                        </el-form-item>
                        <el-form-item label="部门负责人:" prop="personValue">
                            <template v-if="editDepartmentForm.showLook">
                                <el-input
                                    :value="editDepartmentForm.responsibleDepartment"
                                    placeholder="必填"
                                    @focus="departmentDialog"
                                    readonly>
                                </el-input>
                            </template>
                            <template v-else>
                                <el-input
                                    :value="editDepartmentForm.responsibleDepartment"
                                    readonly>
                                </el-input>
                            </template>
                        </el-form-item>
                    </el-form>
                </div>
                <div>
                    <template v-if=" editDepartmentForm.showLook">
                        <div class="slide_footer">
                            <el-button class="fr" style="width:80px;height:34px;;background:#4278BE;border-radius:3px;color:#fff;padding:0" @click="submitDepartment">保存</el-button>
                            <el-button class="fr" style="width:80px;height:34px;border:1px solid #4278BE;border-radius:3px;color:#4278BE;margin-right:24px;margin-left: 0px;padding:0" @click="removeDepartmentVisibles = true">删除部门</el-button>
                        </div>
                    </template>
                </div>
            </div>
            <!-- 新建部门 -->
            <div class="slide_dialog" ref="slide_dialog" @click.stop="showAddDepartment = true"  v-show="showAddDepartment">
                <h4>新建部门<span class="fr closeDialog" @click.stop="showAddDepartment = false">×</span></h4>
                <div style="padding:20px 90px 0 80px">
                    <el-form
                        :model="departmentForm"
                        :rules="departmentRules"
                        ref="departmentForm"
                        label-width="100px"
                        class="addMembers"
                        >
                        <el-form-item label="部门名称:" prop="departmentName">
                            <el-input v-model="departmentForm.departmentName" placeholder="必填"></el-input>
                        </el-form-item>
                        <el-form-item label="上级部门:" prop="department">
                            <el-input
                                :value="departmentForm.department.departmentName"
                                placeholder="必填"
                                @focus="showdepartment"
                                readonly>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="部门负责人:" prop="personValue">
                            <el-input
                                :value="departmentForm.personValue"
                                placeholder="必填"
                                @focus="departmentDialog"
                                readonly>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div>
                    <div class="slide_footer">
                        <el-button class="fr" style="width:80px;height:34px;;background:#4278BE;border-radius:3px;color:#fff;padding:0" @click="handleNewDepartment">保存</el-button>
                    </div>
                </div>
            </div>
            <!-- 设置团队 -->
            <!-- <div class="slide_dialog" ref="slide_dialog" @click.stop="showEditTeam = true"  v-show="this.$store.state.model.showEditTeam">
                <h4>设置团队</h4>
                <div style="padding:20px 90px 0 80px">
                    <el-form
                        :model="team"
                        :rules="teamRules"
                        ref="teamForm"
                        label-width="100px"
                        class="addMembers"
                        >
                        <el-form-item label="团队名称:" prop="name">
                            <el-input v-model="team.name" placeholder="必填" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="部门负责人:">
                            <el-input
                                :value="team.department.departmentName"
                                placeholder="必填"
                                @focus="dialogVisible = true"
                                readonly>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="部门logo:">
                            <template v-if="fileList.length === 1">
                                <img :src="fileList[0].url" alt="" width="44px" style="display:inline-block;vertical-align: middle;">
                            </template>
                            <template v-else>
                                <img src="../../index/images/upload.png" alt="" width="15px" style="display:inline-block;vertical-align: middle;">
                            </template>
                            <el-upload
                                class="upload-demo"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :on-success="handleUploadSuccess"
                            >
                            <template v-if="fileList.length === 1">
                                <span style="color:#4278BE">更改</span>
                            </template>
                            <template v-else>
                                <span style="color:#4278BE">上传图片</span>
                            </template>
                            </el-upload>
                            <template v-if="fileList.length === 1">
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
                        <el-button class="fr" style="width:80px;height:34px;;background:#4278BE;border-radius:3px;color:#fff;padding:0">保存</el-button>
                    </div>
                </div>
            </div> -->
        </div>
        <!-- 选择部门弹框（多选） -->
        <div ref="TreeTransferDialog">
            <TreeTransferDialog
                :IsNum='isNum'
                :treeData="data"
                :defaultProps="{label:'departmentName',children:'children'}"
                :transferTitle="['选择部门', '已选择']"
                :dialogVisible="dialogVisible"
                @close="handleClose"
                @submit="handleSubmit">
            </TreeTransferDialog>
        </div>
        <!-- 选择部门人员弹框 -->
        <div ref="persondialog">
            <persondialog
                :treeData="data1"
                :defaultProps="{label:'name',children:'children'}"
                :transferTitle="['选择部门人员', '已选择']"
                :managers='editDepartmentForm.managers'
                :dialogVisible="personDialogVisible"
                @handlePersonClose="handlePersonClose"
                @handlePsrsonSubmit="handlePsrsonSubmit">
            </persondialog>
        </div>
        <!-- 选择部门弹框 (单选)-->
        <div class="department_dialog" ref="department" >
            <department :treeData="data"
                        :dialogVisible="departmentVisible"
                        @submit="handleDepartment"
                        :editMember='editMember'
                        :showdepartment="editDepartmentForm"
                        @close="handleDepartmentClose"/>
        </div>
        <!-- 标记离职弹框 -->
        <div ref="QuitVisible">
            <el-dialog
                :visible.sync="QuitVisible"
                width="30%"
                style="margin-top: 22vh;"
                >
                <span>将该成员标记离职后，该成员将被从团队中移除，是否确认？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="QuitVisible = false" style="width:80px;height:34px;;color:#4278BE;border:1px solid #4278BE;padding:0">取 消</el-button>
                    <el-button type="primary" @click="handleQuitVisible" style="width:80px;height:34px;;background:#4278BE;color:#fff;padding:0">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <!-- 标记入职弹框 -->
        <div ref="EntryVisible">
            <el-dialog
                :visible.sync="EntryVisible"
                width="30%"
                style="margin-top: 22vh;"
                >
                <span>将该成员标记入职后，该成员将重新加入团队，是否确认？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="EntryVisible = false" style="width:80px;height:34px;;color:#4278BE;border:1px solid #4278BE;padding:0">取 消</el-button>
                    <el-button type="primary" @click="handleEntryVisible" style="width:80px;height:34px;;background:#4278BE;color:#fff;padding:0">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        <!-- 删除成员弹框 -->
        <el-dialog
            :visible.sync="removeMemberVisible"
            width="30%"
            style="margin-top: 22vh;"
            >
            <span>删除该成员后，该成员将被从团队成员中彻底删除，是否确认？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="removeMemberVisible = false" style="width:80px;height:34px;;color:#4278BE;border:1px solid #4278BE;padding:0">取 消</el-button>
                <el-button type="primary" @click="handleRemoveMember" style="width:80px;height:34px;;background:#4278BE;color:#fff;padding:0">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 是否确定删除该部门？ -->
        <el-dialog
            :visible.sync="removeDepartmentVisibles"
            width="30%"
            style="margin-top: 22vh;"
            >
            <span>是否确定删除该部门？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="removeDepartmentVisibles = false" style="width:80px;height:34px;;color:#4278BE;border:1px solid #4278BE;padding:0">取 消</el-button>
                <el-button type="primary" @click="removeDepartment" style="width:80px;height:34px;;background:#4278BE;color:#fff;padding:0">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 只能删除没有成员的部门, 需要先删除部门下的员工，再删除该部门! -->
        <el-dialog
            :visible.sync="confirmDepartmentVisible"
            width="30%"
            style="margin-top: 22vh;"
            >
            <span>只能删除没有成员的部门, 需要先删除部门下的员工，再删除该部门!</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleCloseConfirmDepartment" style="width:80px;height:34px;;color:#4278BE;border:1px solid #4278BE;padding:0">取 消</el-button>
                <el-button type="primary" @click="handleConfirmDepartment" style="width:80px;height:34px;;background:#4278BE;color:#fff;padding:0">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 是否确定删除该部门？ -->
        <el-dialog
            :visible.sync="removeDepartmentVisible"
            width="30%"
            style="margin-top: 22vh;"
            >
            <span>是否确定删除该部门？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="removeDepartmentVisible = false" style="width:150px;height:50px;color:#4278BE;border:1px solid #4278BE">取 消</el-button>
                <el-button type="primary" @click="handleRemoveDepartment(data)" style="width:150px;height:50px;background:#4278BE;color:#fff">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import TreeTransferDialog from '../../../commons/TreeTransferDialog'
import persondialog from '../../../commons/persondialog'
import department from './department'
import bus from  '../../../../modules/bus'
import '../../../../modules/common'
export default {
    name: 'frameWork',
    data() {
        const nametxt = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入成员姓名'))
            } else {
                const reg =  /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,6}$/
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
            activeName: 'first',
            tabNum: 0,
            searchFrameWork: '',
            data:[], //部门tree
            data1:[], // 部门人员tree
            currentPage: 1,
            totalCount: 100,
            pageSize: 10,
            flag:false,
            searchPeople:true,
            searchContent:false,
            departmentContent:false,
            showAdding:false,  // 添加按钮  显示部门列表
            organizational :[],
            removeDepartmentVisible:false,
            confirmDepartmentVisible:false,
            // this.queryEmployee.length === 0 && this.queryDepartment.length === 0:false,
            queryEmployee:[],
            queryDepartment:[],
            removeDepartmentObject:{},
            companyObj:JSON.parse(window.sessionStorage.getItem('companyObj')) || JSON.parse(window.sessionStorage.getItem('teamEmployeeDetailVO')),
            showAddmember: false,  // 添加成员
            showEditmember:false,    // 编辑成员
            QuitVisible:false,  // 离职模态框
            EntryVisible:false,  // 入职模态框
            removeMemberVisible:false,   // 删除成员模态框
            showAddDepartment:false, //添加部门
            personValue:'',   //部门负责人
            showEditDepartment:false, // 编辑部门
            removeDepartmentVisible: false,  //删除部门弹框
            removeDepartmentVisibles:false,
            confirmDepartmentVisible: false,  // 只能删除没有成员的部门, 需要先删除部门下的员工，再删除该部门!
            editlookDepartment: false,
            showEditTeam:false, // 设置团队
            openIsDisabled:false,
            index:1,
            refreshStatus:'',
            companyStatus:JSON.parse(window.sessionStorage.getItem('companyStatus')),
            //编辑成员
            editMember: {
                // employeeName: '',
                // phone: '',
                // employeeEmail: '',
                // employeeJob:'', //职位
                // employeeGender:'',
                // employeeStatus: '',//在职状态
                // employeeNo:'', //工号
                // employeeOfficeLocation:'', //办公地点
                // employeeEntryTime: '',   //入职时间
                // department: '', // 所属部门
                // employeeDescribe: '',   //描述
                // departmentId: '', //所属部门id
                // departmentIdList:[], //附属部门
                // responsibleDepartment: '', // 查看附属部门列表
                // showLook:false,    // 判断显示查看 编辑页   false为查看成员  true为编辑成员
            },
            editMemberRules: {
                employeeName: [
                    {
                        required: true,
                        validator: nametxt,
                        trigger: 'blur'
                    },
                ],
                phone: [
                    {
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur'
                    },
                    { message: '手机号输入不正确', trigger: 'blur', pattern: /^1[34578]\d{9}$/}
                ],
                department: [
                    {
                        required: true,
                        message: '请选择所属部门',
                        trigger: 'change'
                    },
                ],
            },
             //添加成员
            ruleForm: {
                id:'',
                name: '',
                telephone: '',
                email: '',
                position:'', //职位
                gender:0,
                number:'', //工号
                location:'', //办公地点
                time: new Date().Format('yyyy-MM-dd'),   //入职时间
                department: '', // 所属部门
                desc: '',   //描述
                departmentId: '', //所属部门id
                departments:'', //附属部门
                departmentIdList:[]
            },
            rules: {
                name: [
                    {
                        required: true,
                        validator: nametxt,
                        trigger: 'blur'
                    },
                ],
                telephone: [
                    {
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur'
                    },
                    { message: '手机号输入不正确', trigger: 'blur', pattern: /^1[34578]\d{9}$/}
                ],
                department: [
                    {
                        required: true,
                        message: '请选择所属部门',
                        trigger: 'change'
                    },
                ],
                time: [
                    {
                        required: true,
                        message: '请选择入职时间',
                        trigger: 'change'
                    },
                ],
            },
            // 新建部门
            departmentForm:{
                pid: '',
                departmentName:'',
                department: '',
                personValue: '',
                departmentManagers: [], //后台需要的数据
                responsibleDepartment:'',
            },
            departmentRules: {
                departmentName: [
                    {
                        required: true,
                        message: '请输入部门名称',
                        trigger: 'blur'
                    },
                ],
            },
            isNum:[],
            editDepartmentForm: {

            },

            dialogVisible: false,
            personDialogVisible:false,
            departmentVisible:false
        }
    },
    components: {
        TreeTransferDialog,
        department,
        persondialog
    },
    watch: {
        refreshStatus (newval) {
            this.$router.go(0);
        },
        // companyObj (newval) {
        //     this.handleData()
        //     this.getMyCustomer()
        //     this.handleDatas()
        //     this.handleLookPers()
        // }
    },
    created () {
        this.handleData()
        this.getMyCustomer()
        this.handleDatas()
        this.handleLookPers()
    },
    methods: {
        handleData () {
            this.$http({
                method: 'POST',
                url:this.orgManager +  '/v1/organization/department/queryAddressBook',
                data: {
                    companyId:this.companyObj.companyId
                },
            }).then(res => {
                if (res.data.code === 200) {
                    if (res.data.data.children.length != 0) {
                        res.data.data.children[0].first = false
                        this.data = []
                        this.data.push(res.data.data.children[0])
                        this.iteration (this.data)
                    }else {
                        this.data = []
                    }
                }
            })
        },
        iteration(data) {
            for (var j = 0; j < data.length; j++) {
                data[j].updateTime = false
                if (data[j].children != undefined && data[j].children.length > 0) {
                    this.iteration(data[j].children)
                }
            }
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
        handleClick(tab, event) {
            console.log(tab)
        },
        handleNodeClick(obj) {
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/employee/queryPageByDepartmentId',
                // url: 'http://192.168.50.64:8013/v1/organization/employee/queryPageByDepartmentId',
                data: {
                    pageNum: this.currentPage,
                    pageSize:this.pageSize,
                    companyId:obj.companyId || this.companyObj.companyId,
                    departmentId:obj.id || this.companyObj.companyId
                },
            }).then(res => {
                if (res.data.code === 200 && res.data.sysCode === 200) {
                    this.totalCount = res.data.data.totalCount
                    this.organizational  = res.data.data.list
                }
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getMyCustomer()
        },
        handleLookPer (value) {
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/employee/queryByEmployeeId',
                data: {
                    companyId:value.companyId,
                    id:value.id,
                    // employeeId:value.id
                },
            }).then(res => {
                if (res.data.code == 200 && res.data.data != null) {
                    var editLook =  res.data.data
                    var string =  ''
                    editLook.responsibleDepartments.forEach(item => {
                        string+=item.departmentName+'、'
                    })
                    editLook.responsibleDepartment = string.slice(0,-1)
                    editLook.showLook = false
                    this.editMember = editLook
                    this.showEditmember = true
                    this.$store.commit('showEditmember',true)
                }
            })
        },
        handleLookPers () {
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/employee/queryByEmployeeId',
                data: {
                    companyId:this.$route.params.id,
                    id:this.$route.params.approver,
                    // employeeId:1564543891550079
                },
            }).then(res => {
                if (res.data.code == 200 && res.data.data != null) {
                    var editLook =  res.data.data
                    var string =  ''
                    editLook.responsibleDepartments.forEach(item => {
                        string+=item.departmentName+'、'
                    })
                    editLook.responsibleDepartment = string.slice(0,-1)
                    editLook.showLook = false
                    this.editMember = editLook
                    this.showEditmember = true
                }
            })
        },
        handleEditPer (value) {
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/employee/queryByEmployeeId',
                data: {
                    companyId:value.companyId,
                    id:value.id,
                    // employeeId:value.id
                },
            }).then(res => {
                if (res.data.code == 200 && res.data.data != null) {
                    var editLook =  res.data.data
                    var string =  ''
                    editLook.responsibleDepartments.forEach(item => {
                        string+=item.departmentName+'、'
                    })
                    this.isNum = editLook.responsibleDepartments
                    editLook.responsibleDepartment = string.slice(0,-1)
                    editLook.showLook = true
                    this.editMember = editLook
                    this.showEditmember = true
                    this.$store.commit('showEditmember',true)
                }
            })
        },
        // 获取表格数据
        getMyCustomer () {
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/employee/queryPageByDepartmentId',
                // url:'http://192.168.50.64:8013/v1/organization/employee/queryPageByDepartmentId',
                data: {
                    pageNum: this.currentPage,
                    pageSize:this.pageSize,
                    companyId:this.companyObj.companyId,
                    departmentId:this.companyObj.companyId
                },
            }).then(res => {
                if (res.data.code === 200 && res.data.sysCode === 200) {
                    this.totalCount = res.data.data.totalCount
                    this.organizational  = res.data.data.list
                }
            })
        },
        // 设置团队
        // handleSetTeam (data) {
        //     console.log(data)
        //     this.$store.commit('showEditTeam',true)
        //     this.team.name = data.departmentName
        // },
        tableRowClassName({row, rowIndex}) {
            if(rowIndex%2==1){
                return 'success-row';
            }else{
                return 'warning-row';
            }
        },
        searhInput () {
            if (this.searchFrameWork.trim().length > 0) {
                this.queryEmployee = []
                this.queryDepartment = []
                this.$http({
                method: 'POST',
                url:this.orgManager + '/v1/organization/search/info',
                data: {
                    companyId:this.companyObj.companyId,
                    searchName:this.searchFrameWork,
                    },
                }).then(res => {
                    if (res.data.code === 200 && res.data.sysCode === 200) {
                        if (res.data.data.employeeObject != null && res.data.data.employeeObject.length > 0 && res.data.data.departmentObject != null && res.data.data.departmentObject.length > 0) {
                            this.searchPeople = false,
                            this.queryEmployee = res.data.data.employeeObject
                            this.changeColor(res.data.data.employeeObject)
                             this.changeColors(res.data.data.departmentObject)
                            this.searchContent = true
                            this.departmentContent = true
                        }else if (res.data.data.employeeObject != null && res.data.data.employeeObject.length > 0) {
                            this.searchPeople = false,
                            this.queryEmployee = res.data.data.employeeObject
                            this.changeColor(res.data.data.employeeObject)
                            this.searchContent = true
                            this.departmentContent = false
                        }else if (res.data.data.departmentObject != null && res.data.data.departmentObject.length > 0) {
                            this.changeColors(res.data.data.departmentObject)
                            this.searchPeople = false
                            this.departmentContent = true
                        }else {
                            this.searchContent = false
                            this.searchPeople = false
                        }
                    }
                })
            }else {
                this.departmentContent = false
                this.searchPeople = true,
                this.searchContent = false
            }
        },
        changeColor (resultsList) {
            resultsList.forEach((item, index) => {
                // console.log('item', item)
                if (this.searchFrameWork && this.searchFrameWork.length > 0) {
                    // 匹配关键字正则
                    let replaceReg = new RegExp(this.searchFrameWork, 'g')
                    // 高亮替换v-html值
                    let replaceString =
                        '<span class="search-text">' + this.searchFrameWork + '</span>'
                        resultsList[index].employeeName = item.employeeName.replace(
                            replaceReg,
                            replaceString
                        )
                        resultsList[index].phone = item.phone.replace(
                            replaceReg,
                            replaceString
                        )
                }
            })
            this.queryEmployee = []
            this.queryEmployee = resultsList
        },
        changeColors (resultsList) {
            resultsList.forEach((item, index) => {
                // console.log('item', item)
                if (this.searchFrameWork && this.searchFrameWork.length > 0) {
                // 匹配关键字正则
                let replaceReg = new RegExp(this.searchFrameWork, 'g')
                // 高亮替换v-html值
                let replaceString =
                    '<span class="search-text">' + this.searchFrameWork + '</span>'
                    resultsList[index].departmentName = item.departmentName.replace(
                        replaceReg,
                        replaceString
                    )
                }
            })
            this.queryDepartment = []
            this.queryDepartment = resultsList
        },
        // 添加按钮  显示部门列表
        addDepartment () {
            // this.$store.commit('showAddDepartment',true)
            this.showAddDepartment = true
            this.showAdding = false
            // this.showAddDepartment = true
        },
        // 添加按钮  显示成员列表
        addMember () {
            // this.$store.commit('showAddmember',true)
            this.showAddmember = true
            this.showAdding = false
        },
        handleUploadSuccess(response) {
            console.log(response)
            // fileList
        },
        // 查看部门
        handleQueryDepartment (value) {
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/department/queryDepartmentDetail',
                data: {
                    companyId:value.companyId,
                    id:value.id,
                },
            }).then(res => {
                var editLook =  res.data.data
                var string =  ''
                editLook.managers.forEach(item => {
                    string+=item.employeeName+'(' + item.department + ')'  +'、'
                })
                editLook.responsibleDepartment = string.slice(0,-1)
                editLook.showLook = false
                // bus.$emit('editLookDepartment',editLook)
                this.editDepartmentForm = editLook
                // this.$store.commit('showEditDepartment',true)
                this.showEditDepartment = true
            })
        },
        // 编辑部门
        handleEditDepartment (value) {
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/department/queryDepartmentDetail',
                data: {
                    companyId:value.companyId,
                    id:value.id,
                },
            }).then(res => {
                if (res.data.code == 200) {
                    var editLook = res.data.data
                    var string =  ''
                    editLook.managers.forEach(item => {
                        string+=item.employeeName+'(' + item.department + ')'  +'、'
                    })
                    var array =  []
                    editLook.managers.forEach(item => {
                        if (item.departmentId == editLook.id) {
                            array.push({
                            employeeId:item.id,
                            departmentId:editLook.id,
                            departmentMainId:1,
                            employeeJob:item.employeeJob,
                            companyId:this.companyObj.companyId,
                        })
                        }else {
                            array.push({
                            employeeId:item.id,
                            departmentId:editLook.id,
                            departmentMainId:0,
                            employeeJob:item.employeeJob,
                            companyId:this.companyObj.companyId,
                                })
                        }
                    })
                    editLook.departmentManagers = array
                    editLook.responsibleDepartment = string.slice(0,-1)
                    editLook.showLook = true
                    // bus.$emit('editLookDepartment',editLook)
                    this.editDepartmentForm = editLook
                    // this.$store.commit('showEditDepartment',true)
                    this.showEditDepartment = true
                }else {
                    this.$message({
                        type:'error',
                        message:res.data.message
                    })
                }
            })
        },
        removeDepartments (value) {
            this.removeDepartmentVisible = true
            this.removeDepartmentObject = value
        },
        handleCloseConfirmDepartment () {
            this.removeDepartmentVisible = false
            this.confirmDepartmentVisible = false
        },
        handleConfirmDepartment () {
            this.removeDepartmentVisible = false
            this.confirmDepartmentVisible = false
        },
        // 删除部门
        handleRemoveDepartment (value) {
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/department/delete',
                data: {
                    id:this.removeDepartmentObject.id,
                    pid:this.removeDepartmentObject.pid,
                    companyId:this.companyObj.companyId,
                },
            }).then(res => {
                if (res.data.code == 501100003) {
                    this.confirmDepartmentVisible = true
                }else {
                    this.$message({
                        message: '删除部门成功',
                        type: 'success'
                    });
                    this.handleData()
                    this.removeDepartmentVisible = false
                }
            })
        },
        getParents(data, id) {
            for (var i in data) {
                if (data[i].id == id) {
                    return [];
                }
                if (data[i].children) {
                    var ro = this.getParents(data[i].children, id);
                    if (ro !== undefined)
                        return ro.concat(data[i]);
                }
            }
        },
        // 新建下级部门
        handleBottomDepartment (value) {
            console.log(value)
            this.showEditDepartment = false
            this.showAddDepartment = true
            this.departmentForm.department = value
        },
        // 新建同级部门
        handleCenterDepartment (value) {
            var arr = this.getParents(this.data,value.id)
            this.showEditDepartment = false
            this.showAddDepartment = true
            this.departmentForm.department = arr[0]
            // bus.$emit('handleBottomDepartment',arr[0])
        },
        handleDrop(draggingNode, dropNode, dropType, ev) {
            var arr = dropNode.parent.childNodes
            var index = arr.findIndex(item => {
                return item.key == draggingNode.data.id
            })
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/department/orderBy',
                data: {
                    departmentName:draggingNode.data.departmentName,
                    id:draggingNode.data.id,
                    pid:dropType == 'inner' ? dropNode.data.id : dropNode.parent.data.id,
                    seq:index == -1? 1 : index+1,
                    companyId:this.companyObj.companyId,
                },
            }).then(res => {
                if (res.data.code === 200 && res.data.sysCode === 200) {
                    this.$message({
                        message: '拖拽部门成功',
                        type: 'success'
                    })
                }
            })
        },
        handleSearchMember () {
            if (this.ruleForm.telephone.toString().length  == 11) {
                this.$http({
                    method: 'POST',
                    url: this.orgManager + '/v1/organization/employee/queryByPhone',
                    data: {
                        companyId:this.companyObj.companyId,
                        phone:this.ruleForm.telephone
                    },
                }).then(res => {
                    if (res.data.data != null) {
                        this.$message({
                            message: '该用户已被添加。',
                            type: 'warning'
                        })
                        // this.openIsDisabled = true
                        var data = res.data.data
                        this.ruleForm.id = data.id
                        this.ruleForm.telephone = data.phone
                        this.ruleForm.name = data.employeeName
                        // this.ruleForm.position = data.employeeJob
                        // this.ruleForm.number = data.employeeNo
                        this.ruleForm.gender = data.employeeGender
                        // this.ruleForm.department = data.department
                        // this.ruleForm.departmentId = data.departmentId
                        this.ruleForm.email = data.employeeEmail
                        // this.ruleForm.location = data.employeeOfficeLocation
                        this.ruleForm.time = data.employeeEntryTime
                        this.ruleForm.desc = data.employeeDescribe
                    }
                })
            }
        },
        // 保存编辑成员
        handlePreservationMember () {
            var arr = []
            this.editMember.responsibleDepartments.forEach(item => {
                if (item.id == this.editMember.departmentId) {
                    arr.push({
                        employeeId:this.editMember.id,
                        departmentId:item.id || item.departmentId,
                        departmentMainId:0,
                        manager:1
                    })
                }else {
                    arr.push({
                        employeeId:this.editMember.id,
                        departmentId:item.id || item.departmentId,
                        departmentMainId:1,
                        manager:1
                    })
                }
            })
            this.editMember.responsibleDepartments = arr
            this.$refs.editMember.validate((valid) => {
                if (valid) {
                    this.$http({
                        method: 'POST',
                        url: this.orgManager+ '/v1/organization/employee/edit',
                        data: {
                            id:this.editMember.id,
                            phone:this.editMember.phone,
                            employeeName:this.editMember.employeeName,
                            employeeJob:this.editMember.employeeJob,
                            employeeNo:this.editMember.employeeNo,
                            employeeGender:this.editMember.employeeGender,
                            employeeBirth:this.editMember.employeeBirth,
                            iconUrl:this.editMember.iconUrl,
                            department:this.editMember.department,
                            departmentId:this.editMember.departmentId,
                            employeeStatus:this.editMember.employeeStatus,
                            employeeEmail:this.editMember.employeeEmail,
                            employeeOfficeLocation:this.editMember.employeeOfficeLocation,
                            employeeEntryTime:this.editMember.employeeEntryTime,
                            employeeDescribe:this.editMember.employeeDescribe,
                            departmentIdList:this.editMember.responsibleDepartments,
                            companyId:this.companyObj.companyId,
                            },
                    }).then(res => {
                        if (res.data.code == 200  && res.data.sysCode == 200) {
                            this.$message({
                                message: '编辑人员成功',
                                type: 'success'
                            });
                            this.$store.commit('showEditmember',false)
                            this.showEditmember = false
                            this.getMyCustomer()
                            this.handleData()
                            this.$refs.editMember.resetFields();
                        }else {
                            this.$message({
                                message: res.data.message,
                                type: 'error'
                            });
                        }
                    })
                } else {
                    return false;
                }
                });
        },
        // 添加成员
        handleSubmitMember () {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.$http({
                        method: 'POST',
                        url: this.ssoManager + '/v1/user/userInfo/addEmployeeTemporary',
                        // url: 'http://192.168.50.193:8012/v1/user/userInfo/addEmployeeTemporary',
                        data: {
                            phone:this.ruleForm.telephone,
                            employeeName:this.ruleForm.name,
                            employeeJob:this.ruleForm.position,
                            employeeNo:this.ruleForm.number,
                            employeeGender:this.ruleForm.gender,
                            department:this.ruleForm.department,
                            departmentId: this.ruleForm.departmentId,
                            employeeStatus:0,
                            departmentIdList:this.ruleForm.departmentIdList,
                            employeeEmail:this.ruleForm.email,
                            employeeOfficeLocation:this.ruleForm.location,
                            employeeEntryTime:this.ruleForm.time,
                            employeeDescribe:this.ruleForm.desc,
                            companyId:this.companyObj.companyId,
                            },
                    }).then(res => {
                        if (res.data.code == 200) {
                            this.$message({
                                message: '添加成员成功',
                                type: 'success'
                            })
                            this.showAddmember = false
                            this.getMyCustomer()
                            this.$refs.ruleForm.resetFields();
                        }else {
                            this.$message({
                                message: res.data.message,
                                type: 'error'
                            });
                        }

                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        // 添加按钮  显示部门列表
        addDepartment () {
            this.showAdding = false
            this.showAddDepartment = true
        },
        // 添加按钮  显示成员列表
        addMember () {
            this.showAddmember = true
            this.showAdding = false
        },
        //  选择部门弹框（多选）  关闭按钮
        handleClose() {
            this.dialogVisible = false;
        },
        // 选择部门弹框（多选） 确定按钮
        handleSubmit(newValue) {
            var str = ''
            newValue.forEach(item => str+=item.departmentName + '、')
            var arr = []
            newValue.forEach(item => {
                if (item.id == this.editMember.departmentId) {
                    arr.push({
                        employeeId:this.editMember.id,
                        departmentId:item.id,
                        departmentMainId:0,
                        manager:1
                    })
                }else {
                    arr.push({
                        employeeId:this.editMember.id,
                        departmentId:item.id,
                        departmentMainId:1,
                        manager:1
                    })
                }
            })
            var newarr = []
            newValue.forEach(item => {
                if (item.id == this.ruleForm.departmentId) {
                    newarr.push({
                        employeeId:this.ruleForm.id,
                        departmentId:item.id,
                        departmentMainId:0,
                        manager:1
                    })
                }else {
                    newarr.push({
                        employeeId:this.ruleForm.id,
                        departmentId:item.id,
                        departmentMainId:1,
                        manager:1
                    })
                }
            })
            this.ruleForm.departments = str.slice(0,-1)
            this.ruleForm.departmentIdList = newarr
            this.editMember.responsibleDepartment = str.slice(0,-1);
            this.isNum = newValue
            this.editMember.responsibleDepartments = arr
        },
        // 添加成员   选择部门 弹框组织架构
        showDialog() {
            this.dialogVisible = true;
        },
        showEditDialog (value) {
            // this.$refs.TreeTransferDialog.targetNodes = value;
            this.dialogVisible = true;
            // this.isNum =  value;

        },
        // 新建部门   选择部门  弹框组织架构
        showdepartment () {
            this.departmentVisible = true
        },
        // 新建部门   选择部门负责人  弹框组织架构
        departmentDialog () {
            this.personDialogVisible = true
        },
        // 选择部门人员弹框   关闭按钮
        handlePersonClose () {
            this.personDialogVisible = false;
        },
        // 选择部门弹框 (单选)  关闭按钮
        handleDepartmentClose () {
            this.departmentVisible = false
        },
        // 选择部门弹框 (单选) 确认按钮
        handleDepartment (value) {
            this.editMember.department = value.departmentName
            this.editMember.departmentId = value.id
            this.departmentForm.department = value
            this.ruleForm.department = value.departmentName
            this.ruleForm.departmentId = value.id
            this.departments = value
            this.departmentVisible = false
            this.editDepartmentForm.superDepartmentName = value.departmentName
            this.editDepartmentForm.pid = value.id
        },
        // 选择部门人员弹框
        handlePsrsonSubmit (newvalue) {
            this.editDepartmentForm.responsibleDepartment = ''
            this.departmentForm.personValue = ''
            var str = ''
            var arr =  []
            newvalue.forEach(item => {
                str+= item.name + '(' + item.parent +')、'
                this.departmentForm.personValue = str.slice(0,-1)
                if (item.departmentId == this.editDepartmentForm.id) {
                    arr.push({
                    employeeId:item.employeeId,
                    departmentId:this.editDepartmentForm.id,
                    departmentMainId:1,
                    employeeJob:item.employeeJob,
                    companyId:this.companyObj.companyId,
                    })
                }else {
                    arr.push({
                    employeeId:item.employeeId,
                    departmentId:this.editDepartmentForm.id,
                    departmentMainId:0,
                    employeeJob:item.employeeJob,
                    companyId:this.companyObj.companyId,
                    })
                }
            })
            var array =  []
            var string = ''
            newvalue.forEach(item => {
                string+= item.name + '(' + item.parent +')、'
                this.editDepartmentForm.responsibleDepartment = string.slice(0,-1)
                if (item.departmentId == this.editDepartmentForm.id) {
                    array.push({
                    employeeId:item.employeeId,
                    departmentId:this.editDepartmentForm.id,
                    departmentMainId:1,
                    employeeJob:item.employeeJob,
                    companyId:this.companyObj.companyId,
                    })
                }else {
                    array.push({
                    employeeId:item.employeeId,
                    departmentId:this.editDepartmentForm.id,
                    departmentMainId:0,
                    employeeJob:item.employeeJob,
                    companyId:this.companyObj.companyId,
                    })
                }
            })
            this.editDepartmentForm.departmentManagers = array
            this.departmentForm.departmentManagers = arr
        },
        // 编辑部门
        submitDepartment () {
            this.$refs.EditdepartmentForm.validate((valid) => {
                if (valid) {
                    this.$http({
                        method: 'POST',
                        url: this.orgManager + '/v1/organization/department/edit',
                        data: {
                            id:this.editDepartmentForm.id,
                            pid: this.editDepartmentForm.pid,
                            departmentName: this.editDepartmentForm.departmentName,
                            companyId:this.companyObj.companyId,
                            departmentManagers:this.editDepartmentForm.departmentManagers
                        },
                    }).then(res => {
                        if (res.data.code == 200  && res.data.sysCode == 200) {
                            this.$message({
                                message: '编辑部门成功',
                                type: 'success'
                            });
                            // this.getMyCustomer()
                            this.handleData()
                            // this.$store.commit('showEditDepartment',false)
                            this.showEditDepartment = false
                        }else if (res.data.code == 501100002) {
                            this.$message({
                                message: res.data.message,
                                type: 'error'
                            });
                        }else {
                            this.$message({
                                message: res.data.message,
                                type: 'error'
                            });
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        // 新建部门
        handleNewDepartment () {
            this.$refs.departmentForm.validate((valid) => {
                if (valid) {
                    this.$http({
                        method: 'POST',
                        url: this.orgManager + '/v1/organization/department/add',
                        data: {
                            pid: this.departmentForm.department.id,
                            departmentName: this.departmentForm.departmentName,
                            companyId:this.companyObj.companyId,
                            departmentManagers: this.departmentForm.departmentManagers
                        },
                    }).then(res => {
                        if (res.data.code == 200  && res.data.sysCode == 200) {
                            this.$message({
                                message: '新建部门成功',
                                type: 'success'
                            });
                            // this.$store.commit('showAddDepartment',false)
                            this.showAddDepartment = false
                            // this.getMyCustomer()
                            this.handleData()
                        }else if (res.data.code == 501100002) {
                            this.$message({
                                message: res.data.message,
                                type: 'error'
                            })
                        }else {
                            this.$message({
                                message: res.data.message,
                                type: 'error'
                            });
                        }
                    })
                }else{
                    return false;
                }
            })
        },
        // 标记离职
        handleQuitVisible () {
            this.editMember.employeeStatus = 0
            this.QuitVisible = false
        },
        handleCloseConfirmDepartment () {
            this.removeDepartmentVisible = false
            this.confirmDepartmentVisible = false
            this.removeDepartmentVisibles = false
        },
        handleConfirmDepartment () {
            this.removeDepartmentVisible = false
            this.confirmDepartmentVisible = false
            this.removeDepartmentVisibles = false
        },
        //删除部门
        removeDepartment () {
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/department/delete',
                data: {
                    id:this.editDepartmentForm.id,
                    pid:this.editDepartmentForm.pid,
                    companyId:this.companyObj.companyId,
                },
            }).then(res => {
                console.log(res.data)
                if (res.data.code == 501100003) {
                    this.confirmDepartmentVisible = true
                }else {
                    this.$message({
                        message: '删除部门成功',
                        type: 'success'
                    });
                    // this.getMyCustomer()
                    this.handleData()
                    this.removeDepartmentVisibles = false
                }
            })
        },
        // 标记离职按钮
        handleQuit () {
            this.QuitVisible = true
        },
        // 标记入职按钮
        handleEntry () {
            this.EntryVisible = true
        },
        // 标记入职
        handleEntryVisible () {
            this.editMember.employeeStatus = 1
            this.EntryVisible  = false
        },
        // 删除成员
        removeMember () {
            this.removeMemberVisible = true
        },
        //删除成员
        handleRemoveMember () {
            this.$http({
                method: 'POST',
                url: this.orgManager + '/v1/organization/employee/delete',
                data: {
                    companyId:this.companyObj.companyId,
                    id:this.editMember.id,
                      },
            }).then(res => {
                if (res.data.code == 200  && res.data.sysCode == 200) {
                    this.$message({
                        message: '删除人员成功',
                        type: 'success'
                    });
                    this.getMyCustomer()
                    // this.$store.commit('showEditmember',false)
                    this.showEditmember = false
                    this.removeMemberVisible = false
                }
            })
        },
        // 点击其他地方隐藏弹框
        handleHideSlide(e) {
            if (this.dialogVisible === true || this.personDialogVisible === true || this.departmentVisible === true) {
            }else{
                if (!this.$refs.slide_dialog.contains(e.target) && !this.$refs.TreeTransferDialog.contains(e.target) && !this.$refs.persondialog.contains(e.target) && !this.$refs.department.contains(e.target) && !this.$refs.QuitVisible.contains(e.target) && !this.$refs.EntryVisible.contains(e.target)) {
                    this.showAddmember = false
                    this.showEditmember = false
                    this.showAddDepartment = false
                    this.showEditDepartment = false
                    this.$store.commit('showEditmember',false)
                    this.index++
                    if (this.$route.params.id) {
                        if (this.index == 2) {
                            this.$store.commit('showEditmember',true)
                        }else {
                            this.$store.commit('showEditmember',false)
                        }
                    }
                    this.$refs.ruleForm.resetFields();
                    this.$refs.departmentForm.resetFields();
                }
            }
        },
        handleUploadSuccess(response) {
            console.log(response)
            // fileList
        },
    },
    mounted() {
        document.addEventListener('click', this.handleHideSlide)
        bus.$on('pushRefresh',msg => {
            this.refreshStatus = msg
        })
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleHideSlide)
    },
}
</script>

<style lang="scss">
.frameWork_team {
    position: relative;
    // padding: 0 0  0 20px;
    height: 100%;
    box-sizing: border-box;
    .search-text {
        color: #4278BE;
    }
}
.frameWork_team .el-tabs__header {
    margin: 0;
}
.frameWork_team .el-tabs__item {
    color: #4278BE;
    font-size:18px;
}
.frameWork_team .el-tabs__active-bar {
    height:5px;
    background:rgba(66,120,190,1);
}
.frameWork_team .el-tabs__content{
    height: 100%;
    width: 100%;
    padding: 20px 0 0 20px;
    box-sizing: border-box;
    background-color: rgba(255,255,255,1);
}
.frameWork_team .el-tab-pane {
    height: 100%;
}
.frameWork_team .team_ruleForm {
    margin-top: 20px;
}
// .frameWork_team  .el-input__inner {
//     height: 35px;
// }
.frameWork_team .frameWork_left  .el-input__prefix {
    top: -1px;
}
// .frameWork_team  .el-icon-search {
//     font-size: 12px;
// }
.frameWork_team .el-tabs {
    height: 100%;
}
.frameWork_team .tabColor {
    color: #4278BE;
}
.frameWork_team .frameWork_left {
    position: absolute;
    top:20px;
    left:20px;
    width: 323px;
    height: 100%;
    // border: 1px solid red;
    padding: 12px 15px 0 15px;
    background: #F8F8F8;
}
.frameWork_team  .dialog_hover {
    width: 200px;
    padding:10px 15px;
    font-size: 14px;
    box-sizing: border-box
}
.frameWork_team .dialog_hover:hover {
    background: #D8D8D8
}
.frameWork_team .frameWork_left .el-tree-node>.el-tree-node__children {
    overflow:visible;
}
.frameWork_team  .el-dialog__close {
    display: none;
}
.frameWork_team .frameWork_right {
    margin-left: 370px;
}
.frameWork_team .frameWork_right_department {
    height:48px;
    padding:15px 20px;
    box-sizing:border-box
}
.frameWork_team .frameWork_right_department:hover{
    cursor: pointer;
    background: #D8D8D8
}
.frameWork_team .system1 {
    height: 100%;
    margin-top: 18px;
    background: #FFFFFF;
}
.frameWork_team .system2 {
    overflow:auto;
    height:83%
}
.frameWork_team .system2::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}
.frameWork_team .system2::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #4278BE;
}
.frameWork_team .system2::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #F8F8F8;
}
.frameWork_team .system1 h5{
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    border-bottom: 1px solid #EDEFF2;
    padding: 0 0 0 17px;
}
.frameWork_team .el-table thead  {
    font-size:16px;
    color: #303133;
    font-weight: 600;
}
.frameWork_team .el-table {
    
}
.frameWork_team  .el-table td, .el-table th{
    padding: 2px 0;
}
.frameWork_team .el-table .warning-row {
    background: #F6F6FA;
}
.frameWork_team  .el-table .success-row {
    background: #fff;
}
.frameWork_team .el-table--border td, .el-table--border th{
    border-right: none;
}
.frameWork_team .el-table td, .el-table th.is-leaf {
    border-bottom: none;
}
.frameWork_team .el-pagination {
    float: right;
    margin-top: 18px;
}
.frameWork_team .slide_dialog {
    position:fixed;
    width:600px;
    height:100%;
    background:#FFFFFF;
    box-shadow:0px 2px 22px 0px rgba(58, 65, 74, 0.2);
    right:0;
    top:0;
    z-index: 9
}
.frameWork_team .slide_dialog h4 {
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
.frameWork_team .addMembers .el-input__inner {
    height: 30px;
    border: 1px solid #BFC2CC;
}
.frameWork_team .addMembers .el-textarea__inner {
    margin-top: 8px;
    border: 1px solid #BFC2CC;
    height: 108px;
}
.frameWork_team .addMembers .el-form-item {
    margin-bottom: 15px;
}
.frameWork_team .slide_footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: 8px 20px;
    box-sizing: border-box;
    border-top:1px solid #EDEFF2;
}
.frameWork_team .upload-demo {
    display: inline-block;
}
.frameWork_team .el-input__inner {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.frameWork_team .el-upload-list {
    display: none
}
// .el-date-editor.el-input, .el-date-editor.el-input__inner {
//     width: 100%;
// }
// .frameWork_team  .el-date-editor.el-input, .el-date-editor.el-input__inner {
//     width: 330px;
// }
</style>
