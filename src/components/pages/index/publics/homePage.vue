<template>
    <div class="home_page">
        <div class="home_title">
            <el-select v-model="value" @change="changeModule">
                <el-option
                    v-for="item in removeModule"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <i class="el-icon-s-operation" style="float:right" @click.stop="showModule = !showModule"></i>
            <div class="module_ification" v-show="showModule" ref="module">
                <div class="module_title">
                    <span style="float:left">我的分类</span>
                    <span
                        style="float:right;cursor: pointer;color:#6EA6FF"
                        @click="toggle = !toggle"
                    >{{ toggle ? '完成' : '编辑'}}</span>
                </div>
                <div class="remove_module">
                    <div class="module_list" v-for="(item,index) in removeModule" :key="index">
                        <div v-if="index < 1">{{ item.label }}</div>
                        <div
                            v-else
                            draggable="true"
                            @dragstart="drag($event,index)"
                            @drop="drop($event,index)"
                            @dragover="allowDrop($event)"
                        >
                            {{ item.label }}
                            <i
                                class="el-icon-remove-outline"
                                v-show="toggle"
                                @click="remove(item)"
                            ></i>
                        </div>
                    </div>
                </div>
                <p style="margin-top:20px">点击添加分类</p>
                <ul class="add_module">
                    <li v-for="(item,index) in addModule" :key="index">
                        {{ item.label }}
                        <i
                            class="el-icon-circle-plus-outline"
                            v-show="toggle"
                            @click="add(item)"
                        ></i>
                    </li>
                </ul>
            </div>
        </div>
        <div class="page_list">
            <ul class="list_content">
                <li class="release_content">
                    <div class="r_c1">
                        <img src="../../../../assets/logo.png" alt width="12px">
                        <span>发布者信息</span>
                        <span>2019年6月14日</span>
                    </div>
                    <div class="r_c2">
                        <p>稻盛和夫：无论有多少不确定宁因素，也一定要实现自己定下的目标,稻盛和夫：无论有多少不确定宁因素，也一定要实现自己定下的目标</p>
                        <img src="../../../../assets/logo.png" alt width="40px">
                    </div>
                    <span>1位朋友读过</span>
                </li>
                <li class="release_content">
                    <div class="r_c1">
                        <img src="../../../../assets/logo.png" alt width="12px">
                        <span>发布者信息</span>
                        <span>2019年6月14日</span>
                    </div>
                    <div class="r_c2">
                        <p>稻盛和夫：无论有多少不确定宁因素，也一定要实现自己定下的目标,稻盛和夫：无论有多少不确定宁因素，也一定要实现自己定下的目标</p>
                        <img src="../../../../assets/logo.png" alt width="40px">
                    </div>
                    <span>1位朋友读过</span>
                </li>
                <li class="release_content">
                    <div class="r_c1">
                        <img src="../../../../assets/logo.png" alt width="12px">
                        <span>发布者信息</span>
                        <span>2019年6月14日</span>
                    </div>
                    <div class="r_c2">
                        <p>稻盛和夫：无论有多少不确定宁因素，也一定要实现自己定下的目标,稻盛和夫：无论有多少不确定宁因素，也一定要实现自己定下的目标</p>
                        <img src="../../../../assets/logo.png" alt width="40px">
                    </div>
                    <span>1位朋友读过</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'home',
    data() {
        return {
            value: '模块1',
            toggle: false,
            showModule: false,
            removeModule: [
                { label: '模块1', value: '选项1', name: 'module' },
                { label: '模块2', label: '模块2', name: 'modules' },
                { label: '模块3', value: '选项3' },
                { label: '模块4', value: '选项4' },
                { label: '模块5', value: '选项5' }
            ],
            addModule: [
                { label: '模块6', value: '选项6' },
                { label: '模块7', value: '选项7' },
                { label: '模块8', value: '选项8' }
            ]
        }
    },
    methods: {
        changeModule(id) {
            let abc = this.removeModule.find(item => {
                return item.value === id
            })
            this.$router.push({ name: abc.name })
        },
        remove(key) {
            let arr = this.removeModule.find(item => {
                return item.label === key.label
            })
            this.addModule.push(arr)
            this.removeModule.splice(
                this.removeModule.findIndex(item => item.label === key.label),
                1
            )
        },
        add(key) {
            let arr = this.addModule.find(item => {
                return item.label === key.label
            })
            this.removeModule.push(arr)
            this.addModule.splice(
                this.addModule.findIndex(item => item.label === key.label),
                1
            )
        },
        drag(event, index) {
            if (this.toggle === true) {
                event.dataTransfer.setData('index', index)
            }
        },
        drop(event, index) {
            if (this.toggle === true) {
                event.preventDefault()
                let startIndex = parseInt(event.dataTransfer.getData('index'))
                let currentIndex = parseInt(index)
                console.log('start', startIndex)
                console.log('drop', currentIndex)

                if (startIndex - currentIndex > 0) {
                    console.log('要拖拽的元素的索引 大于 当前位置的元素的索引')
                    this.removeModule.splice(
                        currentIndex,
                        0,
                        this.removeModule[startIndex]
                    )
                    console.log('删除' + startIndex + 1)
                    this.removeModule.splice(startIndex + 1, 1)
                } else if (startIndex - currentIndex < 0) {
                    console.log('要拖拽的元素的索引  小于 当前位置的元素的索引')
                    this.removeModule.splice(
                        currentIndex + 1,
                        0,
                        this.removeModule[startIndex]
                    )
                    this.removeModule.splice(startIndex, 1)
                } else {
                    console.log('什么也不用做')
                }
            }
        },
        allowDrop(event) {
            if (this.toggle === true) {
                event.preventDefault()
            }
        },
        hideEditModule (e) {
            if (this.toggle === false) {
                if (!this.$refs.module.contains(e.target)) {
                    this.showModule = false
                }
            }
        }
    },
    mounted() {
        document.addEventListener('click',this.hideEditModule)
    },
    beforeDestroy () {
        document.removeEventListener('click',this.hideEditModule)
    },
}
</script>

