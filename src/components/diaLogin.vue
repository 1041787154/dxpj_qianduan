<template>
	<div class="wzj">
		<audio id="audioPlay_"> 
			<source v-bind:src='audioUrl' type="audio/mpeg" alt="">
	    </audio>
		<img class="bg_3_img" v-bind:src='imgUrl' alt="" />
		<div class="wzj_content">
			<h3 class="header">
					当前选择支部：<span>{{messageTwo.PartyBranchName}}</span>
				</h3>
			<div class="psw">
				请输入密码：
				<input class="password" type="password" placeholder="请输入密码" :value="password" @focus="passChange" />
			</div>
			<div class="number">
				<div class="num">
					<button class="no" @click="chooseNum(1)">1</button>
					<button class="no" @click="chooseNum(2)">2</button>
					<button class="no" @click="chooseNum(3)">3</button>
					<button class="no" @click="chooseNum(4)">4</button>
					<button class="no" @click="chooseNum(5)">5</button>
					<button class="no" @click="chooseNum(6)">6</button>
					<button class="no" @click="chooseNum(7)">7</button>
					<button class="no" @click="chooseNum(8)">8</button>
					<button class="no" @click="chooseNum(9)">9</button>
					<button class="no" @click="chooseNum(X)">X</button>
					<button class="no" @click="chooseNum(0)">0</button>
					<button class="no" @click="chooseNum(-1)"><-</button>
				</div>
				<div class="yes">
					<button class="btn confirm" @click="next('makeAnswer')">确定</button>
					<button class="btn quit" @click="cancer">取消</button>
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
  name: "diaLogin",
  props: ["messageTwo"],
  
  created: function() {
  	this.$ajax({
      method: "get",
      url:
        "get_backBround?PictureTypeID=02&AssessTypeID=04"
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
        	this.video(res.info_C_pass);//"选择完成 请输入登陆密码"
        } else if (res.status.code == 103) {
        	this.video(res.status.msg);
        	this.showPopOne(res.status.msg);
//        var list = [
//          {
//            PartyBranchID: "-1",
//            PartyBranchName: "暂无",
//            City: "暂无"
//          }
//        ];
        }

        this.listUpdate(list);
      })
      .catch(function(err) {
        console.log(err);
      });
      
    },
  
  methods: {
  	
  	passChange(){
  		this.video(this.messageA);
  	},
  	openAudio(words) {
			var oMusic = document.getElementById("audioPlay_");
			this.audioUrl = words;
			oMusic.pause();
			oMusic.load();
			setTimeout(function() {
				oMusic.play();
			}, 150);
		},
		closeAudio() {
			var oMusic = document.getElementById("audioPlay_");
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
  	
  	
    chooseNum(num) {
      if (num != -1) {
        this.password += num;
      } else if (num == -1) {
        this.password = this.password.slice(0, this.password.length - 1);
      }
    },
    showPopOne(message) {
      this.bool_diaOne = true;
      this.messageOne = message;
    },
    closePopOne() {
      this.bool_diaOne = false;
    },
    confirm() {
      if (this.password.length < 1) {
      	this.video(this.messageA);
        this.showPopOne(this.messageA);
      } else {
        this.next();
      }
    },
    cancer() {
      this.$emit("backFromLogin", false);
    },
    next(url_) {
      if (this.password.length < 1) {
      	this.video(this.messageA);
        this.showPopOne(this.messageA);
      } else {
        this.$ajax({
          method: "get",
          url:
            "judge_partyMember_byMemberId?a=" +
            this.messageTwo.PartyBranchID +
            "&b=" +
            this.password
        })
          .then(res => {
            //info

            res = res.data;

            if (res.status.code == 100) {
              //            alert("验证成功");
              this.$router.push({
                //传参数
                name: url_
              });
            } else {
              this.password = "";
              this.video(res.status.msg);
              this.showPopOne(res.status.msg);
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    }
  },

  data() {
    return {
    	audioUrl: "../../static/assets/zp26.mp3",
    	imgUrl: "../../static/assets/bg_2.jpg",
      table_height: "60",
      password: "",
      messageA: "请您输入密码！",
      bool_diaOne: false,
      messageOne: "",
      nowChoose: {
        Name: "未选择",
        PartyPosition: "未选择",
        PartyMemberID: "-1"
      },
      tableData: [
        {
          PartyMemberID: "1",
          Name: "test1",
          Sex: "男",
          Birthday: "1984-8-20",
          PartyMemberLableName: "中共........",
          PartyPosition: "党员"
        },
        {
          PartyMemberID: "2",
          Name: "test1",
          Sex: "男",
          Birthday: "1988-1-20",
          PartyMemberLableName: "中共........",
          PartyPosition: "党员"
        },
        {
          PartyMemberID: "3",
          Name: "test1",
          Sex: "男",
          Birthday: "1981-8-20",
          PartyMemberLableName: "中共........",
          PartyPosition: "党员"
        },
        {
          PartyMemberID: "4",
          Name: "test1",
          Sex: "女",
          Birthday: "1986-5-20",
          PartyMemberLableName: "中共........",
          PartyPosition: "党员"
        },
        {
          PartyMemberID: "5",
          Name: "test1",
          Sex: "男",
          Birthday: "1984-8-20",
          PartyMemberLableName: "中共........",
          PartyPosition: "党员"
        }
      ],
      columns: [
        {
          field: "PartyMemberID",
          title: "党员编号",
          width: 100,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },
        {
          field: "Name",
          title: "姓名",
          width: 100,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },
        {
          field: "Sex",
          title: "性别",
          width: 100,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },

        {
          field: "Birthday",
          title: "生日",
          width: 100,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },
        {
          field: "PartyBranchName",
          title: "支部名称",
          width: 400,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        },
        ,
        {
          field: "PartyMemberLableName",
          title: "类别",
          width: 250,
          titleAlign: "center",
          columnAlign: "center",
          isResize: true
        }
      ]
    };
  }
};
</script>

<style scoped>
.psw input {
  padding: 0rem 0.3rem;
}
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

.wzj {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 960px;
  border: 0.5px solid transparent;
}

.bg_3_img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
}

.header {
  margin-left: 100px;
  text-align: left;
      font-size: 17px;
}

.wzj_content {
  margin-top: 10%;
  /*text-align: center;*/
}

.psw {
  margin-left: 100px;
  font-weight: bold;
  margin-top: 15px;
  text-align: left;
  font-size: 17px;
}

.password {
  width: 460px;
  height: 35px;
  line-height: 35px;
  border: 0.5px solid silver;
  border-radius: 5px;
}

.number {
  overflow: hidden;
  margin-top: 20px;
  margin-left: 200px;
}

.num {
  overflow: hidden;
  width: 250px;
  padding-bottom: 15px;
  border: 1px solid white;
  float: left;
}

.no {
  display: block;
  width: 60px;
  height: 60px;
  border: 2px solid #fff *;
  background: orange;
  color: yellow;
  line-height: 60px;
  text-align: center;
  /*font-weight: bold;*/
  font-size: 24px;
  float: left;
  margin-top: 15px;
  margin-left: 15px;
}

.btn {
  display: block;
  width: 160px;
  height: 50px;
  line-height: 47px;
  border: 2px solid #fff *;
  background: orange;
  color: yellow;
  text-align: center;
  font-size: 24px;
  /*font-weight: bold;*/
}

.yes {
  float: left;
  margin-left: 30px;
}

.confirm {
  margin-top: 15px;
}

.quit {
  margin-top: 165px;
}
</style>