<template>
	<div class="dia">

		<div class="myBody">
			
			<audio id="audioPlay_"> 
			<source v-bind:src='audioUrl' type="audio/mpeg" alt="">
		    </audio>
			<div class="bg">
				<img v-bind:src='imgUrl' alt=""></div>
			<div class="myHeader">渭阳西路街道党员党性教育体检中心</div>
			<div class="myContent">
				<div class="questinfo">
					<p> <span>红线问题:</span> <span>{{ nowRed.RedLineID }}</span></p>

				</div>
				<div class="hx_question">
					{{ nowRed.RedLineContent }}
				</div>
				<div class="answerinfo">
					<p>红线答案:</p>
				</div>
				<div class="hx_answer">
					<label><input class="Radio" type="radio" name="Radio" value="无" @click="check()"/>无</label>
					<label><input class="Radio" type="radio" name="Radio" value="有" @click ="check()"/>有</label>
				</div>
				<div class="resultinfo">
					<p>结果:</p>
				</div>
				<div class="hx_res">
					<ul class="resList_red">
						<li v-for="(item,index) in items_red">
							<div>
								<p> {{ items_red[index].RedLineID }}</p>
								<div v-bind:class="flag[index] ? classA:classB">
									{{ item.number }}
								</div>
							</div>

						</li>
					</ul>
				</div>
				<div class="btns">
					<div>
						<button @click="turn(-1)" class="button-1">上一题</button>
					</div>
					<div>
						<button @click="turn(1)" class="button-1">下一题</button>
					</div>
					<div>
						<button @click="finish" class="button-1">完成</button>
					</div>
					<div>
						<button @click="pageBack" class="button-1">退出</button>
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

		props: ["sendToRed"],
		closeFlag: false,
		methods: {
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
  	
			
			
			
			turn(type) {
				if(type == -1) {
					this.index = this.index + type;
					this.index = this.index > 9 ? 9 : this.index;
					this.index = this.index < 0 ? 0 : this.index;
					this.flag[this.index + 1] = false;
					this.flag[this.index] = true;
					this.nowRed = this.redLineList[this.index];
				} else {
					if(this.items_red[this.index].number) {
						this.index = this.index + type;
						this.index = this.index > 9 ? 9 : this.index;
						this.index = this.index < 0 ? 0 : this.index;
						this.flag[this.index] = true;
						this.flag[this.index - 1] = false;
						this.nowRed = this.redLineList[this.index];
					} else {
						this.video(this.messageV);
						this.showPopOne(this.messageV);//"请先给本题评分！",
					}

				}

			},
			judgeRedRecord() {
				this.finished = false;
				for(var i = 0; i < this.items_red.length; i++) {
					if(!this.items_red[i].number) {
						this.finished = true;
						return true;
					}
				}
				return false;
			},
			judgeFinishRed() {
				this.finished = true;
				for(var i = 0; i < this.items_red.length; i++) {
					if(!this.items_red[i].number) {
						this.finished = false;
					}
				}
			},

			check() {
				var obj = document.getElementsByName("Radio");
				var tempt;
				for(var i = 0; i < obj.length; i++) {
					if(obj[i].checked) {
						this.items_red[this.index].number = obj[i].value;
						tempt = this.index;
						this.turn(1);

					}

				}
				if(tempt == this.redLineList.length - 1) {
					this.judgeFinishRed();
					if(this.finished) {
						this.video(this.messageB);
						this.showPopOne(this.messageB); //已完成评价，请点击“完成”按键完成评价过程。
					} else {
						this.video(this.messageC);
						this.showPopOne(this.messageC); //请完成没有作答的红线问题！

					}

				}

			},
			JSONAnswer(type) {
				var json = {
					IsFinished: type,
					items_red: this.items_red
				};
				this.finished = true;
				for(var i = 0; i < this.items_red.length; i++) {
					if(!this.items_red[i].number) { //没数据false
						this.finished = false;
						json.IsFinished = 0;
						json.items_red[i].number = "";
					} else {
						//						json[this.redLineList[i].RedLineID] = this.items_red[i].number;
						json.items_red[i].number = this.items_red[i].number;
					}
				}
				console.log('------------redLing_result----------' + JSON.stringify(json));
				return json;
			},
			finish() {
				if(!this.finished) {
					//没完成
					this.video(this.messageC);
					this.showPopOne(this.messageC);
				} else {
					// childByValue是在父组件on监听的方法
					// 第二个参数this.childValue是需要传的值
					this.$emit("get-data", this.JSONAnswer(1));
				}
			},
			pageBack() {
				this.$emit("backFromRed", this.JSONAnswer(1));
			},
			closePopOne() {
				this.bool_diaOne = false;
			},
			showPopOne(message) {
				this.bool_diaOne = true;
				this.messageOne = message;
			}
//			setFlagTofalse() {
//				for(var i = 0; i < this.flag.length; i++) {
//					this.flag[i] = false;
//				}
//			},
		},
		created: function() {
			this.$ajax({
					method: "get",
					url: "get_backBround?PictureTypeID=02&AssessTypeID=04"
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
            
            
			this.redLineList = this.sendToRed.redLineList;
			this.items_red = this.sendToRed.items_red;
			this.flag_red = this.sendToRed.flag_red;
			console.log('------flag_red------'+JSON.stringify(this.flag_red));
			console.log('------items_red------'+JSON.stringify(this.items_red));
			console.log('------redLineList------'+JSON.stringify(this.redLineList));

			if(this.flag_red) {
				var fa = 0;
				for(var j = 0; j < this.items_red.length; j++) {
					if(this.items_red[j].number=="无"||this.items_red[j].number=="有") {
						//设置红色框
						this.flag[fa] = false;
						this.flag[j] = true;
						fa = j;
					}
				}
				this.index = fa;
				this.nowRed = this.redLineList[fa];
			} else {
				this.nowRed = this.redLineList[0];
			}

			//			if(this.redLineList) {
			//				this.nowRed = this.redLineList[0];
			//			}

			this.$ajax({
					method: "get",
					url: "get_questionAndAnswer"
				})
				.then(res => {
					//info
					res = res.data;
					if(res.status.code == 100) {
						//						this.messageA = res.info_D_question_assessed;//请进行红线问题作答！
						this.messageB = res.info_D_redLine_assessed; //'已完成评价，请点击“完成”按键完成评价过程。'
						this.messageC = res.info_D_redLine_assessing; //请完成没有作答的红线问题！
					} else {
						this.video(res.status.msg);
						this.showPopOne(res.status.msg);
					}
				})
				.catch(function(err) {
					console.log("-------err-------" + err);
				});
		},
		data() {
			return {
				audioUrl: "../../static/assets/zp32.mp3",
				imgUrl: "../../static/assets/bg_2.jpg",
				nowRed: {
					RedLineContent: "未选择",
					RedLineID: "未选择"
				},
				flag_red: false,
				flag: [
					true,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false
				],
				classA: "classA",
				classB: "classB",
				bool_diaOne: false,

				messageB: "已完成评价，请点击“完成”按键完成评价过程。",
				messageC: "请完成没有作答的红线问题！",
				 messageV:"请先给本题评分！",
				finished: 0,
				json_copy: "",
				index: 0,
				items_red: [{
						num: null,
						RedLineID: "A",
						number: null
					},
					{
						num: null,
						RedLineID: "B",
						number: null
					},
					{
						num: null,
						RedLineID: "C",
						number: null
					},
					{
						num: null,
						RedLineID: "D",
						number: null
					},
					{
						num: null,
						RedLineID: "E",
						number: null
					},
					{
						num: null,
						RedLineID: "F",
						number: null
					},
					{
						num: null,
						RedLineID: "G",
						number: null
					},
					{
						num: null,
						RedLineID: "H",
						number: null
					},
					{
						num: null,
						RedLineID: "I",
						number: null
					},
					{
						num: null,
						RedLineID: "J",
						number: null
					}
				]
			};
		}
	};
</script>

<style scoped>
	.classB {
		width: 60px;
		height: 40px;
		/*line-height: 10px;*/
		background-color: #fff;
		text-align: center;
		margin: auto;
	}
	
	.classA {
		width: 60px;
		height: 40px;
		/*line-height: 10px;*/
		background: #fff;
		text-align: center;
		margin: auto;
		border-style: solid;
		border-width: 2px;
		border-color: #ff4500;
	}
	.dia {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 80%;
		height: 80%;
		font-size: 0.4rem;
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
	
	
	
	.myBody {
		position: relative;
		width: 100%;
		height: 100%;
	}
	
	.bg {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		z-index: -1;
	}
	
	.myHeader {
		font-size: 0.7rem;
		font-weight: bold;
		height: 142px;
		line-height: 142px;
		text-align: left;
		padding-left: 155px;
	}
	
	.myContent {
		width: 100%;
		text-align: left;
		margin-left: 8%;
		margin-top: 1%;
	}
	
	.questinfo,
	.answerinfo,
	.resultinfo {
		padding-top: 10px;
		font-size: 0.4rem;
	}
	
	.questinfo::after {
		content: "";
		display: block;
		clear: both;
	}
	
	.questinfo p,
	.answerinfo p,
	.resultinfo p {
		display: inline-block;
		width: 30%;
		text-align: left;
	}
	
	.hx_question,
	.hx_answer,
	.hx_res {
		width: 85%;
		border: 0.5px solid silver;
		font-size: 0.40rem;
	}
	
	.hx_question {
		text-indent: 40px;
		padding: 20px 10px;
		height: 2.1rem;
	}
	
	.hx_answer {
		text-align: center;
		height: 60px;
		line-height: 60px;
	}
	
	.hx_answer label:nth-child(2) {
		margin-left: 330px;
	}
	
	.hx_res {
		height: 100px;
		over-flow: hidden;
	}
	
	.hx_res>div {
		float: left;
		text-align: center;
		width: auto;
	}
	
	.isAnswer {
		width: 75px;
		height: 35px;
		line-height: 35px;
		background: white;
		margin-left: 20px;
	}
	
	.btns {
		width: 100%;
		margin-top: 0.2rem;
	}
	
	.btns>div {
		display: inline-block;
		width: 1.8rem;
		margin-left: 0.8rem;
		height: 0.5rem;
		line-height: 0.5rem;
		background: orange;
		color: yellow;
		text-align: center;
	}
	
	.button-1 {
		display: inline-block;
		margin: auto;
		width: 1.8rem;
		border: 2px solid #fff;
		color: yellow;
		/*color: rgb(255, 186, 58);*/
		background: orange;
		height: 0.8rem;
		box-sizing: border-box;
		line-height: 0.76rem;
		/*padding: 0px 40px;*/
		text-decoration: none;
		font-size: 0.35rem;
		font-family: "微软雅黑";
		font-weight: 600;
	}
	
	.next {
		margin-left: 0.3rem;
		margin-right: 0.3rem;
	}
	
	.finish {
		margin-right: 0.3rem;
	}
	
	.resList_red {
		height: 30px;
		margin-bottom: 0.3rem;
	}
	
	.resList_red li {
		width: 10%;
		height: 60px;
		float: left;
	}
	
	.resList_red li>div {
		text-align: center;
	}
	
	.resList_red li>div>div {
		width: 60px;
		height: 40px;
		/*line-height: 10px;*/
		/*background-color: #fff;*/
		text-align: center;
		margin: auto;
	}
</style>