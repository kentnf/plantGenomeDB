<template>
    <div class="contentWraper">
        <!-- Batchq -->
        <h3>Batch Query</h3>
        <hr />
        <el-row :gutter="20">
            <el-col :span="14" :offset="4">
                <el-form :model="form" label-width="200px">

                    <el-form-item label="Genome:">
                        <el-select
                            v-model="form.selectNode"
                            style="width: 100%"
                            placeholder="please select genome"
                        >
                        <el-option
                                v-for="item in qgenomesList"
                                :key="item.id"
                                :label="item.sname +' ['+ item.cname+']'"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="Feature Type:">
                        <el-select
                            v-model="form.clade"
                            style="width: 100%"
                            placeholder="please select your zone"
                        >
                            <el-option label="gene" value="gene" />
                            <el-option label="mRNA" value="mRNA" />
                            <el-option label="protein" value="protein" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Input:">
                        <el-input
                            v-model="form.gtinput"
                            placeholder="Gene id / Trancript id"
                            type="textarea"
                            :rows="4"
                        />
                    </el-form-item>

                    <el-form-item label="Options" v-if="form.clade == 'gene'">
                        <el-radio-group v-model="form.Genebody1">
                            <el-radio label="with_genebody"
                                >With Genebody</el-radio
                            >
                            <el-radio label="without_genebody"
                                >Without Genebody</el-radio
                            >
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        label="Upstream Bases:"
                        v-if="form.clade == 'gene'"
                    >
                        <el-input v-model="form.up_id" />
                    </el-form-item>
                    <el-form-item
                        label="Downstream Bases:"
                        v-if="form.clade == 'gene'"
                    >
                        <el-input v-model="form.down_id" />
                    </el-form-item>

                    <el-form-item label="Query Types:">
                        <el-radio-group v-model="form.in_up">
                            <el-radio label="Sequence_Retrieval"
                                >Sequence Retrieval</el-radio
                            >
                            <el-radio
                                v-if="form.clade != 'gene'"
                                label="Function_Annotation_Retrieval"
                                >Function Annotation Retrieval</el-radio
                            >
                            <el-radio
                                v-if="form.clade != 'gene'"
                                label="Family_Retrieval"
                                >Family Retrieval</el-radio
                            >
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="Download" class="submit-button"
                            >Download</el-button
                        >
                    </el-form-item>
                </el-form>
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
import { useStore } from "vuex";
const store = useStore();
const { proxy } = getCurrentInstance();

let qgenomesList = ref([]);
qgenomesList.value = store.state.navconfigData;

const form = reactive({
    clade: "gene",
    gtinput: "",
    Genebody1: "with_genebody",
    up_id: "0",
    down_id: "0",
    in_up: "Sequence_Retrieval",
    selectNode: "",
    region: "",
});
const Download = () => {
    console.log(form.clade);
    let { selectNode, gtinput, clade, up_id, down_id, in_up, Genebody1 } = form;
    if (!selectNode) {
        ElMessage.error("Genome must select.");
        return false;
    }
    if (!gtinput) {
        ElMessage.error("Gene id must input.");
        return false;
    }
    if (clade == "gene") {
        var r = /^\+?[0-9][0-9]*$/;
        if (!r.test(up_id)) {
            ElMessage.error("Upstream Bases must be a positive integer.");
            return false;
        }
        if (Number(up_id) < 0 || Number(up_id) > 5000) {
            ElMessage.error("The maximum value of Upstream Bases is 5000");
            return false;
        }

        if (!r.test(down_id)) {
            ElMessage.error("Downstream Bases must be a positive integer.");

            return false;
        }
        if (Number(down_id) < 0 || Number(down_id) > 5000) {
            ElMessage.error("The maximum value of Downstream Bases is 5000.");
            return false;
        }
    }
    // 'http://127.0.0.1:8080/api/v1/batch/down?var_type=0&record=0&upstream=0&downstream=0&out1=0&out2=0&selectNode=0'

    let url = `${BASE_URL}${proxy.api.batchDown}?var_type=${form.clade}&record=${gtinput}&upstream=${up_id}&downstream=${down_id}&out1=${Genebody1}&out2=${in_up}&genome_id=${selectNode}`;
    window.open(url, "_blank");
    // proxy.util.get(
    //     proxy.api.batchDown,
    //     {
    //         var_type: form.clade,
    //         record: gtinput,
    //         upstream: up_id,
    //         downstream: down_id,
    //         out1: Genebody1,
    //         out2: in_up,
    //         selectNode: selectNode,
    //     },
    //     (resp) => {
    //         console.log(resp, "ddddd");
    //     },
    //     (err) => {
    //         // console.log(err);
    //         ElMessage.error("The maximum value of Downstream Bases is 5000.");
    //     }
    // );
};

// update chromList and genomeList according to the change of qgenome  (jstree method)
/*onMounted(() => {
    setTimeout(() => {
        $("#jstree").jstree({
            plugins: ["checkbox"],
            core: {
                multiple: false, //单选
                // data: store.state.navconfigData,
                data: [
                    {
                        children: store.state.navconfigData,
                        id: "1674276434323193627",
                        state: {
                            disabled: true,
                        },
                        // text: "Castanea",
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


