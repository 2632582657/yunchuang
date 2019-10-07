<!--@description: 日程管理
	@author: 时庆港 -->
<template>
  <div class="schedule-box">
    <el-row type="flex">
      <el-col :span="24" class="btn-center">
        <el-button type="primary" @click="handleShow">新建日程</el-button>
      </el-col>
    </el-row>
    <div class="schedule-body">
      <div class="cale"  >
        <el-calendar >
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <template 
            slot="dateCell"
            slot-scope="{date, data}" >
            <p :class="data.isSelected ? 'is-selected' : ''" @click="getNowSchedule(date) ">
              {{ data.day.split('-').slice(2).join('-') }} {{ selebool(date)? '✔️' : ''}}
            </p>
          </template>
        </el-calendar>
      </div>
      <div class="schedule-list">
        <h2 class="title">{{nowTime}} 日程列表</h2>
        <ul class="list have">
          <li v-if="nowList.length===0"><span class="fio no-fio"></span> 暂无日程</li>
          <li  @click="toDetail(item.id)" v-for="(item,i) in nowList " :key="i">
            <span class="fio have-fio"></span>
            <p class="title_c">{{item.scheduleTitle}}</p>
            <p class="shike">{{item.beginEndTime}}</p>
          </li>
        </ul>
      </div>
      <div class="detail">
        <ul>
          <li class="all-day" @click="toDetail">
            <span>全天</span>
            <p>产品需求输出很出色的就哈萨克基督教卡上的飞机喀什的十大顶级阿克苏贷记卡圣诞贺卡收到很快就的撒娇快点哈宽松的环境喀什的教案设计的</p>
          </li>
        </ul>
        <ul class="all-day-detaill">
          <li v-for="(item,i) in timeArr" :key="i">
            <span>{{item.time}}</span>
            <i class="border_s"></i>
            <div class="content">
                <a @click="toDetail(ele.id)" href="#" v-for="(child,j) in item.now" :key="j" v-show="nowList" :title="child.scheduleTitle">{{child.scheduleTitle}}</a>
            </div>
            
          </li>
        </ul>
      </div>
    </div>

    <!-- 遮罩 -->
    <div class="right_frame_model clear" v-show="isShow" @click.self="closeFrame">
      <div class="right_frame fr">
        <div style="position: relative;height: 100%;width: 100%; z-index:999">
          <div class="frame_head clear">
            <p class="frame_name fl" >{{Newly?"新建日程":"查看日程"}}</p>
            <p class="frame_close fr" @click="closeFrame">×</p>
          </div>
          <div class="frame_content">
            <!-- 日程 -->

            <el-form v-show="Newly" :model="schedule" :rules="rules" ref="schedule" class="demo-schedule" label-width="80px" size="mini">
                <el-form-item label="新建日程" prop="scheduleTitle"  :rules="rules.name"   label-width="124px" >
                    <el-input v-model="schedule.scheduleTitle" style="width:290px"></el-input>
                </el-form-item>
                <el-form-item label="活动时间" label-width="124px">
                    <el-date-picker style="width:290px"  v-model="schedule.scheduleBeginTime" format="yyyy-MM-dd HH:mm" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="起点"  label-width="124px" >
                    <el-input v-model="schedule.scheduleAddress" style="width:290px" ></el-input>
                </el-form-item>

                <el-form-item label="提醒" label-width="124px">
                    <el-select v-model="schedule.scheduleRemind" placeholder="选择提醒时间" style="width:290px">
                        <el-option label="无提醒" value="0"></el-option>
                        <el-option label="开始前5分钟" value="1"></el-option>
                        <el-option label="开始前10分钟" value="2"></el-option>
                        <el-option label="开始前15分钟" value="3"></el-option>
                        <el-option label="开始前30分钟" value="4"></el-option>
                        <el-option label="开始前1小时" value="5"></el-option>
                        <el-option label="开始前1天" value="6"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="日程描述" prop="desc" label-width="124px">
                    <el-input type="textarea" v-model="schedule.scheduleDescribe" style="width:290px"></el-input>
                </el-form-item>

              <el-form-item class="posr">
                <el-button @click="closeFrame">取消</el-button>
                <el-button type="primary" @click="submit()">完成</el-button>
              </el-form-item>
            </el-form>

            <!-- 详情 -->
            <div class="schedule-detail" v-show="!Newly"> 
                <div>
                  <p class="title">日程标题：</p>
                  <p class="content">{{scheduleDetail.scheduleTitle}}</p>
                </div>
                <div>
                  <p class="title">起止时间：</p>
                  <p class="content"><span>{{nowTime}}  {{scheduleDetail.beginEndTime}}</span></p>
                </div>
                <div>
                  <p class="title">提醒：</p>
                  <p class="content">{{scheduleDetail.strRemind}}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import '../../../../modules/common'
