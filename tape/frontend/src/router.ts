import {
  createRouter as createVueRouter,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("./components/BaseLayout.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("./pages/HomePage.vue"),
      },
      {
        path: "mine",
        name: "UserBoardListing",
        component: () => import("./pages/UserBoardListingPage.vue"),
      },
      {
        path: "login",
        name: "Login",
        component: () => import("./pages/LoginPage.vue"),
      },
      {
        path: "confession",
        name: "Confession",
        component: () => import("./pages/DailyConfessionPage.vue"),
      },
      {
        path: "/board/:boardId",
        name: "BoardDetail",
        component: () => import("./pages/BoardDetailPage.vue"),
      },
      {
        path: "/create",
        name: "BoardCreate",
        component: () => import("./pages/BoardCreatePage.vue"),
      },
    ],
  },
];

const router = createVueRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  if (!localStorage.getItem("token") && to.name !== "Login") {
    return { name: "Login" };
  }
});

export function createRouter() {
  return router;
}
