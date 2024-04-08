<script setup>
import { computed } from "vue";

// 使用props跟emit去傳遞數據，進行數據同步
const props = defineProps(["id", "inputVal", "label", "placeHolderText"]);
const emit = defineEmits(["changeInput", "toValidate"]);

const temp = computed({
  get() {
    // 獲取用戶輸入數據
    return props.inputVal;
  },
  set(val) {
    // 處理數據同步修改
    emit("changeInput", val, props.id);
  },
});

// 處理enter鍵傳送功能
const pressEnter = () => {
  emit("toValidate");
};
</script>

<template>
  <div class="">
    <label :for="props.id" class="form-label max-w-full mr-5 font-medium">{{ props.label }}</label>
    <input
      type="text"
      :id="props.id"
      :placeholder="props.placeHolderText"
      v-model.lazy="temp"
      @keyup.enter="pressEnter"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-300 focus:border-green-300 max-w-full	p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>
</template>