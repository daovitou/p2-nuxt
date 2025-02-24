<template>
  <div data-aos="fade-left" class="w-full h-full">
    
  </div>
</template>
<script setup lang="ts">
import axios from "axios";
import { useBreadcrumbStore } from "~/stores/breadcrumb.store";
const { setItems } = useBreadcrumbStore();
interface ISummary {
  totalBooks: number;
  totalVideos: number;
  totalUsers: number;
  totalLanguages: number;
  totalBookCategories: number;
  totalVideoCategories: number;
}
const summaries = ref<ISummary>();
onMounted(async () => {
  setItems([]);
  await axios
    .get(`/api1/dashboard`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      summaries.value = response.data.data;
    })
    .catch((e) => console.log(e));
});
</script>
