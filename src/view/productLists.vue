<template>
	<div>
		<nav-header @transferModel="getModel"></nav-header>
		<div id="bread">
	    	<div class="banner">
	    		<router-link to="/">Home</router-link>&nbsp;/
	    		<span>Goods</span>
	    	</div>
	    	<div class="sort">
	    		<div class="filter">Filter By</div>
	    		<div class="sortText">Sort by:<span class="default" 
	    			@click="defaultSort">Default</span>
	    			<span class="up" @click="sortUp">Price
	    				<span v-bind:class="{'isUp':sortFlag}"></span>
	    			</span>
	    		</div>
	    	</div>
	    	<div class="lists clearfix">
	    		<div class="price">
	    			<ul>
	    				<li >
	    					<span class="title">PRICE:</span>
	    				</li>
	    				<li>
	    					<span v-bind:class="{'line':priceFlag=='all'}"></span>
	    					<span class="text" v-bind:class="{'priceChecked':priceFlag=='all'}" 
	    					@click="choosePrice()">All</span>
	    				</li>
	    				<li v-for="(price,index) in priceArea">
	    					<span v-bind:class="{'line':priceFlag==index}"></span>
	    					<span class="text" v-bind:class="{'priceChecked':priceFlag==index}"
	    					@click="choosePrice(price,index)" 
	    					>{{price.startPrice}}-{{price.endPrice}}</span>
	    				</li>
	    			</ul>
	    		</div>
	    		<div class="product">
	    			<ul>
	    				<li v-for="good in goodsList">
	    					<img v-lazy="'/static/img/'+good.image">
	    					<p class="name">{{good.productName}}</p>
	    					<p class="money">{{good.productPrice |priceFilter}}</p>
	    					<button @click="addCart(good.productId)">加入购物车</button>
	    				</li>
	    			</ul>
	    			<div class="loadMore" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
  					<img src="/static/img/loading-svg/loading-spinning-bubbles.svg" v-show="loading">
					</div>
	    		</div>
	    	</div>
	    </div>
	    <nav-footer></nav-footer>
	    <div v-bind:class="{'delay':addcartFlag}"></div>
		<div class="confirmBox" v-bind:class="{'show':addcartFlag}">
			<div class="cancel" @click="returnList"></div>
			<p>加入购物车成功！</p>
			<div class="bt">
				<button class="yes" @click="returnList">继续购物</button>
				<button class="no" @click="showCart">查看购物车</button>
			</div>
		</div>
		<model :modelFlag="modelFlag" @transferModel="getModel">
			<p slot="textSlot">您还未登录，请先登录</p>
			<button slot="btnSlot" class="yes" @click="close">关闭</button>
		</model>
    </div>
</template>

