<template>
	<div class="myBody_">
        <audio id="audioPlay"> 
			<source v-bind:src='audioUrl' type="audio/mpeg" alt="">
		</audio>
		<div class="bg"><img v-bind:src='imgUrl' alt=""></div>
		<div class="myHeader">党性互评端</div>
		<div class="content">
			<div class="contentBox">

				<h3>党  员  信  息</h3>
				<div class="contentBox_1">
					<div class="message">
						<p>
							<span>主评人 :</span><span>{{member_assessing.Name}}</span>
						</p>
						<p>
							<span>被评人 :</span><span>{{nowChoosed.Name}}</span>
						</p>
						<p>
							<span>支部 :</span><span>{{member_assessing.PartyBranchName}}</span>
						</p>
					</div>

					<div class="depatementTable">
						<el-table :data="member_assessed" height="100%" border style="width: 100%" @row-click="choose" highlight-current-row>
							<el-table-column type="index" prop="myIndex" :index="1" label="编号" align="center">
							</el-table-column>
							<el-table-column prop="Note" label="状态" align="center">
							</el-table-column>
							<el-table-column prop="Name" label="姓名" align="center">
							</el-table-column>
							<el-table-column prop="Sex" label="性别" align="center">
							</el-table-column>
							<el-table-column prop="Birthday" label="生日" align="center">
							</el-table-column>

						</el-table>

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
							<button @click="chooseAnswer(5)" id="btn4" v-bind:class="{'button-1':true,'button-1_disabled':bool_otherBtn}">5</button>
							<button @click="chooseAnswer(4)" id="btn5" v-bind:class="{'button-1':true,'button-1_disabled':bool_otherBtn}">4</button>
							<button @click="chooseAnswer(3)" id="btn6" v-bind:class="{'button-1':true,'button-1_disabled':bool_otherBtn}">3</button>
							<button @click="chooseAnswer(2)" id="btn7" v-bind:class="{'button-1':true,'button-1_disabled':bool_otherBtn}">2</button>
							<button @click="chooseAnswer(1)" id="btn8" v-bind:class="{'button-1':true,'button-1_disabled':bool_otherBtn}">1</button>
						</div>
					</div>
					<div class="contentBox_2">
						<h4>结果</h4>
						<div>
							<ul class="resList_ques">
								<li v-for="(item,index) in items_ques">
									<div>
										<p> {{ index+1 }}</p>
										<!--<div v-bind:class="{'classB':true,'classA':bool_calss}">-->
										<div v-bind:class="flag[index] ? classA:classB">
											{{ item.number }}
										</div>
									</div>

								</li>
							</ul>
							<ul class="resList_red">
								<li v-for="(item,index) in items_red">
									<div>
										<p> {{ items_red[index].RedLineID }}</p>
										<div>
											{{ item.number }}
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
					<button @click="turn(-1)" id="btn2" v-bind:class="{'button-1':true,'button-1_disabled':bool_otherBtn}">上一题</button>
				</div>
				<div>
					<button @click="turn(1)" id="btn3" v-bind:class="{'button-1':true,'button-1_disabled':bool_otherBtn}">下一题</button>
				</div>
				<div>
					<button @click="redLine" id="btn1" v-bind:class="{'button-1':true,'button-1_disabled':bool_Btn_redLine}">红线</button>
				</div>
				<div>
					<button @click="update" class="button-1">提交</button>
				</div>
				<div>
					<button @click="pageBack" class="button-1">返回</button>
				</div>

			</div>

		</div>
		<div class="showDia_redLine" v-if="dia_redLine">
			<div class="child_contenter">
				<redLineDia :redLineList="redLineList" v-if="redLineList" @get-data="getRed" @backFromRed="backFromRed"></redLineDia>
			</div>
		</div>

		<div class="dia_ques" v-if="bool_diaTwo">
			<quesDia :messageTwo="messageTwo" v-if="messageTwo" @noShoWRed="noShoWRed" @showRed="showRed" @quitAll="quitAll" @noQuitAll="noQuitAll" @updateFromQuit="updateFromQuit" @noUpdateFromQuit="noUpdateFromQuit" @saveOne="saveOne" @noSaveOne="noSaveOne" @updateAll="updateAll" @noUpdateAll="noUpdateAll" @noUpdateAndQuit="noUpdateAndQuit"></quesDia>
		</div>

		<div class="dia_ques" v-if="bool_diaOne">
			<quesDia_one :messageOne="messageOne" v-if="messageOne" @determine="closePopOne" @quitToMain="quitToMain"></quesDia_one>
		</div>

	</div>
