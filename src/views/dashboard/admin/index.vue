<template>
  <div class="dashboard-editor-container">欢迎使用招投标后台管理系统！

    <div class="HomePage_data">
      <!-- <div class="Work_statistics">
        <el-container>
          <el-container>
            <div class="Work_statistics_data" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding-left: 20px;">
              <div class="Work_statistics_ondata">
                <div class="gradient ">
                  <img src="../../../assets/images/warning/afb4db.png" />
                </div>
                <div class="statistics_word">
                  <span>资金兑现总数</span>
                  <span style="color:#afb4db">{{statisticData.zjdxNum}}</span>
                </div>
              </div>
              <div class="Work_statistics_ondata">
                <div class="gradient ">
                  <img src="../../../assets/images/warning/c37e00.png" />
                </div>
                <div class="statistics_word">
                  <span>企业获得专利数</span>
                  <span style="color:#c37e00">{{statisticData.zlCount}}</span>
                </div>
              </div>
              <div class="Work_statistics_ondata">
                <div class="gradient ">
                  <img src="../../../assets/images/warning/da765b.png" />
                </div>
                <div class="statistics_word">
                  <span>企业融资总数</span>
                  <span style="color:#da765b">{{statisticData.qyrzNum}}</span>
                </div>
              </div>
              <div class="Work_statistics_ondata">
                <div class="gradient ">
                  <img src="../../../assets/images/warning/ef4136.png" />
                </div>
                <div class="statistics_word">
                  <span>提供就业机会数</span>
                  <span style="color:#ef4136">{{statisticData.tgjyjhCount}}</span>
                </div>
              </div>
              <div class="Work_statistics_ondata" style="margin-bottom: 30px;">
                <div class="gradient ">
                  <img src="../../../assets/images/warning/f05b72.png" />
                </div>
                <div class="statistics_word">
                  <span>企业税收总数</span>
                  <span style="color:#f05b72">{{statisticData.qyssNum}}</span>
                </div>
              </div>
              <div class="Work_statistics_ondata" style="margin-bottom: 30px;">
                <div class="gradient ">
                  <img src="../../../assets/images/warning/f36c21.png" />
                </div>
                <div class="statistics_word">
                  <span>认定各类人才计划数</span>
                  <span style="color:#f36c21">{{statisticData.rdglrcCount}}</span>
                   143 -->
                <!-- </div>
              </div>
              <div class="Work_statistics_ondata" style="margin-bottom: 30px;">
                <div class="gradient ">
                  <img src="../../../assets/images/warning/faa755.png" />
                </div>
                <div class="statistics_word">
                  <span>各级领军型创新创业团队</span>
                  <span style="color:#faa755">{{statisticData.cxcytdCount}}</span>
                </div>
              </div> -->
              <!-- <div class="Work_statistics_ondata" style="margin-bottom: 30px;">
                <div class="gradient ">
                  <img src="../../../assets/images/warning/asghjd.png" />
                </div>
                <div class="statistics_word">
                  <span>领军营业收入(亿元)</span>
                  <span style="color:#faa755">{{statisticData.ljYysr}}</span>
                </div>
              </div>
              <div class="Work_statistics_ondata" style="margin-bottom: 30px;">
                <div class="gradient ">
                  <img src="../../../assets/images/warning/asdsdd.png" />
                </div>
                <div class="statistics_word">
                  <span>上市企业营业收入</span>
                  <span style="color:#faa755">{{statisticData.ssYysr}}</span>
                </div>
              </div>
              <div class="Work_statistics_ondata" style="margin-bottom: 30px;">
                <div class="gradient ">
                  <img src="../../../assets/images/warning/asdasg.png" />
                </div>
                <div class="statistics_word">
                  <span>重点高新技术企业营业收入本年累计</span>
                  <span style="color:#faa755">{{statisticData.zdYysr}}</span>
                </div>
              </div> -->
            <!-- </div>
          </el-container>
          <el-header style="height:20px;"></el-header>
          <el-container>
            <el-container>
              <el-main style="background-color:#FFFFFF;width: 30%;height:28rem;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
                <h3 style="margin: 0 0;">5050企业当前融资轮次分布</h3>
                <pie-chart
                :chartData="chartData"
                :widthData="widthData"
                />
              </el-main>
              <el-container style="background-color:#FFFFFF;width: 70%;height:28rem;margin-left: 30px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)">
                <el-aside style="width: 20%; text-align: center;line-height: 60px;">
                  <el-main style="font-size: 1.5rem;padding: 13px;margin-top: 50%;">
                    <span style="font-size: 2rem;color:#fd7b48">{{statisticData.allCount}}家</span><br/>
                    <span>5050企业</span><br/>
                    <span>总数</span>
                  </el-main>
                </el-aside>
                <el-main style="margin-left: -20px;">
                  <el-header style="background-color:#FFFFFF;height: 11rem;text-align: center;font-size: 1rem;margin-bottom: 20px;margin-left: -20px;">
                    <el-container>
                      <el-divider direction="vertical" class="vertical2"></el-divider>
                      <el-main class="elMain">
                        <el-progress type="circle" :percentage="statisticData.abcAllCountProportion" width="100"></el-progress>
                        <div>
                          <span>C类以上企业数</span>
                          <span class="titleCountSpan">{{statisticData.abcAllCount}}</span>
                        </div>
                      </el-main>
                      <el-divider direction="vertical" class="vertical2"></el-divider>
                      <el-main class="elMain">
                        <el-progress type="circle" :percentage="statisticData.gjgxCountProportion" width="100"></el-progress>
                        <div>
                          <span>国家高新技术企业数</span>
                          <span class="titleCountSpan">{{statisticData.gjgxCount}}</span>
                        </div>
                      </el-main>
                      <el-divider direction="vertical" class="vertical2"></el-divider>
                      <el-main class="elMain">
                        <el-progress type="circle" :percentage="statisticData.dlqyCountProportion" width="100"></el-progress>
                        <div>
                          <span>瞪羚企业数</span>
                          <span class="titleCountSpan">{{statisticData.dlqyCount}}</span>
                        </div>
                      </el-main>
                      <el-divider direction="vertical" class="vertical2"></el-divider>
                    </el-container>
                  </el-header>
                  <el-header style="background-color:#FFFFFF;height: 11rem;text-align: center;font-size: 1rem;margin-bottom: 20px;margin-left: -20px;">
                    <el-container>
                      <el-divider direction="vertical" class="vertical2"></el-divider>
                      <el-main class="elMain">
                        <el-progress type="circle" :percentage="statisticData.djsCountProportion" width="100"></el-progress>
                        <div>
                          <span>独角兽（准独角兽）数</span>
                          <span class="titleCountSpan">{{statisticData.djsCount}}</span>
                        </div>
                      </el-main>
                      <el-divider direction="vertical" class="vertical2"></el-divider>
                      <el-main class="elMain">
                        <el-progress type="circle" :percentage="statisticData.ssqyCountProportion" width="100"></el-progress>
                        <div>
                          <span>上市企业数</span>
                          <span class="titleCountSpan">{{statisticData.ssqyCount}}
                            
                          </span>
                        </div>
                      </el-main>
                      <el-divider direction="vertical" class="vertical2"></el-divider>
                      <el-main class="elMain">

                      </el-main>
                      <el-divider direction="vertical" class="vertical3"></el-divider>
                    </el-container>
                  </el-header>
                </el-main>
              </el-container>
            </el-container>
          </el-container>
        </el-container>
      </div> -->
    </div>
    <a v-show="false" target="_blank" id="exportA">隐藏的a标签</a>


  </div>
