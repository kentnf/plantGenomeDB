<template>
    <div class="contentWraper">
        <el-row>
            <el-col :span="24"> 
                <h3>Sequences and Gene Models</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Genome</th>
                        <th>Download</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in genomesList" :key="index">
                        <td width="600">{{ item.sname }} [{{ item.cname }}]</td>
                        <td><a :href="'/download/genome/' + item.id" target="_blank">download link</a></td>
                    </tr>
                    </tbody>
                </table>
                <hr />
            </el-col>

            <el-col :span="24">
                <h3>Gene Expression (RNA-Seq)</h3>
                <a href="/download/rnaseq" target="_blank">Download</a>
                <hr />
            </el-col>
            
            <el-col :span="24">
                <h3>Variants</h3>
                <a href="/download/variants" target="_blank">Download</a>
                <hr />
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import { ref } from "vue";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
import { useStore } from "vuex";
import CryptoJS from "crypto-js";
const store = useStore();
const router = useRouter();
const genomesList = store.state.navconfigData;

// do not need for browsing genome info repeatly
const goGenomePage = (v) => {
    const url = router.resolve({
        name: "genomeInfo",
        query: {
            id: v.id,
        },
    });
    window.open(url.href);
};

// not same as HSE, fix it later
const generateDownloadLink = (id) => {
    const ciphertext = CryptoJS.SHA256(id).toString();
    console.log(id, ciphertext);
}

</script>
<style lang="less" scoped>
</style>