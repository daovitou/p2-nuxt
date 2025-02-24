export const useSidebarStore = defineStore("sidebarStore", () => {
    const show = ref(true);
    const showSidebar = computed(() => show);
    const toggleSidebar = () => {
      show.value = !show.value;
    };
    const hideSidebar = () => {
      show.value = false;
    };
    return { showSidebar, toggleSidebar,hideSidebar };
  });
  