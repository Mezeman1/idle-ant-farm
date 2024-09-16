import Home from './views/HomePage.vue'
import NotFound from './views/NotFound.vue'

export const routes = [
  { path: '/idle-ant-farm', component: Home, meta: { title: 'Home' }},
  { path: '/:pathMatch(.*)*', component: NotFound, meta: { title: 'Page not found' }},
]