<script>
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter' 
import Model from '@/components/Model' 
import './../assets/css/reset.css'
import '@/assets/css/productList.css'
import '@/assets/css/off.css'
import '@/assets/css/popup.css'
import axios from 'axios'
	export default{
		data(){
			return{
				goodsList:[],  //所有商品列表
				newList:[],  //存放筛选后的商品
				//flag:true, //标志上升下降图标
				priceFrom:0,  //价格区间
				priceTo:5000,
				priceFlag:'all',  //判断选中哪个价格区间
				priceArea:[   //价格区间列表
					{
						startPrice:'0',
						endPrice:'500.00'
					},
					{
						startPrice:'500.00',
						endPrice:'1000.00'
					},
					{
						startPrice:'1000.00',
						endPrice:'5000.00'
					}
				],
				page:1, //当前页面
				pageSize:8,  //每页显示几条数据
				sortFlag:true ,//升序：true;降序：false
				busy:true, //滚动条分页，false为分页 
				loading:false,  //加载中图标 
				addcartFlag:false,  //加入购物车
				userId:'' , //用户ID
				modelFlag:false  //模态框显示标志
			}
		},
		components:{
			NavHeader,
			NavFooter,
			Model
		},
		mounted(){
			this.getGoodsList();
		},
		computed:{
			/*chooseFilter(){  //筛选价格
				var self=this;
				this.newList=[];  //每次筛选数组置空
				if(this.priceFrom!=null&&this.priceTo!=null){
					this.goodsList.forEach(function(value,index){
						if(value.productPrice>=parseInt(self.priceFrom)&&value.productPrice<=parseInt(self.priceTo))
						{
							self.newList.push(value);
						}
					})
				}else{
					self.newList=self.goodsList;
				}			
				return this.newList;
			}*/
		},
		filters:{
			priceFilter(value){
				return '¥'+value;
			}
		},
		methods:{
			getGoodsList(flag){
				let param={
					page:this.page,
					pageSize:this.pageSize,
					sort:this.sortFlag? 1: -1, //true:升序 false:降序  
					priceLevel:this.priceFlag,  //传递选中的价格区间
					priceFrom:this.priceFrom, //传递价格起点
					priceTo:this.priceTo  //价格终点
				}
				this.loading=true;
				axios.get("/goods",{
					params:param
				}).then((res)=>{//获取数据库数据
					this.loading=false;
					if(res.data.status=="0")
					{
						if(flag){
							this.goodsList=this.goodsList.concat(res.data.result.list);
							if(res.data.result.count<8){
								this.busy=true;  //禁用,不再调用loadMore()函数
							}else{
								this.busy=false;  //打开滚动分页触发函数
							}
						}else{
							this.goodsList=res.data.result.list;
							this.busy=false;  
						}
					}else{
						this.goodsList=[];
					}					
				})
			},
			by(name){
				var self=this;
				return function(o,p){
					var a,b;
					if(typeof o==="object" && typeof p==="object" && o && p )
					{
						a=o[name];
						b=p[name];
						if(a===b)
						{
							return 0;
						}
						if(!self.sortFlag){
							if(typeof a === typeof b)
							{
								return a<b ? -1:1;
							}
							return typeof a <typeof b ? -1: 1;
						}else{
							if(typeof a === typeof b)
							{
								return a<b ? 1:-1;
							}
							return typeof a <typeof b ? 1: -1;
						}
						
					}else{
						throw("error");
					}

				}
			},
			sortUp(){  //价格排序
				//this.goodsList.sort(this.by("productPrice"));
				//this.flag=!this.flag;  //标志上升下降图标
				this.page=1;
				this.sortFlag=!this.sortFlag;
				this.getGoodsList();
			},
			choosePrice(price,index){  //通过数据库查询筛选
				this.page=1;
				if(index!=null)
				{
					this.priceFlag=index;  //将选中的索引赋值给价格标志
				}else{
					this.priceFlag='all';  //全选
				}
				if(price!=null)  //没有传递price时，代表全选
				{
					this.priceFrom=price.startPrice;
					this.priceTo=price.endPrice;
				}else{
					this.priceFrom=0;
					this.priceTo=5000;
				}
				this.getGoodsList();
			},
			defaultSort(){ //获取默认排序
				this.getGoodList();  
			},
			loadMore(){  //滚动条分页
				this.busy=true;
				//var self=this;
				setTimeout(()=>{
					this.page+=1;
					this.getGoodsList(true);
				},1000);
			},
			addCart(productId){//加入购物车，添加到数据库
				let param={
					userId:this.$store.state.user.userId, //状态管理的全局数据
					productId:productId
				};
				axios.get('/goods/carts',{params:param}).then((res)=>{
					if(res.data.status=="0"){
						this.addcartFlag=true;
						this.$store.commit("changeCartNum",1);  //加入购物车
					}else{
						this.modelFlag=true;  //提示未登录
					}
				})
			},
			returnList(){  //继续购物
				this.addcartFlag=false;
			},
			showCart(){  //查看购物车
				this.$router.push('/cartList');  //编程式路由
			},
			getModel(msg){
				console.log("接受");
				this.modelFlag=msg;
			},
			close(){
				this.modelFlag=false;  //关闭模态框
			}
		}
	}
</script>
