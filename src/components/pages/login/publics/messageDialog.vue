<template>
    <div class="messageDialog">
        <el-dialog :visible.sync="dialogVisible" width="30%" style="margin-top: 20vh">
            <span>{{Verificationmessage}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false" style="width:139px;height:40px;background:rgba(66,120,190,1);border-radius:3px;color:#fff">知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            dialogVisible: false,
        }
    },
    props:{
        Verificationmessage:{
            type:String,
            default:''
        },
        noticeDialog:{
            type:Boolean,
            default:false
        }
    },
    watch: {
        noticeDialog(newValue) {
            this.dialogVisible = newValue;
        },
    },
    created () {
        this.dialogVisible = this.noticeDialog
    },
    methods: {
    }
}
</script>
<style lang="scss">
.messageDialog .el-dialog {
    width:450px !important;
    height:180px !important;
    background:rgba(248,248,248,1);
    border-radius:3px !important;
}
.messageDialog .el-dialog__close {
    display: none;
}
</style>