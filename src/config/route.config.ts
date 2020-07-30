import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import Recommend from "../pages/recommend.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/recommend",
  },
  {
    path: "/recommend",
    name: "recommend",
    // @ts-ignore
    component: Recommend,
    // children: [
    //   {
    //     path: "/recommend/user",
    //     component: User,
    //   },
    //   {
    //     path: ":id",
    //     component: DiscDetail,
    //   },
    // ],
  },
  {
    path: "/singer",
    name: "singer",
    component: () => import("../pages/singer.vue"),
    // children: [
    //   {
    //     path: "/singer/user",
    //     component: User,
    //   },
    //   {
    //     path: ":id",
    //     component: SingerDetail,
    //   },
    // ],
  },
  {
    path: "/rank",
    name: "rank",
    component: () => import("../pages/rank.vue"),
    // children: [
    //   {
    //     path: "/rank/user",
    //     component: User,
    //   },
    //   {
    //     path: ":id",
    //     component: RankDetail,
    //   },
    // ],
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../pages/search.vue"),
    // children: [
    //   {
    //     path: "/search/user",
    //     component: User,
    //   },
    // ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
