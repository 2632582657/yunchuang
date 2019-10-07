<template>
    <div class="tree-transfer1">
        <el-dialog
            :title="dialogTitle"
            :visible.sync="visible"
            @open="isLoading = false"
            :before-close="modalClose"
            @opened="handleDialogOpen"
            class="tree-transfer__dialog"
        >
            <div
                slot="title"
                class="header-title clear"
                style="border-bottom:1px solid #BFC2CC;height:42px;"
            >
                <div
                    style="width:8px;height:24px;background:#4278BE;float:left;margin-top:4px;margin-left:30px"
                ></div>
                <div
                    style="height:31px;font-size:20px;font-family:MicrosoftYaHei;color:rgba(48,49,51,1);line-height:31px;float:left;margin-left:10px"
                >{{ sourceTitle }}</div>
            </div>
            <section class="tree-transfer__content">
                <div class="tree-transfer__left">
                    <h3 class="tree-transfer__title">{{ sourceTitle }}</h3>
                    <div class="tree-transfer__list">
                        <el-input v-model="filterText" placeholder="搜索">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                        <el-tree
                            ref="tree"
                            :data="treeData"
                            :node-key="nodeKey"
                            :props="defaultProps"
                            :highlight-current="true"
                            :expand-on-click-node="true"
                            show-checkbox
                            default-expand-all
                            check-strictly
                            @check="getCheckedKeys"
                            :filter-node-method="filterNode"
                        >
                            <div
                                class="custom-tree-node"
                                slot-scope="{ node, data }"
                                style="width:100%;"
                            >
                            <span style="display:block;max-width:185px;float:left;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{ data.name }}</span> 
                            </div>
                        </el-tree>
                    </div>
                </div>
                <div class="tree-transfer__right">
                    <h3 class="tree-transfer__title">
                        <span>{{ targetTitle }}</span>
                        <span
                            class="tree-transfer__right-close"
                            @click="clearTargetNodes"
                            v-if="isTargetNodesEmpty"
                        >清空</span>
                    </h3>
                    <div class="tree-transfer__list">
                        <ul class="tree-transfer__list-ul">
                            <li
                                class="tree-transfer__list-li"
                                v-for="item of targetNodes"
                                :key="item[nodeKey]"
                            >
                                <label>
                                    <img
                                        src="./images/person.png"
                                        alt
                                        class="fl"
                                        height="15px"
                                        width="15px"
                                        style="margin:3px 10px 0 0;"
                                    />
                                    <span class="fl">{{item[defaultProps.label]}}</span>
                                </label>
                                <span
                                    class="tree-transfer__list-delete"
                                    @click="handleDeleteItem(item[nodeKey])"
                                >
                                    <i class="el-icon-error"></i>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <span slot="footer" class="dialog-footer">
                <el-button
                    size="mini"
                    @click="modalClose"
                    style="border:1px solid #4278BE;color:#4278BE;width:150px;height:50px;"
                >取消</el-button>
                <el-button
                    size="mini"
                    type="primary"
                    @click="handleSubmit"
                    :loading="isLoading"
                    style="width:150px;height:50px;background:#4278BE;color:#fff"
                >确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
