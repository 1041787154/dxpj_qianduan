<template>
		<div class="myBody">
		<div class="dialog_mask"></div>
		<div class="dialog_container">
			<div class="dialog_content">
				<div class="dialog_content_top">{{messageOne}}</div>
				<div class="dialog_btn">
					<a href="javascript:;" class="btn" @click="determine">确定</a>					
				</div>
			</div>
		</div>
		</div>
</template>

<script>
	//	import redLineDia from './redLineDia'
	export default {

		props: ['messageOne'],
		methods: {
			determine(){
				this.$emit('determine',false);
				if(this.messageOne==this.messaegP){
					this.$emit('quitToMain',false);
				}
				if(this.messageOne==this.messageB){
					this.$emit('quitToMain',false);
				}
			}
		},
				
		
		data() {
			return {
				messaegP: "提交成功,即将跳转至首页面！",
				messageB: "注册成功，即将跳转到党性群评端！"
			};
		}

	};
</script>

<style>
	
	
	.dialog_container {
		background: #fff;
		width: 450px;
		height: 120px;	
			
        top:50%;
        left:50%;
        transform:translateX(-50%) translateY(-50%);
		position: fixed;
		z-index: 999;
		border-radius: 10px;
		margin: 0 auto;
		background: #fef189;

	}
	
	.dialog_content {
		text-align: center;
		padding-top: 30px;
		font-size: 0.3rem;
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
</style>