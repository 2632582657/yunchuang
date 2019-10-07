<template>
    <div class="mongolia">
        <el-dialog title="拒绝理由" :visible.sync="centerDialogVisible" width="40%" center>
            <div class="mongolia_content">
                <el-form :model="ruleForm" ref="ruleForm">
                    <!-- <el-form-item> -->
                        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                    <!-- </el-form-item> -->
                    <!-- <el-form-item label="图片:">
                        <el-upload
                            action="https://jsonplaceholder.typicode.com/posts/"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload> -->
                    <!-- </el-form-item> -->
                </el-form>
                <!-- <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt>
                </el-dialog> -->
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="approval">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'batchArray',
    data() {
        return {
            centerDialogVisible: false,
            // dialogImageUrl: '',
            // dialogVisible: false,
            ruleForm: {
                desc:""
            },
        }
    },
    props: {
        batchArray:Array,
    },
    methods: {
        approval () {
            this.centerDialogVisible = false
            this.$http({
                method: "PUT",
                url: "/oaManage/v1/oa/approval/approve",
                data: {
                    batch:this.batchArray,
                    status: 2,  //  1-审批通过；2审批拒绝
                    refuse:this.ruleForm.desc
                }
            }).then(res => {
                    this.$message.success("审批完成，马上进入下一篇");
            }).catch(error=>{
                this.$message.error(error.message);
            });
        }
        
    }
}
</script>

<style lang="scss">
.mongolia .el-dialog__body {
    padding: 25px 0px 30px
}
.mongolia .el-textarea__inner {
    width: 785px;
    height: 170px;
}
.mongolia  .el-dialog__header {
    padding: 10px 20px 0px;
}
.mongolia_content {
    padding: 0 31px;
}
.mongolia_content .el-form-item {
    margin-top: 20px;
}
.mongolia_content .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
}
.mongolia_content .el-upload-list__item {
    width: 100px;
    height: 100px;
}
</style>
