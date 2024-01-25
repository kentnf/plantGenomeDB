<template>
    <div class="contentWraper">
        <h3>Search Result for Synteny Blocks</h3>
        <!--<el-breadcrumb :separator-icon="'ArrowRight'">  
            <el-breadcrumb-item :to="{ path: '/' }"
                >Home</el-breadcrumb-item
            >
            <el-breadcrumb-item :to="{ path: '/tools/synteny' }"
                >Search Synteny Blocks</el-breadcrumb-item
            >
            <el-breadcrumb-item
                >Search Result for Synteny Blocks</el-breadcrumb-item
            >
        </el-breadcrumb>-->
        <hr />

        <div class="row">
            <div class="col-md-12">
                <br />
                <p>
                    <b>Query genome and location: </b><br />
                    -> Genome: {{ genome1.sname }}<br />
                    -> Location: {{ query.scaffold }}<br />
                </p>
                <p><b>Genome(s) for comparison: </b></p>
            </div>
        </div>

        <el-tabs type="border-card">
            <el-tab-pane :label="genome2.sname">
                <div id="chart"></div>

                <el-table
                    :data="query.data1"
                    stripe
                    :row-class-name="tableRowClassName"
                >
                    <el-table-column prop="Block" label="Block" width="80">
                        <template #default="scope">
                            <a :href="`/#/syntenyResult/${genomes}/${scope.row.block_name}`">{{ scope.row.block_name }}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="Block" label="Organism1 (location)	">
                        <template #default="scope">
                            {{ genome1.sname }}<br />
                            {{ genome1.cname }}<br />
                            {{ scope.row.l_block_chr }}
                            : {{ scope.row.l_block_start.toLocaleString() }} -
                            {{ scope.row.l_block_end.toLocaleString() }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="Block" label="Organism2 (location)">
                        <template #default="scope">
                            {{ genome2.sname }}<br />
                            {{ genome2.cname }}<br />
                            {{ scope.row.r_block_chr }}
                            :{{ scope.row.r_block_start.toLocaleString() }} -
                            {{ scope.row.r_block_end.toLocaleString() }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="score" label="score" width="80">
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, getCurrentInstance } from "vue";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
import Circos from "circos";
import { BASE_URL } from "../utils/function";
import { useStore } from "vuex";
const store = useStore();
const router = useRoute();
const { proxy } = getCurrentInstance();

// genome info
const genomesList = ref([]);
genomesList.value = store.state.navconfigData;
const genomes = ref("");
genomes.value = router.params.genomes;   
const blockname = ref("");
blockname.value = router.params.blockname;

// get the genome info of synteny 
const parts = genomes.value.split(":");
const gid1 = parseInt(parts[0], 10);
const gid2 = parseInt(parts[1], 10);
const genome1 = genomesList.value.find(item => item.id === gid1);
const genome2 = genomesList.value.find(item => item.id === gid2);
// console.log(gid1, gid2, genome1.cname, genome2.cname,'genome ids');

let query = reactive({
    bedCollection: [],
    canvas: "",
    data1: "",
    id_name: "",
    ideoCollection: [],
    l_genome_name: "",
    labCollection: "",
    linkCollection: [],
    r_genome_name: "",
    scaffold: "",
});

const tableRowClassName = ({ row, rowIndex }) => {
    // console.log(row, rowIndex, "rowrowrowrow");
    if (rowIndex % 2 === 1) {
        return "warning-row";
    } else if (rowIndex === 2) {
        return "success-row";
    }
    return "success-row";
};

const drowChert = (block_datas, Chromosome_datas, link_datas) => {
    var width = 850;
    var circos = new Circos({
        container: "#chart",
        width: 1010,
        height: 1010,
    });

    Chromosome_datas.sort(function (a, b) {
        return a.order - b.order;
    });

    Chromosome_datas = Chromosome_datas.map(function (d) {
        return {
            block_id: d.id,
            name: d.label,
            color: d.color,
            id: d.id,
            len: d.len,
            label: d.label,
        };
    });

    block_datas = block_datas.map(function (d) {
        return {
            block_id: d.chrom,
            start: d.blockStart,
            end: d.blockEnd,
            color: d.color,
            name: d.name,
            // url: "http://hort.moilab.net/synteny/block/" + d.url,
            url: window.origin + "/#/syntenyBlock/" + d.url,
        };
    });

    link_datas = link_datas.map(function (d) {
        return {
            source: {
                id: d.source_id,
                start: d.source_breakpoint - 0.5,
                end: d.source_breakpoint + 0.5,
                label: d.source_label,
            },
            target: {
                id: d.target_id,
                start: d.target_breakpoint - 0.5,
                end: d.target_breakpoint + 0.5,
                label: d.target_label,
            },
            color: d.color,
            // url: "http://hort.moilab.net/synteny/block/" + d.url,
            url: window.origin + "/#/syntenyBlock/" + d.url,
        };
    });

    circos
        .layout(Chromosome_datas, {
            innerRadius: width / 2 - 125,
            outerRadius: width / 2 - 100,
            cornerRadius: 5,
            labels: {
                display: false,
            },

            ticks: {
                display: true,
                color: "grey",
                spacing: 5,
                labels: true,
                labelSpacing: 10,
                labelDenominator: 10,
                labelDisplay0: true,
                labelSize: 10,
                majorSpacing: 10,
                size: {
                    minor: 3,
                    major: 6,
                },
            },

            tooltipContent: function (d) {
                return d.len;
            },
            opacity: 0.7,
            events: {
                "mouseover.demo": function (d, i, nodes, event) {
                    d3.select(nodes[i]).style("opacity", 1);
                },
                "mouseout.demo": function (d, i, nodes, event) {
                    d3.select(nodes[i]).style("opacity", 0.7);
                },
            },
        })

        .highlight("block_datas", block_datas, {
            innerRadius: width / 2 - 130,
            outerRadius: width / 2 - 95,
            opacity: 0.7,

            events: {
                "mouseover.demo": function (d, i, nodes, event) {
                    d3.select(nodes[i]).style("opacity", 1);
                    d3.select(nodes[i]).classed("highlighted", true);
                },
                "mouseout.demo": function (d, i, nodes, event) {
                    d3.select(nodes[i]).style("opacity", 0.7);
                    d3.select(nodes[i]).classed("highlighted", false);
                },
                click: function (d) {
                    window.open(d.url);
                },
            },

            color: function (d) {
                return d.color;
            },
            tooltipContent: function (d) {
                return '<div > <h4><a href="">' + d.name + "<a></h4></div>";
            },
        })

        .text(
            "Chromosome_datas-labels",
            Chromosome_datas.map(function (d, index) {
                d.position = d.len / 2;
                d.value = d.name;
                d.color = d.color;
                return d;
            }),
            {
                innerRadius: width / 2 - 75,
                outerRadius: width / 2 - 75,
                style: {
                    "font-size": 14,
                },
                color: function (d) {
                    return d.color;
                },
            }
        )

        .chords("l1", link_datas, {
            radius: function (d) {
                if (d.source.id === "chr1") {
                    return 0.978;
                } else {
                    return 0.978;
                }
            },

            logScale: false,
            opacity: 0.5,
            color: function (d) {
                return d.color;
            },
            tooltipContent: function (d) {
                return (
                    '<div > <h4><a href="">' +
                    d.source.label +
                    " ➤ " +
                    d.target.label +
                    "<a></h4></div>"
                );
            },
            events: {
                click: function (d) {
                    window.open(d.url);
                },
                "mouseover.demo": function (d, i, nodes, event) {
                    d3.select(nodes[i]).classed("highlighted", true);
                },
                "mouseout.demo": function (d, i, nodes, event) {
                    d3.select(nodes[i]).classed("highlighted", false);
                },
            },
        })
        .render();
};

onMounted(() => {
    const router = useRoute();
    // console.log(router.params, "synResRouter");
    genomes.value = router.params.genomes;
    blockname.value = router.params.blockname;

    proxy.util.get(
        proxy.api.syntenyResult +
            `/${router.params.genomes}/${router.params.blockname}`,
        {},
        (resp) => {
            query.bedCollection = resp.content.bedCollection;
            query.canvas = resp.content.canvas;
            query.data1 = resp.content.data1;
            query.id_name = resp.content.id_name;
            query.l_genome_name = resp.content.l_genome_name;
            query.labCollection = resp.content.labCollection;
            query.r_genome_name = resp.content.r_genome_name;
            query.scaffold = resp.content.scaffold;
            // console.log(query, "synResQuery");

            drowChert(
                resp.synteny_content.block_datas,
                resp.synteny_content.chromosome_datas,
                resp.synteny_content.link_datas
            );
        },
        (err) => {}
    );
});
</script>
<style lang="less" scoped>
:deep(.el-table .warning-row) {
    background: #ffffff;
}
:deep(.el-table .success-row) {
    // --el-table-tr-bg-color: var(--el-color-success-light-9);
    background: #f3e5d4 !important;
}

</style>