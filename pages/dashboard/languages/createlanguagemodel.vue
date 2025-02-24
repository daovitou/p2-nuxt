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
    :title="`Create Language Modal`"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Language" name="name" required>
          <UInput v-model="state.name" class="w-full" />
        </UFormField>
        <div class="flex justify-end space-x-4">
          <UButton
            color="error"
            variant="outline"
            label="Close"
            @click="
              () => {
                onCancel();
              }
            "
          />
          <UButton type="submit"> Create </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "#ui/types";
import axios from "axios";
const modal = useModal();
const error = ref();
const schema = z.object({
  name: z
    .string({ message: "Language is required" })
    .trim()
    .min(1, { message: "Language is required" }),
});
type Schema = z.output<typeof schema>;
const state = reactive<Partial<Schema>>({
  name: "",
});
const clearState = () => {
  state.name = "";
};

const emit = defineEmits(["success", "cancel"]);
async function onCancel() {
  clearState();
  modal.close();
  emit("cancel");
}
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    // console.log(event.data);
    await axios
      .post("/api1/languages", event.data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const res = response.data;
        if (res.success) {
          clearState();
          modal.close();
          emit("success");
        }
      })
      .catch((e) => (error.value = e.response.data.error));
  } catch (e) {
    error.value = e;
  }
}
import { useBreadcrumbStore } from "@/stores/breadcrumb.store";
const { setItems } = useBreadcrumbStore();
onMounted(async () => {
  if (!checkPermission(Actions.CREATE_LANGUAGE)) {
    setItems([]);
    navigateTo("/dashboard");
  }
});
</script>
