<template>
<div class="contentWraper">
    <el-main style="padding: 0">

        <h3>{{ family_name }} family of {{ genome.scientific_name }}</h3>
        <hr />
        <h4>List of genes</h4>
        <div
            style="
                display: flex;
                justify-content: space-between;
                margin: 0 auto;
                margin-top: 20px;
            "
        >
            <div
                style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                "
            >
                <p>Show</p>
                <el-select
                    v-model="pageSize2"
                    style="width: 60px; margin: 0 10px"
                    @change="pageSizeChange"
                >
                    <el-option :label="10" :value="10"> </el-option>
                    <el-option :label="20" :value="20"> </el-option>
                </el-select>

                <p>entries</p>
            </div>
            <div style="display: flex; align-items: center">
                <p style="margin-right: 10px">Search:</p>
                <el-input
                    size="small"
                    v-model="searchValue"
                    @input="searchInput"
                    placeholder="Please input"
                />
            </div>
        </div>

        <el-table :data="tableData" stripe>
            <el-table-column prop="Genome" label="Genome">
                <template #default="scope">
                    <el-link
                        @click="tableCellClick"
                        type="primary"
                        :underline="false"
                        target="_blank"
                    >
                        <!-- {{ scope.row.Genome }} -->

                        {{ genome.scientific_name }} <br />
                        {{ genome.common_name }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column prop="Gene" label="Gene">
                <template #default="scope">
                    <el-link
                        @click="goGeneInfo(scope.row.gene_id)"
                        type="primary"
                        :underline="false"
                        target="_blank"
                    >
                        {{ scope.row.gene_id }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column prop="Transcript" label="Transcript">
                <template #default="scope">
                    <el-link
                        @click="goTranscript(scope.row.transcript_id)"
                        type="primary"
                        :underline="false"
                        target="_blank"
                    >
                        {{ scope.row.transcript_id }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column prop="Position" label="Position">
                <template #default="scope">
                    {{ scope.row.chrom }}:{{ scope.row.start }}-{{
                        scope.row.stop
                    }}
                </template>
            </el-table-column>
            <el-table-column prop="Description" label="Description" width="300">
                <template #default="scope">
                    {{ scope.row.description }}
                </template>
            </el-table-column>
        </el-table>
        <div
            style="
                display: flex;
                justify-content: space-between;
                margin: 0 auto;
                margin-top: 20px;
            "
        >
            <div
                style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                "
            >
                <p>Showing 1 to {{ pageSize2 }} of {{ totalNum }} entries</p>
            </div>
            <div style="display: flex; align-items: center">
                <el-pagination
                    v-model:current-page="currentPage2"
                    :page-sizes="[pageSize2]"
                    :small="false"
                    :background="true"
                    layout="prev, pager, next"
                    :total="totalNum"
                />
            </div>
        </div>
        <hr /><br />

        <h4>Download</h4>
        <p>
            <el-button
                type="primary"
                class="normalBtn"
                @click="familyDown('list')"
                >Gene List</el-button
            >
            <el-button
                type="primary"
                class="normalBtn"
                @click="familyDown('cds')"
                >CDS</el-button
            >
            <el-button
                type="primary"
                class="normalBtn"
                @click="familyDown('pep')"
                >Protein</el-button
            >
            <el-button
                type="primary"
                class="normalBtn"
                @click="familyDown('promoter')"
                >Promoter (2K)</el-button
            >
        </p>
        <el-divider />
        <br />

        <h4>Location</h4>
        <div class="chartcon" style="height: 500px">
            <canvas id="chart3" width="1300" height="490"></canvas>
        </div>
        <el-divider />
        <br />

        <h4>Gene Structure</h4>
        <canvas id="chart1" width="1300" height="490"></canvas>
        <el-divider />
        <br />

        <h4>PFAM Domains</h4>
        <div class="chartcon">
            <canvas id="chart2" width="1300" height="490"></canvas>
            <!--div id="chart2Tip"></div-->
        </div>

        <!-- <div id="div2"></div>
        <div id="chart2Tip"></div>

        <div id="struc_view"></div>
        <div id="fa_ipr_view"></div> -->
    </el-main>
</div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
//import { transcriptsData, chromData } from "../mockData/familyMockData";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
import { BASE_URL } from "../utils/function";

const router = useRouter();
const { proxy } = getCurrentInstance();
let organism_id = ref("");
let family_name = ref("");
// import FeatureViewer from "feature-viewer";
const pageSize2 = ref(10);
const searchValue = ref("");
const currentPage2 = ref(1);
let totalNum = ref(0);
let genome = ref({});

var context3,
    canvas3,
    data3,
    data2,
    data1,
    data3_1,
    canvas2,
    context2,
    canvas1,
    context1;

const tableData = ref([]);
let transcripts1 = ref([]);
// const transcripts1 = ref(transcriptsData);
// const chrom1 = ref(chromData);
// var transcripts = transcripts1.value;
// var chrom = chrom1.value;
// console.log(transcriptsData);
// console.log(chrom);
const pageSizeChange = (res) => {
    console.log(res, "pageSizeChangepageSizeChange");
    tableData.value = transcripts1.value.slice(0, res);
    pageSize2.value = res;
};
const searchInput = (res) => {
    console.log(res);
    tableData.value = transcripts1.value
        .filter((e) => {
            return (
                e.gene_id.includes(res) ||
                e.transcript_id.includes(res) ||
                e.description.includes(res) ||
                e.chrom.includes(res) ||
                e.start.includes(res) ||
                e.stop.includes(res)
            );
        })
        .slice(0, pageSize2.value);
};
const familyDown = (res) => {
    const router = useRouter();
    console.log(router, "routerrouter");

    let url = `${BASE_URL}/api/v1/family/download/${res}/${organism_id.value}/${family_name.value}`;
    // window.href = url;
    window.open(url, "_blank"); // proxy.util.get(
    //     proxy.api.familyDown,
    //     {
    //         family_name: family_name.value,
    //         gene_id: "",
    //         id: organism_id.value,
    //         transcript_id: "0",
    //         organism_id: organism_id.value,
    //         stype: res,
    //     },
    //     (resp) => {
    //         console.log(resp);
    //     }
    // );
};
onMounted(() => {
    const router = useRoute();
    organism_id.value = router.query.id * 1;
    family_name.value = router.query.family_name;
    proxy.util.post(
        proxy.api.genomeFamily,
        {
            family_name: router.query.family_name,
            gene_id: "",
            id: router.query.id * 1,
            transcript_id: "0",
            organism_id: router.query.id * 1,
        },
        (resp) => {
            console.log(resp);
            genome.value = resp.genome;
            tableData.value = resp.transcripts.slice(0, 10);
            transcripts1.value = resp.transcripts;
            let transcripts = resp.transcripts;
            let chrom = resp.chrom;
            totalNum.value = resp.transcripts.length;

            canvas1 = document.getElementById("chart1");
            context1 = canvas1.getContext("2d");

            canvas3 = document.getElementById("chart3");
            context3 = canvas3.getContext("2d");
            canvas2 = document.getElementById("chart2");
            context2 = canvas2.getContext("2d");

            data3 = new Array(); // array for storing chr length
            for (var r in chrom) {
                var ref = chrom[r];
                data3.push({ id: ref.name, len: ref.length });
            }

            data1 = new Array(); // array for storing gene structure
            data2 = new Array(); // array for storing Pfam domain
            data3_1 = new Array(); // array for storing gene location
            for (var n in transcripts) {
                var t = transcripts[n];

                // max len for draw multiple transcripts
                var tlen = t.stop - t.start + 1;
                var plen = t.pep_seq.length;
                if (tlen > max_len) {
                    max_len = tlen;
                }
                if (plen > max_plen) {
                    max_plen = plen;
                }

                // for some genome not have exon feature
                if (t.exons.length == 0) {
                    t.exons = t.cds;
                }

                if (t.transcript_id.length > max_tid_len) {
                    max_tid_len = t.transcript_id.length;
                }

                // build feature loc for structure
                // var locations = new Array();
                var exons = new Array();
                for (var x in t.exons) {
                    var f = t.exons[x];
                    if (t.strand == "+") {
                        var fstart = f.start - t.start + 1;
                        var fstop = f.stop - t.start + 1;
                    } else {
                        var fstart = t.stop - f.stop + 1;
                        var fstop = t.stop - f.start + 1;
                    }
                    // locations.push({x:fstart, y:fstop});
                    exons.push({ x: fstart, y: fstop });
                }

                var cds = new Array();
                for (var y in t.cds) {
                    var f = t.cds[y];
                    if (t.strand == "+") {
                        var fstart = f.start - t.start + 1;
                        var fstop = f.stop - t.start + 1;
                    } else {
                        var fstart = t.stop - f.stop + 1;
                        var fstop = t.stop - f.start + 1;
                    }
                    cds.push({ x: fstart, y: fstop });
                }

                data1.push({
                    id: t.transcript_id,
                    tlen: tlen,
                    cds: cds,
                    exon: exons,
                });

                // build feature loc for domain
                var domains = new Array();
                if (t.ipr.length > 0) {
                    var da = t.ipr[0].matches_format;
                    for (y in da) {
                        if (da[y].source_lib == "PFAM") {
                            var term = da[y].source_term;
                            var name = da[y].source_name;
                            var desc = term + ":" + name;
                            for (var k in da[y].location) {
                                var dstart = da[y].location[k].start;
                                var dstop = da[y].location[k].end;
                                domains.push({
                                    x: dstart,
                                    y: dstop,
                                    description: desc,
                                });
                            }
                        }
                    }
                }

                data2.push({ id: t.transcript_id, plen: plen, Pfam: domains });
                data3_1.push({
                    id: t.transcript_id,
                    ref: t.chrom,
                    start: t.start,
                    end: t.stop,
                });
            }
            draw3();
            draw2();
            draw1();
        },
        (err) => {
            console.log(err);
        }
    );

    // drawGeneStruct();
});
function draw1() {
    var cLeft = 20;
    var cTop = 20;
    var itemH = 30;
    var labelW = max_tid_len * 7;
    var mLeft = labelW + cLeft + 10;
    var mWidth = canvas1.width - cLeft - mLeft;
    var max = 0;
    canvas1.height = data1.length * itemH + 70;
    for (var i = 0; i < data1.length; i++) {
        drawLabel(
            context1,
            cLeft,
            i * itemH + cTop,
            labelW,
            itemH - 5,
            data1[i].id
        );
        max = Math.max(
            data1[i].exon[data1[i].exon.length - 1].y,
            data1[i].cds[data1[i].cds.length - 1].y,
            max
        );
    }

    for (var i = 0; i < data1.length; i++) {
        context1.beginPath();
        context1.moveTo(mLeft, i * itemH + cTop + itemH / 2 - 2);
        context1.lineTo(
            mLeft + (data1[i].tlen / max) * mWidth,
            i * itemH + cTop + itemH / 2 - 2
        ); // fix length using tlen
        context1.strokeStyle = "#cae6ef";
        context1.stroke();

        for (var j = 0; j < data1[i].exon.length; j++) {
            context1.fillStyle = "#ffc000";
            context1.fillRect(
                mLeft + (data1[i].exon[j].x / max) * mWidth,
                i * itemH + cTop + 8,
                ((data1[i].exon[j].y - data1[i].exon[j].x) / max) * mWidth,
                itemH - 21
            );
        }

        for (var j = 0; j < data1[i].cds.length; j++) {
            for (var m = 0; m < data1[i].exon.length; m++) {
                if (
                    data1[i].cds[j].x >= data1[i].exon[m].x &&
                    data1[i].cds[j].y <= data1[i].exon[m].y
                ) {
                    context1.fillStyle = "#add8e6";
                    context1.fillRect(
                        mLeft + (data1[i].cds[j].x / max) * mWidth,
                        i * itemH + cTop + 4,
                        ((data1[i].cds[j].y - data1[i].cds[j].x) / max) *
                            mWidth,
                        itemH - 13
                    );
                }
            }
        }

        for (var j = 0; j < data1[i].exon.length; j++) {
            for (var m = 0; m < data1[i].cds.length; m++) {
                if (
                    data1[i].exon[j].x >= data1[i].cds[m].x &&
                    data1[i].exon[j].y <= data1[i].cds[m].y
                ) {
                    context1.fillStyle = "#add8e6";
                    context1.fillRect(
                        mLeft + (data1[i].exon[j].x / max) * mWidth,
                        i * itemH + cTop + 4,
                        ((data1[i].exon[j].y - data1[i].exon[j].x) / max) *
                            mWidth,
                        itemH - 13
                    );
                }
            }
        }
    }
    drawXAxis(context1, mLeft, i * itemH + cTop + itemH / 2, mWidth, max, 8);
}

function draw2() {
    var cLeft = 20;
    var cTop = 40;
    var itemH = 30;
    var labelW = max_tid_len * 7;
    var mLeft = labelW + cLeft + 10;
    var mWidth = canvas2.width - cLeft - mLeft;
    var max = 0;
    canvas2.height = data2.length * itemH + 90;
    for (var i = 0; i < data2.length; i++) {
        drawLabel(
            context2,
            cLeft,
            i * itemH + cTop,
            labelW,
            itemH - 5,
            data2[i].id
        );
        max = Math.max(data2[i].plen, max);
    }
    max += 100;
    var overArray = [];
    for (var i = 0; i < data2.length; i++) {
        context2.beginPath();
        context2.moveTo(mLeft, i * itemH + cTop + itemH / 2 - 2);
        context2.lineTo(
            mLeft + (data2[i].plen / max) * mWidth,
            i * itemH + cTop + itemH / 2 - 2
        ); // end of line, need to be fixed
        context2.strokeStyle = "#cae6ef";
        context2.stroke();

        if (data2[i].Pfam.length > 0) {
            for (var j = 0; j < data2[i].Pfam.length; j++) {
                context2.fillStyle = "#add8e6";
                context2.fillRect(
                    mLeft + (data2[i].Pfam[j].x / max) * mWidth,
                    i * itemH + cTop + 4,
                    ((data2[i].Pfam[j].y - data2[i].Pfam[j].x) / max) * mWidth,
                    itemH - 13
                );

                context2.fillStyle = "#2e528f";
                context2.textAlign = "left";
                context2.fillText(
                    data2[i].Pfam[j].description,
                    mLeft + (data2[i].Pfam[j].x / max) * mWidth + 2,
                    i * itemH + cTop + itemH / 2
                );

                overArray.push({
                    x: mLeft + (data2[i].Pfam[j].x / max) * mWidth,
                    y: i * itemH + cTop + 4,
                    tip: data2[i].Pfam[j].description,
                    w:
                        ((data2[i].Pfam[j].y - data2[i].Pfam[j].x) / max) *
                        mWidth,
                    h: itemH - 13,
                });
            }
        }
    }
    drawXAxis(context2, mLeft, i * itemH + cTop + itemH / 2, mWidth, max, 8);

    canvas2.onmousemove = function (e) {
        console.log(11111);
        document.getElementById("chart2Tip").style.display = "none";
        for (var i = 0; i < overArray.length; i++) {
            if (
                e.offsetX > overArray[i].x &&
                e.offsetY > overArray[i].y &&
                e.offsetX < overArray[i].x + overArray[i].w &&
                e.offsetY < overArray[i].y + overArray[i].h
            ) {
                document.getElementById("chart2Tip").style.display = "block";
                document.getElementById("chart2Tip").innerHTML =
                    overArray[i].tip;
                document.getElementById("chart2Tip").style.left =
                    e.offsetX + "px";
                document.getElementById("chart2Tip").style.top =
                    e.offsetY - 30 + "px";
            }
        }
    };
}

var max_len = 0;
var max_plen = 0;
var max_tid_len = 0;

function drawLabel(context, x, y, w, h, txt) {
    context.beginPath();
    context.fillStyle = "#dfd5d3";
    context.strokeStyle = "rgba(0,0,0,0)";
    context.moveTo(x, y);
    context.lineTo(x + w - 10, y);
    context.lineTo(x + w, y + h / 2);
    context.lineTo(x + w - 10, y + h);
    context.lineTo(x, y + h);
    context.lineTo(x, y);
    context.fill();
    context.textAlign = "left";
    context.fillStyle = "#413a3c";
    context.fillText(txt, x + 3, y + h / 2 + 3);
    context.stroke();
}

const draw3 = () => {
    var cLeft = 20;
    var cTop = 60;
    var itemH = 30;
    var mHeight = canvas3.height - cTop - 20;
    var max = 0;
    var perW = max_tid_len * 10 + 15;
    canvas3.width = data3.length * perW + 80;

    for (var i = 0; i < data3.length; i++) {
        max = Math.max(max, data3[i].len);
    }

    var clickArray = [];
    for (var i = 0; i < data3.length; i++) {
        drawLabel3(
            context3,
            cLeft + i * perW,
            cTop + ((data3[i].len / max) * mHeight) / 2,
            data3[i].id
        );
        drawRoundRectPath(
            context3,
            cLeft + i * perW + 10,
            cTop,
            15,
            (data3[i].len / max) * mHeight,
            3
        );

        var pre_labely = 0;
        for (var j = 0; j < data3_1.length; j++) {
            if (data3_1[j].ref == data3[i].id) {
                clickArray.push({
                    x: cLeft + i * perW + 25 + 37,
                    y:
                        cTop +
                        ((data3_1[j].start + data3_1[j].end) / 2 / max) *
                            mHeight -
                        30,
                    w: data3_1[j].id.length * 6,
                    h: 15,
                    link: data3_1[j].link,
                });

                var gx = cLeft + i * perW + 25;
                var gy =
                    cTop +
                    ((data3_1[j].start + data3_1[j].end) / 2 / max) * mHeight;
                var labely = gy - 20;
                if (labely < pre_labely + 12) {
                    labely = pre_labely + 12;
                }
                drawLabel3_1(context3, gx, gy, labely, data3_1[j].id);
                pre_labely = labely;
            }
        }
    }

    canvas3.onclick = function (e) {
        for (var i = 0; i < clickArray.length; i++) {
            if (
                e.offsetX > clickArray[i].x &&
                e.offsetY > clickArray[i].y &&
                e.offsetX < clickArray[i].x + clickArray[i].w &&
                e.offsetY < clickArray[i].y + clickArray[i].h
            ) {
                window.open(clickArray[i].link, "_blank");
            }
        }
    };
};
function drawLabel3(context, x, y, txt) {
    context.save();
    context.translate(x, y);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.rotate((-90 * Math.PI) / 180);
    context.fillText(txt, 0, 0);
    context.restore();
}
function drawLabel3_1(context, x, y, labely, txt) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + 10, y);
    context.lineTo(x + 10 + 25, labely);
    context.strokeStyle = "#2e528f";
    context.stroke();
    context.textAlign = "left";
    context.fillText(txt, x + 10 + 27, labely + 2);
}
function drawRoundRectPath(context, x, y, width, height, radius) {
    context.save();
    context.translate(x, y);
    context.strokeStyle = "#2e528f";
    context.beginPath(0);
    context.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
    context.lineTo(radius, height);
    context.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
    context.lineTo(0, radius);
    context.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2);
    context.lineTo(width - radius, 0);
    context.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2);
    context.lineTo(width, height - radius);
    context.closePath();
    context.stroke();
    context.fillStyle = "#f8caac";
    context.fill();
    context.restore();
}
function drawXAxis(context, x, y, w, max, count) {
    context.beginPath();
    context.textAlign = "center";
    context.fillStyle = "#333";
    context.strokeStyle = "#333";
    context.moveTo(x, y);
    context.lineTo(x + w, y);
    var perW = Math.floor(max / count);
    for (var i = 0; i < count; i++) {
        context.moveTo((w / max) * (i * perW) + x, y);
        context.lineTo((w / max) * (i * perW) + x, y + 5);
        context.fillText(i * perW + "", (w / max) * (i * perW) + x, y + 18);
    }
    context.moveTo(x + w, y);
    context.lineTo(x + w, y + 5);
    context.fillText(max + "", x + w, y + 18);
    context.stroke();
}
const tableCellClick = () => {
    const url = router.resolve({
        name: "genomeInfo",
        query: {
            id: organism_id.value,
        },
    });
    window.open(url.href, "_blank");
};

const goGeneInfo = (res) => {
    const url = router.resolve({
        name: "GeneInfo",
        query: {
            id: organism_id.value,
            gene_id: res,
        },
    });
    window.open(url.href, "_blank");
};

const goTranscript = (res) => {
    const url = router.resolve({
        name: "Transcript",
        query: {
            id: organism_id.value,
            gene_id: res,
        },
    });
    window.open(url.href, "_blank");
};
</script>
<style lang="less" scoped>
.normalBtn {
    background: #825b2f;
    border: #825b2f;
}
#chart2Tip {
    position: absolute;
    width: 110px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border: 1px solid #333;
    background: #fff;
    font-size: 13px;
    border-radius: 5px;
}
.chartcon {
    width: 1300px;
    height: 500px;
    overflow: auto;
    border-bottom: 1px solid #ddd;
    position: relative;
}
</style>
