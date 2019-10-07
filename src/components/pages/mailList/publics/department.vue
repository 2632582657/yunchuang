<template>
    <div class="departmentVisible">
        <el-dialog
            :visible.sync="departmentVisible"
            :before-close="modalClose"
            @opened="handleDialogOpen"
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
                    style="width:98px;height:31px;font-size:20px;font-family:MicrosoftYaHei;color:rgba(48,49,51,1);line-height:31px;float:left;margin-left:10px"
                >选择部门</div>
            </div>
            <el-tree
                :data="treeData"
                node-key="id"
                ref="tree"
                default-expand-all
                @check="setSelectedNode"
                :check-strictly="true"
                show-checkbox
            >
                <div class="custom-tree-node" slot-scope="{ node, data }" style="width:100%;">
                    <span
                        style="display:block;max-width:185px;float:left;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                    >{{ data.departmentName }}</span>
                </div>
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button
                    @click="handleClose"
                    style="width:96px;height:38px;color:#4278BE;border:1px solid #4278BE"
                >取 消</el-button>
                <el-button
                    type="primary"
                    style="width:96px;height:38px;background:#4278BE;color:#fff"
                    @click="handleSubmit"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: {},
            departmentVisible: false,
            adminData:[]
        }
    },
    created() {
        this.departmentVisible = this.dialogVisible
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
            required: true
        },
        treeData: {
            type: Array,
            default: () => []
        },
        editMember: {
            type:Object,
            default: () => {}
        },
        showdepartment: {
            type:Object,
            default:() => {}
        },
        select: {
            type:Boolean,
            default: false,
        },
        admin: {
            type:Array,
            default:() => []
        }
    },
    watch: {
        dialogVisible(newValue) {
            this.departmentVisible = newValue
        },
        editMember (newValue) {
            this.value = {
                id:newValue.departmentId,
                departmentName:newValue.department
            }
        },
        admin (newValue) {
            this.adminData = newValue
        },
        showdepartment (newValue) {
            this.value = {
                id:newValue.pid,
                departmentName:newValue.superDepartmentName
            }
        }
    },
    methods: {
        setSelectedNode(data, obj) {
            if (!this.select) {
                this.value = data
                this.$refs.tree.setCheckedNodes([data])
            }else {
                this.adminData =  this.$refs.tree.getCheckedNodes()
            }
        },
        handleSubmit() {
            if (!this.select) {
                this.$emit('submit', this.value)
                this.modalClose()
            }else {
                this.$emit('submit', this.adminData)
                this.modalClose()
            }
        },
        handleClose () {
            if (!this.select) {
                this.$emit('submit', this.value)
            }else {
                this.$emit('submit', this.adminData)
            }
            this.departmentVisible = false
            this.$refs.tree.setCheckedNodes([])
        },
        modalClose() {
            this.$emit('close');
            this.departmentVisible = false;
        },
        handleDialogOpen() {
            if (!this.select) {
                this.$refs.tree.setCheckedNodes([this.value])
            }else {
                this.$refs.tree.setCheckedNodes(this.adminData)
            }
        },
    }
}
</script>

<style lang="scss">
.departmentVisible {
    .el-dialog {
        width: 383px !important;
        height: 454px !important;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: rgb(66, 120, 190);
        border-color: rgb(66, 120, 190)
    }
    .el-dialog__header {
        padding: 20px 0 10px;
    }
    .el-dialog__body {
        height:300px ;
        overflow: auto;
        box-sizing: border-box;
        padding: 17px 37px 30px 37px;
    }
    .el-dialog__headerbtn .el-dialog__close {
        display: none
    }
    .dialog-footer {
        float: right;
        margin-right: 20px;
    }
    .el-dialog__body::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 10px;
    }
    .el-dialog__body::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #4278be;
    }
    .el-dialog__body::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #ffffff;
    }
}
</style>
