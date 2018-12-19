<template>
  <div class="native-scroll ui-page-wrapper">
    <div class="ui-page-content">
      <div class="content" >
        <div class="pink"></div>
        <div class="red"></div>
        <div class="white" style="height:50px;"></div>
        <div class="green"></div>
        <div class="black"></div>
        <div class="pink"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name:"native-scroll",
  data(){
    return{

    }
  },
  methods:{
    preventDefault(e){
      e.preventDefault()
    }
  }
}
</script>
<style>
.native-scroll{
  background: slateblue;
}
.content{
  width: 100%;
  height: 2000px;
  background: palegreen;
}
.content>div{
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
</style>


