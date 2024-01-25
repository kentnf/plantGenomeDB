<template>

    <div class="contentWraper">
    <el-row>
        <el-col :span="24">
            <h3>Method for processing RNA-Seq data</h3>
            <p>
                The raw RNA-Seq reads were treated to remove adaptor and low-quality sequences using Trimmomatic (Bolger, Lohse, and Usadel, 2014). 
                Trimmed reads shorter than 80% of their initial length were removed. Then, the remaining cleaned reads were aligned against the SILVA 
                rRNA database (Quast et al., 2013) using the Bowtie program (version 1.1.2) (Langmead et al., 2009), allowing up to three mismatches. 
                The mapped reads were discarded. The resulting high-quality reads were aligned to different Castanea genomes using the STAR program 
                (Dobin et al., 2013), allowing a maximum of two mismatches. Finally, based on the alignments, the read counts of each gene were 
                calculated and normalized to fragments per kilobase of transcripts per million mapped fragments (FPKM) values.
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
            <p><a href="/#/tools/download">Download gene expression data</a></p>
        </el-col>

    </el-row>
    </div>
</template>
<script setup>
import { useStore } from "vuex";
const store = useStore();
const genomesList = store.state.navconfigData;
import { inject } from 'vue';
const siteConfig = inject('siteConfig');
</script>
<style lang="less" scoped>
</style>