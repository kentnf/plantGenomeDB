<template>
    <div class="common-layout">
        <el-container>
            <el-header class="Header">
                <el-row class="center-row">
                    <el-col :span="24">
                     <div class="menu-container">
                        <el-menu
                            :default-active="activeIndex"
                            class="el-menu-demo"
                            mode="horizontal"
                            :ellipsis="false"
                            @select="handleSelect"
                            active-text-color="#ffd04b"
                        >
                        <el-menu-item index="1">
                            <router-link to="/">Home</router-link>
                        </el-menu-item>
                        <el-sub-menu index="2" popper-class="popperClass">
                            <template #title>Genomes</template>
                            <el-menu-item
                                v-for="(item, i) in navconfig"
                                :key="i"
                                :index="'2-' + i"
                                @click="goGenomePage(item)"
                            >
                                {{ item.cname }}
                            </el-menu-item>
                        </el-sub-menu>
                        <el-menu-item index="3">
                            <router-link to="/tools/search">Search</router-link>
                        </el-menu-item>
                        <el-sub-menu index="4" popper-class="popperClass">
                            <template #title>Browser</template>
                            <el-menu-item
                                v-for="(item, i) in navconfig"
                                :index="'4-' + i"
                                @click="goBrowsePage(item)"
                            >
                                {{ item.cname }}
                            </el-menu-item>
                        </el-sub-menu>
                        <el-menu-item index="5">
                            <router-link to="/TranscriptionFactors">Transcription Factors</router-link>
                        </el-menu-item>
                        <el-menu-item index="6">
                            <router-link to="/tools/variants">Variants</router-link>
                        </el-menu-item>
                        <el-menu-item index="7">
                            <router-link to="/tools/rnaseq">RNA-Seq</router-link>
                        </el-menu-item>
                        <el-sub-menu index="8"  popper-class="popperClass">
                            <template #title>Tools</template>
                            <el-menu-item index="8-1">
                                <router-link to="/tools/blast" class="submenu-link">BLAST</router-link>
                            </el-menu-item>
                            <el-menu-item index="8-2">
                                <router-link to="/tools/batchquery" class="submenu-link">Batch Query</router-link>
                            </el-menu-item>
                            <el-menu-item index="8-3">
                                <router-link to="/tools/go/enrich" class="submenu-link">GO Enrichment</router-link>
                            </el-menu-item>
                            <el-menu-item index="8-4">
                                <router-link to="/tools/kegg/enrich" class="submenu-link">KEGG Enrichment</router-link>
                            </el-menu-item>

                            <el-menu-item index="8-6">
                                <router-link to="/tools/synteny" class="submenu-link">Synteny Viewer</router-link>
                            </el-menu-item>
                            <el-menu-item index="8-7">
                                <router-link to="/tools/download" class="submenu-link">Download</router-link>
                            </el-menu-item>
                        </el-sub-menu>
                        <el-menu-item index="9">
                            <router-link to="/contact">Contact Us</router-link>
                        </el-menu-item>
                    </el-menu>
                    </div>
                    </el-col>
                </el-row>
            </el-header>

            <el-main class="mainContainer">
                <router-view />
            </el-main>
            <el-footer class="footer">
                <hr />
                <el-row class="center-row">
                    <el-col :span="12">
                        <b>{{ siteConfig.siteName }}</b> is developed by <span v-html="labInfo"></span> and
                        <a href="http://lab.moilab.net" target="_blank"
                            >MOI Lab</a
                        >
                        <br />
                        The genomic data on this website are supported by
                        <a href="http://hort.moilab.net" target="_blank"
                            >HortGenome Search Engine API</a
                        >
                        <br />This website is compatible with
                        <a href="https://www.microsoft.com/edge" target="blank"
                            >Edge</a
                        >,
                        <a href="https://www.google.com/chrome" target="_blank"
                            >Chrome</a
                        >
                        and
                        <a
                            href="https://www.mozilla.org/en-US/firefox/new"
                            target="_blank"
                            >Firefox</a
                        >
                        <p>
                            <a href="http://beian.miit.gov.cn" target="_blank"
                                >{{ siteConfig.beian }}</a
                            >
                            |
                            <a
                                href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011402010612"
                                target="_blank"
                                >{{ siteConfig.gongan }}</a
                            >
                        </p>
                        <!--/div-->
                    </el-col>
                    <el-col :span="8">
                        <img src="./assets/images/nsfc_logo.jpg" width="180" />
                        &nbsp;
                        <img
                            src="./assets/images/moilab_logo.png"
                            width="100"
                        />
                    </el-col>
                </el-row>
            </el-footer>
        </el-container>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, getCurrentInstance } from "vue";
