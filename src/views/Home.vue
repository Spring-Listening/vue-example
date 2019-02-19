<template>
  <div class="home">
    <scroll-box :hideBar="hideBar">
      <div class="list green"></div>
      <div class="list pink"></div>
      <div class="list white">111111111111</div>
      <div class="list red"></div>
      <div class="list blue"></div>
      <div class="list pink"></div>
      <div class="list black"></div>
      <div class="list green"></div>
    </scroll-box>
    <!-- <native-scroll></native-scroll> -->
  </div>
</template>

<script>
export default {
  name: 'home',
  data(){
    return{
      hideBar:false,
    }
  },
  mounted(){
 
  },
  methods:{
    
  }
}
</script>

<style lang="less">
.bg(@color){
  background: @color;
}
.home{
  .list{
    height: 250px;
    &.pink{
      .bg(pink)
    }
    &.red{
      .bg(red)
    }
    &.green{
      .bg(green)
    }
    &.white{
      height: 50px;
      position: sticky;
      top: 0;
      .bg(blue)
    }
    &.black{
      .bg(black)
    }
  }
  
}

</style>
