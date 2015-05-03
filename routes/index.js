var express = require("express");
var router = express.Router();
var Core = require("../core/core.js");
var core = new Core("./core/data.json");
var _ = require("lodash");

/* GET home page. */
router.get("/", function(req, res, next) {
	core.ready().then(function(){
		res.render("layout", {
  			content: "./isomorphic/content.jsx",
  			styles: ["/css/style.css"],
  			scripts: ["/js/main.js"],
  			data: core.data("basic", true)
  		});
	})
});

router.get("/api/play", function(req, res, next){
	core.playBasic(req.query.players, req.query.rounds);
	res.json({
		action: "update",
		data: core.data("basic")
	});
});

router.get("/api/load", function(req, res, next){
	core.load().then(function(){
		res.json({
			action: "update",
			data: core.data("basic")
		});
	})
});

router.get("/api/save", function(req, res, next){
	core.save();
	res.json({
		action: "message",
		message: "Data saved successfully"
	});
});

module.exports = router;
