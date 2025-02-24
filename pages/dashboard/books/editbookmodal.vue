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
    :title="`Edit Book Modal`"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Code" name="code" required>
          <UInput v-model="state.code" class="w-full" />
        </UFormField>
        <UFormField label="Title" name="title" required>
          <UInput v-model="state.title" class="w-full" />
        </UFormField>
        <UFormField label="Author" name="author" required>
          <UInput v-model="state.author" class="w-full" />
        </UFormField>
        <UFormField label="Issued Date" name="issued">
          <UPopover>
            <UButton color="neutral" variant="subtle" class="w-full">
              {{ df.format(modelValue.toDate(getLocalTimeZone())) }}
            </UButton>
            <template #content>
              <UCalendar v-model="modelValue" class="p-2" />
            </template>
          </UPopover>
        </UFormField>
        <UFormField label="Number of pages" name="page" required>
          <UInput v-model="state.page" type="number" class="w-full" />
        </UFormField>
        <UFormField label="ISBN" name="isbn" required>
          <UInput v-model="state.isbn" class="w-full" />
        </UFormField>
        <UFormField label="ISSN" name="issn" required>
          <UInput v-model="state.issn" class="w-full" />
        </UFormField>
        <UFormField label="Language" name="languageId">
          <USelect
            v-model="state.languageId"
            value-key="id"
            :items="languageItems"
            class="w-full capitalize"
          />
        </UFormField>
        <UFormField label="Category" name="bookCategoryId">
          <USelect
            v-model="state.bookCategoryId"
            value-key="id"
            :items="bookCategoryItems"
            class="w-full capitalize"
          />
        </UFormField>
        <!-- File Ebook -->
        <label
          class="cursor-pointer flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-400 transition"
        >
          <UInput
            type="file"
            class="hidden"
            accept=".pdf"
            @change="onEbookChange"
          />
          <UIcon name="i-lucide-book-a" />
          <span>Upload Ebook</span>
        </label>
        <div class="pb-3" v-if="state.ebook">
          <span class="mb-2">Ebook : {{ state.ebook?.name }}</span>
        </div>
        <div class="pb-3" v-else>
          <span class="mb-2">Ebook : {{ state.tebook }}</span>
        </div>
        <!-- File Cover -->
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
          <span>Upload Cover</span>
        </label>
        <div class="flex flex-col items-center space-y-4">
          <!-- Image Preview -->
          <img
            v-if="imageUrl"
            :src="imageUrl"
            class="w-56 h-64 object-fill border border-gray-300"
            alt="Profile Preview"
          />
          <img
            v-else
            src=""
            class="w-56 h-64 object-fill border border-gray-300 hidden"
            alt="Default Profile"
          />
        </div>
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
const runtimeConfig = useRuntimeConfig();
const modal = useModal();
const error = ref();
const languageItems = ref([{ id: 0, label: "" }]);
const videoCategoryItems = ref([{ id: 0, label: "" }]);
const schema = z.object({
  code: z
    .string({ message: "Code is required" })
    .trim()
    .min(1, { message: "Code is required" }),
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(1, { message: "Title is required" }),
  author: z
    .string({ message: "Author is required" })
    .trim()
    .min(1, { message: "Author is required" }),
  issued: z.date().optional(),
  page: z.number().min(1, { message: "Book pages at lease 1 page(s)" }),
  isbn: z
    .string({ message: "isbn is required" })
    .trim()
    .min(1, { message: "isbn is required" }),
  issn: z
    .string({ message: "isbn is required" })
    .trim()
    .min(1, { message: "isbn is required" }),
  image: z.instanceof(File, { message: "" }).optional(),
  bookCategoryId: z.number(),
  languageId: z.number(),
  ebook: z.instanceof(File, { message: "" }).optional(),
  timage: z.string().optional(),
  tebook: z.string().optional(),
});
type Schema = z.output<typeof schema>;
const state = reactive<Partial<Schema>>({
  code: "",
  title: "",
  author: "",
  issued: new Date(),
  page: 0,
  isbn: "",
  issn: "",
  bookCategoryId: 0,
  languageId: 0,
  timage: "",
  tebook: "",
});
const imageUrl = ref("");
const file = ref();
const ebookUrl = ref("");
const ebook = ref();
const onFileChange = (event: any) => {
  file.value = event.target.files[0];
  state.image = event.target.files[0];
  if (file.value) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      imageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file.value);
  }
};
const onEbookChange = (event: any) => {
  ebook.value = event.target.files[0];
  state.ebook = event.target.files[0];
  if (ebook.value) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      ebookUrl.value = e.target.result;
    };
    reader.readAsDataURL(ebook.value);
  }
};
const clearState = () => {
  state.code = "";
  state.title = "";
  state.author = "";
  state.issued = new Date();
  state.page = 0;
  state.isbn = "";
  state.issn = "";
  state.bookCategoryId = 0;
  state.languageId = 0;
  state.tebook = "";
  state.timage = "";
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
async function onCancel() {
  clearState();
  modal.close();
  emit("cancel");
}
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    console.log(event.data);
    // console.log(modelValue.value.year);
    event.data.issued = new Date(
      modelValue.value.year +
        "-" +
        modelValue.value.month +
        "-" +
        modelValue.value.day
    );
    await axios
      .put(`/api1/books/${props.id}`, event.data, {
        headers: {
          "Content-Type": "multipart/form-data",
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
const bookCategoryItems = ref([{ id: 0, label: "" }]);
onMounted(async () => {
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
    .get("/api1/book-categories", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      const res = response.data.data.categories;
      // state.videoCategoryId = res[0].id;
      bookCategoryItems.value = res.map((item: any) => {
        return { id: item.id, label: item.name };
      });
    })
    .catch((e) => {
      console.log(e);
    });
  await axios
    .get(`/api1/books/${props.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      const res = response.data;
      state.code = res.data.code;
      state.title = res.data.title;
      state.author = res.data.author;
      state.issued = new Date(res.data.issued);
      state.page = res.data.page;
      state.isbn = res.data.isbn;
      state.issn = res.data.issn;
      state.bookCategoryId = res.data.bookCategoryId;
      state.languageId = res.data.languageId;
      state.tebook = res.data.title;
      state.timage = res.data.image;
      imageUrl.value = `${res.data.image}`
    })
    .catch((e) => console.log(e));
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
