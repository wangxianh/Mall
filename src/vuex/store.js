import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//状态管理
const store=new Vuex.Store({
	//定义状态
	state:{
		user:'',   //用户对象，包括name和id,供不同页面使用
		//标志是否点击点击了导航条上的login，true:点击；false:未点击
		logFlag:"",  
		navFlag:false,   //标志是否点击登录，
						//true:点击则导航条显示name和logout,
		        		//false:导航条显示login
		cartNumber:0  //全局管理购物车数量
	},
	mutations:{
		transferUser(state,obj){
			state.user=obj;
		},
		transferLogFlag(state,msg){
			state.logFlag=msg;
		},
		transferNavFlag(state,msg){
			state.navFlag=msg;
		},
		updateCartNum(state,num){
			state.cartNumber=num;
		},
		changeCartNum(state,num){
			state.cartNumber+=num;
		}
	}
});
export default store;