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
            <h3>Browse RNA-Seq data through JBrowse</h3>
            <p><a href="/jbrowse/?data=data/json/6041901&tracks=DNA,genes&" target="_blank">
                Reference genome: Castanea mollissima cv. HBY-2 [Chinese chestnut ]</a></p>
            <p><a href="/jbrowse/?data=data/json/6041904&tracks=DNA,genes&" target="_blank">
                Reference genome: Castanea mollissima cv. Vanuxem [Chinese chestnut (Vanuxem)]</a></p>
            <p><a href="/jbrowse/?data=data/json/6041903&tracks=DNA,genes&" target="_blank">
                Reference genome: Castanea mollissima cv. Sun [Chinese chestnut (Sun)]</a></p>
            <p><a href="/jbrowse/?data=data/json/6041902&tracks=DNA,genes&" target="_blank">
                Reference genome: Castanea mollissima cv. N11-1 [Chinese chestnut (N11-1)]</a></p>
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
</script>
<style lang="less" scoped>
</style>