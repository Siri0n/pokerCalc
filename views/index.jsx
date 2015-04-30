var React = require("react");
var Content = require("./isomorphic/content.jsx");

var InitData = React.createClass({
	render: function(){
		return <script dangerouslySetInnerHTML={{__html: "var initData = JSON.parse('" + JSON.stringify(this.props.data) + "');"}}/>
	}
});

var Main = React.createClass({
	render: function() {
		var props = this.props;
		return (
			<html lang="en">
				<head>
					<meta charSet="utf-8"/>
        			<meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        			<link rel="stylesheet" href="css/style.css"></link>
					<script src="http://api-maps.yandex.ru/2.1/?lang=ru_RU&load=Map,Placemark"></script>
					<InitData data={props}/>
					<script src="js/main.js"></script>
					<title>Test</title>
				</head>
				<body>
					<Content {...props}/>
				</body>
			</html>
		);
	}
});
module.exports = Main;