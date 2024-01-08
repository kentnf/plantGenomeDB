<template>
    <el-main style="padding: 0 200px" class="geneinfoWraper">
        <h3>Gene: {{ gene_id }}</h3>
        <el-divider />
        <el-tabs
            v-model="activeName"
            type="border-card"
            @tab-click="tabHandleClick"
        >
            <el-tab-pane label="Overview" name="1">
                <el-descriptions :column="1">
                    <el-descriptions-item
                        label-class-name="my-label"
                        class-name="my-content"
                        label="Plant name"
                    >
                        <el-link
                            :underline="false"
                            target="_blank"
                            type="primary"
                            @click="goGenomeInfo"
                        >
                            {{ organism.scientific_name }}({{
                                organism.common_name
                            }})
                        </el-link>
                    </el-descriptions-item>
                    <el-descriptions-item
                        label-class-name="my-label"
                        class-name="my-content"
                        label="Genus"
                    >
                        {{ organism.genus }}
                    </el-descriptions-item>
                    <el-descriptions-item
                        label-class-name="my-label"
                        class-name="my-content"
                        label="Species"
                    >
                        {{ organism.species }}
                    </el-descriptions-item>
                    <el-descriptions-item
                        label-class-name="my-label"
                        class-name="my-content"
                        label="Gene ID"
                        ><el-link
                            :underline="false"
                            target="_blank"
                            type="primary"
                        >
                            {{ gene1.gene_id }}
                        </el-link>
                    </el-descriptions-item>
                    <el-descriptions-item
                        label-class-name="my-label"
                        class-name="my-content"
                        label="Description"
                    >
                        {{ transcript1.description }}
                    </el-descriptions-item>
                    <el-descriptions-item
                        label-class-name="my-label"
                        class-name="my-content"
                        label="Location"
                    >
                        {{ gene1.chrom }}:{{ gene1.start - 1 }}-{{
                            gene1.stop - 1
                        }}
                    </el-descriptions-item>
                    <el-descriptions-item
                        label-class-name="my-label"
                        class-name="my-content"
                        label="Strand"
                    >
                        ({{ gene1.strand }})
                    </el-descriptions-item>
                    <el-descriptions-item
                        label-class-name="my-label"
                        class-name="my-content"
                        :label="`Transcripts(${transcripts_in_gene.length})`"
                    >
                        <span
                            v-for="(transcript, i) in transcripts_in_gene"
                            :key="i"
                        >
                            <el-link
                                :underline="false"
                                target="_blank"
                                type="primary"
                                @click="goTranscript"
                            >
                                {{ transcript.transcript_id }}
                                <span
                                    v-if="
                                        transcript.transcript_id ==
                                        gene1.canonical_transcript
                                    "
                                >
                                    *
                                </span>
                            </el-link>
                        </span>
                    </el-descriptions-item>
                </el-descriptions>
                <h4>Gene Structure</h4>
                <div id="struc_view"></div>
            </el-tab-pane>
            <el-tab-pane label="Sequence" name="2">
                <h4>
                    <b>Sequences related to gene {{ gene_id }}</b>
                </h4>

                <el-collapse v-model="activeNames" accordion>
                    <el-collapse-item
                        :title="e.title + ' (' + e.content.length + ')'"
                        :name="e.title"
                        v-for="e in sequenceList"
                        :key="e.tittle"
                    >
                        <div
                            style="
                                word-break: break-all;
                                font-family: 'Lucida Console', Monaco, monospace;
                            "
                        >
                            {{ e.content }}
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="BLAST" name="3">
                <div v-for="record in fa_blast" :key="record.database">
                    <!-- <Blast />  -->
                    <h4>
                        <b
                            >BLAST of {{ gene_id }} vs.
                            {{ record.database }} Database</b
                        >
                    </h4>
                    <div :id="`fa_blast_${record.database}_view`"></div>
                    <el-table
                        v-if="tableData.length > 0"
                        :data="record.hits"
                        stripe
                    >
                        <el-table-column
                            width="150"
                            prop="Hit_accession"
                            label="Accession"
                        >
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
                        <el-table-column
                            width="800"
                            prop="Hit_def"
                            label="Description"
                        >
                        </el-table-column>
                        <el-table-column prop="Hit_hsps" label="E-value">
                            <template #default="scope">
                                {{ scope.row.Hit_hsps.Hsp.Hsp_evalue }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="Hit_hsps" label="Identity">
                            <template #default="scope">
                                {{ scope.row.Hit_hsps.Hsp.Hsp_identity }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="Hit_hsps" label="Alignment">
                            <template #default="scope">
                                <el-link
                                    :underline="false"
                                    type="primary"
                                    @click="
                                        openDialogVisible(record, scope.row)
                                    "
                                    >Show</el-link
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <!-- <div id="fa_blast_TAIR_view"></div> -->
            </el-tab-pane>
            <el-tab-pane label="Domain" name="4">
                <div>
                    <div id="fa_ipr_view"></div>
                    <el-table :data="fa_ipr[0]?.matches_format" stripe>
                        <el-table-column prop="ipr_term" label="IPR Term">
                        </el-table-column>
                        <el-table-column
                            prop="ipr_desc"
                            label="IPR Description"
                        >
                        </el-table-column>
                        <el-table-column prop="source_lib" label="Source">
                        </el-table-column>
                        <el-table-column prop="source_term" label="Source Term">
                        </el-table-column>
                        <el-table-column
                            prop="source_desc"
                            label="Source Name<br>(Description)"
                        >
                        </el-table-column>
                        <el-table-column prop="location" label="Location">
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Gene Ontoloty" name="5">
                <!-- Gene Ontoloty -->
                <h4><b>Gene Ontology Terms</b></h4>
                <div v-for="(item, index) in fa_go1" :key="index">
                    <b>Term:</b>
                    <el-link
                        :href="`http://amigo.geneontology.org/amigo/term/${item.term}`"
                        target="_blank"
                        :underline="false"
                        type="primary"
                    >
                        {{ item.term }}
                    </el-link>
                    &nbsp;&nbsp;&nbsp; <b>Namespace:</b>
                    {{ item.namespace }} &nbsp;&nbsp;&nbsp; <b>Name:</b>
                    {{ item.name }}
                    <br />
                </div>
                <!--<el-table :data="fa_go1" stripe>
                    <el-table-column prop="term" label="Term" width="220">
                       <template #default="scope">
                            <el-link
                                :href="`http://amigo.geneontology.org/amigo/term/${scope.row.term}`"
                                target="_blank"
                                :underline="false"
                                type="primary"
                            >
                                {{ scope.row.term }}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="Name">
                    </el-table-column>
                    <el-table-column
                        prop="namespace"
                        label="Namespace"
                        width="220"
                    >
                    </el-table-column>
                </el-table>-->
            </el-tab-pane>
            <el-tab-pane label="TFS/TRs/PKs" name="6">
                <h4><b>Gene Families</b></h4>
                <el-button
                    :key="term.type"
                    v-for="term in fa_family[0]?.family"
                    type="primary"
                    @click="goFamilyList(term.name)"
                >
                    {{ term.name }}
                    ( <span v-if="term.type == 'TF'">Transcription Factor</span>
                    <span v-else-if="term.type == 'TR'"
                        >Transcriptional Regulator</span
                    >
                    <span v-else-if="term.type == 'PK'">Protein Kinase</span>
                    <span v-else>{{ term.type }}</span
                    >)
                </el-button>
            </el-tab-pane>
            <el-tab-pane label="Homologs" name="7">
                <h4><b>Collinearity gene pairs (Paralogs)</b></h4>
                <!-- //Todo -->
                <el-table :data="paralogs" stripe>
                    <el-table-column prop="gene_id1" label="Transcript ID">
                    </el-table-column>
                    <el-table-column prop="gene_id2" label="Paralogue">
                    </el-table-column>
                    <el-table-column prop="evalue" label="E-value">
                    </el-table-column>
                    <el-table-column prop="organism_id2" label="Organism">
                    </el-table-column>

                    <el-table-column prop="block_id" label="Syntenic Block ID">
                    </el-table-column>
                </el-table>
                <h4><b>Collinearity gene pairs (Orthologs)</b></h4>
                <!-- //Todo -->
                <el-table :data="orthologs" stripe>
                    <el-table-column prop="gene_id1" label="Transcript ID">
                    </el-table-column>
                    <el-table-column prop="gene_id2" label="Orthologs">
                    </el-table-column>
                    <el-table-column prop="evalue" label="E-value">
                    </el-table-column>
                    <el-table-column prop="organism_id2" label="Organism">
                    </el-table-column>

                    <el-table-column prop="block_id" label="Syntenic Block ID">
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

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
    </el-main>
</template>
<script setup>
import { ref, onMounted, reactive, getCurrentInstance } from "vue";
import Blast from "../components/Blast.vue";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();

var transcripts_in_gene = ref([]);
var gene1 = ref({});
var transcript1 = ref([]);
var fa_blast = reactive([]);
var fa_ipr = reactive([]);
var fa_go = reactive([]);
var fa_go1 = ref({});
var fa_family = reactive([]);
var paralogs = reactive([]);
var orthologs = reactive([]);
const router = useRouter();

let organism = ref({});
const activeName = ref("1");
const activeNames = ref("");

let organism_id = ref("");
let gene_id = ref("");
const tableData = ref([
    {
        Hit_accession: "Hit_accession",
        Hit_def: "Hit_def",
    },
]);
let dialogContent = ref({});
let hit = ref({});
var gene, transcript;

let dialogVisible = ref(false);
var options = {
    showAxis: true,
    showSequence: true,
    brushActive: true,
    toolbar: true,
    bubbleHelp: true,
    zoomMax: 20,
};

const sequenceList = ref([]);
const GeneOntologyList = ref([]);

var start;
const openDialogVisible = (res, row) => {
    console.log(res);
    dialogContent.value = res;
    hit.value = row;
    dialogVisible.value = true;
};

onMounted(() => {
    const router = useRoute();
    organism_id.value = router.query.id * 1;
    gene_id.value = router.query.gene_id;

    proxy.util.post(
        proxy.api.geneInfo,
        {
            organism_id: router.query.id * 1,
            gene_id: router.query.gene_id,
        },
        (resp) => {
            transcripts_in_gene.value = resp.transcripts_in_gene;
            gene1.value = resp.gene;
            transcript1.value = resp.transcript;
            fa_blast = resp.fa_blast;
            fa_ipr = resp.fa_ipr;
            fa_go = resp.fa_go;
            fa_go1.value = resp.fa_go[0].terms;
            fa_family = resp.fa_family;
            paralogs = resp.paralogs;
            orthologs = resp.orthologs;
            organism.value = resp.organism;
            console.log(resp, "respresp");

            sequenceList.value.push(
                {
                    title: "Gene sequence",
                    content: gene1.value.gene_seq,
                },
                {
                    title: "mRNA sequence",
                    content: transcript1.value.mrna_seq,
                },
                {
                    title: "Coding sequence (CDS)",
                    content: transcript1.value.cds_seq,
                },
                {
                    title: "Protein sequence",
                    content: transcript1.value.pep_seq,
                }
            );
            // this does not work, fix it later
            //GeneOntologyList.value = [fa_go[0].terms];
            //console.log(GeneOntologyList.value, 'goinfo');

            gene = gene1.value;
            transcript = transcript1.value;

            var gene_seq =
                gene.upstream_seq.substr(-150) +
                gene.gene_seq +
                gene.downstream_seq.substr(0, 150);
            // console.log(gene_seq, "gene_seqgene_seq");
            var struc = new FeatureViewer(gene_seq, "#struc_view", options);
            var locations = new Array();
            var tstart = transcript.start;

            if (transcript.exons.length > 0) {
                if (transcript.strand == "+") {
                    for (var n in transcript.exons) {
                        var feature = transcript.exons[n];
                        if (feature.feature_type == "exon") {
                            var fstart = feature.start - tstart + 1 + 150;
                            var fstop = feature.stop - tstart + 1 + 150;
                            locations.push({ x: fstart, y: fstop });
                        }
                    }
                } else {
                    var loc = Array();
                    for (n in transcript.exons) {
                        loc.push(transcript.exons[n].stop);
                    }
                    start = loc.pop();
                    for (var n in transcript.exons) {
                        var feature = transcript.exons[n];
                        if (feature.feature_type == "exon") {
                            var fstart = Math.abs(
                                feature.stop - start - 1 - 150
                            );
                            var fstop = Math.abs(
                                feature.start - start - 1 - 150
                            );
                            locations.push({ x: fstart, y: fstop });
                        }
                    }
                }
            } else {
                if (transcript.strand == "+") {
                    for (var n in transcript.cds) {
                        var feature = transcript.cds[n];
                        if (feature.feature_type == "CDS") {
                            var fstart = feature.start - tstart + 1 + 150;
                            var fstop = feature.stop - tstart + 1 + 150;
                            locations.push({ x: fstart, y: fstop });
                        }
                    }
                } else {
                    var loc = Array();
                    for (var n in transcript.cds) {
                        loc.push(transcript.cds[n].stop);
                    }
                    start = loc.pop();
                    for (var n in transcript.cds) {
                        var feature = transcript.cds[n];
                        if (feature.feature_type == "CDS") {
                            var fstart = Math.abs(
                                feature.stop - start - 1 - 150
                            );
                            var fstop = Math.abs(
                                feature.start - start - 1 - 150
                            );
                            locations.push({ x: fstart, y: fstop });
                        }
                    }
                }
            }
            // console.log(locations, "locationslocations");
            struc.addFeature({
                data: locations,
                name: transcript.transcript_id + " ",
                className: "transcript_id",
                color: "#ADD8E6",
                type: "rect",
            });
        }
    );
});

// console.log(fa_blast, transcript, fa_ipr, "proxy for transcript, fa_blast, and fa_ipr");
const tabHandleClick = (tab, event) => {
    console.log(tab.index, tab.props.label, tab, activeName.value, "1111111");
    if (tab.props.label == "BLAST") {
        setTimeout(() => {
            drawBlast();
        }, 100);
    } else if (tab.props.label == "Domain") {
        setTimeout(() => {
            drawIPR();
        }, 100);
    }
};

function drawBlast() {
    if (fa_blast.length > 0) {
        for (var n in fa_blast) {
            var db = fa_blast[n].database;

            var div = "#fa_blast_" + db + "_view";
            console.log($(div).children("svg").length);
            if ($(div).children("svg").length < 3) {
                var blast = new FeatureViewer(transcript.pep_seq, div, options);

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
    }
}

function drawIPR() {
    if ($("#fa_ipr_view").children("svg").length > 1) {
        return;
    }
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
                locations.push({ x: loc.start, y: loc.end, description: desc });
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
}

const goGenomeInfo = () => {
    const url = router.resolve({
        name: "genomeInfo",
        query: {
            id: organism_id.value,
        },
    });
    window.open(url.href, "_blank");
};

const goTranscript = (res) => {
    const url = router.resolve({
        name: "Transcript",
        query: {
            id: organism_id.value,
            gene_id: gene_id.value,
        },
    });
    window.open(url.href, "_blank");
};
const goFamilyList = (v) => {
    const url = router.resolve({
        name: "FamilyList",
        query: {
            id: organism_id.value,
            family_name: v,
        },
    });
    window.open(url.href, "_blank");
};
</script>
<style lang="less" scoped>
.geneinfoWraper {
    /deep/ .el-tabs--border-card {
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
    }
    /deep/ .my-label {
        margin-left: 20px !important;
        font-weight: bold;
        display: inline-block;
        width: 200px !important;
        text-align: right;
        flex: none;
    }
    .my-content {
        background: var(--el-color-danger-light-9);
        width: 100px !important;
    }
    /deep/ .el-descriptions__cell {
        padding-bottom: 0 !important;
        display: flex;
    }
}
</style>