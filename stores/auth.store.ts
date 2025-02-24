
export const useAuthStore = defineStore("authStore", () => {
  const authorized = ref(false);
  const isAuthorized = computed(() => authorized.value);
  const toggleAuthorized = () => {
    authorized.value = !authorized.value;
  };
  return { isAuthorized, toggleAuthorized, authorized };
});
