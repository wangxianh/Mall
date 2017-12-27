<template>
	<div>
	<div id="header">
    	<span class="icon"><img src="/static/img/logo.png"/></span>
    	<span class="right">
    		<span>{{username}}</span>
    		<span class="login" v-if="this.$store.state.navFlag" @click="logout"><a href="javascript:;">Logout</a></span>
    		<span class="login" v-else="this.$store.state.navFlag" @click="login"><a href="javascript:;">Login</a></span>
    		
			<span class="cart" @click="toCartList"><img src="/static/img/cart1.png"/>
				<span class="cartNum" v-if="cartNum>0">{{cartNum}}</span>
			</span>
    	</span>  	
    </div>
    
    <nav-login >
    </nav-login>
    <nav-logout></nav-logout>
    </div>
</template>
<script>
import NavLogout from '@/components/NavLogout' 
import NavLogin from '@/components/NavLogin' 
import axios from "axios"
	export default{
		data(){
			return{
				//loginFlag:this.$store.state.navFlag,  //初始值是未登录
				//username:'',  //用来接收子组件传递的用户名
				//logoutFlag:!this.$store.state.logFlag  //登录标志
				//userId:''
				cancelFlag:true
			}
		},  
		computed:{
			username(){
				return this.$store.state.user.userName;
			},
			cartNum(){
				return this.$store.state.cartNumber;
			}
		},
        components:{
            NavLogin,
            NavLogout
        },
		methods:{
			login(){//将login传递给全局变量logFlag
				//this.loginFlag=!this.loginFlag;
				this.$store.commit('transferLogFlag',"login");		
			},
			logout(){  //将logout传递给全局变量logFlag
				this.$store.commit('transferLogFlag',"logout");
			},
			toCartList(){//跳转到购物车列表
				let user=this.$store.state.user;
				if(user){//已登录
					this.$router.push('/cartList');  //编程式路由
				}else{//用户未登录
					this.$emit("transferModel",this.cancelFlag)
				}
			}
			
			/*getFlag(msg){
				this.loginFlag=!msg;
			},*/
			/*getName(msg){  //获取子组件传递的用户对象
				//this.logoutFlag=!this.logoutFlag;
				this.username=msg.userName;
			}*/
		}
	}
</script>
