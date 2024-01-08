<template>
    <div class="genomeInfoWraper">
        <el-row :gutter="20">
            <el-col :span="24" :offset="0">
                <h3>TFs/TRs/PKs</h3>
                <hr />
                <el-card class="box-card">
                    <div class="text item">
                        <h4>Genomes</h4>
                        <p>(please select single genome)</p>
                        <el-tag
                            class="ml-2"
                            style="margin-left: 10px; margin-top: 10px"
                            v-for="item in genomesList"
                            :key="item.id"
                            :type="activeGenmo == item.id ? '' : 'info'"
                            @click="getGenemoFactor(item)"
                            >{{ item.sname }} [{{ item.cname }}]</el-tag
                        >
                    </div>
                </el-card></el-col
            >
            <el-col :span="24" :offset="0">
                <el-card class="box-card">
                    <h4>Transcription Factors</h4>
                    <el-row :gutter="20">
                        <el-col
                            :offset="0"
                            v-for="(e, v, i) in sortASCII(family.TF)"
                            :key="i"
                            style="margin-bottom: 5px"
                            :xs="8"
                            :sm="6"
                            :md="4"
                            :lg="3"
                            :xl="1"
                        >
                            <el-link
                                @click="goNext('FamilyList', v)"
                                :underline="false"
                                style="font-weight: initial"
                                type="primary"
                                >{{ v }} ({{ e }})
                            </el-link>
                        </el-col>
                    </el-row>
                    <h4>Transcriptional Regulators</h4>
                    <el-row :gutter="20">
                        <el-col
                            :offset="0"
                            v-for="(e, v, i) in sortASCII(family.TR)"
                            :key="i"
                            style="margin-bottom: 5px"
                            :xs="8"
                            :sm="6"
                            :md="4"
                            :lg="3"
                            :xl="1"
                        >
                            <el-link
                                @click="goNext('FamilyList', v)"
                                :underline="false"
                                style="font-weight: initial"
                                type="primary"
                                >{{ v }} ({{ e }})
                            </el-link>
                        </el-col>
                    </el-row>
                    <h4>Protein Kinases</h4>
                    <div id="treecontrol" style="display: block">
                        Protein kinase family Tree:
                        <a
                            title="Collapse the entire tree below"
                            @click="CollapseAll(true)"
                        >
                            <img src="../assets/images/minus.gif" />
                            Collapse All</a
                        >
                        |
                        <a
                            title="Expand the entire tree below"
                            @click="CollapseAll(false)"
                            ><img src="../assets/images/plus.gif" /> Expand
                            All</a
                        >
                        |
                        <a
                            @click="ToggleAll"
                            title="Toggle the tree below, opening closed branches, closing open branches"
                            >Toggle All</a
                        >
                    </div>
                    <ul id="pks" class="treeview">
                        <li
                            class="expandable"
                            v-for="(e, i) in ProteinList"
                            :key="i"
                            @click="toggleColla(e)"
                            :class="[
                                i == ProteinList.length - 1
                                    ? 'lastCollapsable'
                                    : '',
                            ]"
                        >
                            <div
                                class="hitarea"
                                :class="[!e.colla ? 'expandable-hitarea' : '']"
                            ></div>
                            <span class="">{{ e.title }}</span>
                            <ul
                                class="innerWrper"
                                :style="{
                                    height: e.colla
                                        ? e.child.length * 25 + 'px'
                                        : '0px',
                                }"
                            >
                                <li v-for="(e1, j) in e.child" :key="j">
                                    <a @click="goFamilyList(e1)" class="">{{
                                        e1
                                    }}</a>
                                    ({{ e1.length }})
                                </li>
                            </ul>
                        </li>
                    </ul>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, getCurrentInstance } from "vue";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
import { desDecrypt } from "../utils/function";
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();

const { proxy } = getCurrentInstance();

const family = ref({});
const organism = ref({});

const Protein = [];
const ProteinList = ref(Protein);

const genemoID = ref();

