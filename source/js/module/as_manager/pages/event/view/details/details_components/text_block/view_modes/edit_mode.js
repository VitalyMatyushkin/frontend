const	React			= require('react'),

		Consts			= require('./../../consts'),
		DetailsStyle	= require('../../../../../../../../../../styles/ui/b_details.scss');

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
			<div className="eDetails_textBlock">
				<h3 className="eDetails_header">
					{this.props.header}
				</h3>
				<textarea	type		= 'textarea'
							className	= {'eDetails_textArea'}
							value		= {this.props.text}
							onChange	= {this.handleChange}
				/>
			</div>
		);
	}
});

module.exports = EditMode;