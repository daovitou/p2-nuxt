<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import axios from "axios";
import Editusermodal from "./editusermodal.vue";
import Createusermodal from "./createusermodal.vue";
import Deleteusermodal from "./deleteusermodal.vue";
import { useBreadcrumbStore } from "@/stores/breadcrumb.store";
const { setItems } = useBreadcrumbStore();
const toast = useToast();
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const modal = useModal();
const globalFilter = ref("");
type users = {
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
type pageData = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  allowNext: boolean;
  allowPrevious: boolean;
  nextPage: number;
  previousPage: number;
  users: users[];
};

const data = ref<users[]>([]);
const pageData = ref<pageData>();

const columns: TableColumn<users>[] = [
  {
    accessorKey: "profile",
    header: "#",
    cell: ({ row }) => `${row.getValue("profile")}`,
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "First Name",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => `${row.getValue("firstname")}`,
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Last Name",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => `${row.getValue("lastname")}`,
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Username",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => `${row.getValue("username")}`,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Email",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => `${row.getValue("email")}`,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Phone",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => `${row.original.phone}`,
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Role",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => `${row.original.role.name}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const color = {
        true: "success" as const,
        false: "error" as const,
      }[row.getValue("status") as string];
      return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
        row.getValue("status") ? "Granted" : "Blocked"
      );
    },
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

function getRowItems(row: Row<users>) {
  return [
    checkPermission(Actions.UPDATE_USER) && {
      type: "label",
      label: "STATUS :",
    },
    checkPermission(Actions.UPDATE_USER) && {
      label: row.original.status ? "Block" : "Grant",
      icon: row.original.status ? "i-lucide-shield-x" : "i-lucide-shield-check",
      color: row.original.status ? "error" : "success",
      async onSelect() {
        if (await changeStatus(Number(row.original.id), !row.original.status)) {
          if (row.original.status) {
            toast.add({
              title: `User account is bloked.`,
              color: "error",
              icon: "i-lucide-shield-x",
            });
          } else {
            toast.add({
              title: `User account is granted.`,
              color: "success",
              icon: "i-lucide-shield-check",
            });
          }
        }
      },
    },
    checkPermission(Actions.UPDATE_USER) && {
      type: "separator",
    },
    (checkPermission(Actions.UPDATE_USER) || checkPermission(Actions.DELETE_USER) ) &&
    {
      type: "label",
      label: "ACTIONS :",
    },
    checkPermission(Actions.UPDATE_USER) && {
      label: "Edit",
      icon: "i-lucide-edit",
      color: "warning",
      onSelect() {
        userId.value = Number(row.original.id);
        openEdit();
      },
    },
    checkPermission(Actions.DELETE_USER) && {
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

const changeStatus = async (id: number, status: boolean) => {
  let result = false;
  await axios
    .put(
      `/api1/users/${id}`,
      {
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .then(async (res) => {
      if (res.status === 200) {
        result = true;
        await loadUser();
      }
    });
  return result;
};

const count = ref(0);
const userId = ref(0);

function openCreate() {
  modal.open(Createusermodal, {
    onSuccess() {
      modal.reset();
      toast.add({
        title: "Create Success !",
        id: "modal-success",
      });
      loadUser();
    },
    onCancel() {
      modal.reset();
    },
  });
}
function openEdit() {
  modal.open(Editusermodal, {
    id: userId.value,
    onSuccess() {
      modal.reset();
      toast.add({
        title: "Success !",
        id: "modal-success",
      });
      loadUser();
    },
    onCancel() {
      modal.reset();
    },
  });
}
function openDelete() {
  modal.open(Deleteusermodal, {
    id: userId.value,
    onSuccess() {
      modal.reset();
      toast.add({
        title: "Success !",
        id: "modal-success",
      });
      loadUser();
    },
    onCancel() {
      modal.reset();
    },
  });
}
const pages = ref();
const limit = ref();
const strUri = ref();
const loadUser = async () => {
  strUri.value = `/api1/users?pages=${pages.value}&limit=${limit.value}&search=${searchKeywords.value}`;
  await axios
    .get(strUri.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(async (res) => {
      pageData.value = await res.data.data;
      data.value = await res.data.data.users;
    })
    .catch((err) => console.log(err))
    .finally(() => {
      isLoading.value = false;
    });
};

onMounted(async () => {
  // pages.value = await useRoute().query.pages ? Number(useRoute().query.pages) : 1;
  // limit.value = await useRoute().query.limit ? Number(useRoute().query.limit) : 6;
  if (!checkPermission(Actions.READ_USER)) {
    setItems([]);
    navigateTo("/dashboard");
  } else {
    pages.value = 1;
    limit.value = 6;
    setItems(["users"]);
    strUri.value = `/api1/users?pages=${pages.value}&limit=${limit.value}`;
    await loadUser();
  }
});

const pagingClick = async () => {
  // navigateTo(`/dashboard/users?pages=${pages.value}&limit=${limit.value}`);
  // strUri.value = `/api1/users?pages=${pages.value}&limit=${limit.value}&search=${searchKeywords.value}`;
  // data.value = [];
  isLoading.value = true;
  await loadUser();
};

const searchKeywords = ref("");
const isLoading = ref(false);
const searchHandler = async () => {
  // strUri.value = `/api1/users?pages=${pages.value}&limit=${limit.value}&search=${searchKeywords.value}`;
  pages.value = 1;
  data.value = [];
  isLoading.value = true;
  await loadUser();
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
        placeholder="Search... (firstname, lastname, username, email, phone, role)"
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
        v-if="checkPermission(Actions.CREATE_USER)"
      />
    </div>
    <UTable
      :loading="isLoading"
      loading-color="primary"
      loading-animation="carousel"
      ref="table"
      v-model:global-filter="globalFilter"
      :data="data"
      :columns="columns"
      class="flex-1"
    >
      <template #profile-cell="{ row }">
        <div class="flex items-center gap-3">
          <UAvatar :src="`${row.original.profile}`" size="lg" />
        </div>
      </template>
      <!-- Skeleton -->
      <template #profile-cell="{ row }" v-if="isLoading">
        <div class="flex items-center gap-3">
          <USkeleton class="h-9 w-9 rounded-md bg-slate-300" />
        </div>
      </template>
      <template #firstname-cell="{ row }" v-if="isLoading">
        <USkeleton class="h-8 w-24 rounded-md bg-slate-300" />
      </template>
      <template #lastname-cell="{ row }" v-if="isLoading">
        <USkeleton class="h-8 w-24 rounded-md bg-slate-300" />
      </template>
      <template #username-cell="{ row }" v-if="isLoading">
        <USkeleton class="h-8 w-24 rounded-md bg-slate-300" />
      </template>
      <template #email-cell="{ row }" v-if="isLoading">
        <USkeleton class="h-8 w-32 rounded-md bg-slate-300" />
      </template>
      <template #phone-cell="{ row }" v-if="isLoading">
        <USkeleton class="h-8 w-24 rounded-md bg-slate-300" />
      </template>
      <template #role-cell="{ row }" v-if="isLoading">
        <USkeleton class="h-8 w-16 rounded-md bg-slate-300" />
      </template>
      <template #status-cell="{ row }" v-if="isLoading">
        <USkeleton class="h-8 w-16 rounded-md bg-slate-300" />
      </template>
    </UTable>

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
