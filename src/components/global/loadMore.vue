<template>
    <div class="detail" ref="wrapper">
        <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" :top-status.sync="topStatus" ref="loadmore" @translate-change="translateChange">
            <slot></slot>
            <div slot="top" v-show = "topStatus" class="mint-loadmore-top">
                <img id="scream" src="./images/top1.png" width="36" height="36" style="display:none;"/>
                <div v-show="topStatus !== 'loading'" class="canvas">
                    <canvas ref="canvas-render" id="cavas"></canvas>
                </div>
                <span v-show="topStatus !== 'loading'">
                    <span class="text" v-show="topStatus === 'pull'">下拉即可刷新...</span>
                    <span class="text" v-show="topStatus === 'drop'">释放即可刷新...</span>
                </span>
                <span v-show="topStatus === 'loading'">
                    <i class="iconfont icon-pull-down-refresh"></i>
                    <span class="text">加载中...</span>
                </span>
            </div>
        </mt-loadmore>
        
    </div>

</template>
<script>
import initCanvas from "./js/canvas";
export default {
    name:"detail",
    data(){
        return{
            topStatus:'',
            percent:0,
        }
    },
    mounted(){
    },
    methods:{
        loadTop() {
            this.$emit("loading")
        },
        onTopLoaded(){
            this.$refs.loadmore.onTopLoaded();
        },
        handleTopChange(status) {
            this.topStatus = status;
        },
        translateChange(translate){
            const translateNum = +translate;
            this.translate = translateNum.toFixed(2);
            if(this.topStatus === 'drop'){
                this.percent = 100;
            }else{
                this.percent = (translateNum / 70).toFixed(2)*100;
            }
            var cavas = document.getElementById('cavas');
            var img = document.getElementById("scream");
            initCanvas(cavas,img,this.percent);
        }, 
          
    },
    
    

}
</script>
<style scoped>
.mint-loadmore {
    background: #f2f2f2;
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
