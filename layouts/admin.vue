<template>
  <div class="main-theme">
    <UiAdminSidebar></UiAdminSidebar>
    <div class="flex flex-col w-full h-full px-4 py-3 gap-4">
      <UiAdminHeader></UiAdminHeader>
      <div data-aos="fade-left"
        class="w-full h-full font-BaiJamjureeRegular bg-slate-50 dark:bg-slate-800 rounded-4xl px-4 py-2 overflow-auto"
      >
        <slot ></slot>
      </div>
    </div>
  </div>
</template>

