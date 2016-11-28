const	React			= require('react'),

		DetailsStyle	= require('../../../../../../../../../../styles/ui/b_details.scss');

const ViewMode = React.createClass({
	propTypes: {
		header:	React.PropTypes.string.isRequired,
		text:	React.PropTypes.string
	},
	render: function(){
		return (
			<div className="eDetails_textBlock">
				<h3 className="eDetails_header">
					{this.props.header}
				</h3>
				<div className="eMatchReport_body">

				</div>
				{this.props.text}
			</div>
		);
	}
});

module.exports = ViewMode;