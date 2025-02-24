<template>
  <UModal
    :dismissible="false"
    :close="{
      color: 'error',
      variant: 'outline',
      class: 'rounded-full',
      onClick: () => {
        modal.reset();
      },
    }"
    class="font-BaiJamjureeRegular"
    :title="`Warning Delete Language`"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <p class="pb-6 text-slate-950 dark:text-slate-200">
        Please click confirm to delete language.
      </p>
      <div class="flex items-center justify-end gap-4">
        <UButton
          @click="closeModal()"
          color="error"
          variant="outline"
          label="Cancel"
        />
        <UButton @click="onSubmit()">Confrim</UButton>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
import axios from "axios";
const modal = useModal();

const emit = defineEmits(["success", "cancel"]);
async function closeModal() {
  try {
    modal.close();
    emit("cancel");
  } catch (error) {
    console.log(error);
  }
}
async function onSubmit() {
  try {
    await axios
      .delete(`/api1/languages/${props.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const res = response.data;
        if (res.success) {
          emit("success");
          modal.close();
        }
      })
      .catch((e) => console.log(e));
  } catch (e) {
    console.log(e);
  }
}
import { useBreadcrumbStore } from "@/stores/breadcrumb.store";
const { setItems } = useBreadcrumbStore();
onMounted(async () => {
  if (!checkPermission(Actions.DELETE_LANGUAGE)) {
    setItems([]);
    navigateTo("/dashboard");
  }
});
</script>
