<template>
  <UModal
    fullscreen
    :title='`You are readding : ${title}`'
    :close="{
      color: 'error',
      variant: 'outline',
      class: 'rounded-full',
      onClick: () => {
        modal.reset();
      },
    }"
  >
    <template #body>
      <Placeholder class="h-full" />
    </template>
  </UModal>
</template>
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
const modal = useModal();
</script>
