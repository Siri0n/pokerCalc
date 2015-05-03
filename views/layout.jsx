var React = require("react");

var InitData = React.createClass({
	render: function(){
		return <script dangerouslySetInnerHTML={{__html: "var initData = JSON.parse('" + JSON.stringify(this.props.data) + "');"}}/>
	}
});

var Layout = React.createClass({
	render: function() {
		var Content = require(this.props.content);
		return (
			<html lang="en">
				<head>
					<meta charSet="utf-8"/>
        			<meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        			<link rel="stylesheet" href="css/style.css"></link>
        			{this.props.styles.map(function(path){
        				return <link rel="stylesheet" href={path}/>
        			})}
        			<InitData data={this.props.data}/>
        			{this.props.scripts.map(function(path){
        				return <script type="text/javascript" src={path}/>
        			})}
					<title>Test</title>
				</head>
				<body>
					<Content {...this.props.data}/>
				</body>
			</html>
		);
	}
});
module.exports = Layout;