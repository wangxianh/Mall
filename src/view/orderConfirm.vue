<template>
	<div>
		<nav-header></nav-header>
		<div class="banner">
			<router-link to="/">Home</router-link>&nbsp;/
    		<span>OrderList</span>
		</div>
		<div id="cart">
    	<div class="content">
    		<fieldset>
    			<legend class="legend">订单确认</legend>
    			<ul class="thead">
	    			<li class="info">订单信息</li>
	    			<li>商品金额</li>
	    			<li>商品数量</li>
	    			<li>总金额</li>
	    		</ul>
	    		<ul class="commodity" v-for="(item,index) in orders">
	    			<li class="cominfo">
	    				<img class="picture" v-bind:src="'/static/img/'+item.image" />
	    				<span class="productName">
	    					{{item.productName}}
	    				</span>
	    			</li>
	    			<li>{{item.productPrice | priceType |symbolMoney}}</li>
	    			<li>
	    				<div class="numbers">
	    					<span>X</span>{{item.productQuantity}}
	    				</div>
	    				<p class="stock orderTotal">有货</p>
	    			</li>
	    			<li class="orderTotal">{{item.productPrice*item.productQuantity| priceType|symbolMoney}}</li>
	    		</ul>	    		
	    	</fieldset>
	    	<div class="InfoConfirm clearfix">
	    		<p>实付款：<span class="orderTotal">{{orderTotal| priceType|symbolMoney}}</span></p>
	    		<p>寄送至：<span>{{orderAddress.addressInfo}}</span></p>
	    		<p>收货人:<span>{{orderAddress.addressName}}</span></p>
	    	</div>
	    	<div class="footerbtns clearfix">
    			<router-link to="/address"><button class="prev">上一步</button></router-link>
				<button class="next" @click="submitOrder">提交订单</button>
	    	</div>
    	</div>
    </div>
		<nav-footer></nav-footer>
	</div>
</template>

<script>
import NavHeader from "@/components/NavHeader"
import NavFooter from "@/components/NavFooter"
import '@/view/css/cart.css'
import axios from "axios"
	export default{
		data(){
			return{
				orders:[],
				orderTotal:0,  //订单总金额
				orderAddress:""  //订单地址
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
			var self=this;
			this.$nextTick(function(){
				self.getOrders();		
			});
		},
		methods:{
			getOrders(){  //获取数据库中用户订单信息
				let param={
					userId:this.$store.state.user.userId, //状态管理的全局数据
					orderId:this.$route.params.orderId
				};
				axios.get("/user/orderList",{params:param}).then((response)=>{
					let res=response.data;
					if(res.status=="0"){
						this.orderTotal=res.result.totalMoney;
						this.orders=res.result.orderProduct;
						this.orderAddress=res.result.orderAddress;
						//this.getTotalMoney();
					}
				})
			},
			getTotalMoney(){
				var self=this;
				this.orderTotal=0;
				this.orders.forEach(function(value,index){
					self.orderTotal+=value.productPrice*value.productQuantity;
				})
			},
			submitOrder(){//提交订单
				let param={
					userId:this.$store.state.user.userId,
					orderId:this.$route.params.orderId
				}
				//更新订单状态，将订单状态置为0，已完成
				axios.post("/user/updateStatus",param).then((res)=>{
					if(res.data.status=="0"){
						this.$router.push("/checkout/"+param.orderId);
					}
				})
			}
		}
	}
</script>