<template>
    <div>
      <iframe :src="iframeSrc" frameborder="0" width="100%" height="650"></iframe>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { inject } from 'vue';
const siteConfig = inject('siteConfig');
const iframeSrc = ref("");
onMounted(() => {
  iframeSrc.value = siteConfig.blastServer;
});
</script>