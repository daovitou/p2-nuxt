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
    :title="`Edit User Account Modal`"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="First Name" name="firstname">
          <UInput v-model="state.firstname" class="w-full" />
        </UFormField>
        <UFormField label="Last Name" name="lastname">
          <UInput v-model="state.lastname" class="w-full" />
        </UFormField>
        <UFormField label="Phone" name="phone">
          <UInput v-model="state.phone" class="w-full" />
        </UFormField>
        <UFormField label="Role" name="role">
          <USelect
            v-model="state.roleId"
            value-key="id"
            :items="roleItems"
            class="w-full capitalize"
          />
        </UFormField>
        <div class="flex justify-end space-x-4">
          <UButton
            color="error"
            variant="outline"
            label="Close"
            @click="
              () => {
                closeModal();
              }
            "
          />
          <UButton type="submit"> Save </UButton>
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
import { useEditUserStore } from "@/stores/edituser.store";
const { editUser } = storeToRefs(useEditUserStore());
const modal = useModal();
const error = ref();
const roleItems = ref([{ id: 0, label: "" }]);
const schema = z.object({
  firstname: z
    .string({ message: "First name is required" })
    .trim()
    .min(1, { message: "First name is required" }),
  lastname: z
    .string({ message: "Last name is required" })
    .trim()
    .min(1, { message: "Last name is required" }),
  phone: z.string().optional(),
  roleId: z.number(),
});
type Schema = z.output<typeof schema>;
const state = reactive<Partial<Schema>>({
  firstname: "",
  lastname: "",
  phone: "",
  roleId: 0,
});
const clearState = () => {
  state.firstname = "";
  state.lastname = "";
  state.phone = "";
  state.roleId = 0;
};
const emit = defineEmits(["success", "cancel"]);
async function closeModal() {
  try {
    clearState();
    modal.close();
    emit("cancel");
  } catch (error) {
    console.log(error);
  }
}
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    // console.log(event.data);
    await axios
      .put(`/api1/users/${props.id}`, event.data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const res = response.data;
        if (res.success) {
          emit("success");
          modal.close();
          clearState();
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
  if (!checkPermission(Actions.UPDATE_USER)) {
    setItems([]);
    navigateTo("/dashboard");
  } else {
    await axios
      .get("/api1/roles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const res = response.data.data;
        // state.roleId = res[0].id;
        roleItems.value = res.map((item: any) => {
          return { id: item.id, label: item.name };
        });
      })
      .catch((e) => {
        console.log(e);
      });
    await axios
      .get(`/api1/users/${props.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const res = response.data;
        state.firstname = res.data.firstname;
        state.lastname = res.data.lastname;
        state.phone = res.data.phone;
        state.roleId = Number(res.data.role.id);
      })
      .catch((e) => console.log(e));
  }
});
</script>