import { watch } from 'fs';
export default {
  data() {
    return {
      isShow:false,
      Newly:false,
      schedule: {  //表单时间
        scheduleTitle: "", //日程标题
        scheduleBeginTime: "", //日程起始时间
        scheduleEndTime:'', //日程结束时间
        scheduleAddress:"", //日程起点
        scheduleRemind:"", //日程提醒
        scheduleDescribe:"", //日程描述
        createBy:""   //日程创建人
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      seleList:[],  //有日程的日期
      user:{}, //用户信息
      nowTime:"",//当前时间
      nowList:[],//当前日程列表
      nowMonth:{},//当前月份日程
      scheduleDetail:'',

       timeArr:this.getTimeArr()//{
      //   arr:[
      //     "00:00","01:00","02:00","03:00","04:00",
      //     "05:00","06:00","07:00","08:00","09:00",
      //     "10:00","11:00","12:00","13:00","14:00",
      //     "15:00","16:00","17:00","18:00","19:00",
      //     "20:00","21:00","22:00","23:00"
      //   ],
      //   now:[]
      // }
    };
  },
  created(){
      this.user=JSON.parse(sessionStorage.getItem("teamEmployeeDetailVO"))
      this.nowTime=new Date()
      console.log(this.nowTime)
      this.nowMonth=new Date(this.nowTime).Format("yyyy-MM")
      this.getNowSchedule(this.nowTime)  //首次进入默认加载
      this.getMonthSchedule()          //首次进入默认加载
      // console.log(this.$refs.datelist.date)
      // this.ceshi()
      
  },
  methods:{
      getTimeArr(){
        var arr=[]
        for(let i=0;i<24;i++){
          arr[i]={time:(i<10?('0'+i):i)+":00",now:[]}
        }
        return arr
      },
      // ceshi(date){
      //   console.log(date)
      //   if(this.seleList.indexOf(date.getTime())>-1){
      //     this.seleList.splice(this.seleList.indexOf(date.getTime()),1)
      //   }else{
      //     this.seleList.push(date.getTime())
      //   }
      // },
      //判断 当前时间是否有日程
      selebool(date){               
        return this.seleList.indexOf(date.getTime()) > -1
      },
      //新建日程
      submit(){
        if(!this.schedule.scheduleTitle){
          this.$message.error({
            message: '请输入日程标题',
          });
          return
        }
        if(!this.schedule.scheduleBeginTime){
          this.$message({
            message: '请选择日程时间',
            type: 'warning'
          });
          return
        }
        if(!this.schedule.scheduleAddress){
          this.$message({
            message: '请输入日程开始起点',
            type: 'warning'
          });
          return
        }
        if(!this.schedule.scheduleRemind){
          this.$message({
            message: '请选择是否提醒',
            type: 'warning'
          });
          return
        }
        var timeArr=this.schedule.scheduleBeginTime
        this.schedule.scheduleBeginTime=timeArr[0].getTime()
        this.schedule.scheduleEndTime=timeArr[1].getTime()
        this.schedule.createBy=this.user.id
        // console.log(this.schedule)
        this.$http({
					method:'POST',
          url:`/oaManager/v1/feign/oa/schedule/addSchedule`,
          data:this.schedule
				}).then((res)=>{
          // console.log(res)

        
        
          if(res.data.code==200){
            // todo 
            this.getMonthSchedule()  
            this.getNowSchedule(new Date(this.nowTime).getTime());
            this.schedule.scheduleTitle=""
            this.schedule.scheduleAddress=""
            this.schedule.scheduleRemind=""
            this.schedule.scheduleDescribe=""
            this.isShow=false
          }else{
              this.$message.error({
              message: res.data.message,
            });
          }
          
        })
        
        
      },
      //隐藏显示
      handleShow(){
         this.isShow=true;
         this.Newly=true
      },
      //进入详情 请求日程详情数据
      toDetail(id){
        this.isShow=true;
        this.Newly=false
        this.$http({
          method:"get",
          url:`/oaManager/v1/feign/oa/schedule/querySchedule/${id}/${this.user.id}`
        }).then((res)=>{
          if(res.data.code===200){
            var data=res.data.data
            data.beginEndTime=data.beginEndTime.split('————').join('—')
            this.scheduleDetail=data
          }
        })
        
      },
      //点击遮罩隐藏遮罩
      closeFrame(){
          this.isShow=false;
      },
      //获取当日日程列表
      getNowSchedule(nowTime){
        
        nowTime=new Date(nowTime).Format("yyyy-MM-dd")  //将时刻格式化
        this.nowMonth=new Date(nowTime).Format("yyyy-MM") //将月份格式化
        this.$http({
					method:'GET',
					url:`/oaManager/v1/feign/oa/schedule/queryDaySchedule/${nowTime}/${this.user.id}`
				}).then((res)=>{
          if(res.data.code===200){
           var data=res.data.data
           data.forEach((item)=>{
            if(item.beginEndTime.indexOf("——")!=-1){
              item.beginEndTime=item.beginEndTime.split('————').join('—')
            }

           })
           data.forEach((item,i)=>{   //时间格式截取
            this.timeArr.forEach((ele,j)=>{
              if(ele.time===item.beginEndTime.slice(0,5)){
                ele.now.push(item)
              }
            })
            //  this.timeArr.now[i]=item
            //  this.timeArr.now[i].beginEndTime=item.beginEndTime.slice(0,5)
           })
           this.nowList=data
          }else{
            this.nowList="" //请求没有日程将之前显示的日程列表清空
            // this.timeArr.now=""
          }
        })
        this.nowTime=nowTime  //h获取当前日期
        this.getMonthSchedule(this.nowMonth)  
      },
      
      // judge(item,ele){
      //   if(ele){
      //     return item==ele.beginEndTime
      //   }else{
      //     return false
      //   }

      // },
      //获取当月日程
      getMonthSchedule(){
        this.$http({
          method:'GET',
          url:`/oaManager/v1/feign/oa/schedule/queryCalendar/${this.nowMonth}/${this.user.id}`
        }).then((res)=>{
          if(res.data.code===200){
            res.data.data.forEach(item => {
             this.seleList.push(new Date(new Date(item.scheduleDay).Format("yyyy-MM-dd")).getTime())
            });
            // console.log(res)
          }else{

          }
        }).catch(error=>{
          console.log(error.message)
        })
      }

  },
};
</script>

<style lang="scss" scoped>
  >>> .el-calendar__title{
    white-space: nowrap
  }
  >>> .el-button--mini{
    padding: 5px 10px
  }
  >>> .el-calendar{
    border:1px solid rgba(191,194,204,1)
  }
  >>> .el-calendar-day>p{
    width: 100%;
    height: 100%;
    text-align: left;
    
  }
  .is-selected{
    color: #409EFF;
  }
  >>> .el-calendar-table .el-calendar-day{
     width: 100%;
    height: 40px;
    padding: 0;
  }
  >>> .el-calendar-table{
    text-align: left;
    margin: 0 auto;
    font-size: 12px;
    th{
      padding: 0px 8px 8px 0px;
    }
  }
  .posr{
      position: absolute;
      bottom: 10px;
      right: 10px;
  }
  // 遮罩================start
  .frame_content {
    height: 82.5%;
    padding-top: 30px;
    padding-left: 30px;
    overflow-y: auto;

  }

  .frame_close {
    color: #909399;
    font-size: 26px;
    margin-right: 4px;
    cursor: pointer;
  }

  .frame_name {
    color: #303133;
    font-size: 20px;
    line-height: 2;
  }

  .frame_head {
    padding: 22px 27px 18px 40px;
    border-bottom: 1px solid #edeff2;
  }

  .right_frame_model {
    position: fixed;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }

  .right_frame {
    width: 600px;
    height: 100%;
    z-index: 999;
    background-color: white;
    /*padding: 22px 20px 0px 40px;*/
    
  }
  // ============================end
  .schedule-box {
    padding: 20px;
    height: 100%;
    .btn-center {
      display: flex;
      justify-content: flex-end;
      padding: 20px 0;
      .el-button {
        padding: 10px 30px;
        border-radius: 3px;
        background: #4278be;
      }
    }
  }
  .schedule-body {
    width: 100%;
    height: 100%;
    display: flex;
    .cale {
      width: 33%;
    }
    .schedule-list {
      width: 25%;
      height: 100%;
      align-self: flex-start;
      border: 1px solid rgba(191, 194, 204, 1);
      padding: 20px;
      overflow-y: auto;
      margin-left: 20px;
      .title {
        color: #303133;
        padding-bottom: 20px;
        font-size: 16px;
        -webkit-background-clip: text;
        // -webkit-text-fill-color:transparent;
        font-weight: 700;
      }
      .have {
        color: #303133;
      }
      .no {
        color: #909399;
      }
      .list {
          font-size: 16px;
          white-space: nowrap;
          li {
              cursor: pointer;
              margin-bottom: 10px;
          }
          .fio {
              display: inline-block;
              float: left;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              position: relative;
              top: 10px;
              margin-right: 8px;
          }
          .have-fio{
              background: #2AA1E1
          }
          .no-fio{
              background: #bfc2cc;
          }
          .shike {
              margin-left: 18px;
              color: #bfc2cc;
              font-size: 14px;
          }
          .title_c{
              width: 90%;
              font-size: 16px;
              display: inline-block;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
          }
      }
    }
    .detail {
      width: 40%;
      height: 100%;
      padding: 20px;
      border: 1px solid rgba(191, 194, 204, 1);
      margin-left: 20px;
      overflow-y: auto;
      .all-day {
        padding-bottom: 20px;
        display: flex;
        justify-content: space-between;
        p {
          width: 90%;
          display: inline-block;
          padding: 8px 0px 8px 28px;
          color: rgba(255, 255, 255, 1);
          background: rgba(166, 190, 222, 1);
          border-radius: 3px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          cursor: pointer;
          align-self: center;
        }
        span {
          display: inline-block;
          align-self: center;
          font-size: 18px;
          color: rgba(48, 49, 51, 1);
          font-weight: 700;
        }
      }
      .all-day-detaill {
        li {
          min-height: 60px;
          height: auto;
        }
        span {
          display: inline-block;
          width: 100%;
          color: #bfc2cc;
        }
        .border_s{
            display: block;
            width: 90%;
            height: 2px;
            background: #ECEDF2;
            position: relative;
            top: -10px;
            float: right

        }
        .content{
          min-height: 45px;
          float: right;
          display: inline-block;
          margin-left: 20px;
          width: 90%;
          display: flex;
          flex-wrap: wrap;
          a {
            display: block;
            padding: 8px 24px;
            background: rgba(255, 255, 255, 1);
            margin-left: 20px;
            background: rgba(166, 190, 222, 1);
            border-radius: 3px;
            color: #fff;
            width: 50%;
            margin-bottom: 5px;
            align-self: center;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            cursor: pointer;
          }
          a:nth-child(1) ,a:nth-child(4n){
            margin-left: 0;
          }
        }
      }
    }
  }
  .schedule-detail{
    margin-left: 10px;
    padding-right: 44px;
    font-size:14px;
    font-family:MicrosoftYaHei;

    div{
      display: flex;
      margin-bottom: 15px;
      .title{
        white-space: nowrap;
        color:rgba(48,49,51,1);
      }
      .content{
        color:rgba(96,98,102,1);
      }
    }
  }
</style>