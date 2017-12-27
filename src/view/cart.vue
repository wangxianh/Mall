<template>
<div>
	<nav-header></nav-header>
	<div class="banner">
		<router-link to="/">Home</router-link>&nbsp;/
    	<span>CartList</span>
	</div>
	<div id="cart">
    	<div class="content">
    		<fieldset>
    			<legend class="legend">购物车</legend>
    			<ul class="thead">
	    			<li class="info">商品信息</li>
	    			<li>商品金额</li>
	    			<li>商品数量</li>
	    			<li>总金额</li>
	    			<li>编辑</li>
	    		</ul>
	    		<ul class="commodity" v-for="(item,index) in items">
	    			<li class="cominfo">
	    				<span class="checkcircle" v-bind:class="{'checked':item.isChecked}" @click="selected(item)"></span>
	    				<img class="picture" v-bind:src="'/static/img/'+item.image" />
	    				<span class="details">
	    					<p class="name">{{item.productName}}</p>
	    					<p>赠送：<span class="gift" v-for="part in item.parts">{{part.partsName}}</span></p>
	    				</span>
	    			</li>
	    			<li>{{item.productPrice | priceType |symbolMoney}}</li>
	    			<li>
	    				<div class="number">
	    					<span v-on:click="add(index,-1)">-</span>
	    					<span class="num">{{item.productQuantity}}</span>
	    					<span v-on:click="add(index,1)">+</span>
	    				</div>
	    				<p class="stock">有货</p>
	    			</li>
	    			<li>{{item.productPrice*item.productQuantity| priceType|symbolMoney}}</li>
	    			<li class="pic"><span v-on:click="deleteOne(item,index)"></span></li>
	    		</ul>
	    		<div v-bind:class="{'delay':delFlag}"></div>
	    		<div class="confirmBox" v-bind:class="{'show':delFlag}">
	    			<div class="cancel" @click="confirmNo"></div>
	    			<p>确认删除此订单信息吗？</p>
	    			<div class="bt">
	    				<button class="yes" @click="confirmOk">Yes</button>
	    				<button class="no" @click="confirmNo">No</button>
	    			</div>
	    		</div>
	    	</fieldset>
	    	<div class="footer">
    			<div class="footleft">
    				<span class="checkcircle" v-bind:class="{'checkItemAll':checkFlag}" @click="selectAll(true)"></span>
    				<span class="checkall">全选</span>
    				<span class="cancelcheck" @click="selectAll(false)">取消全选</span>
    			</div>
    			<div class="footright">
    				<span>Item total:<span class="totalm">{{totalMoney | priceType|symbolMoney}}</span></span>
    				<button @click="addOrder">下一步</button>
    			</div>
	    	</div>
    	</div>
    </div>
    <nav-footer></nav-footer>
</div>
</template>

<script>
	import '@/view/css/cart.css'
	import NavHeader from '@/components/NavHeader'
	import NavFooter from '@/components/NavFooter' 
	import axios from 'axios'
	import Vue from 'vue'
	export default{
		data(){
			return{
				totalMoney:0,
				items:[],
				checkFlag:false,  //标志是否全选
				delFlag:false,  //标志是否点击了删除
				curIndex:0,  //保存要删除的索引号
				curId:0,  //保存要删除的商品id
				//userId:''  //用户id  
				curNumber:0 , //要删除的商品数量，用于更新购物车
				orderId:""
			}
		},
		components:{
			NavHeader,
			NavFooter
		},
		mounted:function(){
			var self=this;
			this.$nextTick(function(){
				self.getItems();
				//self.totalItemPrice()
			})
		},
		filters:{
			priceType:function(value){
				return value.toFixed(2);
			},
			symbolMoney:function(value){
				return '¥'+value;
			}
		},
		methods:{
			getItems(){//查看购物车
				let param={
					userId:this.$store.state.user.userId //状态管理的全局数据
				};
				axios.get('/goods/cartList',{params:param}).then((res)=>{
					this.items=res.data.result.list;  //获取json数据
				});
			},
			add:function(index,type){
				let cartProduct=this.items[index];
				if(cartProduct.productQuantity<2&&type<0){
					cartProduct.productQuantity=1;
				}else{
					axios.post('/goods/changeNum',{productId:cartProduct.productId,type:type}).then((res)=>{
						cartProduct.productQuantity+=type;
						this.$store.commit("changeCartNum",type);
					})	
				}
				this.totalItemPrice();
			},
			totalItemPrice:function(){
				var self=this;
				this.totalMoney=0;
				this.items.forEach(function(value,index){
					if(value.isChecked){
						self.totalMoney+=value.productQuantity*value.productPrice;
					}
					
				})
			},
			selected:function(item){
				if(typeof item.isChecked=='undefined'){
					Vue.set(item,"isChecked",true);  //向Vue中设置一个变量			
				}else{
					item.isChecked=!item.isChecked; //切换选择、取消
				}
				this.totalItemPrice();  //计算总金额
			},
			selectAll:function(flag){
				var self=this;
				if(flag===true){ //根据参数确定时全选还是取消全选
					this.checkFlag=true;
					this.items.forEach(function(item,index){
						if(typeof item.isChecked=='undefined'){
							Vue.set(item,"isChecked",self.checkFlag);  //向Vue中设置一个变量
						}else{
							item.isChecked=self.checkFlag; //切换选择、取消
						}
					})
				}else{
					this.checkFlag=false;
					this.items.forEach(function(item,index){
						if(typeof item.isChecked=='undefined'){
							Vue.set(item,"isChecked",self.checkFlag);  //向Vue中设置一个变量
						}else{
							item.isChecked=self.checkFlag; //切换选择、取消
						}	
					})
				}
				this.totalItemPrice();	
			},
			deleteOne:function(item,index){
				this.delFlag=true;
				this.curIndex=index;
				this.curId=item.productId;
				this.curNumber=item.productQuantity;
			},
			confirmOk:function(){  //确认删除
				var self=this;
				this.delFlag=false;
				var delNumber=-this.curNumber;
				//this.items.splice(this.curIndex,1);
				axios.post("/goods/delProduct",{productId:this.curId}).then((res)=>{
					if(res.data.status=="0"){
						self.getItems();
						this.$store.commit("changeCartNum",delNumber);
						//this.items.splice(this.curIndex,1);
					}
					
				})
			},
			confirmNo:function(){
				this.delFlag=false;
			},
			addOrder(){  //添加到订单
				let userId=this.$store.state.user.userId;
				let chooseList=[];
				let orderStatus="1";  //订单状态，未确认
				this.orderId=Math.random().toString().substr(3);//生成随机数
				this.items.forEach((value,index)=>{
					if(value.isChecked){
						chooseList.push(value)  //选中的商品加入订单列表
					}
				})
				let param={
					"userId":this.$store.state.user.userId,
					"orderId":this.orderId,
					"orderProduct":chooseList,
					"orderMoney":this.totalMoney,
					"orderStatus":orderStatus
				}
				axios.post('/user/addOrder',param).then((response)=>{
					let res=response.data;
					if(res.status=="0"){
						//传递订单Id
						this.$router.push("/address/"+this.orderId);						
					}
				})
			}
			/*getUser(msg){//获取导航头组件传递的用户信息
				this.userId=msg;
			}*/	
		}
	}
</script>
