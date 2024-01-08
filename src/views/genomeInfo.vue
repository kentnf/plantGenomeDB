<template>
    <div class="contentWraper">
        <h3>
            <i>{{ organism.scientific_name }}</i> ({{ organism.common_name }})
        </h3>
        <el-divider />
        <el-tabs
            type="border-card"
            v-model="activeName"
        >
            <el-tab-pane label="Genome Information" name="1">
                <el-row>
                    <el-col :span="12">
                        <el-descriptions title="Taxonomy" :column="1">
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Taxonomy ID"
                            >
                                <el-link
                                    :underline="false"
                                    target="_blank"
                                    type="primary"
                                    :href="
                                        'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=' +
                                        organism.taxid
                                    "
                                    >{{ organism.taxid }}
                                </el-link>
                            </el-descriptions-item>

                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="TScientific name"
                            >
                                <i> {{ organism.scientific_name }}</i>
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Common name"
                            >
                                <i> {{ organism.common_name }}</i>
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Order"
                            >
                                <i> {{ organism.order }}</i>
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Family"
                            >
                                <i> {{ organism.family }}</i>
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Genus"
                            >
                                <i> {{ organism.genus }}</i>
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Species"
                            >
                                <i> {{ organism.species }}</i>
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Subspecies"
                            >
                                <i> {{ organism.subspecies }}</i>
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Variety"
                            >
                                <i> {{ organism.variety }}</i>
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Cultivar"
                            >
                                <i> {{ organism.cultivar }}</i>
                            </el-descriptions-item>
                        </el-descriptions>
                        <el-divider />

                        <el-descriptions
                            title="Genome assembly and annotation"
                            :column="1"
                        >
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Ploidy"
                            >
                                {{ organism.ploidy }}
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Haplotype resolved"
                            >
                                {{ organism.haplotype_resolved }}
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Genome seq num"
                            >
                                {{ organism.genome_seq_num }}
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Genome size"
                            >
                                {{ organism.genome_size }}Mb
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="#Protein-coding Genes"
                            >
                                {{ organism.gene_num }}
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="mRNA num"
                            >
                                {{ organism.mrna_num }}
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="CDS num"
                            >
                                {{ organism.cds_num }}
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Protein num"
                            >
                                {{ organism.pep_num }}
                            </el-descriptions-item>
                            <!--<el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Download"
                            >
                                {{ organism.download }}
                            </el-descriptions-item>-->
                        </el-descriptions>
                    </el-col>
                    <el-col :span="12">
                        <el-image
                            style="width: 30vw; left: 20%"
                            :src="BASE_URL + imageUrl"
                        />

                        <!-- -->
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24" :offset="0">
                        <el-descriptions title="Publication" :column="1">
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Title"
                            >
                                {{ organism.pub_title }}
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Authors"
                            >
                                {{ organism.pub_authors }}
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Date"
                            >
                                {{ organism.pub_date }}
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="PMID"
                                v-if="organism.publication"
                            >
                                <el-link
                                    :underline="false"
                                    target="_blank"
                                    type="primary"
                                    :href="
                                        'https://pubmed.ncbi.nlm.nih.gov/' +
                                        organism.publication
                                    "
                                    >{{ organism.publication }}
                                </el-link>
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Date"
                                v-else-if="organism.doi"
                            >
                                <el-link
                                    :underline="false"
                                    target="_blank"
                                    type="primary"
                                    :href="
                                        'https://pubmed.ncbi.nlm.nih.gov/' +
                                        organism.publication
                                    "
                                    >{{ organism.doi }}
                                </el-link>
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="DOI"
                                v-else
                            >
                                Unpublished
                            </el-descriptions-item>
                            <el-descriptions-item
                                label-class-name="my-label"
                                class-name="my-content"
                                label="Abstract"
                            >
                                {{ organism.pub_abstract }}
                            </el-descriptions-item>
                        </el-descriptions>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
import { watch, ref, onMounted, getCurrentInstance } from "vue";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
const router = useRouter();
const { proxy } = getCurrentInstance();
import { BASE_URL } from "../utils/function";

const activeName = ref("1");
const organism = ref({});
let imageUrl = ref("");
let organism_id = ref("");

const route = useRoute();
watch(() => route.query.id, (newId, oldId) => {
  organism_id.value = newId * 1;
  refreshContent(newId);
});

function refreshContent(oid) {
    proxy.util.post(
        proxy.api.genomeInfo,
        {
            organism_id: oid*1,
        },
        (resp) => {
            organism.value = resp.organism;
            imageUrl.value = resp.image[0];
        },
        (err) => {
            console.log(err);
        }
    );
}

onMounted(() => {
    const router = useRoute();
    organism_id.value = router.query.id * 1;
    refreshContent(organism_id.value)
});
</script>
<style lang="less" scoped>

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
.my-content {
    background: var(--el-color-danger-light-9);
    width: 100px !important;
}
/deep/ .el-tabs--border-card {
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
}
.height-leave-active, .height-enter-active {
    transition: height 0.5s;
}

.height-enter, .height-leave-to {
    height: 0;
}
.innerWrper {
    transition: max-height 0s linear;
    transition-property: all;
    transition-duration: 0.2s;
    transition-timing-function: linear;
    overflow: hidden;
}

</style>