<style lang="scss">
.home_page {
    padding: 20px;
}
.home_title {
    position: relative;
    height: 30px;
    border-bottom: 1px solid #ccc;
}
.module_ification {
    position: absolute;
    width: 341px;
    height: 265px;
    padding: 15px 10px;
    top: 20px;
    right: -333px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #ffffff;
    box-shadow: 0px 0px 6px #cccccc;
}
.module_title {
    overflow: hidden;
}
.remove_module {
    overflow: hidden;
}
.remove_module .module_list {
    position: relative;
    float: left;
    padding: 8px 20px;
    margin-right: 12px;
    margin-top: 10px;
    background-color: #ccc;
}
.remove_module .module_list:first-child {
    color: #ff8400;
}
.remove_module .module_list:nth-child(4n) {
    margin-right: 0px;
}
.remove_module .module_list:hover {
    cursor: pointer;
}
.remove_module .el-icon-remove-outline {
    position: absolute;
    top: 0;
    right: 0;
    color: red;
}
.add_module {
    overflow: hidden;
}
.add_module li {
    position: relative;
    float: left;
    padding: 8px 20px;
    margin-right: 12px;
    margin-top: 10px;
    background-color: #ccc;
}
.add_module li:nth-child(4n) {
    margin-right: 0px;
}
.add_module li:hover {
    cursor: pointer;
}
.add_module .el-icon-circle-plus-outline {
    position: absolute;
    top: 0;
    right: 0;
    color: blue;
}
.home_page .el-input__inner {
    border: none;
    height: 20px;
}
.home_page .el-select {
    height: 20px;
    width: 100px;
}
.home_page .el-input__icon {
    line-height: 20px;
}
.release_content {
    padding-bottom: 15px;
    border-bottom: 1px solid #ccc;
}
.release_content .r_c1 {
    margin-top: 10px;
    overflow: hidden;
}
.release_content .r_c1 img {
    float: left;
    margin-top: 3px;
}
.release_content .r_c1 span:nth-child(2) {
    float: left;
    // width: 45%;
    margin-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.release_content .r_c1 span:nth-child(3) {
    float: right;
    width: 33%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.release_content .r_c2 {
    margin-top: 10px;
    margin-bottom: 15px;
    overflow: hidden;
}
.release_content .r_c2 p {
    float: left;
    width: 70%;
    // height: 40px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.release_content .r_c2 img {
    float: right;
    // width: 20%;
}
</style>
