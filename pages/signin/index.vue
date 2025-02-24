<template>
  <div data-aos="fade-up"
    class="w-full h-full flex items-center justify-center font-BaiJamjureeSemiBold relative"
  >
    <div
      class="absolute p-8 top-20 w-[500px] rounded-xl bg-slate-200 dark:border-none dark:text-slate-300 dark:bg-slate-800"
    >
      <!-- <DarkMode></DarkMode> -->
      <p class="uppercase text-2xl font-BaiJamjureeBold">sign in - agri docs</p>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 pt-8"
        @submit="onSubmit"
      >
        <UFormField label="Username" name="username">
          <UInput v-model="state.username" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput v-model="state.password" type="password" class="w-full" />
        </UFormField>

        <label for="">{{ error }}</label>

        <UButton type="submit" class="w-full mt-3 justify-center uppercase"> Sign IN </UButton>
      </UForm>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "#ui/types";
import axios from "axios";
const error = ref();
const schema = z.object({
  username: z.string().trim(),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  username: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await axios
      .post("/api1/auth/loggin", event.data)
      .then((response) => {
        const res = response.data;
        if (res.success) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("token", res.data.accessToken);
          useRouter().push("/dashboard");
        }
      })
      .catch((e) => (error.value = e.response.data.error));
  } catch (e) {
    // error.value = e
  }
}
</script>
