import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import "./assets/css/style.css";
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// window.ResizeObserver = undefined;
// import "./assets/css/bootstrap.css";
import api from "./utils/api";
import util from './utils/util';

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
};

const siteConfig = {
    siteName: 'SpinachBase',
    siteID: 8,
    // d for development, p for production, please change it before build
    siteMode: 'd', 
    siteURL: 'http://spianchbase.moilab.net',
    blastServer: 'http://spinachbase.moilab.net:4567/',
    jbrowseServer: 'http://spinachbase.moilab.net/jbrowse',
    downloadPath: '/download',
    fpImgName: 'Spinacia oleracea', //front page image name 
    searchExampleGenome: 'Spinacia oleracea var. Cornell-NO.9 [spinach (Cornell-NO.9)]', // match searchExampleID
    searchExampleID: 356203, // match searchExampleGenome
    searchExampleGene: 'YY07194', // match searchExampleID, this id is genome id
    beian: '京ICP备20030913号',
    gongan: '京公网安备11011402010910号',
    labs: [ {
            name: 'Zheng Lab',
            pi: 'Yi Zheng',
            url: 'https://zkxy.bua.edu.cn/info/1073/4231.htm',
            mail: 'yz357@bua.edu.cn',
        },{
            name: 'Wang Lab',
            pi: 'Sen Wang',
            url: 'https://zkxy.bua.edu.cn/info/1073/4921.htm',
            mail: 'wangsenh@163.com',
        }
    ],
};

app.provide('siteConfig', siteConfig);
app.use(ElementPlus);
app.use(store);
app.use(router);
app.mount('#app');
app.config.globalProperties.util = util;
app.config.globalProperties.api = api;