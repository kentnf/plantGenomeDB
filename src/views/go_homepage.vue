<template>
    <div class="contentWraper">
        <!-- go enrich homepage -->
        <h3>GO Enrichment Analysis</h3>
        <hr />
        <el-row :gutter="20">
            <el-col :span="14" :offset="5">
                <div class="panel-info">
                    <div class="panel-heading">
                        GO enrichment analysis using list of gene/transcript IDs.
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
                            <div>Choose one of the three Ontologies:</div>
                            <div class="col-md-12">
                                <el-radio-group v-model="radio1" class="ml-4">
                                    <el-radio label="F" size="large"
                                        >Function</el-radio
                                    >
                                    <br />
                                    <el-radio label="P" size="large"
                                        >Process</el-radio
                                    >
                                    <br />
                                    <el-radio label="C" size="large"
                                        >Component</el-radio
                                    >
                                </el-radio-group>
                            </div>
                        </div>
                        <div style="width: 100%">
                            <div>Choose the p-value correction method:</div>
                            <div class="col-md-12">
                                <el-radio-group v-model="radio2" class="ml-4">
                                    <el-radio label="Bonferroni" size="large"
                                        >Bonferroni</el-radio
                                    >
                                    <el-radio label="Simulation" size="large"
                                        >Simulation</el-radio
                                    >
                                    <el-radio label="FDR" size="large"
                                        >FDR</el-radio
                                    >
                                </el-radio-group>
                            </div>
                        </div>
                        <div style="width: 100%">
                            <div>Feature Types</div>
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
//import $ from "jquery";
//import "../utils/dist/jstree";
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
const radio1 = ref("F");
const radio2 = ref("Bonferroni");
const radio3 = ref("gene");
let submitLoading = ref(false);

const geneid = ref();
let pvalues = ref("0.05");

const form = reactive({
    clade: "go",
    geneid: "",
    radio1: "",
    radio2: "",
    radio3: "",
    pvalue: "",
    selectNode: "",
});

// donwload example of gene list for go enrichment analysis 
const Download = () => {
    let url = `${BASE_URL}${proxy.api.goDownfile}`;
    window.open(url, "_blank");
};

const Submit = () => {
    // console.log(selectNode.value, 'selectNode');
    if (!selectNode.value) {
        ElMessage.error("Genome must select.");
        return false;
    }
    var genome_id = selectNode.value;
    var geneids = geneid.value;
    var aspect = radio1.value;
    var correction = radio2.value;
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
        formFile.append("aspect", aspect);
        formFile.append("types", types);
        formFile.append("correction", correction);
        formFile.append("pvalue", pvalue);
        formFile.append("flag", 0);
    } else {
        formFile.append("genome_id", genome_id);
        formFile.append("types", types);
        formFile.append("aspect", aspect);
        formFile.append("correction", correction);
        formFile.append("pvalue", pvalue);
        formFile.append("geneInputFile", fileObj);
        formFile.append("flag", 1);
    }
    submitLoading.value = true;
    // router.push({
    //     // name: "goresult",
    //     path: "/goresult",
    //     query: { plan: "private" },
    //     // query: {
    //     //     types: rtypes,
    //     //     uid: ruid,
    //     // },
    // });
    // return;
    $.ajax({
        url: BASE_URL + proxy.api.goAnalysis,
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

            // const url = router.resolve({
            //     name: "goresult",
            //     query: {
            //         types: rtypes,
            //         uid: ruid,
            //     },
            // });
            console.log(res, "goenrich-res");
            router.push({
                // name: "goresult",
                path: "/goresult",
                query: { types: rtypes, uid: ruid },
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
            proxy.api.goExample,
            {
                genome_id: genome_id,
            },
            (resp) => {
                // console.log(resp, "goEnrichExampleResp");
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
                multiple: false, //单选
                data: [
                    {
                        children: store.state.navconfigData,
                        id: "1674276434323193627",
                        state: {
                            disabled: true,
                        },
                        text: "Castanea",
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


