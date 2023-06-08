<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { useQuery } from "@tanstack/vue-query";
import { getUser } from "../api";

const { mobile } = useDisplay();
const router = useRouter();
const drawer = ref(!mobile.value);

const isLoggedIn = computed(() => {
  return localStorage.getItem("token");
});

function logout() {
  localStorage.removeItem("token");
  router.push({ name: "Login" });
}

const { data: user } = useQuery({
  queryKey: ["user"],
  queryFn: async () => getUser(),
});
</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar title="匿名墙" prominent>
        <v-app-bar-nav-icon
          v-if="mobile"
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="mobile ? 'bottom' : 'left'"
      >
        <v-list nav>
          <v-list-item
            prepend-icon="mdi-home-outline"
            title="主页"
            value="Home"
            @click="router.push({ name: 'Home' })"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-heart-outline"
            title="每日表白墙"
            value="DailyConfession"
            @click="router.push({ name: 'Confession' })"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-view-list"
            title="我的匿名墙"
            value="UserBoardListing"
            @click="router.push({ name: 'UserBoardListing' })"
          ></v-list-item>
          <v-list-item>
            <v-btn @click="router.push({ name: 'BoardCreate' })" block
              >创建匿名墙</v-btn
            >
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <template v-slot:append>
          <div v-if="user" class="pa-2 text-center text-caption">
            {{ `用户: ${user.username}` }}
          </div>
          <div class="pa-2">
            <v-btn v-if="isLoggedIn" block @click="logout"> 登出 </v-btn>
            <v-btn v-else block @click="router.push({ name: 'Login' })">
              登入
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <v-main class="bg-deep-purple-darken-3" style="min-height: 100vh">
        <router-view></router-view>
      </v-main>
    </v-layout>
  </v-card>
</template>
