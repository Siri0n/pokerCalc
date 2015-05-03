var React = require("react");
var BusMxn = require("./bus.jsx");
var _ = require("lodash");

function format(num){
	if(num != num || typeof num != "number"){
		return "?";
	}
	var s = num + "";
	var a = s.split(".");
	if(a.length == 1){
		a[1] = "";
	}
	if(a[1].length > 2 || a.length != 2){
		console.log("Incorrect number format");
		return s;
	}
	while(a[1].length < 2){
		a[1] += "0";
	}
	return a.join(".");
}

function formatHand(hand){
	if(hand[0] != "1"){
		hand = " " + hand;
	}
	if(hand[hand.length-1] != 0){
		hand += " ";
	}
	return hand;
}

function sort(hands, order, data){
	if("23456789".indexOf(order) > -1){
		return _.sortBy(hands, function(h){
			return -data[order][h].m;
		});
	}
	if("23456789".indexOf(-order) > -1){
		return _.sortBy(hands, function(h){
			return data[-order][h].m;
		});
	}
	return hands;
}

var GlobalControls = React.createClass({
	mixins:[BusMxn],
	render: function(){
		return(
			<div className="controls">
				<div>
					<button onClick={this.stream({type: "ajax", value: "load"})}>
						Load
					</button>
					<button onClick={this.stream({type: "ajax", value: "save"})}>
						Save
					</button>
				</div>
				<div>
					<label>
						<input type="radio" name="mode" value="p" checked={this.props.mode == "p"} 
							onChange={this.streamValue({type: "set", path: "mode"})}>Probability</input>
					</label>
					<label>
						<input type="radio" name="mode" value="m" checked={this.props.mode == "m"} 
							onChange={this.streamValue({type: "set", path: "mode"})}>Expectation</input>
					</label>
				</div>
			</div>
		);
	}
})

var ChanceTable = React.createClass({
	mixins: [BusMxn],
	render: function(){
		var self = this;
		var hands = sort(this.props.hands, this.props.order, this.props.data);
		var playerNums = Object.keys(this.props.data).sort();
		return(
			<table>
				<tr>
					<th>
						H\P
					</th>
					{playerNums.map(function(num){
						var sortClass = "";
						if(self.props.order == num){
							sortClass = " asc";
						}else if(self.props.order == -num){
							sortClass = " desc"
						}
						return <th className={"menu menu-down" + sortClass}>
							{num}
							<div>
								<div className="menu menu-right">
									Sort
									<div>
										<div onClick={self.stream({type: "set", path: "order", value: num})}>
											Ascending
										</div>
										<div onClick={self.stream({type: "set", path: "order", value: -num})}>
											Descending
										</div>
									</div>
								</div>
								<div className="menu menu-right">
									Play
									<div>
										{[1000,10000,100000].map(function(rounds){
											return (
												<div className="item" 
													onClick={self.stream({type: "ajax", value: "play", players: num, rounds: rounds})}>
													{rounds}
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</th>
					})}
				</tr>
				{hands.map(function(hand){
					return (
						<tr>
							<td>{formatHand(hand)}</td>
							{playerNums.map(function(num){
								return(
									<td>{format(self.props.data[num][hand][self.props.mode])}</td>
								);
							})}
						</tr>
					);
				})}
			</table>
		);
	}
});

var Await = React.createClass({
	render: function(){
		return <div className="await" style={{display: this.props.display ? "block" : "none"}}/>
	}
});
var Content = React.createClass({
	mixins: [BusMxn],
	render: function(){
		var {hands, await, order, mode, ...data} = this.props;
		console.log("await", await);
		return(
			<div className="content">
				<ChanceTable mode={mode || "m"} hands={hands} order={order} data={data}/>
				<GlobalControls mode={mode || "m"}/>
				<Await display={!!await}/>
			</div>
		);
	}
})

function criteria(c){

}
module.exports = Content;