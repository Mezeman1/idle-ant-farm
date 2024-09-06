import {createApp} from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import App from './App.vue'
import {routes} from './routes'
import './index.css'
// or
import {plugin as VueTippy} from 'vue-tippy'
import 'tippy.js/dist/tippy.css' // optional for styling

import {createPinia} from 'pinia'
import ToastPlugin from 'vue-toast-notification'
// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-sugar.css'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes: import.meta.hot ? [] : routes,
})

if (import.meta.hot) {
  let removeRoutes = []

  for (const route of routes) {
    removeRoutes.push(router.addRoute(route))
  }

  import.meta.hot?.accept('./routes.ts', ({routes}) => {
    for (const removeRoute of removeRoutes) removeRoute()
    removeRoutes = []
    for (const route of routes) {
      removeRoutes.push(router.addRoute(route))
    }
    router.replace('')
  })
}


app.use(router)
app.use(createPinia())
app.use(ToastPlugin)

app.use(
  VueTippy,
  // optional
  {
    directive: 'tooltip', // => v-tippy
    component: 'tooltip', // => <tippy/>
    componentSingleton: 'tooltip-singleton', // => <tippy-singleton/>,
    defaultProps: {
      placement: 'auto-end',
      allowHTML: true,
    }, // => Global default options * see all props
  },
)
app.mount('#app')
