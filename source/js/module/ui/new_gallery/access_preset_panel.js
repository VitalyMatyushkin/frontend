const	React			= require('react'),

		RadioButton		= require('./../radio_button/radio_button');

const AccessPresetPanel = React.createClass({
	propTypes: {
		currentAccessPreset:	React.PropTypes.string.isRequired,
		accessPresetList:		React.PropTypes.object.isRequired,
		handleChange:			React.PropTypes.func.isRequired
	},
	isChecked: function(preset) {
		return this.props.currentAccessPreset === preset;
	},
	renderList: function() {
		const list = [];

		for(let accessPreset in this.props.accessPresetList) {
			list.push(
				<RadioButton	text		= { this.props.accessPresetList[accessPreset] }
								isChecked	= { this.isChecked(accessPreset) }
								onClick		= { this.props.handleChange.bind(null, accessPreset) }
				/>
			);
		}

		return list;
	},
	render: function() {

		return (
			<div className='bPhotoAccessPresetPanel'>
				<h2> Access Presets </h2>
				{ this.renderList() }
			</div>
		);
	}
});

module.exports = AccessPresetPanel;
