<template>
	<div>
		这是商品列表页面
		{{this.$route.params.goodId}}
		{{this.$route.params.name}}
		<br/>
		<router-link to="/goods/title">跳转到标题页面</router-link>
		<router-link to="/goods/img">跳转到图片页面</router-link><br/>
		<button @click="jump">编程路由--购物车页面</button><br/>
		<router-link v-bind:to="{name:'cart'}">命名路由--购物车页面</router-link>

		<div>
			<router-view></router-view>
		</div>
	</div>

</template>

<style>
</style>

<script>
	export default{
		data(){
			return{
				msg:'hello vue'
			}
		},
		methods:{
			jump(){
				//编程式路由跳转
				//this.$router.push("/cart");   //通过name值跳转
				//this.$router.push({path:'/cart'}); //路径对象
				this.$router.push({path:'/cart?a=123'});  //同时传递值
				//值通过this.$route.query.a来获取

				//this.$router(-2);  //回退两步

			}
		}
	}
</script>