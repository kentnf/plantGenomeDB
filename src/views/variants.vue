<template>

    <div class="newsWraper">
    <el-row>
        <el-col :span="24">
            <h3>Method for calling variants</h3>
            <p>
                The raw resequencing reads were processed to remove adapter and low-quality sequences using Trimmomatic (Bolger, Lohse, and Usadel, 2014)
                 with the following parameters: 'ILLUMINACLIP:TruSeq3-PE-2.fa:2:30:7:1:true LEADING:3 TRAILING:3 SLIDINGWINDOW:4:20 MINLEN:100'. 
                 Then, the cleaned reads were aligned to different Castanea genomes using the BWA-MEM algorithm with the default parameters
                  (Li et al., 2013). Next, the aligned reads were processed to remove duplicated reads using the 'LocusCollector' and 'Dedup' algorithms
                   of Sentieon. The single nucleotide variants (SNVs) and small insertions and deletions (InDels) were called using the 'Haplotyper' 
                   algorithms of Sentieon software (https://www.sentieon.com/).
            </p>
            <hr />
        </el-col>
        <el-col :span="24">
            <h3>Browse variants data through JBrowse</h3>
            <p>Example for setting reference genome in main.js</p>
            <p><a :href="`/jbrowse/?data=data/json/${siteConfig.searchExampleID}&tracks=DNA,genes&`" target="_blank">
                Rference genome: {{ siteConfig.searchExampleGenome }}</a></p>
            <br>

            <p>Example for modifying templete file</p>
            <p><a href="/jbrowse/?data=data/json/356202&tracks=DNA,genes&" target="_blank">
                Reference genome: Spinacia oleracea cv. Viroflay [spinach (Viroflay)]</a></p>
            <br>

            <p>Example for using all genomes as refernce</p>
            <p v-for="(item, index) in genomesList" :key="index">
                <a :href="`/jbrowse/?data=data/json/${item.id}&tracks=DNA,genes&`" target="_blank">
                    Reference genome: {{ item.sname }} [{{ item.cname }}]
                </a>
            </p>
            <hr />

        </el-col>
        <el-col :span="24">
            <h3>Download</h3>
            <p><a href="/#/tools/download">Download variants data (vcf format)</a></p>
        </el-col>

    </el-row>
    </div>
</template>
<script setup>
/*import { ref, onMounted, reactive } from "vue";*/
import { useStore } from "vuex";
const store = useStore();
const genomesList = store.state.navconfigData;
import { inject } from 'vue';
const siteConfig = inject('siteConfig');

</script>
<style lang="less" scoped>
.newsWraper {
    width: 80vw;
    margin: 0 auto;
}
</style>