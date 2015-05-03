var play = require("./game.js");
var Storage = require("./storage.js");
var types = require("./types.js");
var _ = require("lodash");
var Promise = require("promise");

function Core(path){
	var self = this;
	var storage = new Storage(path);

	this.ready = function(){
		if(!storage.data()){
			return self.load();
		}else{
			return Promise.resolve(storage.data());
		}
	}
	
	this.load = function(){
		return storage.load();
	}

	this.save = function(){
		return storage.save();
	}

	this.data = function(type, includeHandList){
		function round(val){
			return Math.round(val*10000)/100;
		}
		var data = _.mapValues(storage.data()[type], function(ndata, n){
			return _.mapValues(ndata, function(hdata){
				var chance = hdata.score/hdata.games;
				return {
					p: round(chance),
					m: round(chance*(n-1)-(1-chance))
				}
			})
		});
		return includeHandList ? _.assign(data, {hands: types.handList}) : data;
	}

	this.hands = function(){
		return types.handList;
	}

	this.playBasic = function(players, rounds){
		var result = {};
		result[players] = play(players, rounds);
		storage.extend({
			basic: result
		});
	}
}

module.exports = Core;