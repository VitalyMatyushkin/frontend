const	React				= require('react'),

		Consts				= require('./../../consts'),
		MatchReportStyle	= require('../../../../../../../../../../styles/ui/b_match_report.scss');

const EditMode = React.createClass({
	propTypes: {
		header:			React.PropTypes.string.isRequired,
		text:			React.PropTypes.string,
		handleChange:	React.PropTypes.func.isRequired
	},
	handleChange: function(eventDescriptor) {
		this.props.handleChange(eventDescriptor.target.value);
	},
	render: function(){
		return (
			<div className="eMatchReport_textBlock">
				<h3 className="eMatchReport_header">
					{this.props.header}
				</h3>
				<textarea	type		= 'textarea'
							className	= {'eMatchReport_textArea'}
							value		= {this.props.text}
							onChange	= {this.handleChange}
				/>
			</div>
		);
	}
});

module.exports = EditMode;