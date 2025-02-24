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
    :title="`Edit Page Modal`"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm
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
          <UButton type="submit" label="Save" />
        </div>
      </UForm>
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
      .put(`/api1/pages/${props.id}`, event.data, {
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
  if (!checkPermission(Actions.UPDATE_PAGE)) {
    setItems([]);
    navigateTo("/dashboard");
  } else {
    await axios
      .get(`/api1/pages/${props.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const res = response.data;
        state.name = res.data.name;
      })
      .catch((e) => console.log(e));
  }
});
</script>