import {
    useRoute,
    onBeforeRouteUpdate,
    useRouter,
    onBeforeRouteLeave,
} from "vue-router";
import { useStore } from "vuex";
import { inject } from 'vue';

const siteConfig = inject('siteConfig');

let labInfo = siteConfig.labs.map(lab => {
    return `<a href="${lab.url}" target="_blank">${lab.name}</a>`;
}).join(', ');

const { proxy } = getCurrentInstance();

const handleOpen = (key, keyPath) => {
    console.log(key, keyPath);
};

const handleClose = (key, keyPath) => {
    console.log(key, keyPath);
};

const route = useRoute();
const router = useRouter();


let userId = ref();
let activeIndex = ref("1");
const handleSelect = (res) => {};

let currentRoute = ref("");
const store = useStore();

let navconfig = ref([]);

onMounted(() => {
    document.title = siteConfig.siteName;
    setTimeout(() => {
        proxy.util.post(
            proxy.api.speciesGenome,
            {
                // remove this id in production server
                // change this id for development server
                site_id: siteConfig.siteID,
            },
            (resp) => {
                // console.log(resp, 'api.speciesGenome');
                resp.forEach((element) => {
                    element.text = element.cname;
                });
                navconfig.value = resp;

                // set the navconfig global 
                store.dispatch("navconfigDataAction", {
                    data: resp,
                });
            },
            (err) => {
                console.log(err);
            }
        );
    }, 0);
});

watch(
    () => router.currentRoute.value.name,
    (newValue, oldValue) => {
        //console.log("watch", newValue);
        currentRoute.value = newValue;
    },
    { immediate: true }
);

const goGenomePage = (v) => {
    const url = router.resolve({
        name: "genomeInfo",
        query: {
            id: v.id,
        },
    });
    // window.open(url.href);
    window.location.href = url.href;
};

const goBrowsePage = (v) => {
    const url = router.resolve({
        name: "tools-browse",
        query: {
            id: v.id,
        },
    });
    window.location.href = url.href;
};

const openOutLink = (res) => {
    window.open(res, "_blank");
};
</script>

<style lang="less" scoped>
.center-row {
    display: flex;
    justify-content: center;
    align-items: center;
}

.menu-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.submenu-link {
  color: #000; /* 链接颜色 */
  text-decoration: none; /* 去掉下划线 */
}


.common-layout {
    .Header {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background: var(--primary-color);
        .el-menu--horizontal {
            border: none;
        }
    }
    .mainContainer {
        min-height: calc(100vh - 215px);
    }
    .popperClass {
        background: var(--secondary-color);
    }
    .el-menu--horizontal {
        background: none;
    }
    /* el-menu-item is for menu without sub-menu */
    .el-menu-item {
        color: #fff !important;
        background: none !important;
    }
    /* below is for menu with sub-menu */
    :deep(.el-menu--horizontal .el-sub-menu .el-sub-menu__title) {
        background: none !important;
        color: #fff !important;
    }
    /* below is for menu with sub-menu when mouse over */
    :deep(.el-menu--horizontal .el-sub-menu .el-sub-menu__title:hover) {
        background: #fff !important;
        color: var(--primary-color) !important;
    }
    .footer {
        background: #fff;
        height: 155px;
    }
    .active {
        font-size: 20px;
    }
}
body :deep(.popperClass) {
    .el-menu--popup {
        background: var(--el-color-black);
    }
}
.flex-grow {
    flex-grow: 1;
}
</style>
