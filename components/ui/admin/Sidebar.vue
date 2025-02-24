<template>
  <div
    class="h-full flex flex-col overflow-x-hidden transition-all duration-300 ease-in-out"
    :class="showSidebar ? 'w-72' : 'w-0'"
  >
    <div
      class="w-full h-20 flex items-center justify-start px-4 text-2xl font-BaiJamjureeBold"
    >
      <span class="uppercase">Administrator</span>
    </div>
    <div class="w-full h-full overflow-auto py-2 px-4">
      <div
        class="w-full h-full flex flex-col items-start gap-2 justify-start overflow-y-scroll"
      >
        <div class="w-full" v-for="item in sideBarItems">
          <RouterLink
            :to="item.routeTo"
            class="w-full h-11 flex items-center justify-start gap-2 hover:bg-slate-300 dark:hover:bg-slate-700 hover:rounded-3xl hover:ps-4 transition-normal duration-300 ease-in-out"
            :class="`${
              $route.path === item.routeTo
                ? 'bg-slate-300 dark:bg-slate-700 rounded-3xl ps-4'
                : ''
            }`"
            :key="item"
            v-if="checkPermission(item.permission)"
          >
            <UIcon :name="item.icon" size="20" />
            <span class="uppercase">{{ item.label }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSidebarStore } from "@/stores/sidebar.store";
import { sideBarItems } from "@/utils/data";
const { showSidebar } = useSidebarStore();
</script>
