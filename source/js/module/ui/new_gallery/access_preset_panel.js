const	React			= require('react'),

		RadioButton			= require('./../radio_button/radio_button'),
		AccessPresetsConsts	= require('./../../helpers/consts/event_photos');

const AccessPresetPanel = React.createClass({
	propTypes: {
		currentAccessPreset:	React.PropTypes.string.isRequired,
		handleChange:			React.PropTypes.func.isRequired
	},
	isChecked: function(preset) {
		return this.props.currentAccessPreset === preset;
	},

	render: function() {

		return (
			<div className='bPhotoAccessPresetPanel'>
				<h2>Access Presets</h2>
				<RadioButton	text		= { 'Public' }
								isChecked	= { this.isChecked(AccessPresetsConsts.ACCESS_PRESETS_SERVER_VALUE.PUBLIC) }
								onClick		= { this.props.handleChange.bind(null, AccessPresetsConsts.ACCESS_PRESETS_SERVER_VALUE.PUBLIC) }
				/>
				<RadioButton	text		= { 'Private' }
								isChecked	= { this.isChecked(AccessPresetsConsts.ACCESS_PRESETS_SERVER_VALUE.PRIVATE) }
								onClick		= { this.props.handleChange.bind(null, AccessPresetsConsts.ACCESS_PRESETS_SERVER_VALUE.PRIVATE) }
				/>
				<RadioButton	text		= { 'Participant parents' }
								isChecked	= { this.isChecked(AccessPresetsConsts.ACCESS_PRESETS_SERVER_VALUE.PARTICIPANT_PARENTS) }
								onClick		= { this.props.handleChange.bind(null, AccessPresetsConsts.ACCESS_PRESETS_SERVER_VALUE.PARTICIPANT_PARENTS) }
				/>
			</div>
		);
	}
});

module.exports = AccessPresetPanel;
