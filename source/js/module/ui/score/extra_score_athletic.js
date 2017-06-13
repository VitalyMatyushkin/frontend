/**
 * Created by Woland on 01.06.2017.
 */
const 	React 		= require('react'),
		ScoreSign	= require('./score_sign'),
		TeamHelper  = require('module/ui/managers/helpers/team_helper'),
		ScoreHelper = require('./score_helper'),
		classNames 	= require('classnames'),
	
		ScoreConsts	= require('./score_consts');

const AthleticExtraScore = React.createClass({
	
	propTypes: {
		extraScore: 				React.PropTypes.number.isRequired,
		onChangeScoreAthletic: 		React.PropTypes.func.isRequired,
		modeView: 					React.PropTypes.string.isRequired
	},
	
	getInitialState: function(){
		return {
			value: this.props.extraScore
		}
	},
	
	onClick:function(operation){
		const result = TeamHelper.operationByType(operation, Number(this.state.value), 'plain', 1);
		
		this.changeScore(result);
	},
	
	onChange:function(event){
		this.changeScore(Number(event.target.value));
		
		event.stopPropagation();
	},
	
	checkValue: function(value){
		return (/^[0-9]{1}$/.test(value) || value === '');
	},
	
	changeScore: function(result){
		if (this.checkValue(result)){
			this.setState({value: result});
			this.props.onChangeScoreAthletic(result);
		}
	},
	
	onFocus:function(event){
		const value = Number(event.target.value);
		
		this.setState({
			value: value === 0 ? '' : value // if value===0, then empty value for current mask, else value
		});
		
		event.stopPropagation();
	},
	
	onBlur:function(event){
		const value = Number(event.target.value) || 0;
		
		this.changeScore(value);
		
		event.stopPropagation();
	},
	
	render: function(){
		
		const bScorePointClassNames	= classNames({
			eScore_Points:	true,
			mPlain:			true,
			mMedium:		this.props.modeView === ScoreConsts.SCORE_MODES_VIEW.BIG
		});
		
		return (
			<div>
				<ScoreSign type="minus" handleClick={this.onClick.bind(null, 'minus')}/>
				<input	type		= "text"
						className	= { bScorePointClassNames }
						value		= { this.props.extraScore }
						onChange	= { this.onChange }
						onFocus		= { this.onFocus }
						onBlur		= { this.onBlur }
				/>
				<ScoreSign type="plus" handleClick={this.onClick.bind(null, 'plus')}/>
			</div>
		)
	}
});

module.exports = AthleticExtraScore;