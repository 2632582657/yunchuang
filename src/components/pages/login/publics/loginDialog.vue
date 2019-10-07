<template>
    <div class="messageDialog">
        <el-dialog :visible.sync="dialogVisible" width="30%" style="margin-top: 20vh">
            <template v-if="flag">
                <span style="color:#4278BE">{{message}}</span>账号未注册，请先注册
            </template>
            <template v-else>
                <span style="color:#4278BE">{{message}}</span>账号已注册，请直接登录
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSubmit" style="width:139px;height:40px;background:rgba(66,120,190,1);border-radius:3px;color:#fff">{{flag ? '立即注册' : '直接登录'}}</el-button>
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
        message:{
            type:String,
            default:''
        },
        messageDialog:{
            type: Boolean,
            default: false,
        },
        flag:{
            type: Boolean,
            default: false,
        },
    },
    watch: {
        messageDialog(newValue) {
            this.dialogVisible = newValue;
        },
    },
    created () {
        this.dialogVisible = this.messageDialog
    },
    methods: {
        handleSubmit() {
            if (this.flag) {
                this.$router.replace({name:'register',path:'/register'})
            }else {
                this.$router.push({
				name:"login",
				path:"/login",
				query:{ 
                        id:true
                    },
                })
            }
        }
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