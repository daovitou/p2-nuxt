<template>
  <div class="w-full h-14 flex items-center justify-between">
    <div
      class="w-full h-full flex items-center justify-between rounded-full ps-2 pe-1 py-2 bg-slate-50 dark:bg-slate-800"
    >
      <div class="flex items-center justify-start gap-6">
        <UiAdminSidebarBotton></UiAdminSidebarBotton>
        <UiBreadcrumb></UiBreadcrumb>
      </div>
      <div></div>
      <div class="py-1 pe-1">
        <div
          class="h-full flex items-center justify-end gap-2 bg-slate-200 dark:bg-slate-900 rounded-full ps-3"
        >
          <DarkMode />
          <div class="ml-3 mr-1">
            Hi, <span class="uppercase mr-2">{{ user.username }}</span>
          </div>
          <UDropdownMenu
            :items="items"
            :ui="{
              content: 'w-48',
            }"
          >
            <UAvatar
              :src="profile"
              alt="Benjamin Canac"
              size="xl"
              class="outline-8 outline-slate-50 dark:outline-slate-800 cursor-pointer"
            />
          </UDropdownMenu>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const userStorage = JSON.parse(localStorage.getItem("user") || "{}");
const profile = ref(`${userStorage.profile}`);
const user = ref<iUser>({
  firstname: "",
  lastname: "",
  username: "",
  phone: "",
  role: "",
  email: "",
});

const items = ref<any>([
  [
    {
      label:  `Role: ${userStorage.role}`,
      icon: "i-lucide-shield",
    },
  ],
  [
    {
      label: "Profile",
      icon: "i-lucide-user",
      onSelect() {
        navigateTo("/dashboard/profile");
      },
    },
    {
      label: "Change Password",
      icon: "i-lucide-credit-card",
      onSelect() {
        console.log("selected");
      },
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-lucide-log-out",
      onSelect() {
        sigoutHandler();
      },
    },
  ],
  [
    {
      label: "Version 1.0.0.0",
      icon: "i-lucide-bolt",
    },
  ],
]);
interface iUser {
  firstname: string;
  lastname: string;
  username: string;
  phone: string;
  role: string;
  email: string;
}

const sigoutHandler = () => {
  removeUser();
  navigateTo("/signin");
};
onMounted(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    user.value = JSON.parse(userData);
  }
});
</script>
