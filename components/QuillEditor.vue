<script setup>
import { ref, onMounted, defineEmits, defineProps } from "vue";

const editor = ref(null);
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: "Start writing...",
  },
});

let quillInstance = null;

onMounted(async () => {
  const { default: Quill } = await import("quill");
  import("quill/dist/quill.snow.css");
  import("quill-mention");
  const TableModule = (await import("quill-table")).default;
  Quill.register("modules/table", TableModule);
  const Image = Quill.import("formats/image");
  Image.sanitize = function (url) {
    return url; // Allow all image sources
  };
  Quill.register(Image, true);

  quillInstance = new Quill(editor.value, {
    theme: "snow",
    placeholder: props.placeholder,
    modules: {
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        source: function (searchTerm, renderList) {
          const users = [
            { id: 1, value: "Alice" },
            { id: 2, value: "Bob" },
          ];
          const matches = users.filter((user) =>
            user.value.toLowerCase().includes(searchTerm.toLowerCase())
          );
          renderList(matches);
        },
      },
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        [{ table: 'insert-table' }, { table: 'insert-row-above' }, { table: 'insert-row-below' }, { table: 'insert-column-left' }, { table: 'insert-column-right' }, { table: 'delete-row' }, { table: 'delete-column' }, { table: 'delete-table' }],
        ["clean"],
      ],
      table: true,
      handlers: {
        image: () => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.click();

          input.onchange = async () => {
            const file = input.files[0];
            if (file) {
              const formData = new FormData();
              formData.append("image", file);

              // 🔹 Upload Image to Your Server
              const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });
              const data = await response.json();

              // Insert uploaded image URL into Quill
              const range = quillInstance.getSelection();
              quillInstance.insertEmbed(range.index, "image", data.url);
            }
          };
        },
      },
    },
  });

  quillInstance.on("text-change", () => {
    emit("update:modelValue", quillInstance.root.innerHTML);
  });

  if (props.modelValue) {
    quillInstance.root.innerHTML = props.modelValue;
  }
});
</script>

<template>
  <div ref="editor"></div>
</template>
