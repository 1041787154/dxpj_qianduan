<template>
	<div class="myBody">
		<div class="bg"><img v-bind:src='imgUrl' alt=""></div>
		<div class="content">
			<div class="contentTitle">
				<p class="titleText">{{tableData.info_A_description}}</p>
				<p class="titleText_1">{{tableData.info_AssesingTypeName}}</p>
			</div>
			<div class="bottom-button">
				<div>
					<button @click="next" class="button-1">进入体检</button >
        </div>
        <div> 
        <button @click="exit" class="button-1">退出</button>
				</div>

			</div>

		</div>
    <div class="showDia_redLine" v-if="bool_diaTwo">
			<loginDia :messageTwo="messageTwo" @determine="closePopTwo" ></loginDia>
	</div> 
	</div>
</template>

<script>
	import loginDia from "./diaLogin";
export default {
	components: {
    //			redLineDia,
    //			quesDia,
    loginDia
  },
  name: "index",
  data() {
    return {
      //				msg: "test",

     
      bool_diaTwo:true,
       messageTwo:'',
      tableData: {
        status: {
          msg: "操作成功",
          code: 100,
          status: 200
        },
        info_AssesingTypeName: "党性互评端",
        info_A_description: "渭阳西路街道党员党性教育体检中心"
      },
      imgUrl:"../../static/assets/bg_1.jpg"
    };
  },
  methods: {
  	
  	 closePopTwo() {
      this.bool_diaTwo = false;
    },
  	
    exit: function() {
      if (confirm("确认退出?")) {
        window.close();
      }
    },
    next() {
      this.$ajax({
        method: "get",
        url: "judge_IsActivity"
      })
        .then(res => {
          //info

          res = res.data;

          if (res.code == 100) {
            //							alert(res.msg);
            this.$router.push({
              name: "choiceDepartment"
            });
          } else {
            alert(res.msg);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    listUpdate(list) {
      this.tableData = list
    }
  },
  created: function() {
    //  var id = this.$route.params.PartyBranchID;//接受参数PartyBranchID  https://www.cnblogs.com/lulianlian/p/7682790.html


///dxpj/hp/get_backBround?PictureTypeID=01&AssessTypeID=02
    this.$ajax({
      method: "get",
      url: "get_backBround?PictureTypeID=01&AssessTypeID=02"
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
      url: "get_A_Description"
    })
      .then(res => {
        //info

        res = res.data;

        if (res.status.code == 100) {
          var list = res;
        } else if (res.status.code == 111) {
          alert(res.status.msg);
        }

        this.listUpdate(list);
      })
      .catch(function(err) {
        console.log(err);
      });
      
       this.$ajax({
      method: "get",
      url: "judge_assess"
    })
      .then(res => {
        //info
        res = res.data;

        if (res.code == 100) {
          this.bool_diaTwo = false;
        } else if (res.code == 101) {
          this.bool_diaTwo = true;
        }

        this.listUpdate(list);
      })
      .catch(function(err) {
        console.log(err);
      });
      
  }
};
</script>





<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	
	.showDia_redLine {
  /*position: absolute;
          left: 350px;
          top: 50px;
          z-index: 100;*/
  width: 100%;
  height: 100%;
  z-index: 300;
  position: fixed;
  top:50%;
  left:50%;
  transform:translateX(-50%) translateY(-50%);
  background: rgba(0, 0, 0, 0.5) !important;
  /* 兼容ie几不知道，好像ie6 */
  /*background: #000;*/
  filter: Alpha(opacity=60);
}
.content{
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10;
  padding-top:9.2%;
  /* padding-top:1.3%;*/
} 	
	
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.bottom-button > div {
  width: 49%;
  display: inline-block;
  box-sizing: border-box;
  text-align: center;
}

.bottom-button .button-1 {
  max-width: 80%;
  position: relative;
}

.titleText {
  color: rgb(255, 230, 0);
  margin: 60px;
  font-size: 0.9rem;
  font-weight: bold;
}

.titleText_1 {
  color: rgb(255, 230, 0);
  margin: 1.6rem;
  font-size: 0.5rem;
}
</style>