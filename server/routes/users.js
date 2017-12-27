var express = require('express');
var router = express.Router();
//var mongoose=require('mongoose');
var Users=require('../models/users');

//登录
router.post('/login', function(req, res, next) {
  //res.send('respond with a resource');
  let username=req.body.username;
  let password=req.body.password;
  //console.log(username+password);
  Users.findOne({"userName":username,"password":password},(err,doc)=>{
	if(err){
		res.json({
			"status":2,
			"msg":err.message
		})
	}else{
		if(doc){
			res.cookie('userId',doc.userId,{
				"path":'/',
				"maxAge":1000*60*60  //最长生命周期
			});
			res.json({
				"status":0,
				"msg":"",
				"result":{
					list:doc
				}
			});
			console.log(doc+"登录成功！");
		}else{
			res.json({
				"status":11,//用户名或密码错误
				"msg":"",
				"result":{
					list:doc
				}
			});
			console.log('用户名或密码错误！')
		}
		
		
	}
  });
});
//登出
router.post('/logout',(req,res,next)=>{
	res.cookie('userId',"",{
		"path":'/',
		"maxAge":0
	});
	res.json({
			"status":0,
			"msg":"",
			"result":""
		});
});
router.get('/cartNum',(req,res,next)=>{
	let userId=req.cookies.userId;
	if(userId){
		  //从cookie中获取userId
		Users.findOne({"userId":userId},(err,doc)=>{
		if(err){
			res.json({
				"status":2,
				"msg":err.message
			})
		}else{
			let cart=doc.cartList;
			let count=0;
			cart.forEach((value,index)=>{  //获取购物车数量
				count+=parseInt(value.productQuantity);
			})
			res.json({
				"status":0,
				"msg":"",
				"result":count
			})
		}
	})
	}	
});

//添加到订单
router.post("/addOrder",(req,res,next)=>{
	let userId=req.body.userId;
	let orderId=req.body.orderId;
	let chooseList=req.body.orderProduct;  //选中的商品
	let orderMoney=req.body.orderMoney;  //订单金额
	let orderStatus=req.body.orderStatus;  //订单状态
	Users.findOne({"userId":userId},(err,doc)=>{
		if(err){
			res.json({
				"status":2,
				"msg":err.message
			})
		}else{
			let order={
				"orderId":orderId,
				"orderProduct":chooseList,
				"totalMoney":orderMoney,
				"orderStatus":orderStatus
			};
			doc.orderList.push(order);  //添加新订单
			doc.save((err)=>{
				if(err){
			 		res.json({
								"status":1,
								"msg":err.message
							});
			 		console.log("订单添加失败！");
			 	}else{
			 		res.json({
								"status":0,
								"msg":''
							});
			 		console.log("订单添加成功！");
			 	}
			})
		}
	})
})
//根据订单id添加地址信息
router.post("/addAddress",(req,res,next)=>{
	let userId=req.body.userId;
	let orderId=req.body.orderId;
	let orderAddress=req.body.orderAddress;
	Users.findOne({"userId":userId},(err,doc)=>{
		if(err){
			res.json({
				"status":2,
				"msg":err.message
			})
		}else{
			//let orderList=doc.orderList;
			doc.orderList.forEach((value,index)=>{
				if(value.orderId==orderId){
					value.orderAddress=orderAddress;
				}
			})
			doc.save((err1)=>{
						if(err1){
			 				res.json({
								"status":1,
								"msg":err1.message
							});
							console.log("地址失败")
			 			}else{
			 				res.json({
								"status":0,
								"msg":''
							});
							console.log("地址成功")
			 			}
					})
			/*orderList.findOne({"orderId":orderId},(err1,orderDoc)=>{
				if(err1){
				res.json({
					"status":2,
					"msg":err1.message
				})
				}else{
					orderDoc.orderAddress=orderAddress; //添加地址信息
					
				}
			})*/
			//doc.save()
		}
	})
})
//查看订单
router.get("/orderList",(req,res,next)=>{
	let userId=req.query.userId;
	let orderId=req.query.orderId;
	let order="";
	Users.findOne({"userId":userId},(err,doc)=>{
		if(err){
			res.json({
				"status":2,
				"msg":err.message
			})
		}else{
			doc.orderList.forEach((value,index)=>{
				if(value.orderId==orderId){
					order=value;  //获取指定订单
				}
			})
			res.json({
				"status":0,
				"msg":'',
				"result":order
			})
		}
	})
})
//更新订单状态
router.post("/updateStatus",(req,res,next)=>{
	let userId=req.body.userId;
	let orderId=req.body.orderId;
	Users.findOne({"userId":userId},(err,doc)=>{
		if(err){
			res.json({
				"status":2,
				"msg":err.message
			})
		}else{
			doc.orderList.forEach((value,index)=>{
				if(value.orderId==orderId){
					value.orderStatus="0";  //状态改为0,已完成
				}
			})
			doc.save((err1)=>{
						if(err1){
			 				res.json({
								"status":1,
								"msg":err1.message
							});
			 			}else{
			 				res.json({
								"status":0,
								"msg":''
							});
			 			}
					})
		}
	})
})
//查看订单总金额
router.get("/getMoney",(req,res,next)=>{
	let userId=req.query.userId;
	let orderId=req.query.orderId;
	let totalMoney=0;  //订单总额
	Users.findOne({"userId":userId},(err,doc)=>{
		if(err){
			res.json({
				"status":2,
				"msg":err.message
			})
		}else{
			doc.orderList.forEach((value,index)=>{
				if(value.orderId==orderId){
					totalMoney=value.totalMoney;  //获取订单总额
				}
			})
			doc.save((err1)=>{
						if(err1){
			 				res.json({
								"status":1,
								"msg":err1.message
							});
			 			}else{
			 				res.json({
								"status":0,
								"msg":'',
								"result":totalMoney
							});
			 			}
					})
		}
	})
})

module.exports = router;
