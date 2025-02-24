<template>
  <div
    class="border border-gray-300 bg-slate-50 dark:bg-slate-900 dark:border-0 dark:hover:border-2 dark:hover:border-slate-500 hover:shadow-xl"
  >
    <div class="video-container">
      <iframe
        :src="`https://www.youtube.com/embed/${item.youtubeId}`"
        frameborder="1"
        allow="accelerometer; autoplay"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
    <div class="py-2 px-3 text-sm">
      <table>
        <tbody>
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
              {{ moment(item.published).tz("Asia/BangKok").format("DD-MMMM-YYYY") }}
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
              {{ item.videoCategory.name }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="py-2 flex items-center justify-end gap-3">
        <UButton
          label="Delete"
          variant="outline"
          color="error"
          @click="$emit('deleteEvent')"
          v-if="checkPermission(Actions.UPDATE_VIDEO)"
        />
        <UButton label="Edit" @click="$emit('editEvent')" v-if="checkPermission(Actions.DELETE_VIDEO  )"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from "moment-timezone";

// Define props for the card
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
defineProps<{
  item: video;
}>();
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
