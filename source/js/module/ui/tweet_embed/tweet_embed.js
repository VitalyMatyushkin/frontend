const React = require('react');

function sendGetRequestToHttpUrl(url) {
	
	return new Promise( function(resolve, reject)  {
		
		const xhr = new XMLHttpRequest();
		
		xhr.open('GET', `https://publish.twitter.com/oembed?url=${url}`, true);
		xhr.onload = function() {
			if (this.status === 200) {
				resolve(this.response);
			} else {
				const error = new Error(this.statusText);
				error.code = this.status;
				error.response = this.response;
				reject(error);
			}
		};
		
		xhr.onerror = function() {
			reject(new Error("Network Error"));
		};
		
		xhr.send();
	});
}

const Component = React.createClass({
	propTypes: {
		link: React.PropTypes.string.isRequired
	},
	componentWillMount: function(){
		sendGetRequestToHttpUrl(this.props.link).then(response => {
			console.log('===================================');
			console.log(response);
			console.log('===================================');
		});
		
		
	},
	render: function(){
		return <h1>Hello world</h1>
	}
});

module.exports = Component;