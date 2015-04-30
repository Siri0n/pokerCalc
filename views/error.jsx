var React = require('react');

var ErrorView = React.createClass({
	render: function(){
		return (
			<div>
			<h1>{this.props.message}</h1>
			<h2>
				{this.props.stack.split("\n").map(function(str){
					return <span style={{display:"block"}}>{str}</span>
				})}
			</h2>
			</div>
		)
	}
});

module.exports = ErrorView;