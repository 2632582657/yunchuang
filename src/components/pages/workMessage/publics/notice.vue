<template>
    <div class="notice">
        <div class="notice_title">
            <el-select v-model="value">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
        </el-select>    
        </div>
        <div class="notice_content">
            <div class="approval_title1">
                <p>5月6日 8:55</p>
            </div>
            <div class="sp_title">
                <img src="../../../../assets/logo.png" alt="" style="float:left;width:30px;">
                <div class="sp_content">
                    <p>审批</p>
                    <div class="Application_content">
                        <div class="application_one">
                            <span style="color:#edc148;float:left">对外职位申请</span>
                            <span style="float:right;color:green">已同意</span>
                        </div>
                        <div class="application_two">你的对外职位啦啦啦啦啦啦啦啦申请已同意，请知晓</div>
                        <div class="application_three">
                            <span style="color:#ccc">对外职位:</span>
                            <span>技术总监</span>
                        </div>
                        <div class="application_four">
                            <span style="color:#ccc">备注：</span>
                            <span>差啦啦啦拉拉啊差啦啦啦拉拉啊差啦啦啦拉拉啊差啦啦啦拉拉啊差啦啦</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="notice_content">
            <div class="approval_title1">
                <p>5月5日 9:55</p>
            </div>
            <div class="sp_title">
                <img src="../../../../assets/logo.png" alt="" style="float:left;width:30px;">
                <div class="sp_content">
                    <p>审批</p>
                    <div class="Application_content">
                        <div class="application_one">
                            <span style="color:#edc148;float:left">出差申请</span>
                            <span style="float:right;color:green">待审批</span>
                        </div>
                        <div class="application_two">车厘子提交的出差需要您审批</div>
                        <div class="application_three">
                            <span style="color:#ccc">出差地点:</span>
                            <span>杭州</span>
                        </div>
                        <div class="application_three">
                            <span style="color:#ccc">出差时间:</span>
                            <span>2019-05-09</span>
                        </div>
                        <div class="application_four">
                            <span style="color:#ccc">结束时间：</span>
                            <span>2019-05-13</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="notice_content">
            <div class="approval_title1">
                <p>5月7日 20:00</p>
            </div>
            <div class="sp_title">
                <img src="../../../../assets/logo.png" alt="" style="float:left;width:30px;">
                <div class="sp_content">
                    <p>工作汇报</p>
                    <div class="Application_content">
                        <p style="color:blue">日报</p>
                        <div class="application_one">
                            <span style="float:left">锅包肉的日报</span>
                            <span style="float:right;color:green"><i class="el-icon-paperclip"></i>2个附件</span>
                        </div>
                        <div class="application_two">
                            <span style="color:#ccc">今日完成工作:</span>
                            <span>旅费不拉不拉不拉不阿里不按旅费不拉不拉不拉不阿里不按旅费不拉不拉不拉不阿里不按旅费不拉不拉不拉不阿里不按旅费不拉不拉不拉不阿里不按旅费……</span>
                        </div>
                        <div class="application_three">
                            <span style="color:#ccc">明日工作计划:</span>
                            <span>旅费不拉不拉不拉不阿里不按旅费不拉不拉不拉不阿里不按旅费不拉不拉不拉不阿里不按旅费不拉不拉不拉不阿里不按旅费不拉不拉不拉不阿里不按旅费……</span>
                        </div>
                        <div class="application_four">
                            <span style="color:#ccc">备注:</span>
                            <span>杭lalaaaa</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="notice_content">
            <div class="approval_title1">
                <p>5月6日 8:55</p>
            </div>
            <div class="sp_title">
                <img src="../../../../assets/logo.png" alt="" style="float:left;width:30px;">
                <div class="sp_content">
                    <p>考勤打卡提醒</p>
                    <div class="Application_content">
                        <p style="color:blue">上班考勤打卡提醒</p>
                        <div class="application_one">
                            <p>还有5分钟就要上班了，别忘记打卡哦~</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="notice_content">
            <div class="sp_title">
                <img src="../../../../assets/logo.png" alt="" style="float:left;width:30px;">
                <div class="sp_content">
                    <p>工作汇报提醒</p>
                    <div class="Application_content">
                        <p style="color:blue">日报提醒</p>
                        <div class="application_one">
                            <p>今天的日报还没有提交，别忘记写哦~</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="notice_content">
            <div class="approval_title1">
                <p>5月7日 14:20</p>
            </div>
            <div class="sp_title">
                <img src="../../../../assets/logo.png" alt="" style="float:left;width:30px;">
                <div class="sp_content">
                    <p>收到的会议邀请提醒</p>
                    <div class="Application_content">
                        <p style="color:blue">上班考勤打卡提醒</p>
                        <div class="application_one">
                            <p>车厘子邀请您5月8日 16：30进行主题为“内部培训”的会议，还有10分钟，请做好参会准备哦~</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="notice_content">
            <div class="approval_title1">
                <p>5月7日 14:20</p>
            </div>
            <div class="sp_title">
                <img src="../../../../assets/logo.png" alt="" style="float:left;width:30px;">
                <div class="sp_content">
                    <p>回款提醒</p>
                    <div class="Application_content">
                        <div class="application_one">
                            <span style="color:#edc148;float:left">别人的回款跟进提醒</span>
                        </div>
                        <div class="application_two">青岛大狮网络科技有限公司的回款需要跟进</div>
                        <div class="application_three">
                            <span style="color:#ccc">计划回款金额(元):</span>
                            <span>168,888,999</span>
                        </div>
                        <div class="application_four">
                            <span style="color:#ccc">回款期次:</span>
                            <span>第二期</span>
                        </div>
                        <div>
                            <span style="color:#ccc">计划回款时间:</span>
                            <span>2019年5月19日</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="notice_content">
            <div class="sp_title">
                <img src="../../../../assets/logo.png" alt="" style="float:left;width:30px;">
                <div class="sp_content">
                    <p>评论</p>
                    <div class="Application_content">
                        <div class="application_one">
                            <span style="color:#edc148;float:left">收到评论</span>
                        </div>
                        <div class="application_three">
                            <span style="color:#ccc">张小兰的评论:</span>
                            <span>啦啦啦啦啦啦啦啦啦啦阿拉啦啦啦啦啦啦啦</span>
                        </div>
                        <div class="application_four">
                            <span style="color:#ccc">对您4月8日的日报进行了评论</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            options: [{
                value: '选项1',
                label: '全部通知'
                },{
                value: '选项2',
                label: '全部通知'
                }],
                value: '全部通知'
        }
    }
}
</script>

