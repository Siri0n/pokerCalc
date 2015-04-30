var React = require("react");
var BusMxn = require("./bus.jsx");

var Controls = React.createClass({
	mixins:[BusMxn],
	render: function(){
		return(
			<div className="controls">
				<button onClick={this.stream({type: "ajax", value: "load"})}>
					Load
				</button>
				<button onClick={this.stream({type: "ajax", value: "save"})}>
					Save
				</button>
			</div>
		);
	}
})

var ChanceTable = React.createClass({
	mixins: [BusMxn],
	render: function(){
		var self = this;
		return(
			<table>
				<caption>
					{this.props.caption}
				</caption>
				<tr>
					<th></th>
					{this.props.hands.map(function(hand){
						return <th>{hand}</th>
					})}
					<th colSpan="3">
						Compute more:
					</th>
				</tr>
				{this.props.data.map(function(row, index){
					return(
						<tr>
							<td>{(index + 2) + " players"}</td>
							{row.map(function(chance){
								return <td>{chance}</td>
							})}
							{[100,1000,10000].map(function(val){
								return(
									<td>
										<button onClick={self.stream({type: "ajax", value: "compute", count: val})}>
											{val}
										</button>
									</td>
								);
							})}
						</tr>
					);
				})}
			</table>
		);
	}
});

var Content = React.createClass({
	render: function(){
		return(
			<div className="content">
				<Controls/>
				<ChanceTable caption="Basic chances" hands={this.props.hands} data={this.props.basic}/>
			</div>
		);
	}
})

module.exports = Content;