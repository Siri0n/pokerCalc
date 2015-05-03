module.exports = ((function(){
	var bus = {
		push: function(){
			throw new Error("Component is not connected to any bus");
		}
	}
	
	function clone(obj){
		return JSON.parse(JSON.stringify(obj));
	}
	
	function createStreamFactory(f){
		f = f || function(val){return val};
		return function(options){
			return function(value){
				var msg = clone(options);
				if(!("value" in msg)){
				 	msg.value = f(value);
				}
				bus.push(msg);
			}
		}
	}
	return {
		connect: function(newBus){
			console.log("Connected to bus");
			bus = newBus;
		},
		stream: createStreamFactory(),
		streamValue: createStreamFactory(function(event){
			return event.target.value;
		})
	}
})());