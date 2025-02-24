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
    :title="`Create User Account Modal`"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <!-- <input type="file" /> -->
        <div class="flex flex-col items-center space-y-4">
          <!-- Image Preview -->
          <UAvatar
            v-if="imageUrl"
            :src="imageUrl"
            class="w-36 h-36 rounded-full object-cover border border-gray-300"
            alt="Profile Preview"
          />
          <UAvatar
            v-else
            src=""
            class="w-36 h-36 rounded-full object-cover border border-gray-300"
            alt="Default Profile"
          />
          <!-- File Input -->
          <label
            class="cursor-pointer flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-400 transition"
          >
            <UInput
              type="file"
              class="hidden"
              accept=".jpg, .png, .jpeg"
              @change="onFileChange"
            />
            <UIcon name="i-lucide-aperture" />
            <span>Upload Profile</span>
          </label>
        </div>
        <UFormField label="First Name" name="firstname" required>
          <UInput v-model="state.firstname" class="w-full" />
        </UFormField>
        <UFormField label="Last Name" name="lastname" required>
          <UInput v-model="state.lastname" class="w-full" />
        </UFormField>
        <UFormField label="Username" name="username" required>
          <UInput v-model="state.username" class="w-full" />
        </UFormField>
        <UFormField label="Email" name="email" required>
          <UInput v-model="state.email" class="w-full" />
        </UFormField>
        <UFormField label="Phone" name="phone">
          <UInput v-model="state.phone" class="w-full" />
        </UFormField>
        <UFormField label="Role" name="role" required>
          <USelect
            v-model="state.roleId"
            value-key="id"
            :items="roleItems"
            class="w-full capitalize"
          />
        </UFormField>
        <UFormField label="Password" name="password" required>
          <UInput
            v-model="state.password"
            placeholder="Password"
            :color="color"
            :type="showPassword ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
            :aria-invalid="score < 4"
            aria-describedby="password-strength"
            class="w-full"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :aria-pressed="showPassword"
                aria-controls="password"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>
        <UProgress
          :color="color"
          :indicator="text"
          :model-value="score"
          :max="5"
          size="sm"
        />
        <p
          id="password-strength"
          class="text-sm font-medium text-rose-600 dark:text-rose-400"
          :class="color == 'success' ? 'hidden' : 'block'"
        >
          {{ text }}. Must contain:
        </p>

        <ul class="space-y-1" aria-label="Password requirements">
          <li
            v-for="(req, index) in strength"
            :key="index"
            class="flex items-center gap-0.5"
            :class="
              req.met
                ? 'text-[var(--ui-success)]'
                : 'text-[var(--ui-text-muted)]'
            "
          >
            <UIcon
              :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
              class="size-4 shrink-0"
            />

            <span class="text-xs font-light">
              {{ req.text }}
              <span class="sr-only">
                {{ req.met ? " - Requirement met" : " - Requirement not met" }}
              </span>
            </span>
          </li>
        </ul>
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
// import { UFormField } from "#components";
const runtimeConfig = useRuntimeConfig();
const modal = useModal();
const error = ref();
const showPassword = ref(false);
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
  username: z
    .string({ message: "Username is required" })
    .trim()
    .min(1, { message: "Username is required" }),
  email: z.string({ message: "Email is required" }).trim().email(),
  phone: z.string().optional(),
  roleId: z.number(),
  password: z
    .string({ message: "Password is required" })
    .trim()
    .min(8, { message: "" })
    .max(32, { message: "" })
    .refine((password) => /[A-Z]/.test(password), {
      message: "",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "",
    })
    .refine((password) => /[0-9]/.test(password), { message: "" })
    .refine((password) => /[!@#$%^&*]/.test(password), {
      message: "",
    }),
  file: z.instanceof(File, { message: "" }).optional(),
});
type Schema = z.output<typeof schema>;
const state = reactive<Partial<Schema>>({
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  phone: "",
  roleId: 0,
  password: "",
});
const clearState = () => {
  state.firstname = "";
  state.lastname = "";
  state.username = "";
  state.email = "";
  state.phone = "";
  state.roleId = 0;
  state.password = "";
};

const emit = defineEmits(["success", "cancel"]);
async function onCancel() {
  clearState();
  modal.close();
  emit("cancel");
}
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await axios
      .post("/api1/users", event.data, {
        headers: {
          "Content-Type": "multipart/form-data",
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
function checkStrength(str: string) {
  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters - up to 32 characters" },
    { regex: /\d/, text: "At least 1 number [0-9]" },
    { regex: /[a-z]/, text: "At least 1 lowercase letter [A-Z]" },
    { regex: /[A-Z]/, text: "At least 1 uppercase letter [a-z]" },
    { regex: /[!@#$%^&*]/, text: "At least 1 special character /[!@#$%^&*]/" },
  ];

  return requirements.map((req) => ({
    met: req.regex.test(str),
    text: req.text,
  }));
}
const strength = computed(() => checkStrength(state.password?.trim() || ""));
const score = computed(() => strength.value.filter((req) => req.met).length);

const color = computed(() => {
  if (score.value === 0) return "neutral";
  if (score.value <= 1) return "error";
  if (score.value <= 4) return "warning";
  return "success";
});

const text = computed(() => {
  if (score.value === 0) return "Enter a password";
  if (score.value <= 2) return "Weak password";
  if (score.value <= 4) return "Moderate password";
  return "Strong password";
});
import { useBreadcrumbStore } from "@/stores/breadcrumb.store";
const { setItems } = useBreadcrumbStore();
onMounted(async () => {
  if (!checkPermission(Actions.CREATE_USER)) {
    setItems([]);
    navigateTo("/dashboard");
  } else {
    imageUrl.value = `${runtimeConfig.public.MINIO_HOST}/profiles/profile.png`;
    await axios
      .get("/api1/roles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const res = response.data.data;
        state.roleId = res[0].id;
        roleItems.value = res.map((item: any) => {
          return { id: item.id, label: item.name };
        });
        // roleItems.value = res.data;
        // if (res.success) {
        //   items.value = res.data;
        // }
      })
      .catch((e) => {
        // (error.value = e.response.data.error)
        console.log(e);
      });
  }
});

const imageUrl = ref("");
const file = ref();

const onFileChange = (event: any) => {
  file.value = event.target.files[0];
  state.file = event.target.files[0];
  if (file.value) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      imageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file.value);
  }
};
</script>
