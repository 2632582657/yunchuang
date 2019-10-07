<!--@description: 补卡申请
	@author: 赵康
    @update: 赵康(2019-06-21 11:41) -->
<template>
  <div class="fillCardApplication">
    <div class="contentBox">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="82px">
        <el-form-item label="补卡日期:" prop="fillCardDate">
          <el-col :span="16">
            <el-date-picker
              type="date"
              placeholder="选择日期时间"
              v-model="ruleForm.fillCardDate"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-col>
          <!-- <el-col class="line" :span="2">-</el-col> -->
          <!--          <el-col :span="9" style="margin-left:10px;">-->
          <!--            <el-form-item prop="startTime">-->
          <!--              <el-time-picker placeholder="选择时间" v-model="ruleForm.startTime" style="width: 100%;"></el-time-picker>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
        </el-form-item>
        <el-form-item label="补卡原因:">
          <el-form-item prop="content">
            <el-input
              type="textarea"
              class="signTextarea"
              placeholder="请输入补卡原因"
              v-model="ruleForm.content"
              maxlength="500"
              show-word-limit
              @focus="borderContent = false"
            ></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="图片:">
          <uploadImg :uploadImg="uploadImg" :fileList="{path:'3'}" ref="ImgUrl"></uploadImg>
        </el-form-item>
        <examineApprove
          :labelWidth="lableWidth"
          :isOne="true"
          :isSingular="true"
          :isApprove="isApprove"
          :dataList="dataList"
          @getDataList="getData"
        ></examineApprove>
        <copiedPerson :labelWidth="lableWidth" ref="copiedPersonData"></copiedPerson>
        <el-button type="primary" @click="submitData('ruleForm')">提交</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import "@/modules/common";
import copiedPerson from "../../Apublics/copiedPerson";
import uploadImg from "../../Apublics/uploadImg";
import examineApprove from "../../Apublics/examineApprove";

export default {
  name: "fillCardApplication",
  data() {
    return {
      ruleForm: {
        fillCardDate: new Date().Format("yyyy-MM-dd"), //默认当前时间
        content: ""
      },
      lableWidth: "80px",
      uploadImg: "http://yapi.ycteam.work/mock/45/oaManage/v1/oa/uploadImages",
      rules: {
        fillCardDate: [
          {
            required: true,
            message: "请选择补卡日期",
            trigger: "change"
          }
        ],
        startTime: [
          {
            required: true,
            message: "请选择补卡时间",
            trigger: "change"
          }
        ],
        content: [
          {
            required: true,
            message: "请填写补卡原因",
            trigger: "blur"
          }
        ]
      },
      borderContent: false,
      isApprove: true,
      dataList: []
    };
  },
  components: {
    copiedPerson,
    uploadImg,
    examineApprove
  },
  beforeRouteLeave: function(to, from, next) {
  	let that = this;
    if (true) {
      // next(false);
		if(this.ruleForm.content || this.dataList.length>0 || this.$refs.ImgUrl.imgUrl.length>0 || that.$refs.copiedPersonData.copyValue.length>0){
			this.$confirm("是否保存尚未提交内容?", "提示", {
				cancelButtonText: "取消",
				confirmButtonText: "确定",
				type: "warning"
			})
				.then(() => {

					// 保存草稿
					this.$http({
						method: "POST",
						url: "/oaManage/v1/oa/approval/fillcard/temp",
						data: {
							applyId: "3",
							applyName: "补卡",
							time: that.ruleForm.fillCardDate,
							content: that.ruleForm.content,
							imgUrls: that.$refs.ImgUrl.imgUrl,
							approverList: that.dataList,
							recipientList: that.$refs.copiedPersonData.copyValue
						}
					})
						.then(res => {
							if (res.status === 200) {
								next(true);
							}
						})
						.catch(error => {
							that.$message.error("保存草稿失败");
						});
				})
				.catch(error => {
					next(true);
				});
		}
    }
  },
  created() {
    let that = this;
    //获取审批人
    this.$http({
      method: "GET",
      url: "/oaManage/v1/oa/approvers",
      params: {
        applyId: "3"
      }
    }).then(res => {
      if (res.status === 200) {
        if (res.data.data) {
          if (res.data.data.approverList) {
            if (res.data.data.approverList.length > 0) {
              that.isApprove = false;
              that.dataList = res.data.data.approverList;
            } else {
            }
          }
        }
      }
    });
    //读取草稿
    this.$http({
      method: "GET",
      url: "/oaManage/v1/oa/approval/fillcard/temp",
      params: {
        applyId: "3"
      }
    }).then(res => {
      if (res.status === 200) {
        if (res.data.data) {
          let data = res.data.data;
          that.ruleForm.fillCardDate = data.time;
          that.ruleForm.content = data.content;
          that.$refs.ImgUrl.imgUrl = data.imgUrls || ''
			if (data.imgUrls) {
				data.imgUrls.forEach(item => {
					this.$refs.ImgUrl.draftImg.push({url:item})
				});
			};
          that.dataList = data.approverList;
          that.$refs.copiedPersonData.copyValue = data.recipientList;
        }
      }
    });
  },
  methods: {
    submitData(formName) {
      if (this.dataList.length < 1) {
        this.$message.warning("至少选择一位审批人");
        return;
      }
      if (this.dataList.length > 0) {
        if (this.dataList[0].length < 1) {
          this.$message.warning("至少选择一位审批人");
          return;
        }
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http({
            method: "POST",
            url: "/oaManage/v1/oa/approval/fillcard",
            data: {
              applyId: "3",
              applyName: "补卡",
              time: this.ruleForm.fillCardDate,
              content: this.ruleForm.content,
              imgUrls: this.$refs.ImgUrl.imgUrl,
              approverList: this.dataList,
              recipientList: this.$refs.copiedPersonData.copyValue
            }
          }).then(res => {
            if (res.status === 200) {
              this.$message.success("提交成功");
            }
          });
        } else {
          this.$message.error("提交失败");
          return false;
        }
      });
    },
    getData(data) {
      this.dataList = data;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../../../stylesheets/main.scss";

.fillCardApplication {
  background-color: white;

  .contentBox {
    width: 500px;
    height: 100%;
    margin: 0 auto;
    padding: 30px 0;
    .changeColor {
      border: 1px solid red;
      @include rounded(4px);
    }
    .el-form-item {
      position: relative;
      .signDate::before,
      .signTextarea::before {
        content: "*";
        position: absolute;
        top: 0px;
        left: -80px;
        color: red;
      }
      .el-input {
        width: 346px;
      }
      .el-form-item__content {
        .el-textarea {
          width: 346px;

          .el-textarea__inner {
            height: 100px;
          }
        }
      }
    }
    // .el-form-item::before {
    //   content: "*";
    //   position: absolute;
    //   top: 11px;
    //   left: 0px;
    //   color: red;
    // }
    .el-button {
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
