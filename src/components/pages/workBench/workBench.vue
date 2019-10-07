<template>
    <div class="workBench">
        <div class="no_content">
           待开放，敬请期待
        </div>
    </div>
</template>

<script>
export default {
    name: 'workBench',
    data() {
        return {
        }
    },
    methods: {
    },
    mounted() {
    },
    beforeDestroy () {
    },
}
</script>

<style lang="scss">
.workBench {
    width: 100%;
    .no_content{
        text-align: center;
        color: #909399;
        margin-top: 300px;
    }
}
</style>
