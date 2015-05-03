var _ = require("lodash");
var types = require("./types");

function Deck(){
	var cards = _.shuffle(types.cardList);
	this.shuffle = function(){
		cards = _.shuffle(types.cardList);
	}
	this.take = function(n){
		if(cards.length < n){
			throw new Error("Too few cards in deck");
		}
		var result = cards.splice(0, n);
		return result;
	}
}

function handType(hand){
	return types.values[Math.max(hand[0].value, hand[1].value)] + 
		(hand[0].suit == hand[1].suit ? "+" : "-") + 
		types.values[Math.min(hand[0].value, hand[1].value)];
}

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

function combinationToString(c){
	return types.combinationList.indexOf(c.combination) + c.kickers.map(function(kicker){
		return "0123456789xyz"[kicker];
	}).join("");
}

function playGame(players, rounds){
	var deck = new Deck();
	var result = {};
	_.forEach(types.handList, function(hand){
		result[hand] = {
			games: 0,
			score: 0
		}
	})
	function max(arr){
		return arr.reduce(function(acc, val){
			return acc > val ? acc : val; 
		}, arr[0])
	}
	for(var i = 0; i < rounds; i++){
		deck.shuffle();
		var playerHands = _.times(players, function(n){
			return deck.take(2);
		});
		var common = deck.take(5);
		var playerCombos = playerHands.map(function(hand){
			var c = combination(hand.concat(common));
			return combinationToString(c);
		});
		var winnerCombo = max(playerCombos);
		var winnerIndex = playerCombos.indexOf(winnerCombo);
		_.times(players, function(n){
			var type = handType(playerHands[n]);
			result[type].games += 1;
			result[type].score += (n == winnerIndex ? 1 : 0);
		});
	}
	return result;
}

module.exports = playGame;