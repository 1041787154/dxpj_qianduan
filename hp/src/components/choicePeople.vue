<template>
	<div class="myBody">
		<audio id="audioPlay" v-bind:src='audioUrl' type="audio/mpeg" alt=""></audio>
		<div class="bg">
			<img v-bind:src='imgUrl' alt=""></div>
		<div class="myHeader">党性互评端</div>
		<div class="content">
			<div class="title">
				<h2>党   员   选   择</h2>
				<br>
			</div>
			<div class="mainContent">
				<div class="contentBox">
					<div class="depatementTable">
						 <el-table :data="tableData" height="100%" border style="width: 100%" @row-click="choose"  highlight-current-row>
							<el-table-column prop="PartyMemberID" label="党员编号"  align="center">
							</el-table-column>
							<el-table-column prop="Name" label="姓名"  align="center">
							</el-table-column>
							<el-table-column prop="Sex" label="性别"  align="center">
							</el-table-column>
							<el-table-column prop="Birthday" label="生日"  align="center">
							</el-table-column>
							<el-table-column prop="PartyBranchName" label="支部名称"  align="center" width="300">
							</el-table-column>
							<el-table-column prop="PartyMemberLableName" label="类别"  align="center" >
							</el-table-column>
						
						
						</el-table>
						
						<p class="chooseText">
							当前选择 : {{nowChoose.Name}}
						</p>
					</div>
				</div>
				<div class="contentBox">
					<div class="contentBox_2">
						<div class="message">
							<p>
								<span>党员 :</span><span>{{nowChoose.Name}}</span>
							</p>
							<p>

							</p>
							<p>
								<span> 密码 :</span><input type="password" :value="password" @focus="passOnfocus"/>
							</p>
							<br>
						</div>
						<div class="buttonBox">
							<ul class="buttonBoxBtn">
								<button @click="chooseNum(1) ">
									<div>1</div>
								</button>
								<button @click="chooseNum(2)">
									<div>2</div>
								</button>
								<button @click="chooseNum(3)">
									<div>3</div>
								</button>
								<button @click="chooseNum(4)">
									<div>4</div>
								</button>
								<button @click="chooseNum(5)">
									<div>5</div>
								</button>
								<button @click="chooseNum(6)">
									<div>6</div>
								</button>
								<button @click="chooseNum(7)">
									<div>7</div>
								</button>
								<button @click="chooseNum(8)">
									<div>8</div>
								</button>
								<button @click="chooseNum(9)">
									<div>9</div>
								</button>
								<button @click="chooseNum('X')">
									<div>X</div>
								</button>
								<button @click="chooseNum(0)">
									<div>0</div>
								</button>
								<button @click="chooseNum(-1)">
									<div>
										<-</div>
								</button>
							</ul>
							</div>
							<div class="bottom-button">
								<div>
									<button @click="next('makeAnswer')" class="button-1">确定</button>
								</div>
								<div>
									<router-link to="/choiceDepartment" class="button-1">返回</router-link>
								</div>

							</div>
						</div>

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
	
  name: "choicePeople",
  methods: {
  	openAudio(words) {
			var oMusic = document.getElementById("audioPlay");
			this.audioUrl = words;
			oMusic.pause();
			oMusic.load();
			setTimeout(function() {
				oMusic.play();
			}, 150);

			this.bool_audioOpen = false;
			oMusic.addEventListener('ended', function() {
				this.bool_audioOpen = true;
			}, false);

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
  	
  	
  	passOnfocus() {
			this.video(this.audio_B);
		},
  	
  		showPopOne(messsage){
  		this.bool_diaOne=true;
  		this.messageOne=messsage;
  	},
  	closePopOne(){
  		this.bool_diaOne=false;
  	},
  	
  	
    choose(row, rowData, column) {
      
      this.nowChoose = row;
      this.password = "";
      this.video(this.audio_B);//请输入登陆密码
      console.log('--------this.audio_B------'+this.audio_B);
    },
    chooseNum(num) {
      if (num != -1) {
        this.password += num;
      } else if (num == -1) {
        this.password = this.password.slice(0, this.password.length - 1);
      }
    },
    next(url_) {
      if (this.nowChoose.PartyMemberID != -1) {
        var data = {
          a: this.nowChoose.PartyMemberID,
          b: this.password
        };
        console.log("------data------" + JSON.stringify(data)); //控制台中打印相关信息
        this.$ajax({
          method: "get",
          url: "judge_partyMember_byMemberId?a=" +
            data.a +
            "&b=" +
            data.b
        })
          .then(res => {
            //info

            res = res.data;

            if (res.status.code == 100) {
              //            alert("验证成功");
              this.$router.push({
                //传参数
                name: url_
//              params: {
//                PartyMemberID: this.nowChoose.PartyMemberID,
//                Name: this.nowChoose.Name,
//                PartyMemberLableName: this.nowChoose.PartyMemberLableName,
//                PartyPosition: this.nowChoose.PartyPosition
//              }
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
      } else {
      	 this.video(this.messageA);
        this.showPopOne(this.messageA);
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
      
    var id = this.$route.query.PartyBranchID; //接受参数PartyBranchID  https://www.cnblogs.com/lulianlian/p/7682790.html

    this.$ajax({
      method: "get",
      url: "get_partyMember_byPartyId/" + id
    })
      .then(res => {
        //info

        res = res.data;

        if (res.status.code == 100) {
          var list = res.info;
          this.audio_B = res.info_C_pass;//请输入登陆密码
          console.log('this.audio_B'+this.audio_B);
          this.video(res.info_B_determine);//选择完成，请选择您的姓名
          
        } else if (res.status.code == 104) {
          alert(res.status.msg);
          var list = [
            {
              PartyMemberID: "-1",
              PartyMemberLableName: "暂无",
              Name: "暂无",
              PartyPosition: "暂无"
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
    	
      audio_B:"请输入登陆密码",
      messageA:"无数据访问！",
      bool_diaOne:false,
      messageOne:'',
    	
      audioUrl: "../../static/assets/zp31.mp3",	
      imgUrl:"../../static/assets/bg_2.jpg",
      table_height: "60",
      password: "",
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
	
	
.contentBox_2 {
  width: 60%;
}

.chooseText {
  float: left;
  font-size: 0.4rem;
}

.depatementTable {
  width: 90%;
  height: 100%;
}

/*.bottom-button {
  top: 70% !important;
  left: 31.5%;
}*/

.buttonBoxBtn {
  width: 90%;
  border: 1px solid rgb(204, 204, 204);
  padding: 2px 2px;
}
/*li*/
.buttonBoxBtn button {
  width: 33%;
  float: left;
  text-align: center;
  margin-bottom: 10px;
  background-color: orange;
  border: 2px solid #fff *;
  /*#fff*/
}

.buttonBoxBtn button div {
  width: 50%;
  height: 47px;
  line-height: 46px;
  background-color: orange;
  /*border: 2px solid #fff;*/
  text-align: center;
  margin: auto;
  font-size: 0.4rem;
}

.buttonBoxBtn::after {
  content: "";
  display: block;
  clear: both;
}

.contentBox:nth-of-type(1) {
  width: 60%;
  height: 100%;
  box-sizing: border-box;
}

.contentBox:nth-of-type(2) {
  width: 36%;
  height: 100%;
  box-sizing: border-box;
}

.mainContent {
  height: 60%;
}

.message {
  text-align: left;
  font-size: 0.35rem;
}

.message p {
  margin-bottom: 7px;
}

.message p span:nth-of-type(1) {
  display: inline-block;
  width: 30%;
  box-sizing: border-box;
}

.message p span:nth-of-type(2) {
  display: inline-block;
  width: 70%;
  box-sizing: border-box;
}

.message p input {
  width: 70%;
  height: 30px;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>