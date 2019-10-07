<template>
    <div class="backstage">
        <el-tree
            :data="data"
            node-key="id"
            @node-click="handleNodeClick"
            :render-content="renderContent"
        >
            <!-- <span class="custom-tree-node" slot-scope="{ node }">
                    <span>{{ node.label }}</span>
                <span>
                    <i :class="node.icon"></i>{{ node.label }}
                    <el-button type="text" size="mini" @click="() => append(data)">Append</el-button>
                    <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
                </span>
            </span> -->
        </el-tree>
    </div>
</template>

<script>
export default {
    data() {
        const data = [
            {
                id: 1,
                label: '后台管理功能分类1',
                icon:'el-icon-success',
                children: [
                    {
                        id: 13,
                        label: '管理功能1',
                        icon:'el-icon-success',
                    },
                    {
                        id: 14,
                        label: '管理功能2',
                        icon:'el-icon-success',
                    },

                ]
            },
            {
                id: 2,
                label: '后台管理功能分类1',
                icon:'el-icon-success',
                children: [
                    {
                        id: 18,
                        label: '管理功能1',
                        icon:'el-icon-success',
                        is_show:'false',
                    },
                    {
                        id: 19,
                        label: '管理功能2',
                        icon:'el-icon-success',
                        is_show:'false',
                    }
                ]
            },
            {
                id: 3,
                label: '后台管理功能分类1',
                icon:'el-icon-success',
                children: [
                    {
                        id: 20,
                        label: '管理功能1',
                        icon:'el-icon-success',
                        is_show:'false',
                    },
                    {
                        id: 21,
                        label: '管理功能2',
                        icon:'el-icon-success',
                        is_show:'false',
                    }
                ]
            },
        ]
        return {
            data: JSON.parse(JSON.stringify(data)), 
            // data: JSON.parse(JSON.stringify(data)),
        }
    },
    methods: {
        handleNodeClick(obj){
            // this.$router.push({name:obj.path});
        },
        renderContent(h, { node, data, store }) {
            return (
                <div style="width:100%">
                    <i class={data.icon}></i>
                    <span> {node.label}</span>
                </div>
            )
        }
    }
}
</script>

<style lang="scss">
.backstage .el-tree-node__content {
    height: 38px;
}
</style>
