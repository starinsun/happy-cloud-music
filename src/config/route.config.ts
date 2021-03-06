// @ts-nocheck
import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import Recommend from "../pages/recommend.vue";
import RecommendDetail from "../pages/recommend-detail.vue";
import User from "../components/User.vue";
import SingerDetail from "../pages/singer-detail.vue";
import RankDetail from "../pages/rank-detail.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/recommend",
  },
  {
    path: "/recommend",
    name: "recommend",
    component: Recommend,
    children: [
      {
        path: "/recommend/user",
        component: User,
      },
      {
        path: ":id",
        component: RecommendDetail,
      },
    ],
  },
  {
    path: "/singer",
    name: "singer",
    component: () => import("../pages/singer.vue"),
    children: [
      {
        path: "/singer/user",
        component: User,
      },
      {
        path: ":id",
        component: SingerDetail,
      },
    ],
  },
  {
    path: "/rank",
    name: "rank",
    component: () => import("../pages/rank.vue"),
    children: [
      {
        path: "/rank/user",
        component: User,
      },
      {
        path: ":id",
        component: RankDetail,
      },
    ],
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../pages/search.vue"),
    children: [
      {
        path: "/search/user",
        component: User,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
