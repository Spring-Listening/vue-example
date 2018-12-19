
import scrollBox from './scroll-box'
import nativeScroll from './native-scroll'

const components = {
  scrollBox,
  nativeScroll
}

const install = function (Vue) {
  for (let name in components) {
    Vue.component(name, components[name])
  }
}

export {
  install,
  scrollBox,
  nativeScroll
}