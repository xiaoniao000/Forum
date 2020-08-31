/**
 * opinion model
 */
const mongoose = require("mongoose");

//这里添加了新字段，就算是已经生成的数据，也会有新字段
const opinionSchema = mongoose.Schema({
  // opinion的_id会自动生成
  forum_id: mongoose.Schema.ObjectId,
  forum: { type: mongoose.Schema.ObjectId, ref: "forum" },
  discussion_id: mongoose.Schema.ObjectId,
  discussion: { type: mongoose.Schema.ObjectId, ref: "discussion" },
  user_id: mongoose.Schema.ObjectId,
  user: { type: mongoose.Schema.ObjectId, ref: "user" },
  // 思考后想明白：数据库不应该这样存放。
  //这是一个存放 回复了该opinion的opinion的id 的数组（事实上将来会存放_id对应的opinion）
  //ref:引用 告诉 Mongoose 在填充的时候使用 opinion model
  //所有储存在 replied_opinions 中的 _id 都必须是 opinion model 中 document 的 _id
  // replied_opinions: [{ type: mongoose.Schema.ObjectId, ref: "opinion" }],
  date: Date,
  content: Object,
  opinionFavorites: Array,
  //回复
  // 在讨论的第几层
  depth: Number,
  // 直接回复对象的id
  parent_id: mongoose.Schema.ObjectId,
  parent: { type: mongoose.Schema.ObjectId, ref: "user" },
});

module.exports = mongoose.model("opinion", opinionSchema); //起一个别名opinion
