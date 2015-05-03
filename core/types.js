var _ = require("lodash");

var suits = ["\u2665", "\u2666", "\u2663", "\u2660"];

var values = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];


var cardList = _.flatten(
	suits.map(function(suit, suitId){
		return values.map(function(value, valueId){
			return {
				suit: suitId,
				value: valueId,
				str: value + suit
			}
		})
	})
)

var handList = _.flattenDeep(
	values.map(
		function(elem, index){
			return values.slice(index).map(
				function(elem2, shift){
					if(shift == 0){
						return elem2 + "-" + elem
					}else{
						return [
							elem2 + "-" + elem,
							elem2 + "+" + elem
						]
					}
				}
			)
		}
	)
);

var combinationList = ["nothing", "pair", "two pairs", "set", "straight", "flush", "four", "straight flush"]

module.exports = {
	suits: suits,
	values: values,
	cardList: cardList,
	handList: handList,
	combinationList: combinationList
}