<!--@description: 抄送人
	@author: 刘钰
    @update: 刘钰(2019-06-24 9:41) -->
<template>
    <div class="copiedPerson">
        <el-form :label-width="labelWidth" >
            <el-form-item label="抄送人：">
                <div class="chooseMember clear">
                    <!-- <div class="members fl" v-for="(item,index) in copyValue" :key="index"> -->
                    <div v-for="(item,index) in copyValue" :key="item.userId" class="fl group">
                        <span class="imgdelete" @click="deleteMember(item,index)">
                            <img src="./images/delete.png" alt="">
                        </span>
                        <img :src="item.headUrl" alt="">
                        <span class="name" v-if="item.userName !== ''">{{item.userName}}</span>
                    </div>
                    <div class="noPeople fl" @click="memberShow = true;oName = 'item'">
                        <el-button>选择抄送人</el-button>
                    </div>
                </div>
            </el-form-item>
            <el-dialog title="选择部门与人员" :visible.sync="memberShow" :close-on-click-modal='false' center>
                <div class="member">
                    <!-- <div class="title">选择部门与人员</div> -->
                    <Address class="address" @takeMember = "getMember(arguments)" @cancel="close()"></Address>
                </div>
            </el-dialog>
        </el-form>
    </div>
</template>

<script>
import Address from '../../../commons/address';
export default {
    name:'copiedPerson',
    components:{
        Address,
    },
    props:{
        labelWidth:{            //label宽度默认150px,可由父组件传值
            default:"150px",
            type:String,
        }
    },
    watch: {
        copyValue(val){
            this.$emit("getCoper",val);
        }
    },
    data() {
        return {
            memberShow:false,
            copyValue:[],
        }
    },
    methods: {
        //子组件address选择的审批人
        getMember(data){
            // console.log(data);
            if (data[0] == "") {
                this.$message.error("您未选择内容");
                return;
            }else{
                this.memberShow = data[1];
                this.copyValue = this.copyValue.concat(data[0]);
                this.copyValue = this.unique(this.copyValue);
            }
        },
        //关闭通讯录
        close(){
            this.memberShow = false;
        },
        //删除人员
        deleteMember(value,index){
            // console.log(value,index)
            let arr = this.copyValue;
            if(arr[index].length){
                for (let i = 0; i < arr[index].length; i++) {
                    if (arr[index][i] == value) {
                        arr[index].splice(i, 1);
                    }
                }
            }else{
                arr.pop(arr[index])
            }
        },
        // 数组去重
        unique(arr) {
            var res = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr.indexOf(arr[i]) == i) {
                    res.push(arr[i]);
                };
            };
            return res;
        },

    },
}
</script>
<style lang="scss" scoped>
    .copiedPerson{
        width:552px;
        margin:30px auto;
        .chooseMember{
            margin-top:-10px;
            cursor: pointer;
            .group{
                margin:10px 0;
                position:relative;
                margin-right:20px;
                text-align: center;
                .imgdelete{
                    position:absolute;
                    right:-8px;
                    top:-8px;
                    width:15px;
                    img{
                        width:100%;
                    }
                }
                img{
                    width:35px;
                }
            }
            .noPeople{
                cursor: pointer;
                background: #fff;
                padding:2px;
            }
        }
        
    }
</style>
