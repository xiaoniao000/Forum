// controllers
const getDiscussion = require("../discussion/controller").getDiscussion;
const getAllOpinions = require("./controller").getAllOpinions;
const createOpinion = require("./controller").createOpinion;
const deleteOpinion = require("./controller").deleteOpinion;
const toggleOpinionFavorite = require("./controller").toggleOpinionFavorite;
/**
 * opinion apis
 */
const opinionAPI = (app) => {
  // create an opinion
  app.post("/api/opinion/newOpinion", (req, res) => {
    //这里的req.user是会自动加上去的吗
    if (req.user) {
      // console.log("req.body------------", req.body);
      createOpinion(req.body).then(
        (result) => {
          res.send(result);
        },
        (error) => {
          res.send(error);
        }
      );
    } else {
      res.send({ authenticated: false });
    }
  });

  // toggle favorite to the opinion
  app.put("/api/opinion/toggleOpinionFavorite/:opinion_id", (req, res) => {
    //params 存储 api 请求中传递过来的参数,这里是opinion_id
    const { opinion_id } = req.params;
    // console.log("后端接受api---------", req.params);
    if (req.user) {
      // TODO: describe the toggle process with opinions
      toggleOpinionFavorite(opinion_id, req.user._id).then(
        (result) => {
          //第一个参数不能直接省略
          //修改成功之后,重新获取discussion,返回给前台
          getDiscussion(null, result.discussion_id).then(
            (result) => {
              // console.log("getDiscussion------success", rseult);
              res.send(result);
            },
            (error) => {
              res.send({ discussionUpdated: false });
            }
          );
        },
        (error) => {
          res.send({ discussionUpdated: false });
        }
      );
    } else {
      res.send({ discussionUpdated: false });
    }
  });

  // remove an opinion
  app.delete("/api/opinion/deleteOpinion/:opinion_id", (req, res) => {
    if (req.user) {
      deleteOpinion(req.params.opinion_id).then(
        (result) => {
          res.send({ deleted: true });
        },
        (error) => {
          res.send({ deleted: false });
        }
      );
    }
  });
};

module.exports = opinionAPI;
