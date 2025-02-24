export const useScreenStore = defineStore("screenStore", () => {
  const screenWidth = ref();
  const screenHeight = ref();
  const updateScreen = () => {
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight;
  };
  const getScreenWidth = computed(() => screenWidth);
  const getScreenHeight = computed(() => screenHeight);
  onMounted(() => {
    updateScreen()
    window.addEventListener("resize", updateScreen);
  });
  return { getScreenWidth, getScreenHeight };
});
