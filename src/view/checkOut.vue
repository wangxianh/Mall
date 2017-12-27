<template>
	<div>
	<nav-header></nav-header>
	<div class="banner">
		<router-link to="/">Home</router-link>&nbsp;/
    	<span>Order Success</span>
	</div>
	<div class="checkout">
		<img src="/static/img/ok-2.png"/>
		<p>恭喜！</p>
		<p>您的订单已完成！</p>
		<div class="orderInfo">
			<span>订单ID:&nbsp;&nbsp;{{orderId}}</span>
			<span>订单总额:&nbsp;&nbsp;{{orderTotal|priceType|symbolMoney}}</span>
		</div>
		<div class="footerbtns clearfix">
			<router-link to="/cartList"><button class="prev">返回购物车列表</button></router-link>
			<router-link to="/"><button class="next">返回商品列表</button></router-link>
	    </div>
	</div>
	<nav-footer></nav-footer>
	</div>
</template>
<script>
	import NavHeader from "@/components/NavHeader"
    import NavFooter from "@/components/NavFooter"
    import axios from "axios"
    export default{
		data(){
			return{
				orderId:this.$route.params.orderId,
				orderTotal:0  //订单总金额
			}
		},
		filters:{
			priceType:function(value){
				return value.toFixed(2);
			},
			symbolMoney:function(value){
				return '¥'+value;
			}
		},
		components:{
			NavHeader,
			NavFooter
		},
		mounted:function(){
			this.$nextTick(()=>{
				this.getMoney();		
			});
		},
		methods:{
			getMoney(){
				let param={
					"userId":this.$store.state.user.userId,
					"orderId":this.$route.params.orderId
				}
				axios.get("/user/getMoney",{params:param}).then((response)=>{
					let res=response.data;
					if(res.status=="0"){
						this.orderTotal=res.result;
					}
				})
			}
		}
	}
</script>