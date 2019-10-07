<!--@description: 帮助界面
    @author: 李瑞军
@update: 李瑞军(2019-06-16 13:41) -->
<template>
    <div class="app_help">
        <ul class="help_list">
            <li v-on:click="qh(true)">
                <span>问题列表</span>
            </li>
            <li v-on:click="qh(false)">
                <span>使用手册</span>
            </li>
            <li style="float:right">我要吐槽</li>
        </ul>
        <div class="help_search">
            <i class="el-icon-arrow-left"></i>
            <i class="el-icon-s-home"></i>
            <div class="help_input">
                <input type="text" placeholder="搜索帮助">
                <i class="el-icon-search"></i>
            </div>
        </div>
        <div v-if="temp" class="tab_one">
            <div class="tab_left">
                <ul class="tab-tit">
                    <li>热门问题</li>
                </ul>
                <p style="margin-top:15px;color:#ccc">问题分类1</p>
                <ul class="tab-tit">
                    <li>xxxxx问题xxxxx问题</li>
                    <li>xxxxx问题</li>
                </ul>
                <p style="margin-top:15px;color:#ccc">问题分类2</p>
                <ul class="tab-tit">
                    <li>xxxxx问题xxxxx问题</li>
                    <li>xxxxx问题</li>
                    <li>xxxxx问题</li>
                    <li>xxxxx问题</li>
                    <li>xxxxx问题</li>
                </ul>
            </div>
            <div class="tab_right">
                <div>
                    <h3>热门问题</h3>
                    <div class="hot_problem">
                        <img src="../../../assets/logo.png" alt="" width="20px;">
                        <span>注册与登录</span>
                    </div>
                    <ul class="all_problem">
                        <li>xxxx标题标题xxxx标题标题?</li>
                        <li>xxxx标题标题xxxx标题标题?</li>
                    </ul>
                    <ul class="all_problem">
                        <li>xxxx标题标题xxxx标题标题?xxxx标题标题xxxx标题标题?</li>
                        <li>xxxx标题标题xxxx标题标题?</li>
                    </ul>
                    <ul class="all_problem">
                        <li>xxxx标题标题xxxx标题标题?</li>
                    </ul>
                </div>
                <div>
                    <div class="hot_problem">
                        <img src="../../../assets/logo.png" alt="" width="20px;">
                        <span>xxxxxx类问题</span>
                    </div>
                    <ul class="all_problem">
                        <li>xxxx标题标题xxxx标题标题?</li>
                        <li>xxxx标题标题xxxx标题标题?</li>
                    </ul>
                    <ul class="all_problem">
                        <li>xxxx标题标题xxxx标题标题?xxxx标题标题xxxx标题标题?</li>
                        <li>xxxx标题标题xxxx标题标题?</li>
                    </ul>
                    <ul class="all_problem">
                        <li>xxxx标题标题xxxx标题标题?</li>
                    </ul>
                </div>
                <el-divider></el-divider>
                <div>
                    <p style="margin-bottom:10px">此信息是否有帮助</p>
                    <el-button type="primary">是</el-button>
                    <el-button type="primary">否</el-button>
                </div>
            </div>
        </div>

        <div v-if="!temp" class="tab_two">
            <div class="tab_two_content">
                <ul>
                    <li style="overflow:hidden;border-bottom:1px solid #ccc;padding-bottom:15px;margin-top:20px">
                        <div style="float:left">
                            <p style="font-size:18px;margin-bottom:10px">创建&注册企业</p>
                            <span>极简流程，快速创建和注册</span>
                        </div>
                        <div style="float:right">
                            <img src="../../../assets/logo.png" alt="" width="50px;">
                        </div>
                    </li>
                    <li style="overflow:hidden;border-bottom:1px solid #ccc;padding-bottom:15px;margin-top:20px">
                        <div style="float:left">
                            <p style="font-size:18px;margin-bottom:10px">邀请成员 </p>
                            <span>啦啦啦啦啦啦啦啦啦啦啦啦啦阿拉蕾</span>
                        </div>
                        <div style="float:right">
                            <img src="../../../assets/logo.png" alt="" width="50px;">
                        </div>
                    </li>
                    <li style="overflow:hidden;border-bottom:1px solid #ccc;padding-bottom:15px;margin-top:20px">
                        <div style="float:left">
                            <p style="font-size:18px;margin-bottom:10px">替换文字替换文字替换文</p>
                            <span>啦啦啦啦啦啦啦啦啦啦啦啦</span>
                        </div>
                        <div style="float:right">
                            <img src="../../../assets/logo.png" alt="" width="50px;">
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'help',
    components: {},
    data() {
        return {
            temp: true,
            helpSearch: '',
        }
    },
    methods: {
        qh: function(t) {
            console.log(t)
            this.temp = t
        }
    }
}
</script>
<style lang="scss">
.app_help {
    // height: 80%;
    margin-top: 10px;
}
.help_list {
    cursor: pointer;
    overflow: hidden;
    border-bottom: 1px solid #cccccc;
}
.help_list li {
    float: left;
    padding-bottom: 10px;
    margin-right: 50px;
    border-bottom: 3px solid #f1f1f1
}
.help_list li:hover {
    color: #3399FF;
    border-bottom: 3px solid #3399FF
}
.help_search {
    height: 35px;
    margin-top: 15px;
    overflow: hidden;
}
.help_search .el-icon-arrow-left {
    float: left;
    margin-top: 7px;
    margin-right: 20px;
    font-size: 18px;
}
.help_search .el-icon-s-home {
    float: left;
    margin-top: 7px;
    margin-right: 20px;
    font-size: 18px;
}
.help_search .help_input {
    position: relative;
    float: left;
}
.help_search  input {
    height: 30px;
    width: 350px;
    padding: 0 10px;
    border: 1px #cccccc solid;
    border-radius: 3px;
}
.help_search .el-icon-search {
    position: absolute;
    right: 13px;
    top: 6px;
    font-size: 18px;

}
.tab_one {
    height: 100%;
    margin-top: 20px;
    overflow: hidden;
}
.tab_one .tab_left {
    float: left;
    height: 100%;
    width: 200px;
    border-right: 1px solid #ccc;
    @media screen and (max-width: 1024px){
        display: none;
    }
}
.tab_left .tab-tit li{
    margin-top: 10px;
    padding: 10px 0;
}
.tab_left .tab-tit li:hover {
    background-color: #FFFFFF
}
.tab_one .tab_right {
    float: left;
    margin-left: 30px;
}
.hot_problem {
    margin-top: 20px;
    overflow: hidden;
}
.hot_problem img {
    float: left;
    margin-right: 15px;
}
.hot_problem span {
    float: left;
}
.all_problem {
    overflow: hidden;
    margin-top: 20px
}
.all_problem li:nth-child(n){
    float: left;
    // margin-top: 15px;
}
.all_problem li:nth-child(2n){
    float: right;
    margin-left: 50px;
}
.tab_two {
    width: 100%;
    height: 100%;
}
.tab_two_content {
    margin: 30px auto;
    height: 100%;
    width: 600px;
}
</style>
