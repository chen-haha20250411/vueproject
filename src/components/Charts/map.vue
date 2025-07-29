<template>
  <div class="echarts">
    <div
      :class="className"
      :id="id"
      :style="{ height: height, width: width }"
      ref="myEchart"
    ></div>
  </div>
</template>
  <script>
import echarts from "echarts";
import * as api from '@/api/clqqxlmk/list'
import "../../../node_modules/echarts/map/js/world.js";
export default {
  name: "echarts",
  props: {
    className: {
      type: String,
      default: "yourClassName",
    },
    id: {
      type: String,
      default: "yourID",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "800px",
    },
  },
  data() {
    return {
      title: "图表",
      placeholder: "用户名/电话",
      find: "2", //1显示新增按钮，2显示导入按钮，若不显示这两个按钮可以写0或者不写值
      chart: null,
      mapData: {},
      nameMap:{},
      cMap:{}
    };
  },
  components: {},
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  created() {
    this.toMapList()
  },
  methods: {
    toMapList() {
      api.toMapList(this.q).then(response => {
        this.mapData = response.data.queryParams.mapData
        this.nameMap = response.data.queryParams.nameMap
        this.cMap= response.data.queryParams.cMap
        this.initChart();
      })
    },
    //搜索回调
    searchItem(val) {
      console.log(val);
    },
    //新增回调
    addNew(val) {
      console.log(val);
    },
    //导入
    leadingItem(val) {
      console.log(val);
    },
    initChart() {
      this.chart = echarts.init(this.$refs.myEchart);
      window.onresize = echarts.init(this.$refs.myEchart).resize;
      // 把配置和数据放这里
      this.chart.setOption({
        backgroundColor: "#02AFDB",
        title: {
          // text: '在线设备分布',
          left: "40%",
          top: "0px",
          textStyle: {
            color: "#fff",
            opacity: 0.7,
          },
        },
        dataRange: {
          show: false,
          min: 0,
          max: 100,
          text: ["High", "Low"],
          realtime: true,
          calculable: true,
          color: ["orangered", "yellow", "lightskyblue"],
        },
        tooltip: {
          trigger: "item",
          formatter(params) {
            return `国家：${params.name}</br>数值：${params.value?params.value:0}`;
          },
        },
        geo: {
          map: "world",
          label: {
            emphasis: {
              show: true,
            },
          },
          roam: false,
          silent: true,
          itemStyle: {
            normal: {
              areaColor: "#37376e",
              borderColor: "#000",
            },
            emphasis: {
              areaColor: "#2a333d",
            },
          },
        },
        series: [
          {
            type: "map",
            name: "才链全球学联数量",
            mapType: "world",
            // zoom: 1.2,
            mapLocation: {
              y: 100,
            },
            nameMap:this.nameMap,
            data: this.mapData,
            symbolSize: 12,
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            itemStyle: {
              emphasis: {
                borderColor: "#fff",
                borderWidth: 1,
              },
            },
          },
        ],
      });
      var that =this;
      // echarts图表的点击事件，可通过param参数确认点击的对象
      this.chart.on("click", function (param) {
        if(that.cMap[param.name]){
          that.$emit('getCountryList', that.cMap[param.name])
        }
      });
    },
  },
};
</script>