
import scrollBox from './scroll-box'
import nativeScroll from './native-scroll'
import loadMore from './loadMore'

const components = {
  scrollBox,
  nativeScroll,
  loadMore
}

const install = function (Vue) {
  for (let name in components) {
    Vue.component(name, components[name])
  }
}

export {
  install,
  scrollBox,
  nativeScroll,
  loadMore
}