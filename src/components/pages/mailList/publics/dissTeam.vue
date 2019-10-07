<template>
    <div class="my_team">
        <!-- <div style="overflow:hidden">
            <img src="../images/dissolution.png" alt="" width="40px" style="float:left">
            <P style="float:left;margin-left:20px;font-size:24px;color:#000000">解散团队</P>
        </div> -->
        <div class="myteam_content" v-show="hideTeam">
            <div style="width: 992px;text-align:center;height: 350px;margin: 0 auto;position: relative;padding-top:200px;">
                <img src="../images/dangerous.png" alt="" width="118px" height="118px" style="margin:0 auto">
                <p style="font-size:16px;color:#303133;margin-top:60px">解散后，你的后台管理帐号和通讯录将会删除；</p>
                <p style="font-size:16px;color:#303133;margin-top:20px"> 该操作不可撤销，请谨慎操作。同时删除的包括钉盘文件，应用数据（公告，考勤，审批等），请做好相应的备份。</p>
                <el-button style="width:150px;height:50px;background:#4278BE;border-radius:3px;color:#fff;margin-top:50px;" @click="dialogVisible = true">解散团队</el-button>
            </div>
        </div>
        <div class="myteam_content" v-show="showTeam">
            <div style="width: 992px;text-align:center;height: 350px;margin: 0 auto;position: relative;padding-top:200px;">
                <img src="../images/dangerous.png" alt="" width="118px" height="118px" style="margin:0 auto">
                <p style="font-size:16px;color:#303133;margin-top:60px">解散后，你的后台管理帐号和通讯录将会删除；</p>
                <p style="font-size:16px;color:#303133;margin-top:20px"> 该操作不可撤销，请谨慎操作。同时删除的包括钉盘文件，应用数据（公告，考勤，审批等），请做好相应的备份。</p>
                <p style="color:#FF6565;margin-top:20px">倒计时12小时2分钟43秒</p>
                <el-button style="width:150px;height:50px;background:#4278BE;border-radius:3px;color:#fff;margin-top:20px;margin-right:175px" @click="revokeTeam">撤销解散团队</el-button>
                <el-button style="width:150px;height:50px;border-radius:3px;color:#4278BE;margin-top:20px;border:1px solid #4278BE;">强制解散团队</el-button>
            </div>
        </div>
        <el-dialog
            title="选择原因"
            :visible.sync="dialogVisible"
            width="30%"
            center
            >
            <div slot="title" class="header-title clear" style="border-bottom:1px solid #BFC2CC;height:42px;">
                <div style="width:16px;height:23px;background:#4278BE;float:left;margin-top:4px;margin-left:30px"></div>
                <div style="width:98px;height:31px;font-size:24px;font-family:MicrosoftYaHei;color:rgba(48,49,51,1);line-height:31px;float:left;margin-left:10px">选择原因</div>
            </div>
            <div style="margin: 0 35px">
                <p>请选择解散原因（必填）</p>
                <el-radio-group v-model="radio">
                    <el-radio :label="1" >广告信息过多</el-radio><br>
                    <el-radio :label="2">使用其他软件</el-radio><br>
                    <el-radio :label="3">公司业务变更</el-radio><br>
                    <el-radio :label="4">有重复团队</el-radio><br>
                    <el-radio :label="5">其他</el-radio><br>
                </el-radio-group>
            </div>
            <div style="margin: 20px 35px 0 35px">
                <p style="margin-bottom:20px">补充（选填）</p>
                <el-input type="textarea" v-model="desc" placeholder="请填写补充说明…" maxlength="200" show-word-limit></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" style="border:1px solid #4278BE;color:#4278BE">取 消</el-button>
                <el-button @click="disbandTeam" style="background:rgba(66,120,190,1);color:#fff">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'dissTeam',
    data () {
        return {
            dialogVisible: false,
            radio: '',
            desc: '',
            hideTeam: true,
            showTeam:false,
        }
    },
    methods: {
        disbandTeam () {
            this.hideTeam = false
            this.showTeam = true
            this.dialogVisible = false
        },
        revokeTeam () {
            this.hideTeam = true
            this.showTeam = false
        }
    }
}
</script>

<style lang="scss">
.my_team {
    height: 100%;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.myteam_content {
    height: 100%;
    width: 100%;
    margin-top: 25px;
    background: #fff;
}
.my_team .el-dialog__header {
    padding: 20px 0 10px;
}
.my_team .el-radio__input.is-checked .el-radio__inner {
    border-color: #DCDFE6;
    background: #4278BE;
}
.my_team .el-radio__input.is-checked+.el-radio__label {
    color: #303133;
}
.my_team .el-radio {
    color: #606266;
    cursor: pointer;
    margin-right: 0;
    margin-top: 20px;
}
.my_team .el-dialog {
    width: 500px !important;
}
.my_team .el-textarea__inner {
    width:380px;
    height:189px;
}
.my_team .el-dialog--center .el-dialog__body {
    text-align: initial;
    padding: 25px 20px  8px;
}
</style>
