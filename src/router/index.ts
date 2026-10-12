import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', redirect: '/dashboard' },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
      },
      {
        path: 'stores',
        name: 'store-list',
        component: () => import('@/views/stores/StoreListView.vue'),
      },
      {
        path: 'stores/new',
        name: 'store-create',
        component: () => import('@/views/stores/StoreCreateView.vue'),
      },
      {
        path: 'stores/:id',
        name: 'store-detail',
        component: () => import('@/views/stores/StoreDetailView.vue'),
      },
      {
        path: 'stores/:id/edit',
        name: 'store-edit',
        component: () => import('@/views/stores/StoreEditView.vue'),
      },
      {
        path: 'diagnosis',
        name: 'diagnosis',
        component: () => import('@/views/diagnosis/DiagnosisView.vue'),
      },
      {
        path: 'plan',
        name: 'plan',
        component: () => import('@/views/plan/PlanView.vue'),
      },
      {
        path: 'content',
        name: 'content-home',
        component: () => import('@/views/content/ContentHomeView.vue'),
      },
      {
        path: 'content/:type',
        name: 'content-create',
        component: () => import('@/views/content/ContentCreateView.vue'),
      },
      {
        path: 'delivery',
        name: 'delivery',
        component: () => import('@/views/delivery/DeliveryView.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/settings/SettingsView.vue'),
      },
      {
        path: 'help',
        name: 'help',
        component: () => import('@/views/help/HelpView.vue'),
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
