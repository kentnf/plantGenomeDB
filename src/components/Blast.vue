<template>
    <div>
        <div
            v-for="record in fa_blast"
            :key="record.database"
            :id="`fa_blast_${record.database}_view`"
        >
            <h4>
                <b
                    >BLAST of Solyc01g102750.3.1 vs.
                    {{ record.database }} Database</b
                >
            </h4>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import $ from "jquery";

import { fa_blast, transcript } from "../mockData/GeneInfo";
console.log(fa_blast, "fa_blastfa_blastfa_blast");
onMounted(() => {
    drawBlast();
});
var options = {
    showAxis: true,
    showSequence: true,
    brushActive: true,
    toolbar: true,
    bubbleHelp: true,
    zoomMax: 20,
};
function drawBlast() {
    if (fa_blast.length > 0) {
        for (let n in fa_blast) {
            var db = fa_blast[n].database;
            var div = "#fa_blast_" + db + "_view";
            console.log($(div).children("svg").length);
            if ($(div).children("svg").length < 3) {
                var blast = new FeatureViewer(transcript.pep_seq, div, options);

                for (let m in fa_blast[n].hits) {
                    var locations = new Array();
                    for (let k in fa_blast[n].hits[m].Hit_hsps) {
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
</script>
<style lang="less" scoped>
</style>