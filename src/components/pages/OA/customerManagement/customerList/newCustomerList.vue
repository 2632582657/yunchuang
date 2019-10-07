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
            :rules="rules"
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
                    <el-select v-model="dynamicValidateForm.industryName" @change="selectIndustryName" placeholder="请选择">
                        <el-option
                        v-for="item in industryList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
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
                    <el-select v-model="dynamicValidateForm.scaleName" @change="selectScaleName" placeholder="请选择">
                        <el-option
                        v-for="item in scaleList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                    prop="sourceName"
                    label="来源">
                    <el-select v-model="dynamicValidateForm.sourceName" @change="selectSourceName" placeholder="请选择">
                        <el-option
                        v-for="item in sourceList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
                    </el-select>
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
                <!-- customerTypeList -->
                <el-col :span="12">
                    <el-form-item
                    prop="customerTypeName"
                    label="类型">
                    <el-select v-model="dynamicValidateForm.customerTypeName"  @change="selectCustomerTypeName" placeholder="请选择">
                        <el-option
                        v-for="item in customerTypeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
                    </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item
                    prop="statesName"
                    label="状态">
                    <el-select v-model="dynamicValidateForm.statesName" @change="selectStatesName" placeholder="请选择">
                        <el-option
                        v-for="item in statesList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                    prop="regionName"
                    label="地区">
                    <el-select v-model="dynamicValidateForm.regionName" @change="selectRegionName" placeholder="请选择">
                        <el-option
                        v-for="item in customerTypeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
                    </el-select>
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
                                <div v-for="(item, index) in dynamicValidateForm.fileList" :key="item.id">
                                        <a :href="item.absolutePath" target="_black">{{ item.originalFileName}}</a>
                                        <el-button @click="downloadIamge(item.absolutePath,item.originalFileName)">下载</el-button>
                                        <el-button @click.prevent="removeOriginalName(index)">删除</el-button>
                                        <br>
                                </div>
                                <el-upload
                                    class="upload-demo"
                                    action="https://result.eolinker.com/7hUBFSf3c24e3ab4d7c9a88a6d8c4566a61bf0d55f38d5a?uri=/v1/crm/componet/customer/upload/file"
                                    multiple
                                    :on-success="handleUploadSuccess"
                                    :headers="uploadHeaders"
                                    accept="image/*"
                                    :file-list="fileList">
                                    <a style="width:91%" v-text="suibian"></a>
                                    <el-button size="small" type="primary" class="fileBtn">附件上传</el-button>
                                </el-upload>
                            </el-form-item>
                        </div>
                    </el-col>
                <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="grid-content bg-purple-dark">
                        <span class="contact_information">联系人信息</span><a @click="addDomain(contactRoleList)">(添加联系人信息)</a>
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
                                :prop="'contacterList.' + index + '.contactRole'">
                                <el-select v-model="domain.contactRoleName" @change="selectContactRoleName" placeholder="请选择">
                                    <el-option
                                    v-for="item in contactRoleList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div>
                            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
                        </div>
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
            <el-button type="primary" @click="handleSubmitForm">保存</el-button>
            <!-- <el-button type="primary" @click="resetForm('dynamicValidateForm')">重置</el-button> -->
        </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'newCustomerList',
    data() {
        return {
            suibian: '',
            dynamicValidateForm: {
                address:"",
                contacterList:[
                    {
                        contactCustomerId:  '',
                        contactCustomerName: "",
                        contactName: "",
                        contactPhone: null,
                        contactRemark: null,
                        contactRoleCode: "",
                        contactRoleName: "",
                        createBy: '',
                        createTime: "",
                        id: '',
                        isDelete: false,
                        updateBy: null,
                        updateTime: null,
                    }
                ],
                createBy :'',
                createTime :"",
                customerName :"",
                customerTypeCode :"",
                customerTypeName :"",
                dealFlag :null,
                email :"",
                enclosure :null,
                fax :"",
                fileList :[],
                id :'',
                industryCode :"",
                industryName :"",
                isDelete :false,
                isTransfer :null,
                managerList :[],
                officialWeb :"",
                postal :"",
                regionCode :null,
                regionName :null,
                remarks :"",
                scaleCode :"",
                scaleName :"",
                sourceCode :"",
                sourceName :"",
                statesCode :"",
                statesName :"",
                telephone :"",
                transferId :null,
                transferName :null,
                transferTime :null,
                updateBy :null,
                updateTime :null,
                userId :null
            },
            customerTypeList: [],
            sourceList:  [],
            industryList:  [],
            scaleList:  [],
            statesList:  [],
            contactRoleList:[],
            fileList: [],
            uploadHeaders: { // 配置上传的请求头
                Authorization: ''
            },
            rules: {
                customerName: [
                    { required: true, message: '客户名称不能为空!', trigger: 'blur' },
                ],
                // customerManagerName: [
                //     { required: true, message: '请选择客户经理', trigger: 'change' }
                // ]
            }
        }
    },
    created () {
        this.getCustomerSelect()
    },
    methods: {
        handleSubmitForm() {
            this.$refs.dynamicValidateForm.validate(valid => {
                if (valid) {
                    this.$http({
                    method: 'POST',
                    url: 'https://result.eolinker.com/7hUBFSf3c24e3ab4d7c9a88a6d8c4566a61bf0d55f38d5a?uri=/v1/app/crm/componet/customer/create',
                    data: this.dynamicValidateForm
                    }).then(res => {
                    if (res.status === 200) {
                        this.$message({
                            type:'success',
                            message: '编辑成功'
                        })
                    }
                    })
                } else {
                    return false;
                }
            })
        },
        // resetForm(formName) {
        //     this.$refs[formName].resetFields()
        // },
        removeDomain(item) {
            var index = this.dynamicValidateForm.contacterList.indexOf(item)
            if (index !== -1) {
                this.dynamicValidateForm.contacterList.splice(index, 1)
            }
        },
        // 获取下拉列表
        getCustomerSelect () {
            this.$http({
                method: 'GET',
                url: 'https://result.eolinker.com/7hUBFSf3c24e3ab4d7c9a88a6d8c4566a61bf0d55f38d5a?uri=/v1/crm/componet/customer/select'
            }).then(res => {
                if (res.status === 200) {
                    this.customerTypeList = res.data.data.customerTypeList
                    this.sourceList = res.data.data.sourceList
                    this.industryList = res.data.data.industryList
                    this.scaleList = res.data.data.scaleList
                    this.pageSize = res.data.data.pageSize
                    this.statesList = res.data.data.statesList
                    this.contactRoleList = res.data.data.contactRoleList
                }
            })
        },
        addDomain(val) {
            this.dynamicValidateForm.contacterList.push({
                contactCustomerName: '',
                contactPhone: '',
                contactRoleName: '',
                contactRoleList: val,
                key: Date.now()
            })
        },
        handleUploadSuccess (response) {
            this.suibian = response.data[0].originalFileName,
            this.dynamicValidateForm.fileList.push({
                relativePath: response.data[0].relativePath,
                originalFileName: response.data[0].originalFileName,
                newFileName: response.data[0].newFileName,
                absolutePath: response.data[0].absolutePath
            })
        },
        removeOriginalName (val) {
            this.dynamicValidateForm.fileList.splice(val, 1)
        },
        downloadIamge(imgsrc, name) {
            console.log(imgsrc,name)
            let image = new Image();
            // 解决跨域 Canvas 污染问题
            image.setAttribute("crossOrigin", "anonymous");
            image.onload = function() {
                let canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                let context = canvas.getContext("2d");
                context.drawImage(image, 0, 0, image.width, image.height);
                let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
                let a = document.createElement("a"); // 生成一个a元素
                let event = new MouseEvent("click"); // 创建一个单击事件
                a.download = name || "photo"; // 设置图片名称
                a.href = url; // 将生成的URL设置为a.href属性
                a.dispatchEvent(event); // 触发a的单击事件
            }
            image.src = imgsrc;
        },
        selectIndustryName(id){
            this.dynamicValidateForm.industryCode = JSON.stringify(this.industryList.find((item)=>{
                return item.name === id;
            }).id)
        },
        selectScaleName (id) {
            this.dynamicValidateForm.scaleCode = JSON.stringify(this.scaleList.find((item)=>{
                return item.name === id;
            }).id)
        },
        selectSourceName (id) {
            this.dynamicValidateForm.sourceCode = JSON.stringify(this.sourceList.find((item)=>{
                return item.name === id;
            }).id)
        },
        selectCustomerTypeName (id) {
            this.dynamicValidateForm.customerTypeCode = JSON.stringify(this.customerTypeList.find((item)=>{
                return item.name === id;
            }).id)
        },
        selectStatesName (id) {
            this.dynamicValidateForm.statesCode = JSON.stringify(this.statesList.find((item)=>{
                return item.name === id;
            }).id)
        },
        selectRegionName (id) {
            this.dynamicValidateForm.regionCode = JSON.stringify(this.industryList.find((item)=>{
                return item.name === id;
            }).id)
        },
        selectContactRoleName (id) {
            console.log(id)
            this.dynamicValidateForm.contactRoleCode = JSON.stringify(this.contactRoleList.find((item)=>{
                return item.name === id;
            }).id)
        }
    }
}
</script>

<style>
.contact_information {
    font-size: 20px;
    font-weight: 700;
}
.contact_information_list {
    padding-top: 20px;
    margin-top: 20px;
    border-top: 1px solid #ccc;

}
.upload-demo {

}
.upload-demo .el-upload  {
    display: block;
    text-align: right;
}
.upload-demo .el-upload-list {
    display: none;
}
</style>