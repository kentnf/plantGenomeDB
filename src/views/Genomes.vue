<template>
    <div class="genomeInfoWraper">
        <el-card class="box-card" style="height: 70vh">
            <div>
                <ul class="genomesListWraper">
                    <li
                        v-for="(e, i) in genomesList"
                        :key="e.key"
                        style="
                            display: flex;
                            align-items: center;
                            justify-content: space-around;
                            position: relative;
                            cursor: pointer;
                        "
                        :class="activeIndex == i ? 'active' : ''"
                        @mouseover="mouseoverGenomes(i)"
                    >
                        <span style="cursor: pointer">{{ e.key }}</span>
                        <CaretRight style="width: 15px; height: 15px" />
                        <ul
                            style="
                                position: absolute;
                                right: -300px;
                                top: 0;
                                border: 1px solid #000;
                                width: 300px;
                                padding-left: 0px;
                                cursor: pointer;
                            "
                            v-if="activeIndex == i"
                        >
                            <li
                                @mouseover="mouseoverGenomes1(j)"
                                :class="activeIndex1 == j ? 'active' : ''"
                                v-for="(e1, j) in e.child"
                                :key="e1.key"
                                @click="goFamilyList(e1)"
                            >
                                <span style="margin-left: 10px">
                                    {{ e1.key }}</span
                                >
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, getCurrentInstance } from "vue";
import CryptoJS from "crypto-js";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
import { desDecrypt } from "../utils/function";

const { proxy } = getCurrentInstance();
const router = useRouter();

let activeIndex = ref(0);
let activeIndex1 = ref(-1);
let genomesList = ref();
const mouseoverGenomes = (i) => {
    console.log(i, "iiiiii");
    activeIndex.value = i;
};
const mouseoverGenomes1 = (i) => {
    console.log(i, "iiiiii");
    activeIndex1.value = i;
};
const goFamilyList = (v) => {
    const url = router.resolve({
        name: "genomeInfo",
        query: {
            id: v.id,
        },
    });
    window.open(url.href, "_blank");
};

onMounted(() => {
    // const router = useRoute();
    // organism_id.value = router.query.id * 1;
    var includeID = desDecrypt().split(",");

    proxy.util.post(
        proxy.api.speciesGenome,
        {
            genome_ids: includeID,
        },
        (resp) => {
            console.log(resp);
            genomesList.value = resp;
        },
        (err) => {
            console.log(err);
        }
    );
});
</script>
<style lang="less" scoped>
.genomeInfoWraper {
    width: 80vw;
    margin: 0 auto;
    .genomesListWraper {
        border: 1px solid #000;
        width: 150px;
        padding-left: 0px;
    }
    li {
        list-style: none;
        font-size: 20px;
        line-height: 2;
    }
    .active {
        background: rgb(238, 238, 238);
    }
}
</style>
