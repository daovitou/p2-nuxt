<template>
  <NuxtLayout name="signin">
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
definePageMeta({
  middleware: ["signin"],
});
</script>
