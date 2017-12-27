<template>
	<div>
		<div v-bind:class="{'delay':modelFlag}"></div>
		<div class="confirmBox" v-bind:class="{'show':modelFlag}">
			<div class="cancel" @click="cancel"></div>
			<slot name="textSlot"></slot>
			<div class="bt">
				<slot name="btnSlot"></slot>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				cancelFlag:false  //关闭标志
			}
		},
		props:["modelFlag"],
		methods:{
			cancel(){//取消
				this.$emit("transferModel",this.cancelFlag)
			}
		}
	}
</script>