<style lang="scss">
.notice {
    margin: 10px 20px;
    padding: 20px 40px 40px;
    background-color: #fff;
    box-sizing: border-box;
}
.notice .el-input__inner {
border: none;
padding: 0;
color: black;
font-size: 14px;
height: 100%;
line-height: 0;
// font-weight: 700px;
// height:20px;
}
.notice .el-select {
    width: 92px
}
.notice .el-select-dropdown  {
    width: 92px;
}
.notice .el-input__icon {
    line-height: 20px;
}
.notice_title {
    padding-bottom: 20px;
    border-bottom: 1px solid #cccccc
}
.notice_content {
    width: 700px;
}
.approval_title1 {
    margin-top: 20px;
}
.approval_title1 p {
    width: 110px;
    margin: 0 auto;
    text-align: center;
    padding: 5px;
    box-sizing: border-box;
    color: #fff;
    border-radius: 3px;
    background: rgba($color: #000000, $alpha: 0.5)
}
.sp_title {
    margin-top: 15px;
    overflow: hidden;
}
.sp_content {
    float: left;
    margin-left: 15px;
}
.Application_content {
    width: 655px;
    padding: 10px 20px 15px 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.Application_content div {
    margin-top: 10px;
}
.application_one {
    overflow: hidden;
}
.application_two {
    width:400px;
}
.application_three {
    width:400px;
}
.application_four {
    width:400px;
}
.sp_content p:first-child {
    margin-bottom: 5px;
}
</style>