let activeIndex = ref(0);
let activeIndex1 = ref(-1);
let genomesList = ref([]);
let activeGenmo = ref("");
const mouseoverGenomes = (i) => {
    console.log(i, "iiiiii");
    activeIndex.value = i;
};
const mouseoverGenomes1 = (i) => {
    console.log(i, "iiiiii");
    activeIndex1.value = i;
};
const sortASCII = (obj) => {
    if (!obj) {
        return [];
    }
    let arr = [];
    let isSort = true;

    Object.keys(obj).forEach((item) => arr.push(item));
    let sortArr = isSort ? arr.sort() : arr.sort().reverse();
    let sortObj = {};
    for (let i in sortArr) {
        sortObj[sortArr[i]] = obj[sortArr[i]];
    }
    console.log(sortObj, "sortObjsortObj");
    return sortObj;
};
const toggleColla = (e) => {
    e.colla = !e.colla;
};
const ToggleAll = (res) => {
    // console.log(ProteinList.value, "1111111");
    ProteinList.value.forEach((element) => {
        element.colla = !element.colla;
    });
};
const CollapseAll = (res) => {
    // console.log(ProteinList.value, "1111111");

    ProteinList.value.forEach((element) => {
        element.colla = res;
    });
};
const goFamilyList = (v) => {
    const url = router.resolve({
        name: "FamilyList",
        query: {
            id: genemoID.value,
            // id: genemoID.value,
            family_name: v,
        },
    });
    window.location.href = url.href;
    //window.open(url.href,);
};
const getGenemoFactor = (e) => {
    activeGenmo.value = e.id;
    genemoID.value = e.id;

    proxy.util.post(
        proxy.api.genomeInfo,
        {
            organism_id: e.id * 1,
        },
        (resp) => {
            console.log(resp);
            organism.value = resp.organism;
            family.value = resp.family;
            let arr = [];

            for (const key in resp.pktree) {
                arr.push({
                    title: key,
                    colla: false,
                    child: resp.pktree[key],
                });
            }
            // console.log(arr, "arrarrarr");
            ProteinList.value = arr;
            // imageUrl.value = resp.image[0];
        },
        (err) => {
            console.log(err);
        }
    );
};
const goNext = (res, v) => {
    console.log(v, "vvvvvv");
    const url = router.resolve({
        name: res,
        query: {
            id: genemoID.value,
            family_name: v,
        },
    });
    window.open(url.href, "_blank");
};
onMounted(() => {
    genomesList.value = store.state.navconfigData;
    // console.log(store.state.navconfigData, "store.state.navconfigData");
});
</script>
<style lang="less" scoped>
.genomeInfoWraper {
    width: 80vw;
    margin: 0 auto;
}

.genomeInfoWraper {
    width: 80vw;
    margin: 0 auto;
    /deep/ .el-descriptions__cell {
        padding-bottom: 0 !important;
        display: flex;
    }
    /deep/ .my-label {
        margin-left: 20px !important;
        font-weight: bold;
        display: inline-block;
        width: 200px !important;
        text-align: right;
        flex: none;
    }
    .my-content {
        background: var(--el-color-danger-light-9);
        width: 100px !important;
    }
    /deep/ .el-tabs--border-card {
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
    }
    .height-leave-active,
    .height-enter-active {
        transition: height 0.5s;
    }

    .height-enter,
    .height-leave-to {
        height: 0;
    }
    .innerWrper {
        transition: max-height 0s linear;
        transition-property: all;
        transition-duration: 0.2s;
        transition-timing-function: linear;
        overflow: hidden;
    }
}

.box {
    height: 100px;
    width: 100px;
    background-color: #e74c3c; /*简写*/
    transition: all 1s ease-in; /*属性名区别*/
    transition-property: all;
    transition-duration: 1s;
    transition-timing-function: ease-in;
    transition-delay: 1s;
}
.box:hover {
    height: 200px;
    width: 200px;
    background-color: springgreen;
}
</style>
