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
  </div>
</template>

<script>
export default {
  name: 'home',
  data(){
    return{
      hideBar:true,
    }
  },
  mounted(){
 
  },
  methods:{
    
  }
}
</script>

<style lang="less">
.home{
  .list{
    height: 250px;
  }
  .pink{
    background: pink;
  }
  .red{
    background: red;
  }
  .green{
    background: green;
  }
  .white{
    height: 50px;
    position: sticky;
    top: 0;
    background: #fff;
  }
  .black{
    background: black;
  }
}

</style>
