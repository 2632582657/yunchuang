<template>
    <div class="management">
        <ul class="management_list">
            <li
                v-for="(item,index) in tabs"
                :class="{active:index == num}"
                @click="tab(index)"
                :key="index"
            >{{item}}</li>
            <li @click.stop="dialog = !dialog">
                <i class="el-icon-circle-plus"></i>添加
            </li>
        </ul>
        <div class="tabCon">
            <div
                v-for="(itemCon,index) in tabContents"
                v-show=" index == num"
                :key="index"
            >{{itemCon}}</div>
        </div>
        <!-- 更多应用 -->
        <div class="app_more" v-show="dialog" ref="appMore" @click="dialog = true">
            <div>
                <div class="app_search">
                    <input type="text" placeholder="搜索">
                    <i class="el-icon-search"></i>
                </div>
                <!-- 推荐这种写法-->
                <ul class="tab-tilte">
                    <li
                        v-for="(title,index) in tabTitle"
                        @click="cur=index"
                        :key="index"
                        :class="{active:cur==index}"
                    >{{title}}</li>
                </ul>
                <div class="tab-content">
                    <div v-for="(m,index) in tabMain" :key="index" v-show="cur==index">
                        <ul>
                            <li class="tab_list">
                                <p class="tab_application">应用分类1</p>
                                <div class="tab_module">
                                    <img src="../../../../assets/logo.png" alt width="24px">
                                    <span>{{ m }}</span>
                                    <!-- @click="showFeatures" -->
                                    <i class="el-icon-more"></i>
                                    <!-- <ul class="tab_position">
                                            <li>
                                                <img src="../../../../assets/logo.png" alt="" width="20px">
                                                <span>阻止</span>
                                            </li>
                                            <li>
                                                <img src="../../../../assets/logo.png" alt="" width="20px">
                                                <span>卸载</span>
                                            </li>
                                    </ul>-->
                                </div>
                                <div class="tab_module">
                                    <img src="../../../../assets/logo.png" alt width="24px">
                                    <span>xxx功能模块</span>
                                    <i class="el-icon-more"></i>
                                </div>
                                <div class="tab_module">
                                    <img src="../../../../assets/logo.png" alt width="24px">
                                    <span>xxx功能模块</span>
                                    <i class="el-icon-more"></i>
                                </div>
                            </li>
                            <li class="tab_list">
                                <p class="tab_application">应用分类1</p>
                                <div class="tab_module">
                                    <img src="../../../../assets/logo.png" alt width="24px">
                                    <span>xxx功能模块</span>
                                    <i class="el-icon-more"></i>
                                </div>
                                <div class="tab_module">
                                    <img src="../../../../assets/logo.png" alt width="24px">
                                    <span>xxx功能模块</span>
                                    <i class="el-icon-more"></i>
                                </div>
                            </li>
                        </ul>
                        <div class="more_pplication">
                            <img src="../../../../assets/logo.png" alt width="20px">
                            <span>更多应用</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'management',
    data() {
        return {
            dialog: false,
            tabs: ['工作类', '工具类', '信息类', '标题四'],
            tabContents: ['内容一', '内容二', '内容三', '内容四'],
            num: 1,
            tabTitle: ['xx系统1', 'xx系统2', 'xx系统3'],
            tabMain: ['内容一', '内容二', '内容三', '内容四'],
            cur: 0 //默认选中第一个tab
        }
    },
    methods: {
        tab(index) {
            this.num = index
        },
        hideMoreApp (e) {
            // let that = this
            if (!this.$refs.appMore.contains(e.target)) {
                this.dialog = false
            }
        }
    },
    mounted() {
        document.addEventListener('click',this.hideMoreApp)
    },
    beforeDestroy () {
        document.removeEventListener('click',this.hideMoreApp)
    },
}
</script>

<style lang="scss">
.management {
    position: relative;
}
.management_list {
    margin-top: 15px;
    border-bottom: 1px solid #ccc;
    overflow: hidden;
    height: 32px;
}
.management_list li {
    float: left;
    padding: 5px 0;
    margin-right: 20px;
}
.management_list li:last-child {
    float: right;
    margin-right: 0;
}
.management_list li:hover {
    cursor: pointer;
    border-bottom: 3px solid #3399ff;
}
.management .app_more {
    position: absolute;
    padding: 10px 0;
    right: 0;
    top:30px;
    background-color: #fff;
    height: 476px;
    width: 357px;
    border-radius: 4px;
    // z-index: 999;
}
.management  .app_search {
    position: relative;
    padding: 0 20px;
}
.management .app_search input {
    height: 38px;
    width: 100%;
    padding-left: 20px;
    border-radius: 4px 4px  0 0;
    border:none;
    border-bottom: 2px blue solid;
}
.management .app_search .el-icon-search {
    position: absolute;
    font-size: 18px;
    right: 30px;
    top: 10px;
    color: black;
}
.management .tab-tilte{
    width: 100%;
    padding: 0 20px;
    margin-top: 15px;
    overflow: hidden;
    border-bottom: 1px solid #CCC;
    color: black;
}
.management .tab-tilte li{
    float: left;
    width: 18%;
    margin-right: 20px;
    text-align: center;
    cursor: pointer;
}
.management .tab_application {
    padding: 0 20px;
    margin-top: 10px;
    color: black;
}
.management .tab_module {
    // position: relative;
    height: 40px;
    padding: 0 20px;
    line-height: 40px;
    overflow: hidden;
    margin-top: 10px;
    color: black;
}
.management .tab_module:hover {
    background-color: cadetblue
}
.management .tab_module img {
    margin-top: 11px;
    float: left;
}
.management .tab_module span {
    float: left;
    margin-left: 10px;
}
.management .tab_module .el-icon-more {
    position: relative;
    // margin-top: 11px;
    line-height: 40px;
    float: right;
    margin-right: 10px;
}
/* 点击对应的标题添加对应的背景颜色 */
.management .tab-tilte .active{
    // background-color: #09f;
    color: blue;
    border-bottom: 3px blue solid;
}
.management .tab-content {
    
}
.management .tab-content .tab_list{
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
}
//  阻止  卸载 定位
.management .tab_position {
    position:absolute;
    width: 200px;
    height: 110px;
    top: 158px;
    right: -141px;
    border-radius: 4px;
    background-color: #cccccc;
    z-index: 999;
}
.management .tab_position li {
    overflow: hidden;
}
.management .more_pplication {
    padding: 0 20px;
    margin-top: 15px;
    overflow: hidden;
    color: black;
}
.management .more_pplication  img {
    float: left;
}
.management .more_pplication  span {
    float: left;
    margin-left: 10px;
}
</style>
