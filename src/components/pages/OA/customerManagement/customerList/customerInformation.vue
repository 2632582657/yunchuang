<template>
    <div class="hello">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3 style="font-weight:700">客户信息</h3>
            </div>
            <el-form
            :model="dynamicValidateForm"
            ref="dynamicValidateForm"
            label-width="100px"
            class="demo-dynamic">
            <el-row>
                <el-col :span="12">
                    <el-form-item
                    prop="customerName"
                    label="客户名称">
                    <el-input v-model="dynamicValidateForm.customerName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                    prop="industryName"
                    label="行业">
                    <el-select v-model="dynamicValidateForm.industryName" placeholder="请选择">
                        <!-- <el-option
                        v-for="item in dynamicValidateForm.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option> -->
                    </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                    prop="customerManagerName"
                    label="客户经理">
                    <!-- <el-select v-model="dynamicValidateForm.managerList[0].customerManagerName" multiple placeholder="请选择">
                        <el-option
                        v-for="item in dynamicValidateForm.managerList"
                        :key="item.id"
                        :label="item.customerManagerName"
                        :value="item.customerManagerName">
                        </el-option>
                    </el-select> -->
                        <template v-for="item in dynamicValidateForm.managerList">
                            <template v-if="item.customerManagerName">
                                <el-button :key="item.id">{{ item.customerManagerName }}</el-button>
                            </template>
                            <template v-else>
                            </template>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <!-- <el-form-item
                    prop="qq"
                    label="QQ">
                    <el-input v-model="dynamicValidateForm.qq"></el-input>
                    </el-form-item> -->
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                    prop="scaleName"
                    label="规模">
                    <el-select v-model="dynamicValidateForm.scaleName" placeholder="请选择">
                        <!-- <el-option
                        v-for="item in dynamicValidateForm.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option> -->
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                    prop="sourceName"
                    label="来源">
                    <el-input v-model="dynamicValidateForm.sourceName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                    prop="telephone"
                    label="电话">
                    <el-input v-model="dynamicValidateForm.telephone"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                    prop="email"
                    label="邮箱">
                    <el-input v-model="dynamicValidateForm.email"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                    prop="fax"
                    label="传真">
                    <el-input v-model="dynamicValidateForm.fax"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                    prop="postal"
                    label="邮编">
                    <el-input v-model="dynamicValidateForm.postal"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                    prop="officialWeb"
                    label="官网">
                    <el-input v-model="dynamicValidateForm.officialWeb"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                    prop="customerTypeName"
                    label="类型">
                    <el-input v-model="dynamicValidateForm.customerTypeName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                    prop="statesName"
                    label="状态">
                    <el-input v-model="dynamicValidateForm.statesName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                    prop="regionName"
                    label="地区">
                    <el-input v-model="dynamicValidateForm.regionName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="16">
                        <div class="grid-content bg-purple">
                            <el-form-item
                            prop="address"
                            label="地址">
                            <el-input v-model="dynamicValidateForm.address"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="16">
                        <div class="grid-content bg-purple">
                            <el-form-item prop="remarks" label="备注">
                                <el-input type="textarea" v-model="dynamicValidateForm.remarks"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="16">
                        <div class="grid-content bg-purple">
                            <el-form-item label="附件上传">
                                <div v-for="item in dynamicValidateForm.fileList" :key="item.id">
                                    <a :href="'http://www.baidu.com'" target="_blank">{{ item.originalFileName}}</a><br>
                                </div>
                            </el-form-item>
                        </div>
                    </el-col>
                <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark">
                        <span class="contact_information">联系人信息</span><a @click="addDomain">(添加联系人信息)</a>
                    </div>
                </el-col>
            </el-row>
            <div>
                <el-row
                :gutter="20"
                v-for="(domain, index) in dynamicValidateForm.contacterList"
                :key="domain.key">
                <div class="contact_information_list">
                    <el-col :span="6">
                        <div>
                            <el-form-item label="联系人姓名" :prop="'contacterList.' + index + '.contactCustomerName'">
                                <el-input v-model="domain.contactCustomerName"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div>
                            <el-form-item
                                label="电话"
                                :key="domain.key"
                                :prop="'contacterList.' + index + '.contactPhone'"
                            >
                                <el-input v-model="domain.contactPhone"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div>
                            <el-form-item
                                label="角色关系"
                                :key="domain.key"
                                :prop="'contacterList.' + index + '.contactRoleName'">
                                <el-select v-model="domain.contactRoleName" placeholder="请选择">
                                    <!-- <el-option
                                    v-for="item in domain.relations"
                                    :key="item.contactRoleCode"
                                    :label="item.contactRoleName"
                                    :value="item.contactRoleCode">
                                    </el-option> -->
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <!-- <div>
                            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
                        </div> -->
                    </el-col>
                    <el-col :span="16">
                        <div class="grid-content bg-purple">
                            <el-form-item label="备注" :key='domain.key' :porp="'contacterList.' + index + '.contactRemark'">
                                <el-input type="textarea" v-model="domain.contactRemark"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </div>
            </el-row>
            </div>
        </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'customerInformation',
    data() {
        return {
            dynamicValidateForm: {
                contacterList: [],
            }
        }
    },
    created () {
        this.getCustomerInformation()
    },
    methods: {
        submitForm(formName) {
            console.log(JSON.stringify(this.dynamicValidateForm))
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        removeDomain(item) {
            console.log(this.dynamicValidateForm.contacterList.indexOf(item))
            var index = this.dynamicValidateForm.contacterList.indexOf(item)
            if (index !== -1) {
                this.dynamicValidateForm.contacterList.splice(index, 1)
            }
        },
        getCustomerInformation () {
            this.$http({
                method: 'GET',
                url: 'https://result.eolinker.com/7hUBFSf3c24e3ab4d7c9a88a6d8c4566a61bf0d55f38d5a?uri=/v1/crm/componet/customer/info',
                data: {
                    customerId: this.$route.query.customerId
                }
            }).then(res => {
                console.log(res)
                if (res.status === 200) {
                    res.data.data.contacterList.forEach(item => {
                        this.dynamicValidateForm.contacterList.push(item)
                    })
                    this.dynamicValidateForm = res.data.data
                }
            })
        },
        addDomain() {
            this.dynamicValidateForm.contacterList.push({
                contactCustomerName: '',
                contactPhone: '',
                contactRoleName: '',
                contactRoleList: val,
                key: Date.now()
            })
        }
    }
}
</script>

<style scoped>
.contact_information {
    font-size: 20px;
    font-weight: 700;
}
.contact_information_list {
    padding-top: 20px;
    margin-top: 20px;
    border-top: 1px solid #ccc;

}
</style>
