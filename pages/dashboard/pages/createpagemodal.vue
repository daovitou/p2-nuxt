<template>
  <UModal
    fullscreen
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
    :title="`Create Page Modal`"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <!-- <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Page" name="name" required>
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
      </UForm> -->
      <QuillEditor v-model="content" placeholder="Write your article here..." />
      <h2>Preview:</h2>
      <div v-html="content" class="preview"></div>
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
    .string({ message: "Page is required" })
    .trim()
    .min(1, { message: "Page is required" }),
  desciption: z.string().trim().optional(),
});
type Schema = z.output<typeof schema>;
const state = reactive<Partial<Schema>>({
  name: "",
});
const clearState = () => {
  state.name = "";
  state.desciption = "";
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
      .post("/api1/pages", event.data, {
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
  if (!checkPermission(Actions.CREATE_PAGE)) {
    setItems([]);
    navigateTo("/dashboard");
  }
});

import { ref } from "vue";
import QuillEditor from "@/components/QuillEditor.vue";

const content = ref("");
</script>

<style>
.preview {
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 20px;
  min-height: 100px;
  background: #f9f9f9;
}
</style>
