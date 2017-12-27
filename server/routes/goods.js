/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-11-29 17:18:35
 * @version $Id$
 */
var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
var Goods=require('../models/goods');
var user=require('../models/users');

mongoose.connect('mongodb://127.0.0.1:27017/mall',
	{useMongoClient:true});

mongoose.connection.on('connected',function(){  //监听数据库连接状况
	console.log("mongodb connected success.");
});

mongoose.connection.on('error',function(){
	console.log("mongodb connected fail.");
});
mongoose.connection.on('disconnected',function(){
	console.log("mongodb connected disconnected.");
});
mongoose.Promise=global.Promise;
//查询列表
router.get('/',function(req,res,next){
	let page=parseInt(req.query.page)>0 ? parseInt(req.query.page):1;  //当前页面
	let pageSize=parseInt(req.query.pageSize)>0?parseInt(req.query.pageSize):8;  //每页条数
	let skipSize=(page-1)*pageSize;  //当前页面从哪条记录开始
	let sort=parseInt(req.query.sort);
	let priceLevel=req.query.priceLevel;
	let condition={};  //查询条件
	let priceGt=parseInt(req.query.priceFrom);
	let priceLte=parseInt(req.query.priceTo);
	if(priceLevel!='all')  //非全选时需要添加查询条件
	{
		condition={
			"productPrice":{$gt:priceGt,$lte:priceLte}
		}
	}
	Goods.find(condition).skip(skipSize).
		limit(pageSize).
		sort({"productPrice":sort}).
		exec(function(err,doc){
				if(err)
				{
					res.json({
						status:'1',
						msg:err.message,
					});
				}else{
					res.json({
						status:'0',
						msg:'',
						result:{
							count:doc.length,
							list:doc
						}
					});
				}
		});
});

//加入购物车
router.get('/carts',function(req,res,next){
	let userId=req.query.userId;  //根据用户id查询该用户
	let productId=req.query.productId; //要添加的商品id 
	//console.log("hello:"+userId+productId);
	if(userId==""||userId==null){
		res.json({
					"status":11,
					"msg":''
				});
		console.log("您还未登录，请先登录！");
	}else{
		Goods.findOne({"productId":productId},(err,productDoc)=>{
		if(err){
			res.json({
				"status":1,
				"msg":err.message
			});
		}else{	
			//查找指定用户的购物车列表
			user.findOne({"userId":userId},(err2,userDoc)=>{
				if(err2){
					res.json({
						"status":1,
						"msg":err2.message
					});
				}else{
				//遍历用户的购物车，判断购物车里是否已经存在该商品
					let cartFlag=false;

					userDoc.cartList.forEach(function(value,index){
						if(value.productId==productId){//该商品已经存在购物车
							/*if(typeof value.productQuantity=='undefined'){
								value.productQuantity=2;
							}else{
								value.productQuantity+=1; //商品数量增加
							}*/
							//console.log(value.productQuantity);
							value.productQuantity+=1; //商品数量增加
							cartFlag=true;
						}
					});
					if(!cartFlag){
						/*var temp=null;
						if(productDoc)
						{
							temp={
								"productId":productDoc.productId,
								"productName":productDoc.productName,
								"productPrice":productDoc.productPrice,
								"image":productDoc.image,
								"productQuantity":1
							}
						}*/
						//给对象增加属性，同时需要在model中添加属性
						productDoc.productQuantity=1;
						userDoc.cartList.push(productDoc);
					}
					userDoc.save((error)=>{
						if(error){
							res.json({
								"status":1,
								"msg":error.message
							});
							console.log('加入失败！');
						}else{
							res.json({
								"status":0,
								"msg":''
							});
							console.log('加入成功！');
						}
					});
				}
				
			})
		}
	})
	}
	
});
//点击+-号增加或删除购物车中商品数量
router.post('/changeNum',(req,res,next)=>{
	let userId=req.cookies.userId;
	let productId=req.body.productId;  //要改变数量的商品id
	let type=req.body.type;  //1:+ ;-1:-
	if(!userId||!productId){
		res.json({
			"status":"10011",
			"msg":"当前未登录"
		})
	}else{
		user.findOne({"userId":userId},(err,doc)=>{
			if(err){
				res.json({
					"status":"2",
					"msg":err.message
				})
			}else{
				doc.cartList.forEach((value,index)=>{
					if(value.productId==productId){//查找到该商品
						if(type==1){//判断点击的是+还是-
							value.productQuantity+=1;  //数据库中商品数量+1
						}else{
							value.productQuantity-=1;  //数据库中商品数量-1
						}
					}
				})
				doc.save((error)=>{  //更新数据库
						if(error){
							res.json({
								"status":1,
								"msg":error.message
							});
						}else{
							res.json({
								"status":0,
								"msg":''
							});
						}
					});

			}
		})
	}
	
})

//删除购物车中的商品
router.post('/delProduct',function(req,res,next){
	let userId=req.cookies.userId;
	let productId=req.body.productId;  //要删除的商品id
	user.findOne({"userId":userId},(err,userDoc)=>{
		if(err){
			req.json({
				"status":1,
				"msg":error.message
			});
		}else{
			 userDoc.cartList.forEach(function(value,index){
			 	if(value.productId==productId){
			 		userDoc.cartList.splice(index,1);//删除购物车中的商品
			 	}
			 });
			 userDoc.save(function(err){
			 	if(err){
			 		res.json({
								"status":1,
								"msg":err.message
							});
			 		console.log("删除失败！");
			 	}else{
			 		res.json({
								"status":0,
								"msg":''
							});
			 		console.log("删除成功！");
			 	}
			 });
		}
		
	})
})
//查看购物车
router.get('/cartList',function(req,res,next){
	//let userId=req.cookies.userId;  
	let userId=req.query.userId;
	if(!userId){
		res.json({
				"status":10011,
				"msg":"当前未登录",
				"result":""
			})
		return;
	} 
	user.findOne({"userId":userId},(err,doc)=>{
		if(err){
			res.json({
				"status":1,
				"msg":err.message
			})
		}else{
			res.json({
				"status":0,
				"msg":'',
				"result":{
					count:doc.cartList.length,
					list:doc.cartList
				}	
			})
		}
	})
});

//查询配送地址
router.get('/address',function(req,res,next){
	let userId=req.cookies.userId;
	user.findOne({"userId":userId},(err,doc)=>{
		if(err){
			res.json({
				"status":1,
				"msg":error.message
			})
		}else{
			res.json({
				"status":0,
				"msg":'',
				"result":{
					count:doc.addressList.length,
					list:doc.addressList
				}
			})
		}
	})
})


module.exports = router;

