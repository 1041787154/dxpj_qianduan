<template>
	<div class="wzj">
		<audio id="audioPlay_"> 
			<source v-bind:src='audioUrl' type="audio/mpeg" alt="">
		</audio>
		<img class="bg_3_img" v-bind:src='imgUrl' alt="" />
		<div class="wzj_content">
			
			<div class="psw">
				请输入用户名：
				<input id="user" class="username" type="text" placeholder="请输入用户名"  @focus="userChange"/>
			</div>
			<div class="psw">
				请输入手机号：
				<input id="phone" class="username" type="text" placeholder="请输入手机号"  @focus="phoneChange"/>
			</div>
			<div class="bottom-button">
				<div>
					<button @click="next" class="button-1">注册</button >
               </div>
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
  	userChange(){
  		this.video(this.messageA);//请您输入用户名！
  	},
  	phoneChange(){
  		this.video(this.messageC);//请您输入手机号！
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

  	
  	
  	
    showPopOne(message) {
      this.bool_diaOne = true;
      this.messageOne = message;
    },
    closePopOne() {
      this.bool_diaOne = false;
    },
    quitToMain(){
    	var this_ = this;
    	this.bool_diaOne = false;
    	this_.$emit("determine", false);
    },
    next() {
    	var sp_1=document.getElementById("user").value;
    	var sp_2=document.getElementById("phone").value;
    	var p1=/^(13[0-9]\d{8}|15[0-35-9]\d{8}|18[0-9]\{8}|14[57]\d{8})$/;
     if (sp_1.length < 1) {
      	this.video(this.messageA);
        this.showPopOne(this.messageA);//请您输入用户名！
        document.getElementById("user").value = "";
      } else if(p1.test(sp_2)==false){
		this.video(this.messageD);
        this.showPopOne(this.messageD);//请您正确输入手机号！  
		document.getElementById("phone").value = "";
      }else{
        this.$ajax({
          method: "get",
          url:
            "register_?user=" +sp_1+"&phone="+sp_2    
        })
          .then(res => {
            //info

            res = res.data;

            if (res.code == 100) {
//            alert("验证成功");
              this.video(this.messageB);
              this.showPopOne(this.messageB);// "设备验证成功，即将跳转到党性自评端！"
            } else {
              document.getElementById("user").value = "";
              document.getElementById("phone").value = "";
              this.video(res.msg);
              this.showPopOne(res.msg);
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      }
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
      username: "",
      phone: "",
      messageA: "请您输入用户名！",
      messageB: "注册成功，即将跳转到党性自评端！",
      messageC: "请您输入手机号！",
      messageD: "请您正确输入手机号！",
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
.bottom-button {
    top: 57%;
    width: 80%;
    margin: auto;
    left: 0;
    right: 0;
    position: absolute;
    word-break: keep-all;
}
.username {
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