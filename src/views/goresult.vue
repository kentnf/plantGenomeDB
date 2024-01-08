<template>
    <div class="contentWraper">
        <h3>GO Enrichment Analysis Result</h3>
        <h4>
            Download GO enrichment result:
            <a @click="download">Tab-delimit format</a>
        </h4>

        <el-table :data="tableData" stripe empty-text="no match result">
            <el-table-column prop="Genome" label="GO term">
                <template #default="scope">
                    <el-link
                        type="primary"
                        :underline="false"
                        target="_blank"
                        :href="`http://amigo.geneontology.org/amigo/term/${scope.row.GO_ID}`"
                    >
                        {{ scope.row.GO_ID }}
                        <br />{{ scope.row.GO_term }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column prop="Category" label="Category" width="100">
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
                width="600"
            >
                <template #default="scope">
                    <el-link
                        type="primary"
                        v-for="feature in scope.row.Genes_annotated_to_the_term"
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
    let url = `${BASE_URL}${proxy.api.downgo}/${types.value}/${uid.value}`;
    window.open(url, "_blank");
};
onMounted(() => {
    const router = useRoute();
    types.value = router.query.types;
    uid.value = router.query.uid;
    proxy.util.post(
        proxy.api.goResult,
        {
            uid: router.query.uid,
            types: router.query.types,
        },
        (resp) => {
            //console.log(resp, "goResult");
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