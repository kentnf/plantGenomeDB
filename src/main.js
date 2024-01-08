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
    siteName: 'Castanea Genome Database',
    siteID: 2,
    // d for development, p for production, please change it before build
    siteMode: 'd',  
    siteURL: 'http://castaneadb.net',
    blastServer: 'http://castaneadb.net:4567/',
    jbrowseServer: 'http://castaneadb.net/jbrowse',
    downloadPath: '/download',
    beian: '京ICP备20030913号',
    gongan: '京公网安备11011402010910号',
    labs: [ {
            name: 'Xing Lab',
            pi: 'Yu Xing',
            url: 'https://zkxy.bua.edu.cn/info/1073/3580.htm',
            mail: 'xingyubua@163.com',
        },{
            name: 'Qin Lab',
            pi: 'Ling Qin',
            url: 'https://zkxy.bua.edu.cn/info/1073/3587.htm',
            mail: 'qinlingbac@126.com',
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