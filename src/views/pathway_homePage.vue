<template>
    <div class="contentWraper">
        <!-- KEGG Enrich -->
        <h3>KEGG Enrichment Analysis</h3>
        <hr />
        <el-row :gutter="20">
            <el-col :span="14" :offset="5">
                <div class="panel-info">
                    <div class="panel-heading">
                        KEGG enrichment analysis using list of gene/transcript IDs.
                    </div>

                    <div style="padding: 15px;">
                        <h5>Genome:</h5>
                        <el-select
                            v-model="selectNode"
                            filterable
                            placeholder="select a genome"
                            style="width: 100%"
                        >
                            <el-option
                                v-for="item in qgenomesList"
                                :key="item.id"
                                :label="item.sname +' ['+ item.cname+']'"
                                :value="item.id"
                            />
                        </el-select>
                        <br /><br />

                        <div>
                            <el-checkbox
                                style="float: right"
                                v-model="checked1"
                                label=" Show an Example ID"
                                size="large"
                                @change="checkedChange"
                            />
                        </div>
                        <h5>Gene/Transcript IDs:</h5>
                        <el-input
                            v-model="geneid"
                            placeholder="Gene/Trancript IDs"
                            type="textarea"
                            :rows="4"
                        />
                        <div style="margin: 10px">
                            <span>Or upload the file containing gene/transcriptIDs</span>
                        </div>
                        <div
                            style="
                                float: none;
                                display: inline-block;
                                vertical-align: middle;
                                width: 100%;
                                margin-top: 5px;
                                margin-bottom: 5px;
                            "
                        >
                            <div class="form-group" style="float: left; width: 50%">
                                <input
                                    type="file"
                                    class="form-control"
                                    id="geneInputFile"
                                />
                            </div>
                            <div style="float: right">
                                <a>
                                    <button
                                        @click="Download"
                                        type="button"
                                        class="btn btn-info submit-button"
                                    >
                                        Download Example
                                    </button>
                                </a>
                            </div>
                        </div>

                        <div style="width: 100%">
                            <div>Types</div>
                            <div class="col-md-12">
                                <el-radio-group v-model="radio3" class="ml-4">
                                    <el-radio label="gene" size="large"
                                        >Gene</el-radio
                                    >
                                    <el-radio label="mrna" size="large"
                                        >mRNA</el-radio
                                    >
                                </el-radio-group>
                            </div>
                        </div>
                        <div>
                            <p>
                                Enter a cutoff p-value for Significant
                                represented GO Terms:*
                            </p>
                            <div class="input-group" style="width: 100%">
                                <input
                                    type="text"
                                    id="pvalue"
                                    class="form-control"
                                    placeholder="0.05"
                                    v-model="pvalues"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="panel-footer">
                        <center>
                            <el-button
                                class="submit-button"
                                type="primary"
                                @click="Submit"
                                :loading="submitLoading"
                                >Submit</el-button
                            >
                        </center>
                    </div>
                </div>
            </el-col>
            <input type="text" hidden v-model="form.selectNode" />
        </el-row>
    </div>
</template>
<script setup>
// import $ from "jquery";
// import "../utils/dist/jstree";
import { ref, onMounted, reactive, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
import { BASE_URL } from "../utils/function";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
const router = useRouter();
import { useStore } from "vuex";
const store = useStore();
const { proxy } = getCurrentInstance();

// vars for el-option
let qgenomesList = ref([]);
qgenomesList.value = store.state.navconfigData;

const selectNode = ref();
const checked1 = ref(false);
const geneid = ref();
const radio3 = ref("gene");
let pvalues = ref("0.05");
let submitLoading = ref(false);

const form = reactive({
    clade: "kegg",
    geneid: "",
    radio3: "",
    pvalue: "",
    selectNode: "",
});
const Download = () => {
    let url = `${BASE_URL}${proxy.api.pathwayDownfile}`;
    window.open(url, "_blank");
};
const Submit = () => {
    if (!selectNode.value) {
        ElMessage.error("Genome must select.");
        return false;
    }
    var genome_id = selectNode.value;
    var geneids = geneid.value;
    var types = radio3.value;
    var pvalue = pvalues.value;
    if (!pvalue) {
        var pvalue = 0.05;
    }
    var formFile = new FormData();
    let fileObj = document.getElementById("geneInputFile").files[0];
    if (typeof fileObj == "undefined" || fileObj.size <= 0) {
        if (!geneids) {
            ElMessage.error("Gene id must input.");

            return;
        }
        formFile.append("genome_id", genome_id);
        formFile.append("geneids", geneids);
        formFile.append("types", types);
        formFile.append("pvalue", pvalue);
        formFile.append("flag", 0);
    } else {
        formFile.append("genome_id", genome_id);
        formFile.append("types", types);
        formFile.append("pvalue", pvalue);
        formFile.append("geneInputFile", fileObj);
        formFile.append("flag", 1);
    }
    submitLoading.value = true;
    // var gene = "gene";
    // var uid = "sdsdfs";
    // router.push({
    //     // name: "goresult",
    //     path: `/pathwayResult/${gene}/${uid}`,
    // });
    // return;
    $.ajax({
        url: BASE_URL + proxy.api.pathwayAnalysis,
        data: formFile,
        type: "POST",
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        success: function (res) {
            let rtypes = res.data.types;
            let ruid = res.data.uuid_name;
            submitLoading.value = false;
            router.push({
                // name: "keggresult",
                path: `/pathwayResult/${rtypes}/${ruid}`,
            });
        },
        error: function (res) {
            alert(res);
        },
    });
};
const checkedChange = () => {
    if (checked1.value) {
        var genome_id = selectNode.value;
        proxy.util.post(
            proxy.api.pathwayExample,
            {
                genome_id: genome_id,
            },
            (resp) => {
                // console.log(resp, "keggEnrichExampleResp");
                geneid.value = resp.ret;
            },
            (err) => {
                console.log(err);
            }
        );
    } else {
        geneid.value = "";
    }
};

/*onMounted(() => {
    setTimeout(() => {
        $("#jstree").jstree({
            plugins: ["checkbox"],
            core: {
                multiple: false, //single option
                data: [
                    {
                        children: store.state.navconfigData,
                        id: "0",
                        state: {
                            disabled: true,
                        },
                        text: "Click to select genome",
                    },
                ],
            },
        });
        $("#jstree").on("changed.jstree", function (e, data) {
            var selectNode = data.instance.get_node(data.selected[0]).id;
            if (selectNode) {
                console.log(selectNode);
                // $("#selectNode").val(selectNode);
                form.selectNode = selectNode;
            } else {
                $("#selectNode").val("");
            }
        });
    }, 100);
});*/
</script>
<style lang="less" scoped>
</style>


