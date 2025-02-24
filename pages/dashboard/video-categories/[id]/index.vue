<template>
  <div class="h-full w-full">
    <div
      class="flex justify-between h-16 px-4 py-3.5 border-b border-[var(--ui-border-accented)]"
    >
      <!-- <UInput v-model="globalFilter" class="min-w-md" placeholder="Filter..." /> -->
      <UInput
        :loading="isLoading"
        icon="i-lucide-search"
        class="w-md"
        size="md"
        variant="outline"
        placeholder="Search... (title, author, language, category)"
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
    </div>
    <div class="h-[calc(100%-4rem)] w-full px-2 pb-2 pt-4">
      <div class="h-full w-full overflow-scroll">
        <div
          ref="containerRef"
          class="w-full grid sm:grid-cols-1 lg:grid-cols-3 gap-3"
        >
          <UiVideoCard
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
import { useBreadcrumbStore } from "@/stores/breadcrumb.store";
const { setItems } = useBreadcrumbStore();
const toast = useToast();
const modal = useModal();
const { id } = useRoute().params;
import { ref } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import axios from "axios";
import Createvideomodal from "../../videos/createvideomodal.vue";
import Deletevideomodal from "../../videos/deletevideomodal.vue";
import Editvideomodal from "../../videos/editvideomodal.vue";
const videoRef = ref<video>();
const editModal = async (id: number, index: number) => {
  // console.log(id,":",index)
  // console.log(items.value[index])
  // items.value.splice(index,1)
  // items.value[index].title = "heelo"
  await axios
    .get(`/api1/videos/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      const res = response.data;
      modal.reset();
      if (res.success) {
        videoRef.value = res.data;
        modal.open(Editvideomodal, {
          id: id,
          video: videoRef.value,
          async onSuccess() {
            modal.reset();
            await axios
              .get(`/api1/videos/${id}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              .then((response) => {
                const res = response.data;
                items.value[index].languageId = res.data.languageId;
                items.value[index].videoCategoryId = res.data.videoCategoryId;
                items.value[index].title = res.data.title;
                items.value[index].youtubeId = res.data.youtubeId;
                items.value[index].published = new Date(res.data.published);
                items.value[index].author = res.data.author;
                items.value[index].language.id = res.data.language.id;
                items.value[index].language.name = res.data.language.name;
                items.value[index].videoCategory.id = res.data.videoCategory.id;
                items.value[index].videoCategory.name =
                  res.data.videoCategory.name;
                // youtubeembede.value = `https://www.youtube.com/embed/${state.youtubeId}`;
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
  modal.open(Deletevideomodal, {
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
type user = {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string;
  profile: string;
  status: boolean;
  role: {
    id: number;
    name: string;
  };
};
interface video {
  id: number;
  title: string;
  youtubeId: string;
  published: Date;
  author: string;
  videoCategoryId: number;
  languageId: number;
  language: {
    id: number;
    name: string;
  };
  videoCategory: {
    id: number;
    name: string;
  };
}
const items = ref<video[]>([]);
const page = ref(1);
const loading = ref(false);
const empty = ref(false);

const fetchMoreItems = async () => {
  if (loading.value) return;
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await axios.get(
    `/api1/videos?cat=${id}&pages=${page.value}&limit=${limit.value}&search=${searchKeywords.value}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (response.data.data.videos.length < 1) {
    empty.value = true;
  } else {
    empty.value = false;
  }
  items.value.push(...response.data.data.videos);
  page.value++;
  loading.value = false;
};

// Trigger infinite scroll when reaching the bottom
const containerRef = ref(null);
useInfiniteScroll(containerRef, fetchMoreItems, { distance: 50 });

// Fetch initial items
fetchMoreItems();

const searchKeywords = ref("");
const isLoading = ref(false);
const limit = ref(6);
const strUri = ref();
const data = ref<video[]>([]);

type pageData = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  allowNext: boolean;
  allowPrevious: boolean;
  nextPage: number;
  previousPage: number;
  videos: video[];
};
const searchHandler = async () => {
  // strUri.value = `/api1/users?pages=${pages.value}&limit=${limit.value}&search=${searchKeywords.value}`;
  page.value = 1;
  items.value = [];
  // strUri.value = `/api1/users?pages=${page.value}&limit=${limit.value}&search=${searchKeywords.value}`;
  // await loadUser();
};

function openCreate() {
  modal.open(Createvideomodal, {
    onSuccess() {
      modal.reset();
      toast.add({
        title: "Create Success !",
        id: "modal-success",
      });
      searchHandler();
    },
    onCancel() {
      modal.reset();
    },
  });
}

onMounted(() => {
  if (!checkPermission(Actions.READ_VIDEO_CATEGORY)) {
    setItems([]);
    navigateTo("/dashboard");
  } else {
    strUri.value = `/api1/users?cat=${id}&pages=${page.value}&limit=${limit.value}`;
  }
});
</script>
