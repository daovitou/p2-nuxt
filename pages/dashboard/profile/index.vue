<template>
    <div data-aos="fade-left" class="">
      <h1>Profile</h1>
    </div>
  </template>
  <script setup>
  import { useBreadcrumbStore } from '~/stores/breadcrumb.store';
  const {setItems} =useBreadcrumbStore();
  onMounted(() => {
    setItems(['profile'])
  });
  </script>
  