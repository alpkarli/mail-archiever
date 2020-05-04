import Vue from 'vue'
import App from './App.vue'
import {
  BootstrapVue,
  IconsPlugin,
  DropdownPlugin,
  TablePlugin,
  LayoutPlugin
} from 'bootstrap-vue'
import VCalendar from 'v-calendar'
import VueMoment from 'vue-moment'
import {moment as timezone} from 'moment-timezone'
import './main.scss'

Vue.config.productionTip = false

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(LayoutPlugin)
Vue.use(DropdownPlugin)
Vue.use(TablePlugin)
// Use v-calendar & v-date-picker components
Vue.use(VCalendar);
// Moment
Vue.use(VueMoment, {
  timezone,
});

new Vue({
  render: h => h(App),
}).$mount('#app')