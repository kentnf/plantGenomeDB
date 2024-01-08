<template>
    <div>
      <iframe :src="iframeSrc" frameborder="0" width="100%" height="650"></iframe>
    </div>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { inject } from 'vue';
const siteConfig = inject('siteConfig');

const route = useRoute();
const iframeSrc = ref("");

watch(() => route.query.id, (newId, oldId) => {
  iframeSrc.value = siteConfig.jbrowseServer + "/?data=data/json/" + newId + "&tracks=DNA,genes&tracklist=0";
});

onMounted(() => {
  iframeSrc.value = siteConfig.jbrowseServer + "/?data=data/json/" + route.query.id + "&tracks=DNA,genes&tracklist=0";
});
</script>