</template>

<script>
import * as api from "@/api/homePage/list";
import BarChart from "@/views/dashboard/admin/components/BarChart";
import PieChart from "@/views/dashboard/admin/components/PieChart";
// import * as lljAdminApi from '@/api/lljAdminApi/api'
export default {
  name: 'DashboardAdmin',
  components: {
    BarChart,
    PieChart
  },
  data() {
    return {
      abcAllCount:"0",
      abAllCount:"0",
      abcNowCount:"0",
      abNowCount:"0",
      ldNowCount:"0",
      zscqAllCount:"0",
      rzAllCount:"0",
      ljYysr:'0',
      ssYysr:'0',
      zdYysr:'0',
      chartData:[],
      widthData:[],
      chartDataBar:[],
      titleData:[],
      statisticData:{},
      
    }
  },
  created() {
    //this.getStatistic();
    // this.queryCompanyView(); // ← 这行也要注释掉！
    this.getStatisticAdmin();
    setTimeout(() => {
      this.titleData=['1-10', '11-20', '21-30', '31-40', '41-50', '>=51'];
      this.chartDataBar=[79, 52, 200, 334, 390, 330]
    }, 100);
    
  },
  methods: {
    toLink(){
      var exportA = document.getElementById("exportA");
      exportA.setAttribute("href","https://www.baidu.com/");
      exportA.click();
    },
    // queryCompanyView () {
    //   var data={
    //     apiFlag:'queryCompanyView',
    //     dataStr:''
    //   }
    //   lljAdminApi.getApi(data).then(response => {
    //     console.log(response);
    //     var finacingRounds = response.data.RESULT.finacingRounds
    //     var chartData = [];
    //     finacingRounds.forEach(element => {
    //       chartData.push({
    //         value: element.count, 
    //         name: element.rounds 
    //       });
    //     });
    //     this.chartData=chartData;
    //     this.widthData=['80px', '100px'];
    //   })
    // },
    getStatisticAdmin () {
      api.getStatisticAdmin().then(response => {
        console.log(response);
        this.statisticData = response.data;
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  // background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

/* 工作统计 */
.HomePage_data {
  background: #fff;
  padding: 20px;
}
.Work_statistics_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f6f6f6;
  padding-bottom: 20px;
}
.title_img {
  width: 4px;
  height: 22px;
  background: #3196fa;
  margin-right: 5px;
  display: inline-block;
}
.title {
  font-size: 18px;
  font-weight: bold;
}
.Work_statistics_date span {
  margin-left: 20px;
  cursor: pointer;
}
.spanbackground {
  font-weight: 550;
  padding: 5px 10px;
  border-radius: 4px;
  border: solid 1px #eaf4fe;
  color: #3196fa;
  background: #eaf4fe;
}
.Work_statistics_data {
  /* margin-top: 20px; */
  font-size: 16px;
  display: flex;
  /* justify-content: space-between; */
  justify-content: flex-start;
  align-items: center;
  flex-flow: wrap;
  margin-bottom: 20px;
}
.Work_statistics_ondata {
  display: flex;
  /* justify-content: space-between; */
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  /* margin-right: 50px; */
  /* width:14.3%; */
  width: 22%;
  margin-right: 2.5rem;
  /* margin-bottom: 25px; */
  margin-top: 30px;
}

/* 背景渐变色 */
.statistics_word {
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 40%;
}
.statistics_word span:nth-child(1) {
  font-size: 18px;
}
.statistics_word span:nth-child(2) {
  font-size: 24px;
  font-weight: bold;
}
.wordcolor1 {
  color: #f49f86;
}
.wordcolor2 {
  color: #76b2fb;
}
.wordcolor3 {
  color: #fd7b48;
}
.wordcolor4 {
  color: #70c752;
}
.wordcolor5 {
  color: #ffb085;
}
.wordcolor6 {
  color: #beabf9;
}
.wordcolor7 {
  color: #2eaafb;
}

.gradient {
  padding: 10px;
  border-radius: 10px;
  margin-right: 10px;
}
.gradient img{
  /* width: 48px;
  height: 49px; */
  width: 70px;
  height: 70px;
}
.gradient1 {
  background-image: linear-gradient(#ff6f8c, #fca999);
}
.gradient2 {
  background-image: linear-gradient(#4692ea, #75c7ed);
}
.gradient3 {
  background-image: linear-gradient(#ff5b5a, #fbc51c);
}
.gradient4 {
  background-image: linear-gradient(#60c34e, #d4e372);
}
.gradient5 {
  background-image: linear-gradient(#ff835a, #ffba7d);
}
.gradient6 {
  background-image: linear-gradient(#73a3ff, #ceadf8);
}
.gradient7 {
  background-image: linear-gradient(#27a2ff, #7ff7d2);
}
</style>

<style>
  .vertical1{
    height: 4em;
    margin-top: 0.5rem;
  }
  .vertical2{
    height: 8.5em;
    margin-top: 1rem;
  }
  .vertical3{
    width: 0px;
  }
  .el-divider--horizontal {
    margin: 0 0;
  }
  .titleCountSpan{
    font-size:1.5rem;
    color:#fd7b48
  }
  .elMain{
    width: 20%;
  }
</style>