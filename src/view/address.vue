<template>
	<div>
		<nav-header></nav-header>
		<div class="banner">
			<router-link to="/">Home</router-link>&nbsp;/
    		<span>Address</span>
		</div>
		<div id="cartaddress" >
	<fieldset>
		<legend>配送地址</legend>
		<ul class="addresses">
			<li v-for="(address,index) in filterAddress" 
			v-bind:class="{'selected':index==selectFlag}" @click="selectAdd(address,index)">
				<div class="detailAddress">
					<div class="left">
						<p class="name">{{address.addressName}}</p>
						<p class="addr">{{address.addressInfo}}</p>
						<p class="telnumber">{{address.telNumber}}</p>
						<p class="default" v-bind:class="{'selectDef':index==selectFlag}" v-if="!address.setDefault" @click="setDef(address.addressId)">设为默认</p>
						<p class="default" v-bind:class="{'selectDef':index==selectFlag}" v-if="address.setDefault">默认地址</p>
					</div>
					<div class="right">
						<div class="edit" v-bind:class="{'selectEdit':index==selectFlag}"></div>
						<div class="del" v-bind:class="{'selectDel':index==selectFlag}"></div>
					</div>
				</div>
			</li>
			<li>
				<div class="add"></div>
			</li>
		</ul>
		<div class="more">more<span :class="{'load':loadFlag}" @click="loadMore"></span></div>
	</fieldset>
	<fieldset>
		<legend>配送方式</legend>
		<ul class="ways">
			<li :class="{'selectWay':wayFlag==1}" @click="wayFlag=1">
				<p>标准配送</p>
				<p>Free</p>
			</li>
			<li :class="{'selectWay':wayFlag==2}" @click="wayFlag=2">
				<p>高级配送</p>
				<p>180</p>
			</li>
		</ul>
	</fieldset>
	<div class="footerbtns clearfix addr">
		<button class="next" @click="nextStep">下一步</button>
	</div>
	</div>
		<nav-footer></nav-footer>
	</div>
</template>
<script>
	import '@/view/css/address.css'
	import NavHeader from '@/components/NavHeader'
	import NavFooter from '@/components/NavFooter' 
	import axios from 'axios'
	import Vue from 'vue'

	export default{
		data(){
			return{
				addressList:[],
				limitNum:2,  //显示地址数目
				selectFlag:0,  //标志选中哪个地址
				loadFlag:false,  //标志是否全部显示
				wayFlag:1,   //配送方式，默认标准配送
				defaultFlag:false,
				address:""  //选中的地址
			}
		},
		components:{
			NavHeader,
			NavFooter
		},
		mounted:function(){
			var self=this;
			this.$nextTick(function(){
				self.getAddress();
			})
		},
		computed:{
			filterAddress:function(){
				return this.addressList.slice(0,this.limitNum);
			}
		},
		methods:{
			getAddress:function(){
				axios.get("/goods/address").then((res)=>{
					this.addressList=res.data.result.list;
					this.address=this.addressList.slice(0,1)[0];//默认返回第一项,默认地址
				})
			},
			loadMore:function(){
				if(this.loadFlag)  //根据标志判断是展开还是收起
				{
					this.loadFlag=false;
					this.limitNum=2;  //只显示两条
				}else{
					this.loadFlag=true;
					this.limitNum=this.addressList.length; //全部显示
				}
			},
			setDef:function(id){
				var self=this;
				this.addressList.forEach(function(value,index){
					if(value.addressId==id){
						value.setDefault=true;
					}else{
						value.setDefault=false;
					}
					/*if(index===ind){
						value.setDefault=true
					}else{
						value.setDefault=false;
					}*/
				});
			},
			selectAdd(address,index){  //选中某个地址:地址对象；索引号
				this.selectFlag=index;
				this.address=address;
			},
			nextStep(){  //将地址信息添加到该订单中
				let param={
					"userId":this.$store.state.user.userId,
					"orderId":this.$route.params.orderId,
					"orderAddress":this.address
				}
				axios.post("/user/addAddress",param).then((res)=>{
					if(res.data.status=="0"){
						this.$router.push("/orderConfirm/"+param.orderId);
					}
				})
			}
		}
	}
</script>

