<template>
	<div class="myBody">
		<audio id="audioPlay"> 
			<source v-bind:src='audioUrl' type="audio/mpeg" alt="">
		</audio>
		<div class="bg">
			<img v-bind:src='imgUrl' alt=""></div>
		<div class="myHeader">党性自评端</div>
		<div class="content">
			<div class="contentBox">

				<h3>党  员  信  息</h3>
				<div class="contentBox_1">
					<div class="message">
						<p>
							<span>姓名 :</span><span>{{nowChoose.Name}}</span>
						</p>
						<p>
							<span>类别 :</span><span>{{nowChoose.PartyMemberLableName}}</span>
						</p>
						<p>
							<span>支部 :</span><span>{{nowChoose.PartyBranchName}}</span>
						</p>
					</div>
				</div>
			</div>
			<div class="contentBox">
				<h3>问  题  作  答</h3>
				<div class="contentBox_1">
					<div class="questinfo">
						<p> <span>问题:</span> <span>{{nowquest.DisplayOder}}</span></p>
						<p> <span>题型:</span> <span>{{nowquest.EvaluationAngle}}</span></p>
						<p><span>分数:</span> <span>{{nowquest.ChoiceCount}} 分</span> </p>
					</div>
					<p class="questtext">
						{{nowquest.QuestionContent}}
					</p>

					<div class="contentBox_2">
						<h4>分数选择</h4>
						<div>
							<button @click="chooseAnswer(5)" class="button-1 ">优秀</button>
							<button @click="chooseAnswer(4)" class="button-1 ">良好</button>
							<button @click="chooseAnswer(3)" class="button-1 ">一般</button>
							<button @click="chooseAnswer(1)" class="button-1 ">较差</button>
						</div>
					</div>
					<div class="contentBox_2">
						<h4>结果</h4>
						<div>
							<ul class="resList">
								<li v-for="(item,index) in items">
									<div>
										<p> {{ index+1 }}</p>
										<div v-bind:class="flag[index] ? classA:classB">
											{{ item.num }}
										</div>
									</div>

								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="bottom-button">
				<div>
					<button @click="turn(-1)" class="button-1">上一题</button>
				</div>
				<div>
					<button @click="turn(1)" class="button-1">下一题</button>
				</div>

				<div>
					<button @click="update" class="button-1">提交</button>
				</div>
				<div>
					<button @click="pageBack" class="button-1">返回</button>
				</div>
			</div>

		</div>
		<div class="dia_ques" v-if="bool_diaTwo">
			<quesDia :messageTwo="messageTwo" v-if="messageTwo" @quitAll="quitAll" @noQuitAll="noQuitAll" @updateAll="updateAll" @noUpdateAll="noUpdateAll" @noUpdateAndQuit="noUpdateAndQuit"></quesDia>
		</div>
		<div class="dia_ques" v-if="bool_diaOne">
			<quesDia_one :messageOne="messageOne" v-if="messageOne" @determine="closePopOne" @quitToMain="quitToMain"></quesDia_one>
		</div>
	</div>
</template>

