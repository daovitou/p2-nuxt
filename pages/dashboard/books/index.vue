<template>
  <div class="h-full w-full">
    <div
      class="flex justify-between px-4 py-3.5 border-b border-[var(--ui-border-accented)]"
    >
      <UInput
        :loading="isLoading"
        icon="i-lucide-search"
        class="w-lg"
        size="md"
        variant="outline"
        placeholder="Search... (code,title, author, issued, isbn, issn, language, category)"
        v-model="searchKeywords"
        @change="searchHandler"
      >
        <template v-if="searchKeywords?.length" #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-circle-x"
            aria-label="Clear input"
            @click="
              () => {
                searchKeywords = '';
                searchHandler();
              }
            "
          />
        </template>
      </UInput>
      <UButton
        class="font-BaiJamjureeSemiBold cursor-pointer"
        label="Create"
        @click="openCreate()"
        v-if="checkPermission(Actions.CREATE_BOOK)"
      />
    </div>
    <div class="h-[calc(100%-4rem)] w-full px-2 pb-2 pt-4">
      <div class="h-full w-full overflow-scroll">
        <div
          ref="containerRef"
          class="w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          <UiBookCard
            v-for="(item, index) in items"
            :key="item.id"
            :item="item"
            @editEvent="editModal(item.id, index)"
            @deleteEvent="deleteModal(item.id, index)"
          />
          <div v-if="loading && !empty" class="text-center py-4 text-gray-500">
            Loading...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import axios from "axios";
import Createbookmodal from "./createbookmodal.vue";
import { useInfiniteScroll } from "@vueuse/core";
import Deletebookmodal from "./deletebookmodal.vue";
import Editbookmodal from "./editbookmodal.vue";
import { useBreadcrumbStore } from "@/stores/breadcrumb.store";
const { setItems } = useBreadcrumbStore();
const { catid } = useRoute().query;
const searchKeywords = ref("");
const limit = ref(6);
const strUri = ref();
const toast = useToast();
const modal = useModal();
const loading = ref(false);
const empty = ref(false);
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
const isLoading = ref(false);
const items = ref<IBook[]>([]);
const page = ref(1);
const searchHandler = async () => {
  page.value = 1;
  items.value = [];
};
const openCreate = () => {
  modal.open(Createbookmodal, {
    onSuccess() {
      modal.reset();
      toast.add({
        title: "Create Success !",
        id: "modal-success",
      });
      searchHandler();
      fetchMoreItems();
    },
    onCancel() {
      modal.reset();
    },
  });
};
const bookRef = ref<IBook>();
const editModal = async (id: number, index: number) => {
  await axios
    .get(`/api1/books/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      const res = response.data;
      modal.reset();
      if (res.success) {
        bookRef.value = res.data;
        modal.open(Editbookmodal, {
          id: id,
          book: bookRef.value,
          async onSuccess() {
            modal.reset();
            await axios
              .get(`/api1/books/${id}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              .then((response) => {
                const res = response.data;
                items.value[index].id = res.data.id;
                items.value[index].code = res.data.code;
                items.value[index].title = res.data.title;
                items.value[index].author = res.data.author;
                items.value[index].issued = new Date(res.data.issued);
                items.value[index].page = res.data.page;
                items.value[index].isbn = res.data.isbn;
                items.value[index].issn = res.data.issn;
                items.value[index].image = res.data.image;
                items.value[index].viewer = res.data.viewer;
                items.value[index].ebook = res.data.ebook;
                items.value[index].languageId = res.data.languageId;
                items.value[index].bookCategoryId = res.data.bookCategoryId;
                items.value[index].language.id = res.data.language.id;
                items.value[index].language.name = res.data.language.name;
                items.value[index].bookCategory.id = res.data.bookCategory.id;
                items.value[index].bookCategory.name =
                  res.data.bookCategory.name;
              })
              .catch((e) => console.log(e));
            toast.add({
              title: "Success !",
              id: "modal-success",
            });
          },
          onCancel() {
            modal.reset();
          },
          onClose() {
            modal.reset();
          },
        });
      }
    });
};
const deleteModal = (id: number, index: number) => {
  // console.log(id,":",index)
  // console.log(items.value[index])
  // items.value.splice(index,1)
  modal.open(Deletebookmodal, {
    id: id,
    onSuccess() {
      items.value.splice(index, 1);
      modal.reset();
      toast.add({
        title: "Success !",
        id: "modal-success",
      });
    },
    onCancel() {
      modal.reset();
    },
  });
};
onMounted(() => {
  if (checkPermission(Actions.READ_BOOK)) {
    strUri.value =
      Number(catid) & (Number(catid) > 0)
        ? `/api1/books?cat=${catid}&pages=${page.value}&limit=${limit.value}&search=${searchKeywords.value}`
        : `/api1/books?pages=${page.value}&limit=${limit.value}&search=${searchKeywords.value}`;
    setItems(["books"]);
  } else {
    setItems([]);
    navigateTo("/dashboard");
  }
});
const fetchMoreItems = async () => {
  if (loading.value) return;
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  strUri.value =
    Number(catid) & (Number(catid) > 0)
      ? `/api1/books?cat=${catid}&pages=${page.value}&limit=${limit.value}&search=${searchKeywords.value}`
      : `/api1/books?pages=${page.value}&limit=${limit.value}&search=${searchKeywords.value}`;
  const response = await axios.get(strUri.value, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (response.data.data.books.length < 1) {
    empty.value = true;
  } else {
    empty.value = false;
  }
  items.value.push(...response.data.data.books);
  page.value++;
  loading.value = false;
};

// Trigger infinite scroll when reaching the bottom
const containerRef = ref(null);
useInfiniteScroll(containerRef, fetchMoreItems, { distance: 50 });

// Fetch initial items
fetchMoreItems();
</script>
