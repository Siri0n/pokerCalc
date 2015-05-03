var React = require("react");
var Content = require("../../views/isomorphic/content.jsx");
var Bacon = require("baconjs");
var _ = require("lodash");
var $ = require("./zepto.js");
window.$ = $;

function type(t){
	return function(v){
		return v.type == t;
	}
}

function set(e){
	return function(state){
		var keys = e.path.split(".");
		var i = 0;
		var ref = state;
		while(typeof ref[keys[i]] == "object" && i < keys.length - 1){
			ref = ref[keys[i++]];
		}
		if(i == keys.length - 1){
			ref[keys[i]] = e.value;
			return state;
		}else{
			throw new Error("Path doesn't exist");
		}

	}
}

$(function(){
	var reactiveContent = React.render(React.createElement(Content, initData), document.body);
	var reactBus = new Bacon.Bus();
	console.log("lol");
	window.reactiveContent = reactiveContent;
	reactiveContent.connect(reactBus);
	window.reactBus = reactBus;
	var o_O;

	var setStream = reactBus
		.filter(type("set"))
		.map(set);
	o_O = setStream;

	var ajaxRequest = reactBus
		.filter(type("ajax"));
	var ajaxResponse = ajaxRequest
		.flatMap(function(e){
			return Bacon.fromPromise($.ajax({
				url: "/api/" + e.value,
				data: _.omit(e, ["value", "type"])
			}));
		})
		.log("server response")
		.map(function(response){
			if(response.action == "update"){
				return function(model){
					return _.assign(model, response.data);
				}
			}else{
				if(response.action == "message"){
					alert(response.message);
				}
				return function(model){
					return model;
				}
			}
		})
	o_O = o_O.merge(ajaxResponse);

	var ajaxIndicator = ajaxRequest
		.awaiting(ajaxResponse)
		.map(function(await){
			return function(state){
				return _.assign(state, {await: await});
			}
		})
		.changes();
	o_O = o_O.merge(ajaxIndicator);


	var model = o_O
		.scan(initData, function(state, f){
			return f(state);
		});
	model.log().onValue(reactiveContent.setProps.bind(reactiveContent));
})