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
    :title="`Edit Video Modal`"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="video-container">
          <iframe
            width="1519"
            height="526"
            :src="`${youtubeembede}`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
        <!-- Before -->
        <UFormField label="Youtube ID" name="youtubeId" required>
          <UInput
            v-model="state.youtubeId"
            class="w-full"
            @change="searchYoutube()"
          />
        </UFormField>
        <UFormField label="Title" name="title" required>
          <UInput v-model="state.title" class="w-full" />
        </UFormField>
        <UFormField label="Published Date" name="published">
          <UPopover>
            <UButton color="neutral" variant="subtle" class="w-full">
              {{ df.format(modelValue.toDate(getLocalTimeZone())) }}
            </UButton>
            <template #content>
              <UCalendar v-model="modelValue" class="p-2" />
            </template>
          </UPopover>
        </UFormField>

        <UFormField label="Author" name="author">
          <UInput v-model="state.author" class="w-full" />
        </UFormField>
        <UFormField label="Category" name="videoCategoryId">
          <USelect
            v-model="state.videoCategoryId"
            value-key="id"
            :items="videoCategoryItems"
            class="w-full capitalize"
          />
        </UFormField>
        <UFormField label="Language" name="languageId">
          <USelect
            v-model="state.languageId"
            value-key="id"
            :items="languageItems"
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
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";
import moment from "moment";
const { editUser } = storeToRefs(useEditUserStore());
const modal = useModal();
const error = ref();
const languageItems = ref([{ id: 0, label: "" }]);
const videoCategoryItems = ref([{ id: 0, label: "" }]);
const schema = z.object({
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(1, { message: "Title is required" }),
  youtubeId: z
    .string({ message: "Youtube Link is required" })
    .trim()
    .min(1, { message: "Youtube Link is required" }),
  published: z.date().optional(),
  author: z.string().trim().optional(),
  videoCategoryId: z.number(),
  languageId: z.number(),
});
type Schema = z.output<typeof schema>;
const state = reactive<Partial<Schema>>({
  title: "",
  youtubeId: "",
  published: new Date(),
  author: "",
  videoCategoryId: 0,
  languageId: 0,
});
const clearState = () => {
  state.title = "";
  state.youtubeId = "";
  state.published = new Date();
  state.author = "";
  state.videoCategoryId = 0;
  state.languageId = 0;
};
const emit = defineEmits(["success", "cancel", "videoChanged"]);
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
    // console.log(modelValue.value.year);
    event.data.published = new Date(
      modelValue.value.year +
        "-" +
        modelValue.value.month +
        "-" +
        modelValue.value.day
    );
    await axios
      .put(`/api1/videos/${props.id}`, event.data, {
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
const df = new DateFormatter("en-US", {
  dateStyle: "full",
});

const modelValue = shallowRef(new CalendarDate(2025, 2, 4));
const youtubeembede = ref("");
const searchYoutube = () => {
  youtubeembede.value = `https://www.youtube.com/embed/${state.youtubeId}`;
};

onMounted(async () => {
  if (!checkPermission(Actions.UPDATE_VIDEO)) {
    setItems([]);
    navigateTo("/dashboard");
  } else {
    await axios
      .get("/api1/languages", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const res = response.data.data.languages;
        // state.languageId = res[0].id;
        languageItems.value = res.map((item: any) => {
          return { id: item.id, label: item.name };
        });
      })
      .catch((e) => {
        console.log(e);
      });
    await axios
      .get("/api1/video-categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const res = response.data.data.categories;
        // state.videoCategoryId = res[0].id;
        videoCategoryItems.value = res.map((item: any) => {
          return { id: item.id, label: item.name };
        });
      })
      .catch((e) => {
        console.log(e);
      });
    await axios
      .get(`/api1/videos/${props.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const res = response.data;
        state.languageId = res.data.languageId;
        state.videoCategoryId = res.data.videoCategoryId;
        state.title = res.data.title;
        state.youtubeId = res.data.youtubeId;
        state.published = new Date(res.data.published);
        state.author = res.data.author;
        youtubeembede.value = `https://www.youtube.com/embed/${state.youtubeId}`;
      })
      .catch((e) => console.log(e));
  }
});
</script>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  aspect-ratio: 16/9;
}

iframe {
  width: 100%;
  height: 100%;
}
</style>
