<template>
  <div
    class="border border-gray-300 bg-slate-50 dark:bg-slate-900 dark:border-0 dark:hover:border-2 dark:hover:border-slate-500 hover:shadow-xl"
  >
    <div class="py-2 px-3 text-sm">
      <div class="book-container py-2 px-4">
        <img
          class="w-full lg:h-60 object-fill border border-slate-200 dark:border-slate-700"
          :src="`${item.image}`"
        />
      </div>
      <table>
        <tbody>
          <tr>
            <th class="w-16 text-left">Code</th>
            <th class="w-5 text-center">:</th>
            <td>
              {{ item.code }}
            </td>
          </tr>
          <tr>
            <th class="w-16 text-left">Title</th>
            <th class="w-5 text-center">:</th>
            <td>
              {{ item.title }}
            </td>
          </tr>
          <tr>
            <th class="w-16 text-left">Author</th>
            <th class="w-5 text-center">:</th>
            <td>
              {{ item.author }}
            </td>
          </tr>
          <tr>
            <th class="w-16 text-left">Published</th>
            <th class="w-5 text-center">:</th>
            <td>
              {{
                moment(item.issued).tz("Asia/BangKok").format("DD-MMMM-YYYY")
              }}
            </td>
          </tr>
          <tr>
            <th class="w-16 text-left">Language</th>
            <th class="w-5 text-center">:</th>
            <td>
              {{ item.language.name }}
            </td>
          </tr>
          <tr>
            <th class="w-16 text-left">Category</th>
            <th class="w-5 text-center">:</th>
            <td>
              {{ item.bookCategory.name }}
            </td>
          </tr>
          <tr>
            <th class="w-16 text-left">ISBN</th>
            <th class="w-5 text-center">:</th>
            <td>
              {{ item.isbn }}
            </td>
          </tr>
          <tr>
            <th class="w-16 text-left">ISSN</th>
            <th class="w-5 text-center">:</th>
            <td>
              {{ item.issn }}
            </td>
          </tr>
          <tr>
            <th class="w-16 text-left">Page</th>
            <th class="w-5 text-center">:</th>
            <td>
              {{ item.page }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="py-2 flex items-center justify-between gap-3">
        <a
          class="font-BaiJamjureeSemiBold text-amber-600 dark:text-amber-200 cursor-pointer"
          :href="item.ebook"
          target="_blank"
          @click="countHandler(item.id)"
          >Read ...</a
        >
        <div class="flex gap-3">
          <UButton
            label="Delete"
            variant="outline"
            color="error"
            @click="$emit('deleteEvent')"
            v-if="checkPermission(Actions.UPDATE_BOOK)"
          />
          <UButton
            label="Edit"
            @click="$emit('editEvent')"
            v-if="checkPermission(Actions.DELETE_BOOK)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: IBook;
}>();
import moment from "moment-timezone";
import PdfModal from "./PdfModal.vue";
import axios from "axios";
const modal = useModal();
const toast = useToast();
// Define props for the card

interface IBook {
  id: number;
  code: string;
  title: string;
  author: string;
  issued: Date;
  page: number;
  isbn: string;
  issn: string;
  image: string;
  viewer: number;
  bookCategoryId: number;
  languageId: number;
  ebook: string;
  language: {
    id: number;
    name: string;
  };
  bookCategory: {
    id: number;
    name: string;
  };
}

const countHandler = async (id: number) => {
  await axios.get(`/api1/books/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
function viewPdf(title: string) {
  modal.open(PdfModal, {
    title: title,
    onSuccess() {
      modal.reset();
      toast.add({
        title: "Create Success !",
        id: "modal-success",
      });
    },
    onCancel() {
      modal.reset();
    },
  });
}
</script>

<style scoped>
.book-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  aspect-ratio: 16/9;
}
</style>
