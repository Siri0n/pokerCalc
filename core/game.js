var _ = require("lodash");
var suits = [
	{
		id: 0,
		str: "\u2665"
	},
	{
		id: 1,
		str: "\u2666"
	},
	{
		id: 2,
		str: "\u2663"
	},
	{
		id: 3,
		str: "\u2660"
	}
];

var values = [
	{
		id: 0,
		str: "2"
	},
	{
		id: 1,
		str: "3"
	},
	{
		id: 2,
		str: "4"
	},
	{
		id: 3,
		str: "5"
	},
	{
		id: 4,
		str: "6"
	},
	{
		id: 5,
		str: "7"
	},
	{
		id: 6,
		str: "8"
	},
	{
		id: 7,
		str: "9"
	},
	{
		id: 8,
		str: "10"
	},
	{
		id: 9,
		str: "J"
	},
	{
		id: 10,
		str: "Q"
	},
	{
		id: 11,
		str: "K"
	},
	{
		id: 12,
		str: "A"
	},
];


var cardList = _.flatten(
	suits.map(function(suit){
		return values.map(function(value){
			return {
				suit: suit.id,
				value: value.id,
				toString: function(){return value.str + suit.str}
			}
		})
	})
)

var handList = _.flattenDeep(
	values.map(
		function(elem, index){
			return values.slice(index).map(
				function(elem2){
					if(elem.id == elem2.id){
						return {
							id: elem.id + "-" + elem2.id,
							str: elem.str + "-" + elem2.str
						}
					}else{
						return [
							{
								id: elem.id + "-" + elem2.id,
								str: elem.str + "-" + elem2.str
							},
							{
								id: elem.id + "+" + elem2.id,
								str: elem.str + "+" + elem2.str
							}
						]
					}
				}
			)
		}
	)
);

function Deck(){
	var cards = _.shuffle(cardList);
	this.get = function(n){
		if(cards.length < n){
			//throw new Error("Too few cards in deck");
			console.log("! new deck !");
			cards = _.shuffle(cardList);
		}
		var result = cards.splice(0, n);
		console.log(result);
		return result;
	}
}

function handType(hand){
	return hand[0].value + (hand[0].suit == hand[1].suit ? "+" : "-") + hand[1].value;
}

var combinations = ["nothing", "pair", "two pairs", "set", "straight", "flush", "four", "straight flush"];

function range(n){
	return _.times(n, function(k){ return k});
}

function straight(cards){
	var cardsByVal = _.groupBy(cards, "value");
	var start = _.find(
		range(9).reverse(),
		function(n){
			return range(5).reduce(function(accum, shift){
				return accum && !!cardsByVal[n + shift];
			}, true)
		}
	)
	if(typeof start == "undefined"){
		return null;
	}else{
		return _.times(5, function(n){return cardsByVal[start + n][0]});
	}
}

function query(cards, n){
	var cardsByVal = _.groupBy(cards, "value");
	var value = _.findLastIndex(
		range(13),
		function(i){
			return (i in cardsByVal) && cardsByVal[i].length >= n;
		}
	)
	if(value == -1){
		return false;
	}
	var result = _.take(cardsByVal[value], n);
	var rest = _.xor(cards, result);
	return {
		value: value,
		result: result,
		rest: _.sortBy(rest, "value").reverse()
	}
}

function combination(cards){
	var cardsBySuit = _.groupBy(cards, "suit");
	var flushCards = _.find(cardsBySuit, function(cards){
		return	cards.length >= 5;
	})
	if(flushCards){
		var straightFlush = straight(flushCards);
		if(straightFlush){
			return {
				combination: "straight flush",
				kickers: [straightFlush[4].value]
			}
		}
	}
	var query4 = query(cards, 4);
	if(query4){
		return {
			combination: "four",
			kickers: [query4.value, query4.rest[0].value]
		}
	}

	var query3 = query(cards, 3);
	if(query3){
		var query3_2 = query(query3.rest, 2);
		if(query3_2){
			return {
				combination: "full house",
				kickers: [query3.value, query3_2.value]
			}
		}
	}
	if(flushCards){
		flushCards = _.sortBy(flushCards, "value").reverse();
		flushCards = _.take(flushCards, 5);
		return {
			combination: "flush",
			kickers: _.map(flushCards, "value")
		}
	}
	var straightCards = straight(cards);
	if(straightCards){
		return {
			combination: "straight",
			kickers: [straightCards[4].value]
		}
	}
	if(query3){
		return {
			combination: "set",
			kickers: [query3.value, query3.rest[0].value, query3.rest[1].value]
		}
	}
	var query2 = query(cards, 2);
	if(query2){
		var query2_2 = query(query2.rest, 2);
		if(query2_2){
			return {
				combination: "two pairs",
				kickers: [query2.value, query2_2.value, query2_2.rest[0].value]
			}
		}
		return {
			combination: "pair",
			kickers: [query2.value, query2.rest[0].value, query2.rest[1].value, query2.rest[2].value]
		}
	}
	return {
		combination: "nothing",
		kickers: _.take(_.map(cards, "value").sort(function(a,b){return b-a}), 5)
	}
}

function playGame(players){
	var deck = new Deck(); //stub
}

module.exports = {
	Deck: Deck,
	handList: handList,
	handType: handType,
	straight: straight,
	combination: combination,
	query: query,
	range: range,
}