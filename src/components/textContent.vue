<template>
	<div class="myBody">
		<audio id="audioPlay"> 
			<source v-bind:src='audioUrl' type="audio/mpeg" alt="">
		</audio>
		<!--<div><audio src="../assets/zp24.mp3" id="music">您的浏览器不支持MP3格式！</audio></div>-->
		<div class="bg"><img v-bind:src='imgUrl' alt=""></div>
		<div class="myHeader">党性自评端</div>
		<div class="content">
			<div class="text">
				<h3>
					{{titleA}}
				</h3>
				<br>
				<h3>
					{{titleB}}
				</h3>
				<br>
				<p>
					{{contentA}}
				</p>
			</div>
			<div class="bottom-button">
					<button @click="next('choiceDepartment')" class="button-1">跳过</button>
			</div>
		</div>
		<!--<audio id="music"  controls>
                   <source src="../assets/zp24.mp3" type="audio/mpeg"/>
                   <source v-bind:src='imgUrl' type="audio/mpeg">
                   Your browser does not support the audio element.
        </audio>-->
        
	</div>
</template>

<script>
	 
     
export default {
  name: "textcontent",
  data() {
    return {
      titleA:'',
      titleB:'',
      contentA:'',
      
      msg: "test",
      messageO: "播音成功",
//    bool:false,
//    imgUrl:"../../static/assets/zp24.mp3",
      imgUrl: "../../static/assets/bg_2.jpg",
      audioUrl: "../../static/assets/zp24.mp3",
//    audioUrl: "zp24.mp3", 
      tableData: {
        status: {
          msg: "操作成功",
          code: 100,
          status: 200
        }
        //					info_AssesingTypeName: "....."
      },
      
     
    };
  },
  
  methods: {
    next(url_next) {
     this.closeAudio();
      this.$router.push({
        name: url_next
      });
    },
    listUpdate(list) {
      this.tableData = list.info_AssesingTypeName;
      this.titleA=this.tableData.substring(0,10);
      var temptA = this.tableData.substring(10);
      
      this.titleB=temptA.substring(0,10);
      this.contentA =temptA.substring(10);
      
      
      
    },
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
          if ((res.status.code = 100)) {
          	this.openAudio(res.addressMP3);
          	console.log('addressMP3:'+this.audioUrl);
//        	this.bool = true;
          	
            //imgUrl							this.showPopOne('提交成功');
            //							alert(this.messageO); //播音成功
          } else {
            alert(res.status.msg);
          }
        })
        .catch(function(err) {
          console.log("-------err2-------" + err);
        });
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
  	
    //  var id = this.$route.params.PartyBranchID;//接受参数PartyBranchID  https://www.cnblogs.com/lulianlian/p/7682790.html
    //          var
    this.$ajax({
      method: "get",
      url: "get_generalDescription"
    })
      .then(res => {
        //info

        res = res.data;

        if (res.status.code == 100) {
          //						var list = res;
          //						this.tableData = res;
          this.listUpdate(res);
          this.video(res.info_AssesingTypeName);
//        console.log('addressMP311:'+this.audioUrl);
//        this.next('choiceDepartment')
          
        } else if (res.status.code == 111) {
          alert(res.status.msg);
        }
      })
      .catch(function(err) {
        console.log(err);
      });

    //			this.video(this.tableData.info_AssesingTypeName);
  }
};
</script>

<style scoped>
/*.button-1 {
		width: 20%;
		margin: auto;
	}*/

.text {
  position: relative;
  width: 60%;
  margin: 10px auto;
  text-align: center;
  top: 8%;
  color: #000;
  font-size: 30px;
}

.text p {
  margin-bottom: 30px;
  text-align:left;
		text-indent:2em;
}

/*.bottom-button>div {
		width: 80%;
		display: inline-block;
		box-sizing: border-box;
		text-align: center;
	}*/
</style>