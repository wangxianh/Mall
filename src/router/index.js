import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ProductList from '@/demo_view/productList'
import Title from '@/demo_view/title'
import Image from '@/demo_view/image'
import cartList from '@/view/cart'
import ProductLists from '@/view/productLists'
import Address from '@/view/address'
import orderConfirm from '@/view/orderConfirm'
import CheckOut from '@/view/checkOut'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    /*{
        path:'/',   //默认路径，访问helloworld页面
        name:'HelloWorld',
        component:HelloWorld
    },*/
    {
    	//path:'/goods',  //不带参数的动态路由
    	//path:'/goods/:goodId',  //带一个参数的，参数值通过this.$route.params.goodId获取
    	//带多个参数，值获取同上,访问路径:/goods/123/user/wxh
    	path:'/goods/:goodId/user/:name', 
    	name: 'ProductList',
    	component:ProductList,
    	children:[   //嵌套路由
    		{
    			path:'title',  //注意访问路径：/goods/title
    			name:'title',
    			component:Title
    		},
    		{
    			path:'img',
    			name:'img',
    			component:Image
    		}
    	]
    },
    {
    	path:'/cartList', //访问购物车页面
    	name:'cartList',
    	component:cartList
    },
    {
        path:'/',  
        //path:'/goods', //默认访问商品列表页面
        name:'ProductLists',
        component:ProductLists
    },
    {
        path:'/address/:orderId', //访问地址页面,传递订单参数
        name:'address',
        component:Address
    },
    {
        path:'/orderConfirm/:orderId', //订单确认页面
        name:'orderConfirm',
        component:orderConfirm
    },
    {
        path:'/CheckOut/:orderId', //提交订单页面
        name:'CheckOut',
        component:CheckOut
    }
  ]
})
