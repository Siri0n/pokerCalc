var fs = require("fs");
var Promise = require("promise");
var _ = require("lodash");
var types = require("./types.js");

var empty = {
	basic: {}
}
_.times(8, function(n){
	empty.basic[n+2] = {};
	types.handList.forEach(function(hand){
		empty.basic[n+2][hand] = {
			games: 0,
			score: 0
		}
	});
})

function Storage(filePath){
	var self = this;
	var path = filePath || "./data.json";
	var data = null;
	
	this.load = function(customPath){
		return new Promise(function(resolve, reject){
			fs.readFile(customPath || path, function(err, res){
				if(err){
					console.log("error reading json", err);
					data = _.clone(empty);
				}else{
					data = JSON.parse(res);
				}
				resolve(data);
			})
		})
	}
	
	this.data = function(){
		return data;
	}

	this.save = function(customPath){
		fs.writeFile(customPath || path, JSON.stringify(data));
	}

	this.extend = function(newdata){
		function add(obj, obj1, keystack){
			keystack = keystack || "";
			_.forEach(obj1, function(val, key){
				if(typeof val == "number"){
					if(typeof obj[key] == "number"){
						obj[key] += val;
					}else{
						throw new TypeError("Malformed data: " + keystack + "." + key);
					}
				}else{
					if(typeof val == "object" && typeof obj[key] == "object"){
						add(obj[key], val, keystack + "." + key);
					}else{
						throw new TypeError("Malformed data");
					}
				}
			})
		}
		var _data = _.clone(data)
		try{
			add(_data, newdata);
		}catch(e){
			throw e;
		}
		data = _data
	}
}

module.exports = Storage;