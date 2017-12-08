const	React	= require('react'),
		{SVG}	= require('module/ui/svg');

const ScoreSign = React.createClass({
	propTypes: {
		type:			React.PropTypes.string.isRequired,
		handleClick:	React.PropTypes.func.isRequired
	},
	render: function () {
		const self = this;

		let icon;
		switch (self.props.type){
			case 'minus':
				icon = 'icon_minus';
				break;
			case 'plus':
				icon = 'icon_plus';
				break;
		}

		return (
			<div className="eScore_SignContainer" onClick={self.props.handleClick}>
				<SVG classes="eScore_Sign" icon={icon} />
			</div>
		);
	}
});

module.exports = ScoreSign;