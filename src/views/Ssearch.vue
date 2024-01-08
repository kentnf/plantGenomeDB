<template>
    <div class="home">
        <div class="title" style="margin-top: 10vh">
            <h1>Searching Horticultural Genomic Data</h1>
        </div>

        <div class="title">
            <el-select
                v-model="value"
                filterable
                remote
                reserve-keyword
                placeholder="grape ethylene receptor"
                :remote-method="remoteMethod"
                :loading="loading"
                style="width: 50%; margin-top: 40px"
                size="large"
            >
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
        </div>
        <div class="title">
            <p
                @click="dialogVisible = true"
                :underline="false"
                style="
                    color: #337ab7;
                    width: 50%;
                    margin-top: 40px;
                    display: flex;
                    align-items: center;
                "
            >
                <el-icon><QuestionFilled /></el-icon> Quick Guide for Search
            </p>
        </div>
        <div class="title" style="margin-top: 20px">
            <el-table :data="tableData" border style="width: 80%">
                <el-table-column prop="date" label="Date" width="180" />
                <el-table-column prop="name" label="Name" width="180" />
                <el-table-column prop="address" label="Address" />
            </el-table>
        </div>

        <el-dialog
            v-model="dialogVisible"
            width="50%"
            :before-close="handleClose"
        >
            <div class="lightbox featherlight-inner" id="quickguide">
                <h4>
                    Quick guide for search:
                    <font color="#FF0000"
                        ><b>Plant or Term or Plant Term or Term Plant</b></font
                    >
                </h4>
                <h4>Example for searching terms:</h4>
                <ul style="line-height: 1.8">
                    <li>
                        <b
                            >Single Search plant by Scientific name or Common
                            name:<br /><font color="blue"
                                >Vitis vinifera/grape</font
                            ></b
                        >
                    </li>
                    <li>
                        <b
                            >Single Search term:
                            <font color="blue"
                                >VIT_200s0125g00280/wrky/GO:0006355/IPR036093/ethylene
                                receptor</font
                            ></b
                        >
                    </li>
                    <li>
                        <b
                            >Advanced Search gene in specify plant by plant
                            term:</b
                        >
                    </li>
                    <li>
                        <b
                            >Search gene by plant Gene-ID:
                            <font color="blue"
                                >grape VIT_200s0125g00280 or VIT_200s0125g00280
                                grape</font
                            ></b
                        >
                    </li>
                    <li>
                        <b
                            >Search gene by plant TF:
                            <font color="blue"
                                >grape wrky or wrky grape</font
                            ></b
                        >
                    </li>
                    <li>
                        <b
                            >Search gene by plant GO-ID:
                            <font color="blue"
                                >grape go:0006355 or go:0006355 grape</font
                            ></b
                        >
                    </li>
                    <li>
                        <b
                            >Search gene by plant IPR/Pfam-domain:
                            <font color="blue"
                                >grape IPR036093 or IPR036093 grape</font
                            ></b
                        >
                    </li>
                    <li>
                        <b
                            >Search gene by plant description:
                            <font color="blue"
                                ><br />grape Procollagen-proline 4-dioxygenase
                                or Procollagen-proline 4-dioxygenase grape</font
                            ></b
                        >
                    </li>
                </ul>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";

const list = ref([]);
const options = ref([]);
const value = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const router = useRouter();
const tableData = [
    {
        date: "2016-05-03",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
    },
    {
        date: "2016-05-02",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
    },
    {
        date: "2016-05-04",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
    },
    {
        date: "2016-05-01",
        name: "Tom",
        address: "No. 189, Grove St, Los Angeles",
    },
];

onMounted(() => {
    list.value = states.map((item) => {
        return { value: `value:${item}`, label: `label:${item}` };
    });
});

const remoteMethod = (query) => {
    if (query) {
        loading.value = true;
        setTimeout(() => {
            loading.value = false;
            options.value = list.value.filter((item) => {
                return item.label.toLowerCase().includes(query.toLowerCase());
            });
        }, 200);
    } else {
        options.value = [];
    }
};
const goGenome = (res) => {
    const url = router.resolve({
        name: res,
    });
    window.open(url.href, "_blank");
};

const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
];
</script>
<style lang="less" scoped>
.home {
    height: 100px;
    .title {
        display: flex;
        justify-content: center;
        align-items: center;
        h1 {
            font-size: 36px;
        }
    }
    .title1 {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
    }
    .textWraper {
        width: 50%;
        // display: inherit;
        line-height: 1.2;
        align-items: center;
        margin-top: 5px;
        i {
            margin-right: 5px;
        }
    }
}
</style>
