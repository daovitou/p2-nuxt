<template>
  <div
    class="w-10 h-10 flex items-center justify-center p-1 bg-green-500 rounded-full cursor-pointer hover:bg-green-400"
    @click="toggleSidebar"
    >
    <Icon name="i-lucide-menu" class="text-white dark:text-slate-950" />
  </div>
</template>
<script setup>
import { useSidebarStore } from '@/stores/sidebar.store';
const {toggleSidebar} = useSidebarStore()
</script>