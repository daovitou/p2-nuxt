<template>
  <UIcon
    name="i-lucide-moon"
    size="20"
    class="cursor-pointer"
    @click="isDark = !isDark"
    v-if="!isDark"
  />
  <UIcon
    name="i-lucide-sun"
    size="20"
    class="cursor-pointer"
    @click="isDark = !isDark"
    v-else
  />
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
</script>
