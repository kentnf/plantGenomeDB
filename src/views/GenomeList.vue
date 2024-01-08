<template>
    <div class="newsWraper">
        <h3>List of Genomes</h3>
        <hr />
        <div
            style="
                display: flex;
                justify-content: space-between;
                margin: 0 auto;
                margin-top: 20px;
                margin-bottom: 20px;
            "
        >
            <div
                style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                "
            >
                <p>Show</p>
                <el-select
                    v-model="pageSize2"
                    style="width: 60px; margin: 0 10px"
                    @change="pageSizeChange"
                >
                    <el-option :label="10" :value="10"> </el-option>
                    <el-option :label="25" :value="25"> </el-option>
                    <el-option :label="50" :value="50"> </el-option>
                    <el-option :label="100" :value="100"> </el-option>
                </el-select>

                <p>entries</p>
            </div>
            <div style="display: flex; align-items: center">
                <p style="margin-right: 10px">Search:</p>
                <el-input
                    size="small"
                    v-model="searchValue"
                    placeholder="Please input"
                    @input="searchInput"
                />
            </div>
        </div>

        <el-table :data="newsList" stripe>
            <el-table-column prop="organism" label="Scientific name">
                <template #default="scope">
                    <el-link
                        @click="goNext('genomeInfo', scope.row)"
                        target="_blank"
                        :underline="false"
                        type="primary"
                    >
                        <i>{{ scope.row.scientific_name }}</i>
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="common_name"
                label="Common name"
            ></el-table-column>
            <el-table-column
                prop="order"
                width="120"
                label="Order"
            ></el-table-column>
            <el-table-column
                prop="family"
                width="120"
                label="Family "
            ></el-table-column>
            <el-table-column
                prop="genus"
                width="160"
                label="Genus "
            ></el-table-column>
            <el-table-column prop="cultivar" label="PUBMED ">
                <template #default="scope">
                    <el-link
                        :href="`https://pubmed.ncbi.nlm.nih.gov/${scope.row.publication}`"
                        target="_blank"
                        :underline="false"
                        type="primary"
                    >
                        {{ scope.row.publication }}
                    </el-link>
                </template>
            </el-table-column>
        </el-table>
        <div
            style="
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            "
        >
            <div
                style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                "
            >
                <p>
                    Showing {{ pageSize2 * (currentPage2 - 1) + 1 }} to
                    {{ pageSize2 }} of {{ total }} rows entries
                </p>
            </div>
            <el-pagination
                v-model:current-page="currentPage2"
                @current-change="getData"
                :small="false"
                v-model:page-size="pageSize2"
                :background="true"
                layout="prev, pager, next"
                :total="total"
            />
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, inject, getCurrentInstance } from "vue";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";

const pageSize2 = ref(10);
const currentPage2 = ref(1);
const searchValue = ref("");
const total = ref(0);
const router = useRouter();
const { proxy } = getCurrentInstance();

let newsList = ref([]);
const goNext = (res, row) => {
    console.log(res, "resresresresres");
    const url = router.resolve({
        name: res,
        // query: res.organism_id,
        // params: {
        //     id: 100,
        // },
        query: {
            // idrow: res.id,
            id: row.id,
        },
    });
    window.open(url.href, "_blank");
};
const pageSizeChange = () => {
    getData();
};
const searchInput = () => {
    currentPage2.value = 1;
    getData();
};
const getData = () => {
    // const $util: () =>inject(TEST_SYMBOL)
    // console.log(proxy.$util, "$util$util");
    proxy.util.post(
        proxy.api.genomeList,
        {
            page: currentPage2.value,
            size: pageSize2.value,
            query: searchValue.value,
        },
        (resp) => {
            console.log(resp);
            newsList.value = resp.dataList;
            total.value = resp.count;
        },
        (err) => {
            console.log(err);
        }
    );
};
onMounted(() => {
    getData();
});
</script>
<style lang="less" scoped>
.newsWraper {
    width: 80vw;
    margin: 0 auto;
}
</style>