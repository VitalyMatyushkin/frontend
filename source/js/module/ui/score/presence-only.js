/**
 * Created by vitaly on 26.09.17.
 */

const 	React 		= require('react'),
		ScoreSign	= require('./score_sign'),
		TeamHelper  = require('module/ui/managers/helpers/team_helper'),
		ScoreHelper = require('./score_helper'),
		classNames 	= require('classnames'),

		ScoreConsts	= require('./score_consts');

const PlainPoints = React.createClass({
	propTypes:{
		presence:		React.PropTypes.number,
		onChange: 		React.PropTypes.func.isRequired
	},
	getDefaultProps: function() {
		return {
			modeView: ScoreConsts.SCORE_MODES_VIEW.SMALL
		};
	},
	getInitialState:function(){
		return {
			value: this.props.presence === 1 ? true : false
		};
	},
	onChange:function(e){
		this.changeScore(e.target.checked);

		e.stopPropagation();
	},
	changeScore:function(value){
		this.setState({
			value: value
		});

		this.props.onChange({
			value: value ? 1 : 0,
			isValid: true
		});
	},
	render:function(){
		return (
			<div className="bScore">
				<span>Presence</span>
				<input
					className	= "eCheckbox_switch"
					type		= "checkbox"
					checked		= { this.state.value }
					onChange	= { this.onChange }
				/>
				<label/>
			</div>
		);

	}
});


module.exports = PlainPoints;
