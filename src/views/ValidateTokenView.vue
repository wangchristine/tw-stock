<script setup>
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useCommonStore } from "@/stores/common";

const commonStore = useCommonStore();
const { isLoading } = storeToRefs(commonStore);
const router = useRouter();

let tokenDOM = ref(null);
let token = ref(null);
let errors = ref([]);

onMounted(() => {
  tokenDOM.value.focus();
});

const sendValidateToken = async () => {
  if (!token.value) {
    errors.value.token = "欄位不得為空";
  } else {
    errors.value = [];

    try {
      isLoading.value = true;
      await commonStore.postValidateToken(token.value);
      const removeKeyPrefix = "todayHistory";
      for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).indexOf(removeKeyPrefix) != -1) {
          localStorage.removeItem(localStorage.key(i));
        }
      }
      router.push({ name: "home" });
    } catch (err) {
      errors.value.token = "通關密碼錯誤";
    }
    isLoading.value = false;
  }
};
</script>

<template>
  <main>
    <div class="container">
      <form class="token-form">
        <h2>通關密碼</h2>
        <br />
        <input
          type="text"
          :class="['token', { 'error-field': errors.token }]"
          name="token"
          ref="tokenDOM"
          v-model="token"
        />
        <p v-if="errors.token" class="token-error">{{ errors.token }}</p>
        <button type="submit" class="send" @click.prevent="sendValidateToken()">確定</button>
      </form>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 1440px;
  display: flex;
  justify-content: space-around;
  text-align: center;
  width: 80%;
  margin: auto;
  flex-wrap: wrap;
}

.token-form {
  min-width: 500px;
  margin-top: 30px;
  padding: 20px 10px;
  border: solid 1px;
  border-radius: 20px;
  line-height: 40px;
}

.token-form .token {
  display: block;
  width: 80%;
  margin: 0 auto;
  padding: 8px 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 0;
}

.token-form .error-field {
  border: #eb5959 2px solid;
}

.token-form .token-error {
  color: #eb5959;
}

.token-form .send {
  background-color: #53334c;
  color: #fff;
  border: 1px #fff solid;
  border-radius: 5px;
  padding: 6px 10px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .token-form {
    min-width: initial;
    width: 100%;
  }
}
</style>