<script>
	import quesDia from "./quesDia";
	import quesDia_one from "./quesDia_one";

	export default {
		components: {
			quesDia,
			quesDia_one
		},
		name: "makeAnswer",
		methods: {
			openAudio(words) {
			var oMusic = document.getElementById("audioPlay");
			this.audioUrl = words;
			oMusic.pause();
			oMusic.load();
			setTimeout(function() {
				oMusic.play();
			}, 250);
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

			pageBack() {
				this.showPopTwo(this.messageB);
				this.video(this.messageB);
			},
			quitAll() {
				this.closePopTwo();
				if(this.judgeFinish()) {
					this.video(this.messageG);
					this.showPopTwo(this.messageG); //当前数据未提交到数据库，是否提交？
					
				} else {
					this.video(this.messageC);
					this.showPopTwo(this.messageC); //当前问题没有完成，是否提交至数据库？
					
				}
			},
			noUpdateAndQuit() {
				this.closePopTwo();
				this.$router.push({
					name: "index"
				});
			},
			noQuitAll() {
				this.closePopTwo();
			},

			judgeFinish() {
				var finish = true;
				for(var i = 0; i < 20; i++) {
					if(!this.items[i].number) {
						finish = false;
					}
				}
				return finish;
			},
			closePopOne() {
				this.bool_diaOne = false;
			},
			showPopOne(message) {
				this.messageOne = message;
				this.bool_diaOne = true;
			},
			showPopTwo(message) {
				this.messageTwo = message;
				this.bool_diaTwo = true;
			},
			closePopTwo() {
				this.bool_diaTwo = false;
			},
			noUpdateAll() {
//				this.closeAudio();
				this.closePopTwo();
			},
			updateAll() {
//				this.closeAudio();
				this.closePopTwo();
				this.update_();
			},

			update() {
				if(this.judgeFinish()) {
					this.video(this.messageH);
					this.showPopTwo(this.messageH); //messageH:'是否确认提交？',
					
				} else {
					this.video(this.messageA);
					this.showPopOne(this.messageA); //messageA:'请完成所有题目后再提交，谢谢！',
					
				}
			},
			JSONAnswer(type) {
				var _this = this;
				var json = {
					IsFinished: type
				};
				for(var i = 0; i < 20; i++) {
					json["Answer_" + i] = _this.items[i].number;
					if(!_this.items[i].number) {
						json.IsFinished = 0;
						json["Answer_" + i] = "";
					}
				}
				return json;
			},
			quitToMain() {
				this.closePopOne();
				this.$router.push({
					name: "index"
				});
			},
			update_() {
				var _this = this;
				var data = this.JSONAnswer(1);

				this.$ajax({
						method: "POST",
						url: "save_questionAndAnswer",
						data: data,
						headers: {
							"Content-type": "application/x-www-form-urlencoded;charset=UTF-8"
						}
					})
					.then(res => {
						//info
						res = res.data;
						if((res.code = 100)) {
							this.video(this.audio_C);
							this.showPopOne(this.messaegP); //提交成功,即将跳转至首页面！
							
						} else {
							this.video(res.msg);
							this.showPopOne(res.msg);

						}
					})
					.catch(function(err) {
						console.log(err);
					});
			},
			
			turn(type) {
				if(type == -1) {
					var index = this.nowquest.DisplayOder;
					index = index + type;
					if(index < 1) {
						this.video(this.messageD);
						this.showPopOne(this.messageD);//已到第一题
						
					}

					index = index > 20 ? 20 : index;
					index = index < 1 ? 1 : index;
					this.flag[index] = false; //待作答的方框背景色改变
					this.flag[index - 1] = true;
					this.nowquest = this.questionList[index - 1];
					this.nowquest.DisplayOder = index;
				} else {
					if(this.items[this.nowquest.DisplayOder - 1].number) {
						var index = this.nowquest.DisplayOder;
						index = index + type;
						if(index > 20) {
							this.video(this.audio_B);
							this.showPopTwo(this.messageF);
//							this.video(this.messageF);
							
						}
						index = index > 20 ? 20 : index;
						index = index < 1 ? 1 : index;
						this.flag[index - 1] = true;
						this.flag[index - 2] = false;
						this.nowquest = this.questionList[index - 1];
						this.nowquest.DisplayOder = index;
					} else {
						this.video(this.messageE);
						this.showPopOne(this.messageE); //请先给本题评分！
						
					}
				}
			},

			chooseAnswer(num) {

				this.items[this.nowquest.DisplayOder - 1].number = num;
				this.items[this.nowquest.DisplayOder - 1].num = "*";
				this.turn(1);
			},
			listUpdate(list) {
				this.questionList = list;
			},
			updateAnswer(answers) {
				var fa = 0;
				for(var i = 0; i < this.questionList.length; i++) {
					var Answer_e = "Answer_" + i;
					if(answers["Answer_" + i] != "") {
						//设置红色框
						this.flag[fa] = false;
						this.flag[i] = true;
						fa = i;
						this.items[i].number = answers["Answer_" + i];
						this.items[i].num = "*";
					}
				}
				this.nowquest = this.questionList[fa];
			}
		},
		created: function() {
			this.$ajax({
					method: "get",
					url: "get_backBround?PictureTypeID=02&AssessTypeID=01"
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

			this.nowquest = this.questionList[0];
			this.$ajax({
					method: "get",
					url: "get_questionAndAnswer"
				})
				.then(res => {
					//info
					res = res.data;
					this.listUpdate(res.info_question);

					this.nowquest = this.questionList[0];

					this.nowChoose = res.info_member;
					if(res.isHavingWrited) {
						this.updateAnswer(res.info_answer);
					}
					this.audio_A = res.info_C_determine;
					this.audio_B = res.info_D_all_assessed;
					this.audio_C = res.info_D_all_determine;
					
					this.video(this.audio_A);

				})
				.catch(function(err) {
					console.log(err);
				});
		},
		data() {
			return {
				finish_ques: false,
				audioUrl: "../../static/assets/zp32.mp3",
				imgUrl: "../../static/assets/bg_2.jpg",
				msg: "test",
				classA: "classA",
				classB: "classB",
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

				messageA: "请完成所有题目后再提交，谢谢！", //ll
				messageH: "是否确认提交？", //ll

				messageB: "是否确认退出？", //ll
				messageC: "当前问题没有完成，是否提交至数据库？", //ll
				messageG: "当前数据未提交到数据库，是否提交？", //ll

				messageD: "已到第一题", //index=0>LL
				messageE: "请先给本题评分！", //LLL
				messageF: "评价已完成,是否点击“提交”按键，提交评价数据。", //index=20LL
				messaegP: "提交成功,即将跳转至首页面！",

				audio_A: "自评问卷由20道测试题组成，请您在每道题的答案中，选择与自身实际相符的答案，现在答题开始",
				audio_B: "评价已完成，是否点击“提交”按键，提交评价数据。",
				audio_C: "答题完成，谢谢您的参与，请前往“党员互评”电脑，开始体检第二环节。",

				messageTwo: "",
				messageOne: "",

				bool_diaTwo: false,
				bool_diaOne: false,
				items: [{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					},
					{
						num: null,
						number: null
					}
				],
				nowChoose: {
					PartyMemberID: "1",
					Name: "test1",
					PartyMemberLableName: "两新组织党员",
					PartyBranchName: "中共咸阳秦宝中学支部委员会"
				},
				questionList: [{
						ChoiceCount: 5,
						DisplayOder: 1,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "1",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 2,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "2",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 3,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "3",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 4,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "4",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 5,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "5",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 6,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "6",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 7,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "7",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 8,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "8",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 9,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "9",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 10,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "10",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 11,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "11",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 12,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "12",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 13,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "13",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 14,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "14",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 15,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "15",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 16,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "16",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 17,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "17",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 18,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "18",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 19,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "19",
						QuestionnaireTypeID: "2"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 20,
						EvaluationAngle: "",
						IsUse: true,
						QuestionContent: "",
						QuestionID: "20",
						QuestionnaireTypeID: "2"
					}
				],
				nowquest: {
					ChoiceCount: 5,
					DisplayOder: 2,
					EvaluationAngle: "",
					QuestionContent: "",
					QuestionID: "2"
				}
			};
		}
	};
</script>

<style scoped>
	
	.classB {
		width: 40px;
		height: 30px;
		line-height: 30px;
		background-color: #fff;
		text-align: center;
		margin: auto;
	}
	
	.classA {
		width: 40px;
		height: 30px;
		line-height: 30px;
		background-color: #fff;
		/*background: #fbd40d;*/
		border-style: solid;
		border-width: 2px;
		border-color: #ff4500;
		text-align: center;
		margin: auto;
		/*orangered;*/
	}
	
	.myBody_ {
		width: 100%;
		height: 100%;
		margin-top: -30px;
		overflow: hidden;
		/*position: relative;*/
	}
	
	.showDia_redLine {
		/*position: absolute;
		left: 350px;
		top: 50px;
		z-index: 100;*/
		position: fixed;
		top: 0%;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 200;
		background: rgba(0, 0, 0, 0.5) !important;
		/* 兼容ie几不知道，好像ie6 */
		background: #000;
		filter: Alpha(opacity=60);
	}
	
	.child_container {
		position: relative;
		margin: auto;
		top: 30%;
		background: #fff;
		z-index: 250;
		/*z-index要放在父元素之上 */
	}
	
	.dia_ques {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		z-index: 99;
	}
	
	.dialog_content {
		font-size: 0.4rem;
	}
	
	.button-1 {
		display: inline-block;
		margin: auto;
		border: 2px solid #fff;
		color: rgb(255, 186, 58);
		background-color: orangered;
		/*orangered;*/
		height: 0.8rem;
		box-sizing: border-box;
		line-height: 0.8rem;
		padding: 0px 0.45rem;
		text-decoration: none;
		font-size: 0.38rem;
		font-family: "微软雅黑";
		font-weight: 600;
	}
	
	.button-1_disabled {
		background-color: orange;
	}
	
	.resList li {
		width: 5%;
		height: 0.8rem;
		display: inline-block;
		vertical-align: top;
		margin-left: 0.15rem;
		margin-bottom: 0.1rem;
		text-align: center;
	}
	
	.resList_red li {
		width: 7%;
		height: 60px;
	}
	
	.contentBox {
		height: 90%;
	}
	
	.contentBox:nth-of-type(1) {
		width: 30%;
		box-sizing: border-box;
	}
	
	.message {
		text-align: left;
		font-size: 0.4rem;
		padding-top: 20px;
		height: 30%;
	}
	
	h3 {
		font-size: 0.5rem;
	}
	
	.message p {
		margin-bottom: 0.3rem;
		text-align: left;
	}
	
	.message p span:nth-of-type(1) {
		display: block;
		width: 30%;
		box-sizing: border-box;
		margin-left: 5%;
		float: left;
	}
	
	.message p span:nth-of-type(2) {
		display: block;
		width: 60%;
		box-sizing: border-box;
		text-align: left;
		float: left;
	}
	
	.message:after,
	.message p:after {
		content: "";
		display: block;
		clear: both;
	}
	
	.depatementTable {
		width: 80%;
		height: 64%;
		margin: 1rem auto;
	}
	
	.contentBox h3,
	.contentBox h4 {
		text-align: left;
		position: relative;
		left: 3%;
	}
	
	.contentBox:nth-of-type(2) {
		width: 70%;
		box-sizing: border-box;
	}
	
	.contentBox_1 {
		border: 2px solid #fff;
		width: 95%;
		margin: auto;
		height: 90%;
	}
	
	.questinfo {
		padding-top: 10px;
	}
	
	.questinfo::after {
		content: "";
		display: block;
		clear: both;
	}
	
	.questinfo p {
		display: inline-block;
		width: 30%;
		text-align: left;
		font-size: 0.4rem;
	}
	
	.questinfo p:nth-of-type(1) {
		width: 30%;
	}
	
	.questtext {
		color: rgba(81, 81, 253, 0.795);
		font-size: 0.4rem;
		width: 80%;
		margin: auto;
		padding: 10px 5px;
		height: 17%;
		text-align: left;
		text-indent: 2em;
	}
	
	.contentBox_2 {
		margin-bottom: 10px;
	}
	
	.contentBox_2 h4 {
		font-size: 0.4rem;
		margin-bottom: 10px;
	}
	
	.contentBox_2>div {
		width: 90%;
		margin: auto;
		border: 2px solid #fff;
		padding: 20px 30px;
		text-align: left;
		font-size: 0.3rem;
	}
	
	.contentBox_2>div button {}
	
	.resList_ques {
		margin-bottom: 0.2rem;
	}
	
	.resList_ques li>div {
		text-align: center;
	}
	
	.resList_ques li {
		margin-left: 0.3rem;
		margin-bottom: 0.1rem;
	}
	
	.resList_red {
		display: block;
		height: 30px;
		margin-bottom: 20px;
	}
	
	.resList_red li>div {
		text-align: center;
	}
	
	.resList_red li>div>div {
		width: 42px;
		height: 30px;
		line-height: 30px;
		background-color: #fff;
		text-align: center;
		margin: auto;
	}
	
	.resList_red li {
		margin-left: 0.25rem;
	}
	
	.bottom-button {
		padding-top: 12px;
        padding-left: 15%;
		margin: 0.6rem auto;
	}
</style>