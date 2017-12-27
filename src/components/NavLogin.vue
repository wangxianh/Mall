<template>
    <div>
        <div v-bind:class="{'showDelay':loginFlag}"></div>
        <div class="pop" v-bind:class="{'showLogin':loginFlag}">
        	<div class="cancel" @click="cancel"></div>
        	<p>登录</p>
            <span class="error" v-if="loginTip">
                <img src="/static/img/icon/error.png" />
                <span>用户名或密码错误</span>
            </span>
        	<div class="admin">
        		<img src="/static/img/icon/user.png" />
        		<input type="text" v-model="username" placeholder="请输入账号">
        	</div>
        	<div class="password">
        		<img src="/static/img/icon/pass.png" />
        		<input type="text" v-model="password" placeholder="请输入密码">
        	</div>
        	<button @click="login">登录</button>
            <button @click="cancel">取消</button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
	export default{
        /*props:{  //接受父组件数据
            loginFlag:{  //传递是否点击标志
                type:Boolean,
                required:true
            }
        },*/
        data(){
            return{
                //showLogin:false,  //标志是否登录
                //loginFlag:this.$store.state.logFlag,
                username:'',
                password:'',
                loginTip:false  //登录错误提示
                //userId:''
            }
        },
        computed:{
            loginFlag(){ //判断点击的是否是login
                return this.$store.state.logFlag=='login';
            }
        },
		methods:{
			cancel(){
                //双向数据绑定，子组件传递给父组件
                //this.$emit('transferLogin',this.loginFlag);
                //传递空值给logFlag，不显示登录框和背景
                this.$store.commit('transferLogFlag','');
			},
            login(){
                if(!this.username||!this.password){
                    this.loginTip=true;
                    return;
                }
                /*let param={
                    username:this.username,
                    password:this.password
                };*/
                axios.post("/user/login",{username:this.username,
                    password:this.password}).then((res)=>{
                    if(res.data.status=='0'){
                        //console.log('登录成功');
                        //this.userId=res.data.result.list.userId;
                        let user={ 
                            userId:res.data.result.list.userId,
                            userName:this.username
                        }
                        //向父组件传递用户对象，显示在导航条
                        //this.$emit('transferName',user);
                        //通过vuex状态管理的方式传递用户对象
                        this.$store.commit('transferUser',user);
                        //点击登录后传递空值给logFlag,不显示登录框和背景
                        this.$store.commit('transferLogFlag','');
                        //点击登录后，同时设置navFlag为true,导航条显示username和logout
                        this.$store.commit('transferNavFlag',true);
                        this.getCartNum() ;         
                    }else{
                        this.loginTip=true;  //登录失败
                    }
                })
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
