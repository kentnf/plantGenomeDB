<template>
    <div class="contentWraper">
        <h3>Search</h3>
        <hr />

        <div class="search-container">
            <el-select v-model="genomeId" placeholder="Select genome" class="select-box search-common">
                <el-option
                    v-for="item in genomesList"
                    :key="item.id "
                    :label="item.sname"
                    :value="item.id"
                />
            </el-select>
            <el-autocomplete
                v-model="searchKey"
                filterable
                remote
                reserve-keyword
                placeholder="Enter keyword"
                :loading="loading"
                :fetch-suggestions="remoteMethod"
                value-key="name"
                :trigger-on-focus="false"
                :min-chars="3"
                class="search-common"
                popper-class="el-autocomplete-suggestion"
                :popper-append-to-body="false"
            ></el-autocomplete>
            <el-button @click="goSsearch" icon="Search" circle class="search-button search-common"></el-button>
        </div>
        <div class="keyword-links">
            Examples: 
            <a href="#" @click.prevent="setKeyword(siteConfig.searchExampleGene, siteConfig.searchExampleID)">{{ siteConfig.searchExampleGene }}</a>, 
            <a href="#" @click.prevent="setKeyword('Ethylene-insensitive protein 2', siteConfig.searchExampleID)">Ethylene-insensitive protein 2</a>, 
            <a href="#" @click.prevent="setKeyword('GO:0000160', siteConfig.searchExampleID)">GO:0000160</a>, 
            <a href="#" @click.prevent="setKeyword('IPR001046',siteConfig.searchExampleID)">IPR001046</a>, 
            <a href="#" @click.prevent="setKeyword('WRKY', siteConfig.searchExampleID)">WRKY</a>, 
            <a href="#" @click.prevent="setKeyword('ETR2', siteConfig.searchExampleID)">ETR2</a>
        </div>

        <div v-if="tableData.length > 0">
        <h3>Result</h3>
        <hr />
            <div class="title" style="margin-top: 20px">
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%; margin: 0 auto"
                    :header-cell-style="{
                        color: '#000',
                    }"
                >
                    <el-table-column prop="Genome" label="Genome">
                        <template #default="scope">
                            <el-link
                                type="primary"
                                :underline="false"
                                target="_blank"
                                @click="cellClick(scope.row)"
                            >
                                <!-- {{ scope.row.Genome }} -->
                                {{ scope.row.genus }}
                                {{ scope.row.species }} ({{
                                    scope.row.common_name
                                }})
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="Gene" width="180" label="Gene">
                        <template #default="scope">
                            <el-link
                                type="primary"
                                :underline="false"
                                target="_blank"
                                @click="geneInfo(scope.row)"
                            >
                                {{ scope.row.gene_id }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="Transcript"
                        width="180"
                        label="Transcript "
                    >
                        <template #default="scope">
                            <el-link
                                type="primary"
                                :underline="false"
                                target="_blank"
                                @click="goTranscript(scope.row)"
                            >
                                {{ scope.row.transcript_id }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="Position" label="Position">
                        <template #default="scope">
                            {{ scope.row.chrom }}:{{ scope.row.start }}-{{
                                scope.row.stop
                            }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="Description"
                        width="180"
                        label="Description"
                    >
                        <template #default="scope">
                            <el-link
                                type="success"
                                :underline="false"
                                target="_blank"
                            >
                                {{ scope.row.description }}
                            </el-link>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { ElAutocomplete, ElButton } from 'element-plus';
// import { Search } from "@element-plus/icons-vue";
const router = useRouter();
import { useStore } from "vuex";
const store = useStore();
const { proxy } = getCurrentInstance();

import { inject } from 'vue';
const siteConfig = inject('siteConfig');


const genomeId = ref('');
const searchKey = ref([]);
const tableData = ref([]);

let genomesList = ref([]);
genomesList.value = store.state.navconfigData;

// autocomplete searching keyword
// api: searchData : /api/v1/search/data
const loading = ref(false);
const remoteMethod = (query) => {
  if (query) {
    return new Promise((resolve, reject) => {
      loading.value = true;
      proxy.util.post(
        proxy.api.searchData,
        {
          keyword: query,
          organism_id: genomeId.value * 1, 
        },
        (resp) => {
          //console.log(resp, 'resp');
          loading.value = false;
          resolve(resp);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  } else {
    return new Promise(resolve => {
      resolve([]);
    });
  }
};

const setKeyword = (keyword, gid) => {
    searchKey.value = keyword;
    genomeId.value = gid;
};

// search data 
// api: ssearch: /api/v1/search/ssearch
const goSsearch = (res) => {
    // console.log(genomeId.value, searchKey.value, 'search params');
    if (!genomeId.value || !searchKey.value) {
        return;
    }
    proxy.util.post(
        proxy.api.ssearch,
        {
            query: searchKey.value,
            organism_id: genomeId.value * 1,
        },
        (resp) => {
            console.log(resp, 'searchResp');
            tableData.value = resp.posts;

            // loading.value = false;
            // options.value = resp;
        },
        (err) => {
            console.log(err);
        }
    );
};

const goTranscript = (res) => {
    const url = router.resolve({
        name: "Transcript",
        query: {
            id: res.organism_id,
            gene_id: res.transcript_id,
        },
    });
    //window.open(url.href, "_blank");
    window.location.href = url.href;
};
const geneInfo = (res) => {
    const url = router.resolve({
        name: "GeneInfo",
        query: {
            id: res.organism_id,
            gene_id: res.gene_id,
        },
    });
    window.location.href = url.href;
};
const cellClick = (res) => {
    const url = router.resolve({
        name: "genomeInfo",
        query: {
            id: res.organism_id,
        },
    });
    window.location.href = url.href;
};

// should get data from nav
//onMounted(() => {
    // genomesList.value = store.state.navconfigData;
//});
</script>
<style lang="less" scoped>
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.keyword-links {
    margin-top: 15px;
    text-align: center;
}
.search-common {
  border-radius: 0;
  background-color: var(--primary-color);
  color: #fff;
  margin-right: 0px;
}
.select-box {
  width:300px;
}
:deep(.el-autocomplete .el-input__inner) {
    width: 600px;
}
.search-button {
   color:#fff;
}
</style>