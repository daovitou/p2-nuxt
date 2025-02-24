export const useBreadcrumbStore = defineStore("breadcrumbStore", () => {
  const items = ref<string[]>([]);
  const getItems = computed(() => items);
  const setItems = (uItems: string[]) => {
    items.value = uItems;
  };
  return { getItems, setItems };
});
