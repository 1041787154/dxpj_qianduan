<template>
<div class="myBody">
	<audio id="audioPlay"> 
			<source v-bind:src='audioUrl' type="audio/mpeg" alt="">
	</audio>
    <div class="bg">
        <img v-bind:src='imgUrl' alt="">
    </div>
    <div class="myHeader">党性互评端
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
			<quesDia_one :messageOne="messageOne" v-if="messageOne" @determine="closePopOne"></quesDia_one>
		</div>
</div>
</template>

<script>
	import quesDia_one from "./quesDia_one";
export default {
	components: {
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
  	
  	
  	showPopOne(messsage){
  		this.bool_diaOne=true;
  		this.messageOne=messsage;
  	},
  	closePopOne(){
  		this.bool_diaOne=false;
  	},
  	
    choose(row, column, cell) {
      this.chooseId = row.PartyBranchID;
    },
    next(url) {
      if (this.chooseId != -1) {
        this.$router.push({
          name: url,
          query: {
            PartyBranchID: this.chooseId
          }
        });
      } else {
      	this.video(this.messageA);
        this.showPopOne(this.messageA);//请先选择支部！
      }
    },
    listUpdate(list) {
      this.tableData = list;
    }
},
  created: function() {
  	  this.$ajax({
      method: "get",
      url: "get_backBround?PictureTypeID=02&AssessTypeID=02"
    })
      .then(res => {
        //info
     
        res = res.data
        console.log(res.PictureTypeName)
       this.imgUrl=res.PictureTypeName
      //  this.imgUrl="../../static/assets/bg_1.jpg"
        
      })
      .catch(function(err) {
        console.log(err)
      });
      
      
    this.$ajax({
      method: "get",
      url: "get_party_selected"
    })
      .then(res => {
        //info

        res = res.data;

        if (res.status.code == 100) {
          var list = res.info;
          this.video(res.info_A_input);//欢迎您来到党性体检第二环节 党员互评
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
    	bool_diaOne:false,
      messageOne:'',
    	
    	 messageA:"请先选择支部！",
    	 audio_A: "欢迎您来到党性体检第二环节 党员互评",
    	
      imgUrl:"../../static/assets/bg_2.jpg",
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
