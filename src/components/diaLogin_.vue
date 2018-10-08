<template>
	<div class="wzj">
		<audio id="audioPlay_"> 
			<source v-bind:src='audioUrl' type="audio/mpeg" alt="">
		</audio>
		<img class="bg_3_img" v-bind:src='imgUrl' alt="" />
		<div class="wzj_content">
			
			<div class="psw">
				请输入设备号：
				<input id="pass" class="password" type="text" placeholder="请输入设备号" :value="password" @focus="passChange"/>
			</div>
			<div class="number">
				<div class="num">
					<button class="no" @click="chooseNum(0)">0</button>
					<button class="no" @click="chooseNum(1)">1</button>
					<button class="no" @click="chooseNum(2)">2</button>
					<button class="no" @click="chooseNum(3)">3</button>
					<button class="no" @click="chooseNum(4)">4</button>
					<button class="no" @click="chooseNum(5)">5</button>
					<button class="no" @click="chooseNum(6)">6</button>
					<button class="no" @click="chooseNum(7)">7</button>
					<button class="no" @click="chooseNum(8)">8</button>
					<button class="no" @click="chooseNum(9)">9</button>
					<button class="no" @click="chooseNum('A')">A</button>
					<button class="no" @click="chooseNum('B')">B</button>
					<button class="no" @click="chooseNum('C')">C</button>
					<button class="no" @click="chooseNum('D')">D</button>
					<button class="no" @click="chooseNum('E')">E</button>
					<button class="no" @click="chooseNum('F')">F</button>
					<button class="no" @click="chooseNum('G')">G</button>
					<button class="no" @click="chooseNum('H')">H</button>
					<button class="no" @click="chooseNum('I')">I</button>
					<button class="no" @click="chooseNum('J')">J</button>
					<button class="no" @click="chooseNum('K')">K</button>
					<button class="no" @click="chooseNum('L')">L</button>
					<button class="no" @click="chooseNum('M')">M</button>
					<button class="no" @click="chooseNum('N')">N</button>
					<button class="no" @click="chooseNum('O')">O</button>
					<button class="no" @click="chooseNum('P')">P</button>
					<button class="no" @click="chooseNum('Q')">Q</button>
					<button class="no" @click="chooseNum('R')">R</button>
					<button class="no" @click="chooseNum('S')">S</button>
					<button class="no" @click="chooseNum('T')">T</button>
					<button class="no" @click="chooseNum('U')">U</button>
					<button class="no" @click="chooseNum('V')">V</button>
					<button class="no" @click="chooseNum('W')">W</button>
					<button class="no" @click="chooseNum('X')">X</button>
					<button class="no" @click="chooseNum('Y')">Y</button>
					<button class="no" @click="chooseNum('Z')">Z</button>
					<button class="no" @click="chooseNum(-1)"><-</button>
					<button class="confirm" @click="next('makeAnswer')">确定</button>
				</div>
				<!--<div class="yes">
					<button class="btn confirm" @click="next('makeAnswer')">确定</button>
				<!--	<button class="btn quit" @click="cancer">取消</button>-->
				<!--</div>-->
			</div>
		</div>
		<div class="dia_ques" v-if="bool_diaOne">
			<quesDia_one :messageOne="messageOne" v-if="messageOne" @determine="closePopOne" @quitToMain="quitToMain"></quesDia_one>
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
  methods: {
  	passChange(){
  		this.video(this.messageA);//请您输入密码！
  	},
  	
  	
  	openAudio(words) {
			var oMusic = document.getElementById("audioPlay_");
			this.audioUrl = words;
			oMusic.pause();
			oMusic.load();
			setTimeout(function() {
				oMusic.play();
			}, 250);
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
						if((res.status.code = 100)) {
							this.openAudio(res.addressMP3);
							console.log('addressMP3:' + this.audioUrl);
						} else {
							this.showPopOne(res.status.msg);
						}
					})
					.catch(function(err) {
						console.log("-------err2-------" + err);
					});
			},

  	
  	
  	
    chooseNum(num) {
      var sp_1=document.getElementById("pass").value;
      if (num != -1) {
        this.password = sp_1 + num;
      } else if (num == -1) {
        this.password = sp_1.slice(0, sp_1.length - 1);
      }
    },
    showPopOne(message) {
      this.bool_diaOne = true;
      this.messageOne = message;
    },
    closePopOne() {
      this.bool_diaOne = false;
    },
    quitToMain(){
    	this.bool_diaOne = false;
    	this.$emit("determine", false);
    },
    next() {
    	var sp_1=document.getElementById("pass").value;
     if (sp_1.length < 1) {
      	
      	this.video(this.messageA);
        this.showPopOne(this.messageA);//请您输入密码！
        this.password = "";
      } else {
        this.$ajax({
          method: "get",
          url:
            "getNumOfcomputer?num=" +sp_1    
        })
          .then(res => {
            //info

            res = res.data;

            if (res.code == 100) {
//            alert("验证成功");
              this.video(this.messageB);
              this.showPopOne(this.messageB);// "设备验证成功，即将跳转到党性自评端！"
            } else {
              this.password = "";
              this.video(res.msg);
              this.showPopOne(res.msg);
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      }
      //    if (this.password.length < 1) {
//    	
//    	this.video(this.messageA);
//      this.showPopOne(this.messageA);//请您输入密码！
//    } else {
//      this.$ajax({
//        method: "get",
//        url:
//          "http://202.206.249.16:8080/dxpj/zp/getNumOfcomputer?num=" +this.password    
//      })
//        .then(res => {
//          //info
//
//          res = res.data;
//
//          if (res.code == 100) {
////            alert("验证成功");
//            this.video(this.messageB);
//            this.showPopOne(this.messageB);// "设备验证成功，即将跳转到党性自评端！"
//          } else {
//            this.password = "";
//            this.video(res.msg);
//            this.showPopOne(res.msg);
//          }
//        })
//        .catch(function(err) {
//          console.log(err);
//        });
//    }

      
      
      
      
    }
  },
 created: function() {
  	this.$ajax({
      method: "get",
      url:
        "get_backBround?PictureTypeID=02&AssessTypeID=01"
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
    },
  data() {
    return {
    	audioUrl: "../../static/assets/zp32.mp3",
    	
    	imgUrl: "../../static/assets/bg_2.jpg",
      table_height: "60",
      password: "",
      messageA: "请您输入密码！",
      messageB: "设备验证成功，即将跳转到党性自评端！",
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
  width: 60%;
  height: 67%;
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
  margin-left: 23%;
  font-weight: bold;
  padding-top: 3%;
  text-align: left;
  font-size: 17px;
}

.password {
  width: 46%;
  height: 35px;
  line-height: 35px;
  border: 0.5px solid silver;
  border-radius: 5px;
}

.number {
  overflow: hidden;
  margin-top: 4%;
  margin-left: 17%;
}

.num {
  overflow: hidden;
  width: 77%;
  padding-bottom: 15px;
  border: 1px solid white;
  float: left;
}

.no {
  display: block;
  width: 10%;
  height: 10%;
  border: 2px solid #fff *;
  background: orange;
  color: yellow;
  line-height:40px;
  text-align: center;
  /*font-weight: bold;*/
  font-size: 24px;
  float: left;
  /*margin-top: 15px;
  margin-left: 15px;*/
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
.confirm{
	display: block;
  width: 30%;
  height: 8%;
  border: 2px solid #fff *;
  background: orange;
  color: yellow;
 line-height:40px;
  text-align: center;
  /*font-weight: bold;*/
  font-size: 24px;
  float: left;
  /*margin-top: 15px;
  margin-left: 15px;*/
}



/*.confirm {
  margin-top: 80%;
}*/

.quit {
  margin-top: 165px;
}
</style>