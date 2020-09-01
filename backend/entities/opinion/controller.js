// models
const Opinion = require("./model");
const { map } = require("lodash");

/**
 * get all opinion regarding a single discussion
 * @param  {ObjectId} discussion_id
 * @return {Promise}
 */
const getAllOpinions = (discussion_id) => {
  return new Promise((resolve, reject) => {
    // 先得到所有该discussion下的opnion
    Opinion.find({ discussion_id })
      .populate("user")
      .populate("parent_user")
      .sort({ date: -1 }) //降序
      .exec((error, opinions) => {
        //execuce 立即执行查询
        if (error) {
          console.log(error);
          reject(error);
        } else if (!opinions) reject(null);
        else {
          // console.log("opinions-----------", opinions);
          //得到一级回复
          const firstLevelOpinions = opinions.filter(
            (opinion) =>
              JSON.stringify(opinion.parent_id) == JSON.stringify(discussion_id)
          );
          //得到所有楼的二级回复
          const secondLevelOpinions = opinions.filter(
            (opinion) =>
              JSON.stringify(opinion.parent_id) !==
              JSON.stringify(discussion_id)
          );
          // console.log("secondLevelOpinions---------", secondLevelOpinions);

          try {
            for (let firstLevelOpinion of firstLevelOpinions) {
              // 得到每层楼的二级回复
              secondLevelOpinions.filter((secondLevelOpinion) => {
                return secondLevelOpinion.depth === firstLevelOpinion.depth;
              });
              // !!!这个_doc注意一下，不加不能动态添加属性
              firstLevelOpinion._doc[
                "subOpinions"
              ] = secondLevelOpinions.filter((secondLevelOpinion) => {
                return secondLevelOpinion.depth === firstLevelOpinion.depth;
              });
              //按发表时间降序排列每层楼的二级回复
              firstLevelOpinion.subOpinions &&
                firstLevelOpinion.subOpinions.sort(
                  (opinion_a, opinion_b) => opinion_b.date - opinion_a.date
                );
            }
          } catch (err) {
            console.log("---------------", err);
          }

          // console.log("firstLevelOpinions---------", firstLevelOpinions);
          resolve(firstLevelOpinions);
        }
      });
  });
};

/**
 * create an opinion regarding a discussion
 * @param  {ObjectId} forum_id
 * @param  {ObjectId} discussion_id
 * @param  {ObjectId} user_id
 * @param  {Object} content
 * @return {Promise}
 */
const createOpinion = ({
  forum_id,
  discussion_id,
  user_id,
  content,
  parent_id,
  parent_user_id,
  depth,
}) => {
  return new Promise((resolve, reject) => {
    const newOpinion = new Opinion({
      forum_id,
      discussion_id,
      discussion: discussion_id,
      user_id,
      user: user_id,
      content,
      date: new Date(),
      opinionFavorites: [],
      parent_id,
      parent_user: parent_user_id,
      depth,
    });

    newOpinion.save((error) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(newOpinion);
      }
    });
  });
};

const updateOpinion = (opinion_id) => {
  // TODO: implement update for opinion
};

/**
 * delete a single opinion
 * @param  {ObjectId} opinion_id
 * @return {Promise}
 */
const deleteOpinion = (opinion_id) => {
  return new Promise((resolve, reject) => {
    Opinion.remove({ _id: opinion_id }).exec((error) => {
      if (error) {
        console.log(error);
        reject(error);
      } else resolve("deleted");
    });
  });
};

/**
 * toggle favorite status of opinion
 * @param  {ObjectId} opinion_id
 * @param  {ObjectId} user_id
 * @return {Promise}
 */
const toggleOpinionFavorite = (opinion_id, user_id) => {
  return new Promise((resolve, reject) => {
    Opinion.findById(opinion_id, (error, opinion) => {
      // console.log("toggleOpinionFavorite---------------", opinion);
      if (error) {
        console.log(error);
        reject(error);
      } else if (!opinion) reject(null);
      else {
        // add or remove favorite
        let matched = null;
        for (let i = 0; i < opinion.opinionFavorites.length; i++) {
          //opinion.opinionFavorites保存 点赞者的user_id
          if (String(opinion.opinionFavorites[i]) === String(user_id)) {
            matched = i;
          }
        }

        //如果没有点过赞，把该user_id添加进去；否则，从discussion.favorites数组中删掉该user_id
        if (matched === null) {
          opinion.opinionFavorites.push(user_id);
        } else {
          opinion.opinionFavorites = [
            ...opinion.opinionFavorites.slice(0, matched),
            ...opinion.opinionFavorites.slice(
              matched + 1,
              opinion.opinionFavorites.length
            ),
          ];
        }

        //opinion.save 是干什么的
        //updatedOpinion 就是更新后(去掉某个userId)的opinion
        opinion.save((error, updatedOpinion) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          // console.log(`------------updatedOpinion${updatedOpinion}`);
          resolve(updatedOpinion);
        });
      }
    });
  });
};

module.exports = {
  getAllOpinions,
  createOpinion,
  updateOpinion,
  deleteOpinion,
  toggleOpinionFavorite,
};
