<script setup>
import { reactive, ref } from "vue";
import LabelInput from "./components/LabelInput.vue";
import { getCheckCode, getFirstVal } from "./utils/caculateNum.js";

const errorMessage = ref("");
const resultArr = ref([]);
const placeHolderText = ref("");
const labelForm = reactive({
  startingAccount: "",
  accountNumber: "",
});

const changeInput = (val, id) => {
  labelForm[id] = val;
};


function cleanHandle(){
  
  // 清空 input 值
  labelForm.startingAccount = "";
  labelForm.accountNumber = "";
  resultArr.value = [];
  
// 處理錯誤訊息
  if (errorMessage.value.length !== 0) {
    // 設置定時器，在三秒後清空 errorMessage
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
}

function clearInput() {
  // 清空 input 值
  labelForm.startingAccount = "";
  labelForm.accountNumber = "";
  resultArr.value = [];
}

// 處理錯誤訊息
function errorHandle() {
  if (errorMessage.value.length !== 0) {
    // 設置定時器，在三秒後清空 errorMessage
    setTimeout(() => {
      errorMessage.value = "";
      clearInput();
    }, 3000);
  }
}

// 起始帳號規則
const startingAccountLengthRegex = /^\d{11}$/;
const startingAccountNumberRegex = /^\d+$/;
// 帳號數量規則
const accountNumberRegex = /^[1-9]\d{0, 3}$/;
// 分行別規則
const branchRegex = /^(0[1-9]|[1-8][0-9]|9[0-8])$/;
// 科目別規則
const subjectRegex = /^(10|20|30|40|50|51|66|77|88)/;


// 驗證表單
const validateForm = () => {
  // 驗證表單，全部通過返回 true
  errorMessage.value = ""; // 用於重置錯誤信息，否則會bug

  labelForm.startingAccount = labelForm.startingAccount.trim();
  // 驗證起始帳號長度 + 輸入
  if (!startingAccountLengthRegex.test(labelForm.startingAccount)) {
    errorMessage.value = "起始帳號長度錯誤";
    cleanHandle();
    return;
  }
  if (!startingAccountNumberRegex.test(labelForm.startingAccount)) {
    errorMessage.value = "起始帳號需為數字";
    cleanHandle();
    return;
  }

  // 驗證帳號輸入數量
  if (accountNumberRegex.test(labelForm.accountNumber)) {
    errorMessage.value = "帳號數量錯誤";
    cleanHandle();
    return;
  }

  // 分行別驗證
  const branch = parseInt(labelForm.startingAccount.slice(0, 3));
  if (branchRegex.test(branch) || branch === 19) {
    errorMessage.value = "分行別錯誤";
    cleanHandle();
    return;
  }

  let result = [];

  for (let i = 0; i < labelForm.accountNumber; i++) {
    // 驗證科目別
    const subject = parseInt(labelForm.startingAccount.slice(3, 5));
    if (!subjectRegex.test(subject)) {
      errorMessage.value = "生成帳號將造成科目別錯誤";
      cleanHandle();
      return;
    }
    // 分別丟入函數運算得出檢核碼
    const firstVal = getFirstVal(labelForm.startingAccount, branch, subject);
    const code = getCheckCode(firstVal);

    // 初始帳號加入檢核碼
    result.push(labelForm.startingAccount + code);
    labelForm.startingAccount = (parseInt(labelForm.startingAccount) + 1)
      .toString()
      .padStart(11, "0");
  }

  resultArr.value = result;

  // 清空 input 值
  labelForm.startingAccount = "";
  labelForm.accountNumber = "";
};
</script>

<template>
  <div class="pt-10">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-sm overflow-hidden md:max-w-xl">
      <div class="pt-10">
      <h1 class="text-2xl text-gray-900 font-extrabold">帳號產生器</h1>
        <div class="mb-5 mt-10">
          <LabelInput
            id="startingAccount"
            :inputVal="labelForm.startingAccount"
            label="起始帳號"
            placeHolderText="01234567899"
            @changeInput="changeInput"
            @toValidate="validateForm"
          />
        </div>
        <div class="mb-3 mb-10">
          <LabelInput
            id="accountNumber"
            :inputVal="labelForm.accountNumber"
            label="帳號數量"
            placeHolderText="99"
            @changeInput="changeInput"
            @toValidate="validateForm"
          />
        </div>
        <!-- 點擊按鈕時觸發 submitForm 方法 -->
        <button class="relative inline-flex items-center justify-center p-0.5 mb-10 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-200 to-lime-200 group-hover:from-teal-200 group-hover:to-lime-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800" @click="validateForm">
        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          Send
        </span>
        </button>

      </div>
    </div>

    <div v-if="errorMessage" class=" mt-5 max-w-md mx-auto rounded-xl shadow-sm overflow-hidden md:max-w-xl flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
      <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <span class="sr-only">Info</span>
      <div>
        <span class="font-medium">注意！</span>{{ errorMessage }}
      </div>
    </div>

    <!-- 顯示生成的完整帳號 -->
    <div v-else-if="resultArr.length > 0" class="mt-5 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-xlw-50 md:max-w-xl mb-10">
      <h1 class="text-2xl text-gray-800 font-semibold mt-10 mb-10">生成的帳號</h1>
      <ul class="mb-10">
        <li v-for="(account, index) in resultArr" :key="index">
          {{ account }}
        </li>
      </ul>
      <!-- 點擊按鈕時觸發 clearInput 方法 -->
        <button class="relative inline-flex items-center justify-center p-0.5 mb-10 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-200 to-lime-200 group-hover:from-teal-200 group-hover:to-lime-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800" @click="cleanHandle">
        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          Clear
        </span>
        </button>
    </div>

  </div>
</template>

<style>
</style>