<template>
    <div class="contentWraper">
        <!-- Batchq -->
        <h3>Search Synteny Blocks</h3>
        <hr />
        <el-row :gutter="20">
            <el-col :span="14" :offset="5">
                <div style="text-align:center;">
                    <h4><a href="http://cucurbitgenomics.org/v2/misc/tutorial/Synteny.pdf" target="_blank">
                        Tutorial (PDF)
                    </a> &nbsp;&nbsp;
                    <a href="https://www.youtube.com/watch?v=t6Kl2z_dCqs&t=6s" target="_blank">
                        YouTube
                    </a>
                    </h4>
                </div>
                <div class="panel-info">
                    <div class="panel-heading">
                        Search blocks by a given location.
                    </div>
                    <div style="padding: 15px;">
                    <h5>Genome:</h5>
                        <el-select
                            v-model="qgenome"
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
                    <h5>Chromosome/Scaffold:</h5>

                    <el-select
                        v-model="chrom"
                        filterable
                        placeholder="select a chromosome/scaffold"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="item in chromList"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name"
                        />
                    </el-select>
                    
                    <h5>Choose a genome for comparison:</h5>
                    <el-select
                        v-model="genome"
                        filterable
                        placeholder="select a chromosome/scaffold"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="item in genomeList"
                            :key="item.name"
                            :label="item.name"
                            :value="item.key"
                        />
                    </el-select>
                    </div>

                    <div class="panel-footer">
                        <center>
                            <el-button
                                style="background-color:#825b2f; border: none;" 
                                type="primary"
                                @click="Submit"
                                :loading="submitLoading"
                                >
                                Submit
                            </el-button>
                        </center>
                    </div>
                </div>
            </el-col>
            <input type="text" hidden v-model="selectNode" />
        </el-row>
    </div>
</template>
<script setup>
import { ref, watch, onMounted, reactive, getCurrentInstance } from "vue";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
const router = useRouter();
import { useStore } from "vuex";
const store = useStore();
const { proxy } = getCurrentInstance();

// vars for el-option
let qgenomesList = ref([]);
qgenomesList.value = store.state.navconfigData;
let chromList = ref([]);
let genomeList = ref([]);

// vars for el-select
let qgenome = ref();
let chrom = ref();
let genome = ref();
let selectNode = ref();
let submitLoading = ref(false);
const form = reactive({
    selectNode: "",
});

// submit and direct to synteny Result page
const Submit = () => {
    console.log(qgenome.value*1, chrom.value, genome.value*1, 'submit.resp');
    proxy.util.post(
        proxy.api.syntenyAnalysis,
        {
            l_genome_id: qgenome.value*1,
            l_genome_scaffold: chrom.value,
            r_genome_id: genome.value*1,
            genome_id: 0,
            // selectNode: form.selectNode, for species-specific database, pass code 0 to genome_id
            
        },
        (resp) => {
            let { blockname, genomes } = resp;
            // console.log(resp,'submit.resp');
            router.push({
                path: `/syntenyResult/${genomes}/${blockname}`,
            });
        },
        (err) => {
            console.log(err);
        }
    );
};

// update chromList and genomeList according to the change of qgenome (watch method)
watch(qgenome, (newValue, oldValue) => {
    // console.log(newValue, oldValue, 'x1');
    if (newValue) {
        proxy.util.post(
            proxy.api.syntenyGenomeinfos,
            {
                genome_id: newValue * 1,
            },
            (resp) => {
                // console.log(resp, 'jstree.changed.resp');
                chromList.value = resp.chroms;
                genomeList.value = resp.family;
            },
            (err) => {
                console.log(err);
            }
        );
    }
});


// update chromList and genomeList according to the change of qgenome  (jstree method)
/*onMounted(() => {
    setTimeout(() => {
        $("#jstree").jstree({
            core: {
                multiple: false, //单选
                data: [
                    {
                        children: store.state.navconfigData,
                        id: "1674276434323193627",
                        state: {
                            disabled: true,
                        },
                        text: "Click to choose genome",
                    },
                ],
            },
        });
        $("#jstree").on("changed.jstree", function (e, data) {
            // console.log(data, 'jstree.changed.data'); 
            var selectNode = data.instance.get_node(data.selected[0]).id;
            if (selectNode) {
                console.log(selectNode);
                form.selectNode = selectNode;
                proxy.util.post(
                    proxy.api.syntenyGenomeinfos,
                    {
                        genome_id: selectNode * 1,
                    },
                    (resp) => {
                        // console.log(resp, 'jstree.changed.resp');
                        chromList.value = resp.chroms;
                        genomeList.value = resp.family;
                    },
                    (err) => {
                        console.log(err);
                    }
                );
                // $("#selectNode").val(selectNode);
                // form.selectNode = selectNode;
                // $.ajax({
                //     url: BASE_URL + proxy.api.syntenyGenomeinfos,
                //     type: "POST",
                //     dataType: "json",
                //     cache: false,
                //     processData: false,
                //     contentType: false,
                //     success: function (ret) {
                //         console.log(ret);
                //         chromList.value = ret.chroms;
                //         genomeList.value = ret.family;
                //     },
                //     error: function (data) {
                //         console.log(data);
                //     },
                // });
            } else {
                $("#selectNode").val("");
            }
        });
    }, 100);
});*/
</script>
<style lang="less" scoped>
</style>


