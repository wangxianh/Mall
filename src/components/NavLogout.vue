<template>
	<div>
		<div v-bind:class="{'delay':logoutFlag}"></div>
		<div class="confirmBox" v-bind:class="{'show':logoutFlag}">
			<div class="cancel" @click="cancel"></div>
			<p>确认登出吗？</p>
			<div class="bt">
				<button class="yes" @click="confirmOut">确认</button>
				<button class="no" @click="cancel">取消</button>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios"
	export default{
		data(){
			return{
				test:this.$store.state.logFlag=='logout'
			}
		},
		computed:{
			logoutFlag(){  //判断点击的是否是logout
				return this.$store.state.logFlag=='logout';
			}
		},
		methods:{
			confirmOut(){  //确认登出,将用户置空
				axios.post("/user/logout").then((response)=>{
					let res=response.data;
					if(res.status=="0"){
						this.$store.commit('transferUser','');//用户置空
						this.$store.commit('transferNavFlag',false);
						this.$store.commit('transferLogFlag','');
						this.$store.commit("updateCartNum",0);//购物车数量为0
						this.$router.push("/");//跳转到商品页面		
					}
				})
				
			},
			cancel(){
                this.$store.commit('transferLogFlag','');
			},
			getCartNum(){//查找购物车数量
                axios.get("/user/cartNum").then((response)=>{
                    let res=response.data;
                    if(res.status=="0"){
                        //更新到全局状态管理
                        this.$store.commit("updateCartNum",res.result);
                    }
                    
                })
            }
		}
	}
</script>