const LOCAL_KEY = 'targetNodes'
export default {
    name: 'persondialog',
    props: {
        // 宽度
        // width: {
        //     type: String,
        //     default: '500px'
        // },
        // // 高度
        // height: {
        //     type: String,
        //     default: '1000px'
        // },
        // 树形列表数据
        treeData: {
            type: Array,
            default: () => []
        },
        // dialog 标题
        dialogTitle: {
            type: String,
            default: 'Title'
        },
        // transfer 标题
        transferTitle: {
            type: Array,
            default: () => ['源列表', '目标列表']
        },
        // 树形列表节点 key
        nodeKey: {
            type: String,
            default: 'id'
        },
        // 树形列表 data 默认 prop
        defaultProps: {
            type: Object,
            default: () => ({ label: 'label', children: 'children' })
        },
        // dialog 显示状态
        dialogVisible: {
            type: Boolean,
            default: false,
            required: true
        },
        managers: {
            type:Array,
            default: () => []
        },
        select: {
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            visible: false,
            canAddNode: true,
            targetNodes: [],
            filterText: '',
            isLoading:false,
        }
    },
    computed: {
        sourceTitle() {
            return this.transferTitle[0]
        },
        targetTitle() {
            return this.transferTitle[1]
        },
        isTargetNodesEmpty() {
            return this.targetNodes.length !== 0
        }
    },
    watch: {
        dialogVisible(newValue) {
            this.visible = newValue
        },
        filterText(val) {
            this.$refs.tree.filter(val)
        },
        managers (newValue) {
            var arr = []
            newValue.forEach(item => {
                arr.push({
                    name: item.employeeName || item.name,
                    id:item.id || item.employeeId,
                    parent:item.department,
					iconUrl:item.iconUrl
                })
            })
            this.targetNodes = arr
        },
        treeData (newval) {
            this.iterations(newval)
        }
    },
    created() {
        this.visible = this.dialogVisible
        this.targetNodes = []
    },
    mounted() {
        window.addEventListener('beforeunload', e =>
            this.beforeunloadHandler(e)
        )
    },
    destroyed() {
        window.removeEventListener('beforeunload', e =>
            this.beforeunloadHandler(e)
        )
    },
    methods: {
        iterations(data) {
            for (var j = 0; j < data.length; j++) {
                if (data[j].type == 1) {
                    data[j].disabled = true
                }else {
                    data[j].disabled = false
                }
                if (data[j].children != undefined && data[j].children.length > 0) {
                    this.iterations(data[j].children)
                }
            }
        },
        filterNode(value, data, node) {
            if (!value) {
                return true
            }
            var level = node.level
            var _array = [] //这里使用数组存储 只是为了存储值。
            this.getReturnNode(node, _array, value)
            var result = false
            _array.forEach(item => {
                result = result || item
            })
            return result
        },
        getCheckedKeys(data, obj) {
            const currNode = this.$refs.tree.getCheckedNodes()
            var arr = []
            if (!this.select) {
                for (var i = 0; i < currNode.length; i++) {
                    var flag = true
                    for (var j = 0; j < arr.length; j++) {
                        if (currNode[i].employeeId == arr[j].employeeId) {
                            flag = false
                        }
                    }
                    if (flag && currNode[i].type == 2) {
                        if (!currNode[i].parent) {
                            currNode[i].parent = this.getParents(this.treeData,currNode[i].employeeId)[0].name
                        }
                        arr.push(currNode[i])
                        this.canAddNode = true
                    }
                }
            }else {
                this.$refs.tree.setCheckedNodes([data])
                arr = [data]
            }
            this.targetNodes = arr
        },
        getParents(data, id) {
            for (var i in data) {
                if (data[i].employeeId == id) {
                    return [];
                }
                if (data[i].children) {
                    var ro = this.getParents(data[i].children, id);
                    if (ro !== undefined)
                        return ro.concat(data[i]);
                }
            }
        },
        getReturnNode(node, _array, value) {
            var isPass =
                node.data &&
                node.data.name &&
                node.data.name.indexOf(value) !== -1
            isPass ? _array.push(isPass) : ''
            var isPhone =
                node.data &&
                node.data.phone &&
                node.data.phone.indexOf(value) !== -1
            isPhone ? _array.push(isPhone) : ''
            this.index++
            if (!isPass && node.level != 1 && node.parent) {
                this.getReturnNode(node.parent, _array, value)
            }
        },
        handleDeleteItem(id) {
            this.targetNodes = this.targetNodes.filter(
                item => item[this.nodeKey] !== id
            )
            this.$refs.tree.setCheckedNodes(this.targetNodes)
        },
        handleSubmit() {
            this.$emit('handlePsrsonSubmit', this.targetNodes)
            this.setLocal(LOCAL_KEY, JSON.stringify(this.targetNodes))
            this.modalClose()
            this.isLoading = true
        },
        clearTargetNodes() {
            this.$refs.tree.setCheckedKeys([])
            this.targetNodes = []
        },
        // isExistedTargetNode(node) {
        //     return this.targetNodes.some(
        //         item => item[this.nodeKey] === node[this.nodeKey]
        //     )
        // },
        handleDialogOpen() {
			if (this.managers) {
				var arr = []
				this.managers.forEach(item => {
					arr.push({
						name: item.employeeName || item.name,
						id:item.id || item.employeeId,
						parent:item.department,
						iconUrl:item.iconUrl
					})
				})
				this.$refs.tree.setCheckedNodes(arr)
			}else if (this.getLocal(LOCAL_KEY) != null) {
				this.targetNodes = JSON.parse(this.getLocal(LOCAL_KEY))
				this.$refs.tree.setCheckedNodes(this.targetNodes)
			}
        },
        modalClose() {
            this.$emit('handlePersonClose')
            this.visible = false
            this.$refs.tree.setCheckedKeys([])
        },
        beforeunloadHandler() {
            this.removeLocal(LOCAL_KEY)
        },
        setLocal(key, value) {
            sessionStorage.setItem(key, value)
        },
        getLocal(key) {
            return sessionStorage.getItem(key)
        },
        removeLocal(key) {
            sessionStorage.removeItem(key)
        }
    }
}
</script>

