<template>
		<div class="myBody">
		<div class="dialog_mask"></div>
		<div class="dialog_container">
			<div class="dialog_content">
				<div class="dialog_content_top">{{messageTwo}}</div>
				<div class="dialog_btn">
					<a href="javascript:;" class="btn" @click="determine">确定</a>
					<a href="javascript:;" class="btn" @click="cancel">取消</a>
				</div>
			</div>
		</div>
		</div>
</template>

<script>
export default {
  props: ["messageTwo"],

  methods: {
    determine() {
      console.log("--------messageTwo---------" + this.messageTwo);

      // childByValue是在父组件on监听的方法
      // 第二个参数this.childValue是需要传的值
      if (this.messageTwo == this.messageA) {
        this.$emit("showRed", false);
      }
      if (this.messageTwo == this.messageI) {
        this.$emit("quitAll", false);
      }
      if (this.messageTwo == this.messageD) {
        this.$emit("saveOne", false);
      }
      if (this.messageTwo == this.messageH) {
        this.$emit("updateAll", false);
      }
      if (this.messageTwo == this.messageJ) {
        this.$emit("updateAll", false);
      }
    },
    cancel() {
      if (this.messageTwo == this.messageA) {
        this.$emit("noShoWRed", false);
      }
      if (this.messageTwo == this.messageI) {
        this.$emit("noQuitAll", false);
      }
      if (this.messageTwo == this.messageD) {
        this.$emit("noSaveOne", false);
      }
      if (this.messageTwo == this.messageH) {
        this.$emit("noUpdateAll", false);
      }
      if (this.messageTwo == this.messageJ) {
        this.$emit("noUpdateAndQuit", false);
      }
    }
  },
  created: function() {
    //			this.nowquest = this.questionList[0];
    this.$ajax({
      method: "get",
      url: "get_questionAndAnswer"
    })
      .then(res => {
        //info
        res = res.data;
        if (res.status.code == 100) {
          this.messageA = res.info_D_question_assessed; //请进行红线问题作答！
          this.messageB = res.info_D_redLine_assessed; //'已完成评价，请点击“完成”按键完成评价过程。'

          //						this.messageB = res.
          //						this.messageC = res.
          //						this.messageD = res.
          //						this.messageE = res.
          //						this.messageF = res.
          //						this.messageG = res.
          //						this.messageH = res.
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
      messageA: "请进行红线问题作答！",
      messageB: "已完成评价，请点击“完成”按键完成评价过程。",
      messageI: "是否确认退出？",
      messageJ: "当前数据未提交到数据库，是否提交？",
      messageD: "已完成本党员的评价，是否保存？",
      messageH: "是否确认提交？",
      bool_diaOne: false,
      messageOne: ""
    };
  }
};
</script>

<style>


.dialog_container {
		background: #fff;
		width: 500px;
		height: 170px;
		
		 top:50%;
         left:50%;
         transform:translateX(-50%) translateY(-50%);
		position: fixed;
		
		border-radius: 10px;
		margin: 0 auto;
		z-index: 999;
		background: #fef189;
		box-shadow: 0 0 0.3rem #888;

	}


.dialog_content {
  text-align: center;
  padding-top: 10%;
  font-size: 0.32rem;
}

.dialog_btn {
  margin-top: 20px;
  line-height: 30px;
}

.dialog_btn a {
  background: #f9390b;
  padding: 2px 30px;
  border-radius: 5px;
  color: #fff;
  text-decoration: none;
  width: 50px;
  display: inline-block;
}

.dialog_btn a:nth-child(2) {
  margin-left: 20px;
}

.dia_ques {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}
</style>