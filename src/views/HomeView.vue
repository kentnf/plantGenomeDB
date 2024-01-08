<template>
    <div class="contentWraper">
        <!-- image and introduction -->
        <el-row>
            <el-col>
                <h1 class="page-header">Welcome to {{ siteConfig.siteName }}</h1>
                <div class="row">
                    <div class="col-md-5 text-center">
                        <img
                            class="center-block img-responsive"
                            src="@/assets/images/frontpage_01.jpg"
                            style="height: 350px"
                        />
                        <h4><em>Castanea mollissima</em></h4>
                    </div>
                    <div class="col-md-7 rtejustify text-left">
                        <span style="font-size: 16px">
                            The CGD (Castanea Genomics Database) is a
                            comprehensive platform for the most important
                            ecological and economic value chestnut. Data
                            available from CGD includes gene annotation, gene
                            expression, genetic molecular markers, resource of
                            comparative genomics. CGD also provided some useful
                            genomic tools online.
                        </span>
                    </div>
                    <br />
                    <br />
                    <div class="col-md-7 rtejustify text-left">
                        <span style="font-size: 16px">
                            <em>Castanea</em>, a genus of Fagaceae family, is
                            one of the important ecological and economic value
                            plants, which seven <em>Castanea</em> species, can
                            be found in East Asia (<em>C. mollissima</em>,
                            <em>C. seguinii</em>, <em>C. henryi</em> and
                            <em>C. crenata</em>), in North America (<em
                                >C. dentata</em
                            >
                            and <em>C. pumila</em>), and in Europe (<em
                                >C. sativa</em
                            >). Chestnuts play an important role in nut
                            production and forest ecosystem services. China has
                            a long history for commercial nut production of
                            Chinese chestnut and has higher biodiversity. The
                            Chinese chestnut is widely cultivated in 26
                            provinces in China, and the nut yield was 1,965,351
                            tonnes, accounting for 83.50% of the world chestnut
                            production, rank first worldwide in 2018. Due to
                            excellent nutritional quality and natural resistance
                            to pests and diseases, Chinese chestnut has been
                            used in several breeding program resistance to
                            <em>Cryphonectria parasitica</em> and
                            <em>Phytophthora cinnamomic</em>.
                        </span>
                    </div>
                </div>
            </el-col>
        </el-row>

        <!-- Tools and news -->
        <hr />
        <el-row>
            <el-col :span="11">
                <ul>
                    <h3>News</h3>
                    <li
                        v-for="(item, index) in news"
                        :key="item.date"
                        :class="{
                            'white-bg': index % 2 === 0,
                            'gray-bg': index % 2 !== 0,
                        }"
                    >
                        <p class="news-text">
                            <div v-html="item.description"></div> <b>[{{ item.date }}]</b>
                        </p>
                    </li>
                </ul>
                <p class="right-align">
                    <router-link to="/news">more...</router-link>
                </p>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="12">
                <h3>Tools</h3>
                <div class="row">
                    <div class="col-sm-9">
                        <div class="row">
                            <div class="col-sm-7">
                                <img
                                    src="@/assets/images/btn_search.png"
                                /><router-link to="/tools/search">
                                    Search Gene</router-link
                                ><br />
                                <img
                                    src="@/assets/images/btn_pwyenrich.png"
                                /><router-link to="/tools/kegg/enrich">
                                    KEGG Enrichment Analysis</router-link
                                ><br />
                                <img
                                    src="@/assets/images/btn_goenrich.png"
                                /><router-link to="/tools/go/enrich">
                                    GO Enrichment Analysis</router-link
                                >
                            </div>
                            <div class="col-sm-5">
                                <img
                                    src="@/assets/images/btn_browse.png"
                                /><router-link to="/tools/browse">
                                    Genome Browser</router-link
                                ><br />
                                <img
                                    src="@/assets/images/btn_batch.png"
                                /><router-link to="/tools/batchquery">
                                    Batch Query</router-link
                                ><br />
                                <img
                                    src="@/assets/images/btn_download.png"
                                /><router-link to="/tools/download">
                                    Download</router-link
                                >
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3 text-center">
                        <router-link to="/tools/blast" class="link">
                            <img
                                class="img-responsive"
                                src="@/assets/images/btn_blast.png"
                            />
                            BLAST
                        </router-link>
                    </div>
                </div>
            </el-col>
        </el-row>

        <hr />

        <!-- genome card -->
        <el-row class="center-row">
            <el-col :span="24">
                <h3>Genomes</h3>
            </el-col>
            <el-col
                v-for="(fit, index) in genomesList"
                :key="index"
                :xs="24"
                :sm="12"
                :md="5"
                :lg="5"
                :xl="4"
                style="margin-right: 15px; margin-top: 15px"
            >
                <el-card :body-style="{ padding: '5px' }" @click="goGenomePage(fit)">
                    <el-image
                        style="
                            width: 200px;
                            height: 200px;
                            margin: 0 auto;
                            display: block;
                            margin-top: 10px;
                        "
                        :src="BASE_URL + '/api/v1/static/images/genome/' + fit.id +  '_1.jpg'"
                    />
                    <div style="padding: 10px">
                        <p style="text-align: center">{{ fit.cname }}</p>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { desDecrypt } from "../utils/function";
import { BASE_URL } from "../utils/function";
import { useStore } from "vuex";
import { inject } from 'vue';
const siteConfig = inject('siteConfig');
const store = useStore();
const genomesList = store.state.navconfigData;

const router = useRouter();
const goGenomePage = (v) => {
    const url = router.resolve({
        name: "genomeInfo",
        query: {
            id: v.id,
        },
    });
    window.open(url.href);
};

const news = ref(null);

const fetchData = () => {
    fetch("news.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((jsonData) => {
            news.value = jsonData.announcements.slice(0, 5);
        })
        .catch((error) => {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        });
};
onMounted(fetchData);
</script>

<style lang="less" scoped>
.center-row {
    display: flex;
    justify-content: center;
    align-items: center;
}

.white-bg {
    background-color: white;
}

.gray-bg {
    background-color: #ececec;
}

li {
    border-bottom: 1px solid gray;
    list-style-type: none;
    margin-left: 0;
}
.news-text {
    padding: 10px;
}

.right-align {
    text-align: right;
}

.contentWraper {
    height: 100px;
    width: 80vw;
    margin: 0 auto;
    
    .title {
        display: flex;
        justify-content: center;
        align-items: center;
        h1 {
            font-size: 36px;
        }
    }
    .title1 {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }
    .textWraper {
        width: 50%;
        // display: inherit;
        line-height: 1.2;
        align-items: center;
        margin-top: 5px;
        i {
            margin-right: 5px;
        }
    }
}
</style>
