<template>
    <div class="newsWraper">
        <h3>List of News</h3>
        <hr />
        <el-table :data="news" border stripe>
            <el-table-column prop="description" label="News"> 
                <template v-slot="{ row }">
                    <div v-html="row.description"></div>
                </template>
            </el-table-column>
            <el-table-column prop="date" label="Date" width="150">
            </el-table-column>
        </el-table>
        <div
            style="
                display: flex;
                justify-content: space-between;
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
                <p>Showing 1 to 10 rows</p>
                <el-select
                    v-model="pageSize2"
                    style="width: 60px; margin: 0 10px"
                >
                    <el-option :label="10" :value="10"> </el-option>
                    <el-option :label="20" :value="20"> </el-option>
                </el-select>

                <p>rows per page</p>
            </div>
            <el-pagination
                v-model:current-page="currentPage2"
                :page-sizes="[pageSize2]"
                :small="false"
                :background="true"
                layout="prev, pager, next"
                :total="5"
            />
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
const pageSize2 = ref(10);
const currentPage2 = ref(1);

const news = ref(null);

const fetchData = () => {
    fetch("news.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((jsonData) => {
            news.value = jsonData.announcements;
        })
        .catch((error) => {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        });
};
onMounted(fetchData);
</script>
<style lang="less" scoped>
.newsWraper {
    width: 80vw;
    margin: 0 auto;
}
</style>