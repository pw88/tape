import { createApp } from "vue";
import App from "./App.vue";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { md2 } from "vuetify/blueprints";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { VueQueryPlugin } from "@tanstack/vue-query";

import { createRouter } from "./router";

const vuetify = createVuetify({
  components,
  directives,
  blueprint: md2,
});

const router = createRouter();

createApp(App).use(router).use(vuetify).use(VueQueryPlugin).mount("#app");
