<template>
    <div class="genomeInfoWraper">
        <h3>Transcript: {{ query.transcript.transcript_id }}</h3>
        <h5>
            Gene:
            <a @click="goGenome('GeneInfo')" target="_blank"
                >{{ query.gene.gene_id }}
            </a>
        </h5>
        <el-divider />
        <el-descriptions title="" :column="1">
            <el-descriptions-item
                label-class-name="my-label"
                class-name="my-content"
                label="Plant name"
            >
                <el-link
                    @click="goGenome('genomeInfo')"
                    :underline="false"
                    target="_blank"
                    type="primary"
                >
                    {{ query.organism?.scientific_name }} ({{
                        query.organism?.common_name
                    }})
                </el-link>
            </el-descriptions-item>
            <el-descriptions-item
                label-class-name="my-label"
                class-name="my-content"
                label="Genus"
            >
                {{ query.organism.genus }}
            </el-descriptions-item>
            <el-descriptions-item
                label-class-name="my-label"
                class-name="my-content"
                label="Species"
            >
                {{ query.organism.species }}
            </el-descriptions-item>
            <el-descriptions-item
                label-class-name="my-label"
                class-name="my-content"
                label="Gene ID"
            >
                <el-link
                    @click="goGenome('GeneInfo')"
                    :underline="false"
                    target="_blank"
                    type="primary"
                    >{{ query.gene.gene_id }}
                </el-link>
            </el-descriptions-item>
            <el-descriptions-item
                label-class-name="my-label"
                class-name="my-content"
                label="Description"
            >
                {{ query.transcript.description }}
            </el-descriptions-item>
            <el-descriptions-item
                label-class-name="my-label"
                class-name="my-content"
                label="Location"
            >
                {{ query.gene.chrom }}:{{ query.gene.start - 1 }}-{{
                    query.gene.stop - 1
                }}
            </el-descriptions-item>
            <el-descriptions-item
                label-class-name="my-label"
                class-name="my-content"
                label="Strand"
            >
                (+)
            </el-descriptions-item>
            <el-descriptions-item
                label-class-name="my-label"
                class-name="my-content"
                :label="`Transcripts(${query.transcripts_in_gene.length})`"
            >
                <span
                    v-for="(transcript, i) in query.transcripts_in_gene"
                    :key="i"
                >
                    <el-link :underline="false" target="_blank" type="primary">
                        {{ transcript.transcript_id }}
                        <span
                            v-if="
                                transcript.transcript_id ==
                                query.gene.canonical_transcript
                            "
                        >
                            *
                        </span>
                    </el-link>
                </span>
                <!-- <el-link
                    @click="goGenome('Transcript')"
                    :underline="false"
                    target="_blank"
                    type="primary"
                    >Solyc01g160010.1.1 *
                </el-link> -->
            </el-descriptions-item>
        </el-descriptions>
        <h4><b>Gene Structure</b></h4>
        <div id="struc_view"></div>
        <h4>
            <b>Sequences related to gene Solyc01g160010.1</b>
        </h4>
        <el-collapse v-model="activeNames" accordion>
            <el-collapse-item title="mRNA sequence" name="mRNA sequence">
                <div
                    style="
                        word-break: break-all;
                        font-family: 'Lucida Console', Monaco, monospace;
                    "
                >
                    {{ query.transcript?.mrna_seq }}
                </div>
            </el-collapse-item>
            <el-collapse-item
                title="Coding sequence (CDS)"
                name="Coding sequence (CDS)"
            >
                <div
                    style="
                        word-break: break-all;
                        font-family: 'Lucida Console', Monaco, monospace;
                    "
                >
                    {{ query.transcript?.cds_seq }}
                </div>
            </el-collapse-item>
            <el-collapse-item title="Protein sequence" name="Protein sequence">
                <div
                    style="
                        word-break: break-all;
                        font-family: 'Lucida Console', Monaco, monospace;
                    "
                >
                    {{ query.transcript?.pep_seq }}
                </div>
            </el-collapse-item>
        </el-collapse>
        <div v-for="record in query.fa_blast" :key="record.database">
            <h4>
                <b
                    >BLAST of Solyc01g160010.1.1 vs.
                    {{ record.database }} Database</b
                >
            </h4>
            <div :id="`fa_blast_${record.database}_view`"></div>
            <el-table :data="record.hits" stripe>
                <el-table-column prop="Hit_accession" label="Accession">
                    <template #default="scope">
                        <el-link
                            :href="`https://www.ncbi.nlm.nih.gov/protein/${scope.row.Hit_accession}`"
                            target="_blank"
                            :underline="false"
                            type="primary"
                            v-if="record.database == 'nr'"
                        >
                            {{ scope.row.Hit_accession }}
                        </el-link>
                        <el-link
                            :href="`https://www.uniprot.org/uniprot/${scope.row.Hit_accession}`"
                            target="_blank"
                            :underline="false"
                            type="primary"
                            v-else-if="
                                record.database == 'TrEMBL' ||
                                record.database == 'Swiss-Prot'
                            "
                        >
                            {{ scope.row.Hit_accession }}
                        </el-link>

                        <el-link
                            :href="`https://www.arabidopsis.org/servlets/Search?type=general&search_action=detail&method=1&show_obsolete=F&name=${scope.row.Hit_accession}&sub_type=gene&SEARCH_EXACT=4&SEARCH_CONTAINS=1`"
                            target="_blank"
                            :underline="false"
                            type="primary"
                            v-else-if="record.database == 'TAIR'"
                        >
                            {{ scope.row.Hit_accession }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="Hit_def" label="Description">
                </el-table-column>
                <el-table-column prop="" label="E-value">
                    <template #default="scope">
                        {{ scope.row.Hit_hsps.Hsp.Hsp_evalue }}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="Identity">
                    <template #default="scope">
                        {{ scope.row.Hit_hsps.Hsp.Hsp_identity }}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="Alignment">
                    <template #default="scope">
                        <el-link
                            :underline="false"
                            type="primary"
                            @click="openDialogVisible(record, scope.row)"
                            >Show</el-link
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <h4><b>Functional Domains (InterPro)</b></h4>
        <div id="fa_ipr_view"></div>

        <el-table :data="query.fa_ipr[0]?.matches_format" stripe>
            <el-table-column prop="ipr_term" label="IPR Term">
                <template #default="scope">
                    <el-link
                        :href="`https://www.ebi.ac.uk/interpro/entry/${scope.row.ipr_term}`"
                        target="_blank"
                        :underline="false"
                        type="primary"
                        v-if="scope.row.ipr_term != 'None'"
                    >
                        {{ scope.row.ipr_term }}
                    </el-link>
                    <span v-else>
                        {{ scope.row.ipr_term }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="ipr_desc" label="IPR Description">
            </el-table-column>
            <el-table-column prop="source_lib" label="Source">
                <template #default="scope">
                    <el-link
                        :href="sourceUrlConfig[scope.row.source_lib]"
                        target="_blank"
                        :underline="false"
                        type="primary"
                        v-if="sourceUrlConfig[scope.row.source_lib]"
                    >
                        {{ scope.row.source_lib }}
                    </el-link>
                    <span v-else>
                        {{ scope.row.source_lib }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="source_term" label="Source Term">
                <template #default="scope">
                    <el-link
                        :href="
                            sourceUrlConfig[scope.row.source_term] +
                            scope.row.source_term
                        "
                        target="_blank"
                        :underline="false"
                        type="primary"
                        v-if="sourceTermUrlConfig[scope.row.source_lib]"
                    >
                        {{ scope.row.source_term }}
                    </el-link>
                    <span v-else>
                        {{ scope.row.source_term }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="source_desc"
                label="Source Name (Description)"
            >
                <template #default="scope">
                    <span>
                        {{ scope.row.source_name }} <br />
                        {{ scope.row.source_desc }} <br />
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="location" label="Location">
                <template #default="scope">
                    <div v-for="loc in scope.row.location" :key="loc.evalue">
                        coord: {{ loc.start }}...{{ loc.end }}
                        <span v-if="loc.evalue">
                            e-value: {{ loc.evalue }}
                        </span>
                        <br />
                        <span v-if="loc.score"> score: {{ loc.score }} </span>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
            v-model="dialogVisible"
            :title="`BLAST of Solyc01g102750.3.1 vs. ${dialogContent.database}`"
            width="50%"
        >
            <div class="modal-body">
                <br />Match: {{ hit.Hit_accession }} ({{ hit.Hit_def }})<br />
                <br /><b>HSP</b> Score: {{ hit.Hit_hsps.Hsp.Hsp_score }}, Expect
                = {{ hit.Hit_hsps.Hsp.Hsp_evalue }} Identity =
                {{ hit.Hit_hsps.Hsp.Hsp_identity }}, Postives =
                {{ hit.Hit_hsps.Hsp.Hsp_positive }}<br />
                <pre>
                    <br>Query: {{ hit.Hit_hsps.Hsp.Hsp_qseq }} 
                    <br>       {{ hit.Hit_hsps.Hsp.Hsp_midline }} 
                    <br>Sbjct: {{ hit.Hit_hsps.Hsp.Hsp_hseq }} 
                </pre>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">
                        Close
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div> 
</template>
<script setup>
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
import { ref, onMounted, reactive, getCurrentInstance } from "vue";
import $ from "jquery";
const { proxy } = getCurrentInstance();


const router = useRouter();
const activeNames = ref("");
const goGenome = (res) => {
    const url = router.resolve({
        name: res,
        query: {
            id: organism_id.value,
            gene_id: gene_id.value,
        },
    });
    window.open(url.href, "_blank");
};

let organism_id = ref("");
let gene_id = ref("");
let query = reactive({
    gene: {},
    transcript: {},
    fa_blast: [],
    fa_ipr: [],
    fa_go: [],
    fa_family: [],
    exp: {},
    paralogs: [],
    orthologs: [],
    variants_in_transcript: [],
    transcripts_in_gene: [],
    coverage_stats: {},
    cnvs: {},
    cnvgenes: {},
    organism: {},
});

let dialogVisible = ref(false);
let hit = ref({});
let dialogContent = ref({});
let sourceUrlConfig = ref({
    PFAM: "http://pfam.xfam.org/",
    SMART: "http://smart.embl-heidelberg.de/",
    GENE3D: "http://www.cathdb.info/",
    PANTHER: "http://pantherdb.org/",
    PROSITE: "https://prosite.expasy.org/",
    SUPERFAMILY: "http://www.supfam.org/SUPERFAMILY/",
    PRINTS: "http://130.88.97.239/PRINTS/",
    CDD: "https://www.ncbi.nlm.nih.gov/cdd/",
});
let sourceTermUrlConfig = ref({
    PFAM: "http://pfam.xfam.org/family/",
    SMART: "http://smart.embl-heidelberg.de/smart/do_annotation.pl?BLAST=DUMMY&DOMAIN=",
    GENE3D: "http://www.cathdb.info/version/latest/superfamily/",
    PANTHER: "http://pantherdb.org/panther/family.do?clsAccession=",
    PROSITE: "https://prosite.expasy.org/cgi-bin/prosite/prosite-search-ac?",
    SUPERFAMILY: "http://www.supfam.org/SUPERFAMILY/cgi-bin/scop.cgi?sunid=",
    PRINTS: "http://130.88.97.239/PRINTS/?ss=",
    CDD: "https://www.ncbi.nlm.nih.gov/cdd/?ss=",
});
const openDialogVisible = (res, row) => {
    console.log(res);
    dialogContent.value = res;
    hit.value = row;
    dialogVisible.value = true;
};

const testvars = ref([]);

onMounted(() => {
    const router = useRoute();
    organism_id.value = router.query.id * 1;
    gene_id.value = router.query.gene_id;

    proxy.util.post(
        proxy.api.transcriptInfo,
        {
            organism_id: router.query.id * 1,
            transcript_id: router.query.gene_id,
        },
        (resp) => {            
            query.gene = resp.gene;
            query.transcript = resp.transcript;
            query.fa_blast = resp.fa_blast;
            query.fa_ipr = resp.fa_ipr;
            query.fa_go = resp.fa_go;
            query.fa_family = resp.fa_family;
            query.exp = resp.exp;
            query.paralogs = resp.paralogs;
            query.orthologs = resp.orthologs;
            query.variants_in_transcript = resp.variants_in_transcript;
            query.transcripts_in_gene = resp.transcripts_in_gene;
            query.coverage_stats = resp.coverage_stats;
            query.cnvs = resp.cnvs;
            query.cnvgenes = resp.cnvgenes;
            query.organism = resp.organism;
            console.log(resp, "resprespresp");

            var options = {
                showAxis: true,
                showSequence: true,
                brushActive: true,
                toolbar: true,
                bubbleHelp: true,
                zoomMax: 20,
            };
            var gene = resp.gene;
            var transcript = resp.transcript;
            var fa_ipr = resp.fa_ipr;
            var fa_blast = resp.fa_blast;
            // var fa_ipr=resp.fa_ipr
            // var fa_ipr=resp.fa_ipr

            /* structure */
            /* only has exon, no UTR region, using gene sequence next version */
            var struc = new FeatureViewer(
                gene.stop - gene.start + 1 + 300,
                "#struc_view",
                options
            );
            var locations = new Array();
            var tstart = transcript.start;

            if (transcript.exons.length > 0) {
                for (var n in transcript.exons) {
                    var feature = transcript.exons[n];
                    if (feature.feature_type == "exon") {
                        var fstart = feature.start - tstart + 1 + 150;
                        var fstop = feature.stop - tstart + 1 + 150;
                        locations.push({ x: fstart, y: fstop });
                    }
                }
            } else {
                for (var n in transcript.cds) {
                    var feature = transcript.cds[n];
                    if (feature.feature_type == "CDS") {
                        var fstart = feature.start - tstart + 1 + 150;
                        var fstop = feature.stop - tstart + 1 + 150;
                        locations.push({ x: fstart, y: fstop });
                    }
                }
            }

            struc.addFeature({
                data: locations,
                name: transcript.transcript_id + " ",
                className: "transcript_id",
                color: "#ADD8E6",
                type: "rect",
            });

            /* functional annotation */
            /* InterPro */
            if (fa_ipr.length > 0) {
                var ipr = new FeatureViewer(
                    transcript.pep_seq,
                    "#fa_ipr_view",
                    options
                );
                var matches = fa_ipr[0].matches_format;
                for (var n in matches) {
                    //console.log(matches[n])
                    var locations = new Array();
                    for (var m in matches[n].location) {
                        var loc = matches[n].location[m];
                        var desc = "";
                        if (loc.evalue) {
                            desc += "E-value:" + loc.evalue + "; ";
                        }
                        if (loc.score) {
                            desc += "Score:" + loc.score + " ";
                        }
                        locations.push({
                            x: loc.start,
                            y: loc.end,
                            description: desc,
                        });
                    }
                    var term = matches[n]["ipr_term"];
                    if (matches[n].ipr_term == "None") {
                        // Error when use source_term
                        term = matches[n]["source_term"];
                    }
                    ipr.addFeature({
                        data: locations,
                        name: term + " ",
                        className: "term",
                        color: "#ADD8E6",
                        type: "rect",
                    });
                }
            }
            /* end InterPro*/

            /* BLAST */
            setTimeout(() => {
                if (fa_blast.length > 0) {
                    for (var n in fa_blast) {
                        var db = fa_blast[n].database;
                        var div = "#fa_blast_" + db + "_view";
                        var blast = new FeatureViewer(
                            transcript.pep_seq,
                            div,
                            options
                        );

                        for (var m in fa_blast[n].hits) {
                            var locations = new Array();
                            for (var k in fa_blast[n].hits[m].Hit_hsps) {
                                var hsp = fa_blast[n].hits[m].Hit_hsps[k];
                                var desc =
                                    "E-value:" +
                                    hsp.Hsp_evalue +
                                    "; Identity:" +
                                    hsp.Hsp_identity;
                                locations.push({
                                    x: hsp["Hsp_query-from"],
                                    y: hsp["Hsp_query-to"],
                                    description: desc,
                                });
                            }
                            var accession = fa_blast[n].hits[m].Hit_accession;
                            blast.addFeature({
                                data: locations,
                                name: accession + " ",
                                className: "accession",
                                color: "#ADD8E6",
                                type: "rect",
                            });
                            //console.log(fa_blast[n].hits[m])
                        }
                    }
                }
                $("html").css({
                    opacity: "1",
                });
            }, 100);

            /* end BLAST */
        }
    );
});

</script>

<style lang="less" scoped>
.genomeInfoWraper {
    width: 80vw;
    margin: 0 auto;
    /deep/ .el-descriptions__cell {
        padding-bottom: 0 !important;
        display: flex;
    }
    /deep/ .my-label {
        margin-left: 20px !important;
        font-weight: bold;
        display: inline-block;
        width: 200px !important;
        text-align: right;
        flex: none;
    }
}
</style>