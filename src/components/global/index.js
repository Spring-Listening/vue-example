
import scrollBox from './scroll-box'

const components = {
  scrollBox
}

const install = function (Vue) {
  for (let name in components) {
    Vue.component(name, components[name])
  }
}

export {
  install,
  scrollBox
}