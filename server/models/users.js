/**
 * 用户模型
 * @authors Your Name (you@example.org)
 * @date    2017-12-01 14:46:25
 * @version $Id$
 */
let mongoose=require('mongoose');
let userSchema=new mongoose.Schema({
	"userId":String,
	"userName":String,
	"password":String,
	"orderList":[
		{
			"orderId":String,
			"createTime":Date, //订单创建日期
			"totalMoney":Number, //订单总金额
			"orderStatus":String,  //订单状态
			"orderAddress":{  //
				"addressId":String,
				"addressName":String,
				"addressInfo":String,
				"telNumber":String,
				"isDefault":Boolean
			},
			"orderProduct":[  //订单商品
				{
					"productId":String,
					"productName":String,
					"productPrice":Number,
					"productQuantity":Number,
					"image":String,
					"parts":[
						{
							"partId":String,
							"partName":String
						}
					]
				}
			]
		}
	],
	"addressList":[
		{
			"addressId":String,
			"addressName":String,
			"addressInfo":String,
			"telNumber":String,
			"isDefault":Boolean
		}
	],
	"cartList":[
		{
			"productId":String,
			"productName":String,
			"productPrice":Number,
			"productQuantity":Number,
			"image":String,
			"parts":[
				{
					"partId":String,
					"partName":String
				}
			]
		}
	]
});

module.exports=mongoose.model("User",userSchema);
