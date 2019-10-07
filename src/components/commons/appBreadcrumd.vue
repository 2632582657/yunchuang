<template>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <template v-if="list.length > 1">
            <!-- <template v-if="list[1].label == '帮助'">
                <i class="el-icon-question"></i><p>{{ list[1].label }}</p>
            </template>
            <template v-else-if="list[1].label == '我的工作台'">
                <i class="el-icon-folder"></i><p>{{ list[1].label }}</p>
            </template> -->
            <template v-if="list[1].label == '主页' || list[1].label == '加入团队申请' || list[1].label == '申请加入企业提醒'|| list[1].label == '邀请拒绝提醒'||list[1].label == '公司号消息'|| list[1].label == '邀请同意提醒'||list[1].label == '工作通知'||list[1].label == '邀请加入团队通知'||list[1].label == '后台管理' || list[1].label == '消息' || list[1].label == '通讯录' || list[1].label == '我的工作台' || list[1].label == '帮助'||list[1].label == '团队管理'">
                    <template v-for="item in list.slice(1)">
                        <template v-if="item.icon">
                            <el-breadcrumb-item :key="item.path"><i :class="item.icon" style="color:#4278BE"></i><p>{{ item.label }}</p></el-breadcrumb-item>
                        </template>
                        <template v-else>
                            <el-breadcrumb-item :key="item.path"><P>{{ item.label }}</P></el-breadcrumb-item>
                        </template>
                    </template>
            </template>
            <template v-else>
                <template v-for="item in list">
                    <template v-if="item.icon">
                        <el-breadcrumb-item :key="item.path"><i :class="item.icon"  style="color:#4278BE;"></i><p>{{ item.label }}</p></el-breadcrumb-item>
                    </template>
                    <template v-else>
                        <el-breadcrumb-item :key="item.path"><P>{{ item.label }}</P></el-breadcrumb-item>
                    </template>
                </template>
            </template>
        </template>
    </el-breadcrumb>
</template>

<script>
export default {
    name: 'AppBreadcrumb',
    props: {
        // 建议的写法，更严谨友好
        list: {
            type: Array,
            required: true
        }
    }
}
</script>

<style lang="scss">
.el-breadcrumb {
    font-size: 24px !important;
    margin: 0 0 10px 10px;
}
.breadcrumb i {
    float: left;
    font-size: 38px;
    margin-top: 5px;
    margin-right: 10px;
}
.breadcrumb p {
    float: left;
    margin-top: 10px;
}
.el-breadcrumb .el-breadcrumb__separator[class*=icon] {
    margin: 4px 6px;
    font-weight: 400;
}
</style>
