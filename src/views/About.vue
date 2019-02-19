<template>
  <div class="about">
    <canvas id="myChart" width="375" height="260"></canvas>
    <canvas id="mountNode" width="375" height="250"></canvas>
    <canvas id="mountNodes" width="375" height="250"></canvas>
  </div>
</template>
<script>
// const F2 = require('@antv/f2');
const F2 = require('@antv/f2/lib/index-all');
export default {
  name:'about',
  data(){
    return{

    }
  },
  mounted(){
    this.f2();
    this.f3();
    this.f4();
  },
  methods:{
    f2(){
      const data = [
        { genre: 'Sports', sold: 275 },
        { genre: 'Strategy', sold: 115 },
        { genre: 'Action', sold: 120 },
        { genre: 'Shooter', sold: 350 },
        { genre: 'Other', sold: 150 },
      ];

      // Step 1: 创建 Chart 对象
      const chart = new F2.Chart({
        id: 'myChart',
        pixelRatio: window.devicePixelRatio // 指定分辨率
      });

      // Step 2: 载入数据源
      chart.source(data);

      // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
      chart.interval().position('genre*sold').color('genre');

      // Step 4: 渲染图表
      chart.render();
    },
    f3(){
      var data = [{
        year: 2000,
        age: 27.2
      }, {
        year: 2001,
        age: 27.5
      }, {
        year: 2002,
        age: 27.8
      }, {
        year: 2003,
        age: 28
      }, {
        year: 2004,
        age: 28.2
      }, {
        year: 2005,
        age: 28.4
      }, {
        year: 2006,
        age: 28.8
      }, {
        year: 2007,
        age: 28.8
      }, {
        year: 2008,
        age: 28.8
      }, {
        year: 2009,
        age: 28.8
      }, {
        year: 2010,
        age: 28.9
      }, {
        year: 2011,
        age: 29
      }, {
        year: 2012,
        age: 29.3
      }, {
        year: 2013,
        age: 29.4
      }, {
        year: 2014,
        age: 29.5
      }, {
        year: 2015,
        age: 29.7
      }, {
        year: 2016,
        age: 30
      }, {
        year: 2017,
        age: 30.12
      },{
        year: 2018,
        age: 30.12
      },{
        year: 2019,
        age: 30.12
      },{
        year: 2020,
        age: 30.12
      }];
      var chart = new F2.Chart({
        id: 'mountNode',
        pixelRatio: window.devicePixelRatio
      });
      var defs = {
        year: {
          range: [0, 1],
          max: 2020
        },
        age: {
          tickCount: 5
        }
      };
      chart.axis('year', {
        label: function label(text, index, total) {
          var cfg = {
            textAlign: 'center'
          };
          if (index === 0) {
            cfg.textAlign = 'start';
          }
          if (index > 0 && index === total - 1) {
            cfg.textAlign = 'end';
          }
          return cfg;
        }
      });
      chart.source(data, defs);
      chart.tooltip({
        showCrosshairs: true
      });
      chart.guide().tag({
        position: [2020, 30.12],
        content: '30.12',
        direct: 'tl',
        offsetY: -5,
        background: {
          fill: '#8659AF'
        },
        pointStyle: {
          fill: '#8659AF'
        }
      });
      chart.line().position('year*age').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
      chart.area().position('year*age').shape('smooth').color('l(0) 0:#F2C587 0.5:#ED7973 1:#8659AF');
      chart.render();
    },
    f4(){
      var data = [{
        amount: 20,
        ratio: 0.1,
        memo: '学习',
        const: 'const'
      }, {
        amount: 100,
        ratio: 0.5,
        memo: '睡觉',
        const: 'const'
      }, {
        amount: 10,
        ratio: 0.05,
        memo: '吃饭',
        const: 'const'
      }, {
        amount: 30,
        ratio: 0.15,
        memo: '讲礼貌',
        const: 'const'
      }, {
        amount: 10,
        ratio: 0.05,
        memo: '其他',
        const: 'const'
      }, {
        amount: 20,
        ratio: 0.1,
        memo: '运动',
        const: 'const'
      }, {
        amount: 10,
        ratio: 0.05,
        memo: '暂无备注',
        const: 'const'
      }];

      var chart = new F2.Chart({
        id: 'mountNodes',
        pixelRatio: window.devicePixelRatio
      });

      chart.source(data);
      chart.coord('polar', {
        transposed: true,
        innerRadius: 0.4,
        radius: 0.75
      });
      chart.axis(false);
      chart.legend({
        position: 'bottom',
        align: 'center'
      });
      chart.tooltip(false);
      chart.guide().html({
        position: ['50%', '50%'],
        html: '<div style="width: 100px;height: 20px;text-align: center;line-height: 20px;" id="textContent"></div>'
      });
      // 配置文本饼图
      chart.pieLabel({
        sidePadding: 75,
        label1: function label1(data) {
          return {
            text: data.memo,
            fill: '#808080'
          };
        },
        label2: function label2(data) {
          return {
            fill: '#000000',
            text: '$' + data.amount.toFixed(2),
            fontWeight: 500,
            fontSize: 10
          };
        }
      });
      chart.interval().position('const*ratio').color('memo', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0', '#3436C7', '#223273']).adjust('stack');
      chart.render();

      // 绘制内阴影
      var frontPlot = chart.get('frontPlot');
      var coord = chart.get('coord'); // 获取坐标系对象
      frontPlot.addShape('sector', {
        attrs: {
          x: coord.center.x,
          y: coord.center.y,
          r: coord.circleRadius * coord.innerRadius * 1.2, // 全半径
          r0: coord.circleRadius * coord.innerRadius,
          fill: '#000',
          opacity: 0.15
        }
      });
      chart.get('canvas').draw();
    }
  }
}
</script>
