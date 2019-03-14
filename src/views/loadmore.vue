<template>
    <div class="detail" ref="wrapper">
       <loadMore @loading = "loading" ref="loadmore">
            <ul class="scrollBox">
                <li style="lineHeight:40px;borderBottom:1px solid #ddd;" v-for="(item,index) in list" :key="index">{{ item }}</li>
            </ul>
       </loadMore>
    </div>

</template>
<script>
export default {
    name:"detail",
    data(){
        return{
            list:[1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9],
        }
    },
    mounted(){

    },
    methods:{
        loading(){
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 2000);
        },
        
    },

}
</script>
<style scoped>
.mint-loadmore {
    background: #f2f2f2;
}
.scrollBox{
    background: #fff;
}
.rotate{
    transform: rotate(180deg);
    transition: all .3s;
}
.mint-loadmore-top .text{
    font-size: .26rem;
    color: #666666;
    padding-left: 4px;
}
.is-dropped{
    transform: translate3d(0px, 0px, 0px);
}

.canvas{
    width: 22px;
    height: 50px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.mint-loadmore-top{
    display: flex;
    flex-direction: row;
    justify-content: center;align-items: center;
}
</style>
