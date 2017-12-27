/**
 * 定义商品数据模型
 * @authors Your Name (you@example.org)
 * @date    2017-11-29 17:12:49
 * @version $Id$
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var goodSchema=new Schema({
	productId:String,
	productName:String,
	productPrice:Number,
	productImage:String,
	productQuantity:Number
});

//Good对应访问数据库中goods表
module.exports=mongoose.model('Good',goodSchema); 