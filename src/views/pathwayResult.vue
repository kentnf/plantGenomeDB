<template>
    <div class="contentWraper">
        <h3>KEGG Enrichment Analysis Result</h3>
        <h4>
            Download KEGG enrichment result:
            <a @click="download">Tab-delimit format</a>
        </h4>

        <el-table :data="tableData" stripe empty-text="no match result">
            <el-table-column prop="Genome" label="Pathway name">
                <template #default="scope">
                    <el-link
                        type="primary"
                        :underline="false"
                        target="_blank"
                        :href="`https://www.genome.jp/dbget-bin/www_bget?pathway:${scope.row.Pathway_ID}`"
                    >
                        {{ scope.row.Pathway_ID }}
                        {{ scope.row.Pathway_name }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column prop="Cluster_frequency" label="Cluster frequency">
            </el-table-column>
            <el-table-column prop="Genome_frequency" label="Genome frequency">
            </el-table-column>
            <el-table-column prop="P_value" label="P-value"> </el-table-column>

            <el-table-column prop="adj_P" label="adj P"> </el-table-column>
            <el-table-column
                prop="Genes annotated to the term"
                label="Genes annotated to the term"
                width="500"
            >
                <template #default="scope">
                    <el-link
                        type="primary"
                        v-for="feature in scope.row
                            .Genes_annotated_to_the_pathway"
                        :key="feature"
                        :underline="false"
                        target="_blank"
                        @click="goGeneInfo(feature)"
                    >
                        {{ feature }},&nbsp;
                    </el-link>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, getCurrentInstance } from "vue";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
const router = useRouter();

const { proxy } = getCurrentInstance();
const tableData = ref([]);
const types = ref([]);
const uid = ref([]);
const genomeid = ref([]);
import { BASE_URL } from "../utils/function";

const goGeneInfo = (res) => {
    const url = router.resolve({
        name: "GeneInfo",
        query: {
            id: genomeid.value,
            gene_id: res,
        },
    });
    window.open(url.href, "_blank");
};
const download = (res) => {
    let url = `${BASE_URL}${proxy.api.downpway}/${types.value}/${uid.value}`;
    window.open(url, "_blank");
};
onMounted(() => {
    const router = useRoute();
    console.log(router.params, "routerrouter");
    types.value = router.params.types;
    uid.value = router.params.uid;
    proxy.util.post(
        proxy.api.pathwayResult,
        {
            uid: router.params.uid,
            types: router.params.types,
        },
        (resp) => {
            console.log(resp, "ddddd");
            tableData.value = resp.posts;
            genomeid.value = resp.genomeid;
            // geneid.value = resp.ret;
        },
        (err) => {
            console.log(err);
        }
    );
});
</script>
<style lang="less" scoped>
</style>