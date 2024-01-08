<template>
    <el-header
        class="header"
        style="display: flex; align-items: center; justify-content: end"
    >
        <!-- <Edit style="width: 1em; height: 1em; margin-right: 8px" /> -->
        <div style="display: flex; justify-content: center; flex: 1">
            <el-text
                class="mx-1 text"
                :class="activePath == '/' ? 'active' : ''"
                @click="goNextPage('/')"
                >首页</el-text
            >
            <el-text
                class="mx-1 text"
                @click="goNextPage('/article')"
                :class="activePath == '/article' ? 'active' : ''"
                >合作文章</el-text
            >
            <!--  -->
            <el-text
                class="mx-1 text"
                :class="activePath == '/technology' ? 'active' : ''"
                @click="goNextPage('/technology')"
                >科技服务</el-text
            >
        </div>

        <el-icon class="text" :size="40"
            ><HomeFilled @click="goNextPage('/')" style="color: #fff"
        /></el-icon>
    </el-header>
</template>

<script setup >
import { ref, watch } from "vue";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
let userId = ref();
let activePath = ref();

// userId.value = route.params.id
const goNextPage = (res) => {
    router.push(res);
};
watch(
    () => route,
    (newValue, oldValue) => {
        activePath = router.currentRoute.value.path;
    },
    { immediate: true }
);
</script>
<style lang="less" scoped>
.header {
    background: #184e71;
    .text {
        color: #fff;
        font-size: 18px;
        margin: 0 20px;
    }
    .text:hover {
        color: orange;
    }
    .active {
        color: orange;
    }
}
</style>