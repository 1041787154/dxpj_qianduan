<template>
<div class="myBody">
	<audio id="audioPlay"> 
			<source v-bind:src='audioUrl' type="audio/mpeg" alt="">
	</audio>
    <div class="bg">
        <img v-bind:src='imgUrl' alt=""></div>
    <div class="myHeader">	群众评价端
    </div>
    <div class="content">
        <div class="title">
            <h2>支 部 选 择</h2>
            <br>
        </div>
        <div class="depatementTable">
            <el-table :data="tableData" height="100%" border style="width: 100%" @row-click="choose"  highlight-current-row>
                <el-table-column prop="PartyBranchID" label="支部编号"  align="center">
                </el-table-column>
                <el-table-column prop="PartyBranchName" label="支部名称"  align="center">
                </el-table-column>
                <el-table-column prop="City" label="支部所在省"  align="center" >
                </el-table-column>
               
            </el-table>
        </div>

        <div class="bottom-button">
            <div>
                <button @click="next('choicePeople')" class="button-1">确定</button>
            </div>
            <div>
                <router-link to="/" class="button-1">返回</router-link>
            </div>

        </div>

    </div>
    <div class="dia_ques" v-if="bool_diaOne">
			<quesDia_one  :messageOne="messageOne" v-if="messageOne" @determine="closePopOne"></quesDia_one>
	</div>

    <div class="showDia_redLine" v-if="bool_diaTwo">
			<loginDia :messageTwo="messageTwo" v-if="messageTwo" @determine="closePopTwo" @backFromLogin="backFromLogin"></loginDia>
	</div>  
</div>
</template>

<script>
import loginDia from "./diaLogin";
import quesDia_one from "./quesDia_one";
export default {
  components: {
    //			redLineDia,
    //			quesDia,
    loginDia,
    quesDia_one
  },

  name: "choiceDepartment",
  methods: {
  	 openAudio(words) {
			var oMusic = document.getElementById("audioPlay");
			this.audioUrl = words;
			oMusic.pause();
			oMusic.load();
			setTimeout(function() {
				oMusic.play();
			}, 150);
		},
		closeAudio() {
			var oMusic = document.getElementById("audioPlay");
			oMusic.pause();
		},
    video(info_words) {
    	
      var json = {
        words: info_words
      };
      this.$ajax({
        method: "POST",
        url: "video_words",
        data: json,
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
      })
        .then(res => {
          //info
          res = res.data;
          if ((res.status.code = 100)) {
          	this.openAudio(res.addressMP3);
          	console.log('addressMP3:'+this.audioUrl);
          } else {
            this.showPopOne(res.status.msg);
          }
        })
        .catch(function(err) {
          console.log("-------err2-------" + err);
        });
  },
  	
  	
    choose(row, column, cell) {
      this.messageTwo = row;
    },
    next(message) {
      if (this.messageTwo.PartyBranchID != -1) {
        this.showPopTwo(this.messageTwo);
        this.closeAudio();
      } else {
      	this.video(this.messageA);
        this.showPopOne(this.messageA); //请先选择支部
      }
    },

    backFromLogin() {
      this.closePopTwo();
    },

    showPopTwo(message) {
      this.bool_diaTwo = true;
      this.messageTwo = message;
    },
    closePopTwo() {
      this.bool_diaTwo = false;
    },
    showPopOne(message) {
      // alert("dfdfdf");
      this.bool_diaOne = true;
      this.messageOne = message;
    },
    closePopOne() {
      this.bool_diaOne = false;
    },
    listUpdate(list) {
      this.tableData = list;
    },
    closeDoor() {}
  },
  created: function() {
  	this.$ajax({
      method: "get",
      url:
        "get_backBround?PictureTypeID=02&AssessTypeID=03"
    })
      .then(res => {
        //info

        res = res.data;
        console.log(res.PictureTypeName);
        this.imgUrl = res.PictureTypeName;
        //  this.imgUrl="../../static/assets/bg_1.jpg"
      })
      .catch(function(err) {
        console.log(err);
      });
      
      
    this.$ajax({
      method: "get",
      url: "get_party_selected"
    })
      .then(res => {
        //info

        res = res.data;

        if (res.status.code == 100) {
          this.video(res.info_A_input);// "尊敬的群众代表，您现在所处的位置是渭阳西路街道党员党性教育体检中心，很荣幸邀请您来到这里，对我们的党员进行评议；请选择邀请您前来参加党性评议的支部",
          var list = res.info;
        } else if (res.status.code == 103) {
          var list = [
            {
              PartyBranchID: "-1",
              PartyBranchName: "暂无",
              City: "暂无"
            }
          ];
        }

        this.listUpdate(list);
      })
      .catch(function(err) {
        console.log(err);
      });
  },
  data() {
    return {
    	
    	audioUrl: "../../static/assets/zp26.mp3",
    	imgUrl: "../../static/assets/bg_2.jpg",
      messageA: "请先选择支部",

      bool_diaOne: false,
      bool_diaTwo: false,
      messageOne: "",
      messageTwo: {
        PartyBranchID: -1,
        PartyBranchName: "test1",
        City: "北京"
      },
      chooseId: -1,

      tableData: [
        {
          PartyBranchID: "1",
          PartyBranchName: "test1",
          City: "北京"
        },
        {
          PartyBranchID: "2",
          PartyBranchName: "test1",
          City: "秦皇岛"
        },
        {
          PartyBranchID: "3",
          PartyBranchName: "test1",
          City: "河北"
        },
        {
          PartyBranchID: "4",
          PartyBranchName: "test1",
          City: "安徽"
        },
        {
          PartyBranchID: "5",
          PartyBranchName: "test1",
          City: "上海"
        }
      ]
    };
  }
};
</script>


<style scoped>
/*.dia_ques {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}*/
.dia_ques {
 width:100%;
    height:100%;
    background:rgba(0, 0, 0, 0.5);
    position: fixed;
    top:50%;
    left:50%;
    transform:translateX(-50%) translateY(-50%);
    z-index: 99;
}
.showDia_redLine {
  /*position: absolute;
          left: 350px;
          top: 50px;
          z-index: 100;*/
  position: fixed;
  top: 0%;
  width: 100%;
  height: 100%;
  z-index: 200;
  background: rgba(0, 0, 0, 0.5) !important;
  /* 兼容ie几不知道，好像ie6 */
  background: #000;
  filter: Alpha(opacity=60);
}
.bottom-button {
  top: 75% !important;
}
.title {
  font-size: 0.4rem;
}
.depatementTable {
  margin: auto;
  width: 70%;
  height: 60%;
  overflow: hidden !important;
  text-align: center;
}
</style>
