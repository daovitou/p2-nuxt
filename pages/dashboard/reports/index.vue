<template>
    <div data-aos="fade-left" class="">
      <h1>Reports Page</h1>
    </div>
  </template>
  <script setup>
  import { useBreadcrumbStore } from '~/stores/breadcrumb.store';
  const {setItems} =useBreadcrumbStore();
  onMounted(() => {
    setItems(["reports"])
  });
  </script>
  
  