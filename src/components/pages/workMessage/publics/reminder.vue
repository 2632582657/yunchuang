<template>
    <div class="reminder">
        <ul>
            <li class="reminder_list">
                <div class="list_left">
                    <div style="overflow: hidden;">
                        <img src="../../../../assets/logo.png" alt="" style="float:left;margin-right:10px" width="16px">
                        <p style="float:left">审批：<span>各种申请审批，例如xxx提交的出差申请</span></p>
                    </div>
                    <div class="list_content">
                        <p>出差地点:<span>杭州</span></p>
                        <p>出差时间:<span>2019年5月13日</span></p>
                        <p>结束时间:<span>2019年5月19日</span></p>
                    </div>
                </div>
                <div class="list_right">
                    <p style="float:right">刚刚</p>
                    <div>
                        <p style="float:left;margin-top:10px;margin-left:50px">查看详情</p>
                        <el-button type="primary" plain style="float:right;margin-left:10px">同意</el-button>
                        <el-button plain style="float:right;">拒绝</el-button>
                    </div>
                </div>
            </li>
        </ul>
        <ul class="punch">
            <li class="punch_list">
                <div class="punch_top">
                    <img src="../../../../assets/logo.png" alt="" width="20px" style="float:left">
                    <span style="float:left">费审批类提醒，例如打卡提醒</span>
                    <span style="float:right">13分钟前</span>
                </div>
                <div class="punch_bottom">
                    <span style="float:left">还有5分钟就要上班了，别忘记打卡哦~</span>
                    <span style="float:right;color:#3399FF">去打卡</span>
                </div>
            </li>
        </ul>
        <ul class="punch">
            <li class="punch_list">
                <div class="punch_top">
                    <img src="../../../../assets/logo.png" alt="" width="20px" style="float:left">
                    <span style="float:left">例如工作汇报提醒</span>
                    <span style="float:right">1小时前</span>
                </div>
                <div class="punch_bottom">
                    <span style="float:left">今天的日报还没有提交，别忘记写哦</span>
                    <span style="float:right;color:#3399FF">去打卡</span>
                </div>
            </li>
        </ul>
        <ul class="punch">
            <li class="punch_list">
                <div class="punch_top">
                    <img src="../../../../assets/logo.png" alt="" width="20px" style="float:left">
                    <span style="float:left">费审批类提醒，例如打卡提醒</span>
                    <span style="float:right">13分钟前</span>
                </div>  
                <div class="punch_bottom">
                    <span style="float:left;width:70%">车厘子邀请您5月8日 16：30进行主题为“内部培训”的会议，还有10分钟，请做好参会准备哦~</span>
                    <span style="float:right;color:#3399FF">详情</span>
                </div>
            </li>
        </ul>
        <ul class="punch">
            <li class="punch_list">
                <div class="punch_top">
                    <img src="../../../../assets/logo.png" alt="" width="20px" style="float:left">
                    <span style="float:left">费审批类提醒，例如打卡提醒</span>
                    <span style="float:right">13分钟前</span>
                </div>
                <div class="punch_bottom">
                    <span style="float:left">还有5分钟就要上班了，别忘记打卡哦~</span>
                    <span style="float:right;color:#3399FF">详情</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {

}
</script>

<style>
.reminder {
    margin: 10px 20px;
    padding: 40px;
    background-color: #fff;
    box-sizing: border-box;
}
.reminder_list {
    width: 700px;
    border: 1px solid #ccc;
    padding: 10px 20px;
    overflow: hidden;
}
.list_left {
    width: 60%;
    float: left;
}
.list_right {
    width: 40%;
    float: right;
}
.list_content p {
    margin-top: 10px
}
.list_right div{
    overflow: hidden;
    margin-top: 67px;
}
.list_right .el-button {
    padding: 9px 16px
}
.punch {
    margin-top: 15px;
}
.punch_list{
    width: 700px;
    border: 1px solid #ccc;
    padding: 10px 20px;
}
.punch_top {
    overflow: hidden;
}
.punch_bottom {
    margin-top: 15px;
    overflow: hidden;
}
</style>
