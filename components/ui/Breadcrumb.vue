<template>
  <div data-aos="fade-left" class="text-sm text-slate-500 flex items-center justify-start gap-2">
    <RouterLink to="/dashboard" class="flex items-center justify-center hover:text-black dark:hover:text-white">
      <UIcon name="ic:outline-home" size="20" />
    </RouterLink>
    <div v-for="(item,index) in getItems" :key="index" data-aos="fade-right" class="flex items-center justify-start gap-2 text-md">
      <p>/</p>
      <p class="uppercase">{{ item }}</p>
    </div>
  </div>
</template>

<script setup>
import { useBreadcrumbStore } from '@/stores/breadcrumb.store';
const {getItems} = useBreadcrumbStore()
</script>
