import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [{
    path: '/',
    name: 'home',
    component: HomeView
},{
    // genomeInfo
    path: '/genomeInfo',
    name: 'genomeInfo',
    component: () =>
        import('../views/genomeInfo.vue')
}, {
    path: '/TranscriptionFactors',
    name: 'TranscriptionFactors',
    component: () =>
        import('../views/TranscriptionFactors.vue')
}, {
    path: '/tools/search',
    name: 'Search',
    component: () =>
        import('../views/Search.vue')
}, {
    path: '/FamilyList',
    name: 'FamilyList',
    component: () =>
        import('../views/FamilyList.vue')
}, {
    path: '/GeneInfo',
    name: 'GeneInfo',
    component: () =>
        import('../views/GeneInfo.vue')
}, {
    path: '/Transcript',
    name: 'Transcript',
    component: () =>
        import('../views/Transcript.vue')
}, {
    path: '/news',
    name: 'news',
    component: () =>
        import('../views/news.vue')
}, {
    path: '/tools/batchquery',
    name: 'Batchq',
    component: () =>
        import('../views/Batchq.vue')
}, {
    path: '/tools/go/enrich',
    name: 'goHomepage',
    component: () =>
        import('../views/go_homepage.vue')
}, {
    path: '/goresult',
    name: 'goresult',
    component: () =>
        import('../views/goresult.vue')
}, {
    path: '/pathwayResult/:types/:uid',
    name: 'pathwayResult',
    component: () =>
        import('../views/pathwayResult.vue')
}, {
    path: '/syntenyResult/:genomes/:blockname',
    name: 'syntenyResult',
    component: () =>
        import('../views/syntenyResult.vue')
}, {
    path: '/syntenyBlock/:genomes/:blockname',
    name: 'syntenyBlock',
    component: () =>
        import('../views/syntenyBlock.vue')
}, {
    path: '/tools/kegg/enrich',
    name: 'pathwayHomePage',
    component: () =>
    import('../views/pathway_homePage.vue')
}, {
    path: '/tools/synteny',
    name: 'tools-synteny',
    component: () =>
    import('../views/synteny.vue')
}, {
    path: '/tools/rnaseq',
    name: 'tools-rnaseq',
    component: () =>
    import('../views/rnaseq.vue')
}, {
    path: '/tools/variants',
    name: 'tools-variants',
    component: () =>
    import('../views/variants.vue')
}, {
    path: '/tools/browse',
    name: 'tools-browse',
    component: () =>
    import('../views/browse.vue')
}, {
    path: '/tools/download',
    name: 'tools-download',
    component: () =>
    import('../views/download.vue')
}, {
        path: '/tools/blast',
        name: 'tools-blast',
        component: () =>
        import('../views/blast.vue')
}, {
    path: '/contact',
    name: 'contact',
    component: () =>
        import('../views/contact.vue')
},
{
    path: '/faq',
    name: 'faq',
    component: () =>
        import('../views/faq.vue')
},]

const router = createRouter({
    // history: createWebHistory(process.env.BASE_URL),
    // do not change it to createWebHistory, otherwise, iframe does not work 
    history: createWebHashHistory(),
    routes
})

export default router