<style lang="scss">
.tree-transfer1 {
    h3,
    ul,
    li {
        margin: 0;
        padding: 0;
    }
    .el-input__prefix {
        top: -5px;
    }
    .is-disabled {
        display: none
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #4278be;
        border-color: #4278be;
    }
    .el-dialog {
        width: 700px !important;
        height: 600px !important;
    }
    .el-dialog__header {
        padding: 20px 0 10px;
    }
    .el-dialog__body {
        padding: 17px 37px 30px 37px;
    }
    .el-input__inner {
        height: 35px;
        margin-bottom: 15px;
    }
    .dialog-footer {
        float: right;
        margin-right: 20px;
    }
    .el-tree-node {
        .is-leaf + .el-checkbox .el-checkbox__inner {
            display: inline-block;
        }
        .el-checkbox .el-checkbox__inner {
            display: none;
        }
    }
    .tree-transfer__content .tree-transfer__list::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 10px;
    }
    .tree-transfer__content .tree-transfer__list::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #4278be;
    }
    .tree-transfer__content .tree-transfer__list::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        background: #ffffff;
    }
    .tree-transfer__content {
        position: relative;
        overflow: hidden;
        height: 400px;
        .tree-transfer__title {
            border-bottom: 1px solid #ebeef5;
            padding: 0 15px;
            height: 40px;
            line-height: 40px;
            color: #333;
            font-size: 16px;
            // background-color: #f5f7fa;
        }

        .tree-transfer__list {
            padding: 10px;
            height: calc(100% - 41px);
            box-sizing: border-box;
            overflow: auto;
        }

        .tree-transfer__left {
            position: absolute;
            top: 0;
            left: 0;
        }

        .tree-transfer__middle {
            position: absolute;
            top: 50%;
            left: 40%;
            width: 20%;
            transform: translateY(-50%);
            text-align: center;
        }

        .tree-transfer__right {
            position: absolute;
            top: 0;
            right: 0;

            .tree-transfer__right-close {
                float: right;
                color: #4278be;
                font-size: 14px;
                cursor: pointer;
            }

            .tree-transfer__list-ul {
                padding-bottom: 20px;
            }

            .tree-transfer__list-li {
                position: relative;
                padding: 4px 24px 4px 10px;
                border-radius: 3px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .tree-transfer__list-li:hover {
                background-color: #f5f7fa;
            }

            .tree-transfer__list-li:hover .tree-transfer__list-delete {
                display: block;
            }

            .tree-transfer__list-delete {
                display: none;
                position: absolute;
                top: 50%;
                right: 10px;
                margin-top: -10px;
                color: #4278be;
                cursor: pointer;
                text-align: center;
            }
        }

        .tree-transfer__left,
        .tree-transfer__right {
            border: 1px solid #ebeef5;
            width: 48%;
            height: 100%;
            box-sizing: border-box;
            border-radius: 5px;
            vertical-align: middle;
        }
    }
    // .el-dialog__footer {
    //   text-align: center;
    // }
}
</style>
