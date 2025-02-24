<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import axios from "axios";
import { useBreadcrumbStore } from "@/stores/breadcrumb.store";

import moment from "moment-timezone";
import Createlanguagemodel from "./createlanguagemodel.vue";
import Editlanguagemodal from "./editlanguagemodal.vue";
import Deletelanguagemodal from "./deletelanguagemodal.vue";

const { setItems } = useBreadcrumbStore();
const toast = useToast();
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const table = useTemplateRef("table");
const modal = useModal();
const globalFilter = ref("");
const isOpen = ref(false);
type language = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
type pageDataType = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  allowNext: boolean;
  allowPrevious: boolean;
  nextPage: number;
  previousPage: number;
  users: language[];
};

const data = ref<language[]>([]);
const pageData = ref<pageDataType>();

const columns: TableColumn<language>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#`,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Language",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => `${row.getValue("name")}`,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Created Date",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) =>
      `${moment(row.getValue("createdAt"))
        .tz("Asia/Bangkok")
        .format("DD-MMMM-YYYY")}`,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Updated Date",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) =>
      `${moment(row.getValue("updatedAt"))
        .tz("Asia/Bangkok")
        .format("DD-MMMM-YYYY")}`,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content: {
              align: "end",
            },
            items: getRowItems(row),
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
            })
        )
      );
    },
  },
];

function getRowItems(row: Row<language>) {
  return [
    checkPermission(Actions.UPDATE_LANGUAGE) && {
      type: "label",
      label: "ACTIONS :",
    },
    checkPermission(Actions.UPDATE_LANGUAGE) && {
      label: "Edit",
      icon: "i-lucide-edit",
      color: "warning",
      onSelect() {
        userId.value = Number(row.original.id);
        openEdit();
      },
    },
    checkPermission(Actions.DELETE_LANGUAGE) && {
      label: "Delete",
      icon: "i-lucide-trash",
      color: "error",
      async onSelect() {
        userId.value = Number(row.original.id);
        openDelete();
      },
    },
  ];
}

const count = ref(0);
const userId = ref(0);

function openCreate() {
  modal.open(Createlanguagemodel, {
    onSuccess() {
      modal.reset();
      toast.add({
        title: "Create Success !",
        id: "modal-success",
      });
      loadData();
    },
    onCancel() {
      modal.reset();
    },
  });
}
function openEdit() {
  modal.open(Editlanguagemodal, {
    id: userId.value,
    onSuccess() {
      modal.reset();
      toast.add({
        title: "Success !",
        id: "modal-success",
      });
      loadData();
    },
    onCancel() {
      modal.reset();
    },
  });
}
function openDelete() {
  modal.open(Deletelanguagemodal, {
    id: userId.value,
    onSuccess() {
      modal.reset();
      toast.add({
        title: "Success !",
        id: "modal-success",
      });
      loadData();
    },
    onCancel() {
      modal.reset();
    },
  });
}

const pages = ref();
const limit = ref();
const strUri = ref();
const loadData = async () => {
  strUri.value = `/api1/languages?pages=${pages.value}&limit=${limit.value}&search=${searchKeywords.value}`;
  await axios
    .get(strUri.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(async (res) => {
      pageData.value = await res.data.data;
      data.value = await res.data.data.languages;
    })
    .catch((err) => console.log(err))
    .then(() => {
      isLoading.value = false;
    });
};

onMounted(async () => {
  // pages.value = await useRoute().query.pages ? Number(useRoute().query.pages) : 1;
  // limit.value = await useRoute().query.limit ? Number(useRoute().query.limit) : 6;
  if (checkPermission(Actions.CREATE_LANGUAGE)) {
    pages.value = 1;
    limit.value = 6;
    setItems(["languages"]);
    strUri.value = `/api1/languages?pages=${pages.value}&limit=${limit.value}`;
    await loadData();
  } else {
    setItems([]);
    navigateTo("/dashboard");
  }
});
const pagingClick = async () => {
  // strUri.value = `/api1/users?pages=${pages.value}&limit=${limit.value}&search=${searchKeywords.value}`;
  isLoading.value = true;
  await loadData();
};

const searchKeywords = ref("");
const isLoading = ref(false);
const searchHandler = async () => {
  // strUri.value = `/api1/users?pages=${pages.value}&limit=${limit.value}&search=${searchKeywords.value}`;
  isLoading.value = true;
  pages.value = 1;
  data.value = [];
  await loadData();
};
</script>

<template>
  <div data-aos="fade-left">
    <div
      class="flex justify-between px-4 py-3.5 border-b border-[var(--ui-border-accented)]"
    >
      <!-- <UInput v-model="globalFilter" class="min-w-md" placeholder="Filter..." /> -->
      <UInput
        :loading="isLoading"
        icon="i-lucide-search"
        class="w-md"
        size="md"
        variant="outline"
        placeholder="Search... (Language)"
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
        class="font-BaiJamjureeSemiBold"
        label="Create"
        @click="openCreate()"
        v-if="checkPermission(Actions.CREATE_LANGUAGE)"
      />
    </div>
    <UTable
      :loading="isLoading"
      ref="table"
      v-model:global-filter="globalFilter"
      :data="data"
      :columns="columns"
      class="flex-1"
    />
    <div
      class="flex flex-row justify-between px-4 py-1.5 border-t border-[var(--ui-border-accented)]"
    >
      <!-- <UInput v-model="globalFilter" icon="i-lucide-filter" class="min-w-md" placeholder="Filter..." /> -->
      <UPagination
        v-model:page="pages"
        :items-per-page="limit"
        :total="pageData?.totalRecords"
        @click="pagingClick()"
      />
    </div>
  </div>
</template>