</template>

<script>
	import redLineDia from "./redLineDia";
	import quesDia from "./quesDia";
	import quesDia_one from "./quesDia_one";

	export default {
		components: {
			redLineDia,
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
			
			
			
			redLine() {
				this.dia_redLine = true;
			},

			choose(row, event, col) {
				if(this.judgeAllIsFinished()) {
					this.video(this.messageF);
					this.showPopOne(this.messageF); //所有评价已完成，请点击“提交”按键，提交评价数据。
					
				} else {
					if(row.Note == "已完成") {
						this.video(this.messageK);
						this.showPopOne(this.messageK); //此用户已完成评价，不可点击！
					} else {
						if(!this.bool_member) {
							this.video(this.messageL);
							this.showPopOne(this.messageL); //请先完成此次评价！
						} else {
							//如果用户表可以点击&&只能点击未完成的用户
							//设置按钮
							let _this = this;
							let index = -1;
							_this.member_assessed.forEach((v, i) => {
								// id 是每一行的数据id

								if(v.PartyMemberID == row.PartyMemberID) {
									index = i;
								}
							});
							this.redBtnDisabel(false);
							this.flag[0] = true;
							this.otherBtnDisabel(false);
							//设置问题为未完成状态
							this.finish_red = false;
							this.finish_ques = false;
							//设置成可以保存的标志
							this.bool_result = true;

							this.int_index = index;
							this.nowChoosed = row;
							this.nowquest = this.questionList[0];
							this.video(this.messageR);//请您在赋分完成后，点击“提交”按键"
						}
					}
				}
			},

			saveToList() {
				if(this.bool_result) {
					//          	this.json_member["abb"]="sdf";
					//          	console.log(this.json_member);
					//					console.log('-------this.items_ques.length-------' + JSON.stringify(this.items_ques.length));
					var json = {
						IsFinished: 1,
						PartyMemberID: this.member_assessed[this.int_index].PartyMemberID
					};
					for(var i = 0; i < this.items_ques.length; i++) {
						json["Answer_" + i] = this.items_ques[i].number;
						this.items_ques[i].number = null;
					}
					for(var j = 0; j < this.items_red.length; j++) {
						json[this.items_red[j].RedLineID] = this.items_red[j].number;
						this.items_red[j].number = null;
					}
					//				this.json_member = json;
					this.json_members.push(json);
					//					console.log('-------json-------' + JSON.stringify(json));
					console.log(
						"-------members_assessedSuccessed-------" +
						JSON.stringify(this.json_members)
					);
				}
				this.bool_result = false; //防止多付保存一个用户答案
			},
			otherBtnDisabel(bool) {
				this.bool_otherBtn = bool;
				document.getElementById("btn2").disabled = bool;
				document.getElementById("btn3").disabled = bool;

				document.getElementById("btn4").disabled = bool;
				document.getElementById("btn5").disabled = bool;
				document.getElementById("btn6").disabled = bool;
				document.getElementById("btn7").disabled = bool;
				document.getElementById("btn8").disabled = bool;
			},
			redBtnDisabel(bool) {
				this.bool_Btn_redLine = bool;
				document.getElementById("btn1").disabled = bool;
			},

			showPopOne(message) {
				this.bool_diaOne = true;
				this.messageOne = message;
			},
			closePopOne() {
				this.bool_diaOne = false;
				this.closePopTwo();
			},
			getRed(childValue) {
				// childValue就是子组件传过来的值

				this.json_red = childValue; //红线信息
				this.dia_redLine = false; //不展示红线答题对话

				this.items_red = childValue.items_red; //红线答案
				this.finish_red = childValue.IsFinished; //是否完成红线评价

				this.bool_Btn_redLine = this.finish_red;
				//				if(this.bool_Btn_redLine) {

				this.redBtnDisabel(true); //将红线btn设成不可点击
				this.judgeFinishQues(); //判断普通问题是否完成

				if(this.finish_ques) {
					this.config_finish();
					if(this.judgeAllIsFinished()) {
						this.video(this.messageF);
						this.showPopOne(this.messageF); //所有评价已完成，请点击“提交”按键，提交评价数据。
					} else {
						this.bool_member = true; //设置用户列表可以点击
						this.video(this.messageC);
						this.showPopOne(this.messageC); //请选择下一位您要评价的党员
					}
				} else {
					this.video(this.messageE);
					this.showPopOne(this.messageE); //请完成该党员剩余的评价!
				}
			},
			judgeFinishQues() {
				this.finish_ques = true;
				for(var i = 0; i < 20; i++) {
					if(!this.items_ques[i].number) {
						this.finish_ques = false;
					}
				}
			},
			backFromRed() {
				this.dia_redLine = false;
				this.video(this.messageB);
				this.showPopOne(this.messageB);
			},
			//通过点击弹出框途径，进入红线评价对话框
			showRed() {
				this.closePopTwo();
				this.redLine();
			},
			//退出弹出框，不进入红线评价对话框
			noShoWRed() {
				this.closePopTwo();
			},
			quitAll() {
				if(this.num_finish()) {
					this.video(this.messageJ);
					this.showPopTwo(this.messageJ); //当前数据未提交到数据库，是否提交？
				} else {
					this.$router.push({
						name: "index"
					});
				}
			},
			noQuitAll() {
				this.closePopTwo();
			},
			updateFromQuit() {
				this.saveAll();
			},
			noUpdateFromQuit() {
				this.$router.push({
					name: "index"
				});
			},
			closePopTwo() {
				this.bool_diaTwo = false;
			},
			showPopTwo(message) {
				this.bool_diaTwo = true;
				this.messageTwo = message;
			},
			pageBack() {
				this.video(this.messageI);
				this.showPopTwo(this.messageI);
			},
			//判断是否完成80%人数的评价
			num_finish() {
				var numb = 0;
				for(var i = 0; i < this.member_assessed.length; i++) {
					if(this.member_assessed[i].Note == "已完成") {
						numb += 1;
					}
				}
				console.log("-------num_sum-------" + this.member_assessed.length);
				console.log("-------num_finish-------" + numb);
				if(numb < this.member_assessed.length * 0.8) {
					return false;
				} else {
					return true;
				}
			},
			judgeAllIsFinished() {
				var finish = true;
				for(var i = 0; i < this.member_assessed.length; i++) {
					if(this.member_assessed[i].Note == "未完成") {
						finish = false;
					}
				}
				return finish;
			},
			quitToMain() {
				this.closePopOne();
				this.$router.push({
					name: "index"
				});
			},
			saveAll() {
				var data = {
					info_member: this.json_members
				};
				console.log("-------updateInf-------" + JSON.stringify(data));
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
						console.log("-------res:-------" + JSON.stringify(res));
						if((res.code = 100)) {
							//								this.showPopOne('提交成功');
							//							this.showPopOne(this.messaegP); //提交成功,即将跳转至首页面！
//							alert('messaegP提交成功！');
//                          this.video(this.提交成功！);
							this.json_members = [];
						} else {
							this.video(res.msg);
							this.showPopOne(res.msg);
						}
					})
					.catch(function(err) {
						console.log("-------err2-------" + err);
					});
			},
			saveAll__() {

				this.$ajax({
						method: "get",
						url: "setAssessingStatus"
					})
					.then(res => {
						//info
						res = res.data;
						if(res.code == 100) {
							this.video(this.messaegP);
							this.showPopOne(this.messaegP); //提交成功,即将跳转至首页面！
							console.log("-------getInf_assessedAndAssessing--------" + res);
						} else {
							this.video(res.msg);
							this.showPopOne(res.msg);
						}
					})
					.catch(function(err) {
						console.log("-------err-------" + err);
					});

			},
			updateAll() {
				this.closePopTwo();
				this.saveAll__();
			},
			noUpdateAll() {
				this.closePopTwo();
			},
			noUpdateAndQuit() {
				this.closePopTwo();
				this.$router.push({
					name: "index"
				});
			},
			update() {
				if(!this.num_finish()) {
					this.video(this.messageU);
					this.showPopOne(this.messageU);//80%
				} else {
					this.video(this.messageH);
					this.showPopTwo(this.messageH);////是否确认提交？
					//
				}
			},

			turn(type) {
				if(type == -1) {
					var index = this.nowquest.DisplayOder;
					index = index + type; //现在的顺序
					index = index > 20 ? 20 : index;
					index = index < 1 ? 1 : index;
					this.flag[index] = false; //待作答的方框背景色改变
					this.flag[index - 1] = true;
					this.nowquest = this.questionList[index - 1];
					this.nowquest.DisplayOder = index;
				} else {
					if(this.items_ques[this.nowquest.DisplayOder - 1].number) {
						//该答题框有数据
						if(this.member_assessed[this.int_index].Note == "已完成") {
							//							this.flag[19] = false;
							this.setFlagTofalse();
							//							alert("您已完成评价，请选择下位要评价的成员！");
						} else {
							var index = this.nowquest.DisplayOder;
							index = index + type; //现在的顺序
							index = index > 20 ? 20 : index;
							index = index < 1 ? 1 : index;
							this.flag[index - 1] = true;
							this.flag[index - 2] = false;
							this.nowquest = this.questionList[index - 1];
							this.nowquest.DisplayOder = index;
						}
					} else {
						this.video(this.messageV);
						this.showPopOne(this.messageV);//"请先给本题评分！"
					}
				}
			},
			saveOne() {
				this.closePopTwo();
				this.config_finish();
				if(this.judgeAllIsFinished()) {
					this.video(this.messageF);
					this.showPopOne(this.messageF); //所有评价已完成，请点击“提交”按键，提交评价数据。
				} else {
					this.bool_member = true; //设置用户列表可以点击
					this.video(this.messageC);
					this.showPopOne(this.messageC); //请选择下一位您要评价的党员
				}
			},
			noSaveOne() {
				this.closePopTwo();
			},
			config_finish() {
				this.member_assessed[this.int_index].Note = "已完成";
				this.bool_Btn_redLine = true; //将红线btn设成不可点击
				this.otherBtnDisabel(true); //将其他btn设成不可点击
				this.saveToList();
				this.saveAll();
				this.setFlagTofalse();
			},
			setFlagTofalse() {
				for(var i = 0; i < this.flag.length; i++) {
					this.flag[i] = false;
				}
			},
			chooseAnswer(number) {
				var index = this.nowquest.DisplayOder;
				this.items_ques[index - 1].number = number;
				//				this.items_ques[index - 1].num = "*" + num;
				this.bool_member = false; //将用户列表设置成不可点击
				this.turn(1); //下一道题

				if(index == 20) {
					//					this.judgeFinishQues();
					if(this.finish_red) {
						console.log(
							"--------judgeAllIsFinishedFromQues-------" +
							this.judgeAllIsFinished()
						);
						this.video(this.messageD);
						this.showPopTwo(this.messageD); //已完成本党员的评价，是否保存？
					} else {
						this.video(this.messageA);
						this.showPopTwo(this.messageA); //请进行红线问题作答！
					}
				}
			},

			listUpdate(list) {
				this.questionList = list;
			}
		},

		created: function() {
			//			this.nowquest = this.questionList[0];
			this.$ajax({
					method: "get",
					url: "get_backBround?PictureTypeID=02&AssessTypeID=02"
				})
				.then(res => {
					//info

					res = res.data
					console.log(res.PictureTypeName)
					this.imgUrl = res.PictureTypeName
					//  this.imgUrl="../../static/assets/bg_1.jpg"

				})
				.catch(function(err) {
					console.log(err)
				});

			this.$ajax({
					method: "get",
					url: "get_questionAndAnswer"
				})
				.then(res => {
					//info
					res = res.data;
					if(res.status.code == 100) {
						//						this.questionList = res.info_question;
						this.listUpdate(res.info_question);
						this.redLineList = res.info_redLine;
						//						this.nowquest = this.questionList[0];
						this.member_assessed = res.info_member_assessed;
						//						this.nowChoosed = this.member_assessed[this.int_index];
						this.member_assessing = res.info_member_assessing;
						
                        this.messageQ = res.info_C_determine;//请您依据党员实情，按照画面评议内容，逐一对您所在支部的其他党员予以赋分，“党员互评”开始，请选择你要评议的党员",
                        this.messageR = res.info_D_member;//请您在赋分完成后，点击“提交”按键",
                        this.messageS = res.info_D_question_assessing;//请完成没有作答的问题！"
						this.messageA = res.info_D_question_assessed; //'请进行红线问题作答！'
						this.messageB = res.info_D_redLine_assessing; //"请完成没有作答的红线问题！",
						this.messageT = res.info_D_redLine_assessed;//已完成评价，请点击“完成”按键完成评价过程。",
						this.messageC = res.info_D_redLine_determine; //请选择下一位您要评价的党员
						this.messageF = res.info_D_all_assessed; //所有评价已完成，请点击“提交”按键，提交评价数据。
						//						this.messageE = res.
						//						this.messageF = res.
						//						this.messageG = res.
						//						this.messageH = res.
						this.video(this.messageQ);
						
						this.redBtnDisabel(true);
						this.otherBtnDisabel(true);
//						this.showPopOne(this.messageG);

						console.log("-------getInf_assessedAndAssessing--------" + res);
					} else {
						alert("数据操作失败，请重新评价！");
					}

					//      if (res.isHavingWrited != 0) {
					//        this.updateAnswer(res.info_answer);
					//      }
				})
				.catch(function(err) {
					console.log("-------err-------" + err);
				});
		},
		data() {
			return {
				audioUrl: "../../static/assets/zp32.mp3",
				imgUrl: "../../static/assets/bg_2.jpg",
				flag: [
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
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

				bool_member: true, //将用户列表设置成不可点击
				bool_question: true, //
				//				json_member:{},
				json_members: [], //存储一个被评价的党员的结果
				bool_result: true, //防止一个党员的信息多次存入结果集
				int_index: 0, //点击的党员index

				bool_diaTwo: false, //是否弹出提示框（两个选项）
				bool_diaOne: false, //是否弹出提示框（一个选项）

				messageOne: "",
				messageTwo: "",
				bool_Btn_redLine: false, //红线按钮颜色状态
				bool_otherBtn: false, //其他按键的颜色状态
				dia_redLine: false, //是否弹出红线对话框
				dialogFormVisible: false,
				finish_ques: false, //是否完成普通问题
				finish_red: false, //是否完成红线问题

				dialogVisible: false,

				messageA: "请进行红线问题作答！",
				messageB: "请完成没有作答的红线问题！",
				messageC: "请选择下一位您要评价的党员",
				messageD: "已完成本党员的评价，是否保存？",
				messageE: "请完成没有作答的问题！",
				messageF: "所有评价已完成，请点击“提交”按键，提交评价数据。",
				messageG: "请选择您要评价的党员",
				messageH: "是否确认提交？",
				messageI: "是否确认退出？",
				messageJ: "当前数据未提交到数据库，是否提交？",
				messageK: "此用户已完成评价，不可点击！",
				messageL: "请先完成此次评价！",
				messaegP: "提交成功,即将跳转至首页面！",
				messageQ:"请您依据党员实情，按照画面评议内容，逐一对您所在支部的其他党员予以赋分，“党员互评”开始，请选择你要评议的党员",
				messageR:"请您在赋分完成后，点击“提交”按键",
//				messageS:"请完成没有作答的问题！",
				messageT:"已完成评价，请点击“完成”按键完成评价过程。",
				messageU:"未完成80%的评价，请您继续评价！",
				messageV:"请先给本题评分！",
				
				json_red: {
					IsFinished: 1,
					A: "无",
					B: "无",
					C: "无",
					D: "无",
					E: "无",
					F: "无",
					G: "无",
					H: "无",
					I: "无",
					J: "无"
				},
				form: {
					name: "",
					region: "",
					date1: "",
					date2: "",
					delivery: false,
					type: [],
					resource: "",
					desc: ""
				},
				formLabelWidth: "120px",

				msg: "test",
				member_assessing: {
					Name: "未选择",
					PartyBranchName: "未选择",
					PartyMemberID: "-1"
				},
				nowChoosed: {
					Birthday: "未选择",
					Name: "未选择",
					Sex: "未选择",
					Note: "未选择",
					PartyMemberID: "-1"
				},
				items_ques: [{
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
				items_red: [{
						num: null,
						RedLineID: "A",
						number: null
					},
					{
						num: null,
						number: null,
						RedLineID: "B"
					},
					{
						num: null,
						number: null,
						RedLineID: "C"
					},
					{
						num: null,
						number: null,
						RedLineID: "D"
					},
					{
						num: null,
						number: null,
						RedLineID: "E"
					},
					{
						num: null,
						number: null,
						RedLineID: "F"
					},
					{
						num: null,
						number: null,
						RedLineID: "G"
					},
					{
						num: null,
						number: null,
						RedLineID: "H"
					},
					{
						num: null,
						number: null,
						RedLineID: "I"
					},
					{
						num: null,
						number: null,
						RedLineID: "J"
					}
				],
				member_assessed: [{
					PartyMemberID: "-1",
					Name: "未选择",
					Sex: "未选择",
					Birthday: "未选择",
					PartyMemberLableName: "未选择",
					PartyPosition: "未选择"
				}],
				member_assessed_2: [{
					PartyMemberID: "-1",
					Name: "未选择",
					Sex: "未选择",
					Birthday: "未选择",
					PartyMemberLableName: "未选择",
					PartyPosition: "未选择"
				}],
				questionList: [{
						ChoiceCount: 5,
						DisplayOder: 1,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionExPlain: null,
						QuestionID: "1"
					},
					{
						ChoiceCount: 5,
						DisplayOder: 2,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "2",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 3,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "3",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 4,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "4",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 5,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "5",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 6,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "6",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 7,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "7",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 8,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "8",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 9,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "9",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 10,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "10",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 11,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "11",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 12,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "12",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 13,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "13",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 14,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "14",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 15,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "15",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 16,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "16",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 17,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "17",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 18,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "18",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 19,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "19",
						QuestionExPlain: null
					},
					{
						ChoiceCount: 5,
						DisplayOder: 20,
						EvaluationAngle: "未选择",
						IsUse: true,
						QuestionContent: "未选择",
						QuestionID: "20",
						QuestionExPlain: null
					}
				],

				redLineList: [{
						RedLineContent: "未选择",
						RedLineID: "A"
					},
					{
						RedLineContent: "未选择",
						RedLineID: "B"
					},
					{
						RedLineContent: "未选择",
						RedLineID: "C"
					},
					{
						RedLineContent: "未选择",
						RedLineID: "D"
					},
					{
						RedLineContent: "未选择",
						RedLineID: "E"
					},
					{
						RedLineContent: "未选择",
						RedLineID: "F"
					},
					{
						RedLineContent: "未选择",
						RedLineID: "G"
					},
					{
						RedLineContent: "未选择",
						RedLineID: "H"
					},
					{
						RedLineContent: "未选择",
						RedLineID: "I"
					},
					{
						RedLineContent: "未选择",
						RedLineID: "J"
					}
				],

				nowquest: {
					ChoiceCount: 5,
					DisplayOder: 1,
					EvaluationAngle: "",
					QuestionContent: "",
					QuestionExPlain: null,
					QuestionID: "1"
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
		/*margin-top: -30px;*/
		overflow: hidden;
		/*position: relative;*/
	}
	
	.showDia_redLine {
		/*position: absolute;
		left: 350px;
		top: 50px;
		z-index: 100;*/
		position: fixed;
		top: 0;
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
	
	.resList_ques li {
		width: 5%;
		height: 0.8rem;
		display: inline-block;
		vertical-align: top;
	}
	
	.resList_red li {
		width: 7%;
		height: 60px;
		float: left;
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
		width: 95%;
		height: 66%;
		margin: auto;
		/*margin-bottom: 1%;*/
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
		font-size: 0.40rem;
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
	
	.contentBox_2>div button {
		width: 7%;
		height: 5%;
	}
	
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