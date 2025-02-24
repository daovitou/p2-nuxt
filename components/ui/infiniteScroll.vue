<script setup>
import { ref } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import axios from "axios";

const items = ref([]);
const page = ref(1);
const loading = ref(false);
const empty = ref(false);

const fetchMoreItems = async () => {
  if (loading.value) return;
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await axios.get(`/api1/users?pages=${page.value}&limit=10`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (response.data.data.users.length < 1) {
    empty.value = true;
  }
  items.value.push(...response.data.data.users);
  page.value++;
  loading.value = false;
};

// Trigger infinite scroll when reaching the bottom
const containerRef = ref(null);
useInfiniteScroll(containerRef, fetchMoreItems, { distance: 50 });

// Fetch initial items
fetchMoreItems();
</script>

<template>
  <!-- <UiVideoCard
    ref="containerRef"
    v-for="item in items"
    :key="item.id"
    :title="item.username"
    :description="item.email"
  /> -->
  <div ref="containerRef" class="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-cols-4 gap-3">
    <UiVideoCard
      v-for="item in items"
      :key="item.id"
      :title="item.username"
      :description="item.email"
    />
    <div v-if="loading & !empty" class="text-center py-4 text-gray-500">
      Loading...
    </div>
    <div v-if="items.length<1">
      No Records
    </div>
  </div>
</template>
