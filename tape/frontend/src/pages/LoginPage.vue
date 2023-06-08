<script setup lang="ts">
import { ref } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { login, register } from "../api";
import { useRouter } from "vue-router";

const tab = ref("Login");
const router = useRouter();

const loginFormData = ref({
  username: "",
  password: "",
});

const registerFormData = ref({
  username: "",
  password: "",
  confirmPassword: "",
});

const snackbar = ref(false);

const required = () => (v: string) => !!v || "必填项";
const minLength = (length: number) => (v: string) =>
  (v && v.length >= length) || `至少 ${length} 个字符`;

const loginMutation = useMutation({
  mutationFn: async () => await login(loginFormData.value),
  onSuccess: ({ token }: { token: string }) => {
    localStorage.setItem("token", token);
    router.push("/");
  },
});

const registerMutation = useMutation({
  mutationFn: async () => await register(registerFormData.value),
  onSuccess: () => {
    snackbar.value = true;
    setTimeout(() => {
      tab.value = "Login";
    }, 1000);
  },
});
</script>

<template>
  <div class="h-100 d-flex">
    <v-card width="300" class="mx-auto my-auto pa-4">
      <v-card-title> 欢迎来到匿名墙 </v-card-title>
      <v-tabs v-model="tab" background-color="primary" dark>
        <v-tab value="Login">登入</v-tab>
        <v-tab value="Register">注册</v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="Login">
            <v-form
              v-if="tab == 'Login'"
              @submit.prevent="loginMutation.mutate"
            >
              <v-text-field
                v-model="loginFormData.username"
                label="用户名"
                :rules="[required()]"
              ></v-text-field>
              <v-text-field
                v-model="loginFormData.password"
                label="密码"
                type="password"
                :rules="[required()]"
              ></v-text-field>
              <v-btn
                type="submit"
                :loading="loginMutation.isLoading.value"
                block
                class="mt-2"
                >登入</v-btn
              >
            </v-form>
          </v-window-item>
          <v-window-item value="Register">
            <v-form
              v-if="tab == 'Register'"
              @submit.prevent="registerMutation.mutate"
            >
              <v-text-field
                v-model="registerFormData.username"
                label="用户名"
                :rules="[required(), minLength(6)]"
              ></v-text-field>
              <v-text-field
                v-model="registerFormData.password"
                label="密码"
                type="password"
                :rules="[required(), minLength(8)]"
              ></v-text-field>
              <v-btn
                type="submit"
                block
                class="mt-2"
                :loading="registerMutation.isLoading.value"
                >注册</v-btn
              >
            </v-form>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
  <v-snackbar v-model="snackbar">注册成功！</v-snackbar>
</template>
