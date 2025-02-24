<template>
    <div v-html="context.data.data.description">
    </div>
</template>
<script setup lang="ts">
import axios from 'axios';
const context = await axios.get("/apim/page/contact")
</script>