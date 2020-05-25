import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

// 懒加载模式，this generates a separate chunk (about.[hash].js) for this route
const page = name => () => import('../views/' + name)

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // TODO
  window.document.title = to.meta.title
  if (to.meta.requireAuth === true) {
    // 需要登录权限进入的路由
    if (!localStorage.getItem('token')) {
      // 取不到登录信息
      return next({ name: 'login' })
    } else {
      // 取得到登录信息，进行下一步
      return next()
    }
  } else {
    // 不需要登录权限
    return next()
  }
})

export default router
