/**
 * Created by Woland on 17.04.2017.
 */
const 	React 		= require('react'),
		ScoreSign	= require('./score_sign'),
		TeamHelper  = require('module/ui/managers/helpers/team_helper'),
		ScoreHelper = require('./score_helper'),
		classNames 	= require('classnames'),
		
		ScoreConsts	= require('./score_consts');

const CricketPoint = React.createClass({
	
	propTypes:{
		plainPoints:	React.PropTypes.number.isRequired,
		initialPoints:	React.PropTypes.number.isRequired,
		step:			React.PropTypes.number.isRequired,
		onChange: 		React.PropTypes.func.isRequired,
		modeView:		React.PropTypes.string,
		type:			React.PropTypes.string.isRequired,
		isPlayerScore: 	React.PropTypes.bool
	},
	
	getDefaultProps: function() {
		return {
			modeView: 		ScoreConsts.SCORE_MODES_VIEW.SMALL,
			isPlayerScore: 	false
		};
	},
	
	getInitialState:function(){
		return {
			error:false,
			value:this.props.plainPoints
		};
	},
	
	onClick:function(operation){
		const result = TeamHelper.operationByType(operation, Number(this.props.plainPoints), 'plain', Number(this.props.step));
		
		this.changeScore(result);
	},
	onFocus:function(event){
		const value = Number(event.target.value);
		
		this.setState({
			value: value === 0 ? '' : value // if value===0, then empty value for current mask, else value
		});
		
		event.stopPropagation();
	},
	onChange:function(event){
		this.changeScore(Number(event.target.value));
		
		event.stopPropagation();
	},
	onBlur:function(event){
		const value = Number(event.target.value) || 0;
		
		this.setState({
			value: value
		});
		
		event.stopPropagation();
	},
	/**
	 * Function check input value wickets for team (less 10) and players (0 or 1)
	 * Also function check input value runs for team/player which can not be more 999
	 * @param {number} value
	 * @returns {boolean}
	 */
	checkValue: function(value){
		if (this.props.isPlayerScore === true && this.props.type.toLowerCase() === 'wickets') {
			return (/^[01]{1}$/.test(value) || value === ''); // Player can not have more than 1 wicket (0 or 1 wicket)
		} else if(this.props.isPlayerScore === false && this.props.type.toLowerCase() === 'wickets') {
			return (/^[0-9]{1}$/.test(value) || value === ''); // Team can not have more than 9 wicket
		} else {
			return (/^[0-9.]{1,3}$/.test(value) || value === '');
		}
	},
	changeScore:function(value){
		if(this.checkValue(value)){
			const error = ScoreHelper.pointsPlainValidation(value, Number(this.props.step));
			
			this.setState({
				value: value,
				error: error
			});
			
			let result = !value ? 0 : error ? this.state.value : value;
			//We save score in format {number}: <Runs>999.<Wickets>9 (example 200.5, mean Runs: 200, Wickets: 5)
			//For wickets we add the fractional part to runs
			//For runs we add the whole part to wickets
			if (this.props.type.toLowerCase() === 'wickets') {
				result = result / 10;
				result = result + Number(this.props.initialPoints);
			} else {
				result = result + (Number(this.props.initialPoints) / 10);
			}
			
			this.props.onChange({
				value: result,
				isValid:!error
			});
		}
	},
	
	
	render: function(){
		
		const 	error = !!this.state.error,
				title = error ? this.state.error : null,
				value = this.state.value,

				bScorePointClassNames	= classNames({
					eScore_Points:	true,
					mPlain:			true,
					mMedium:		this.props.modeView === ScoreConsts.SCORE_MODES_VIEW.BIG
				});
		
		return (
			<div className="eScoreCricketPoint">
				<div>{`${this.props.type}:`}</div>
				<ScoreSign type="minus" handleClick={this.onClick.bind(null, 'minus')}/>
				<input	type		= "text"
						className	= {bScorePointClassNames}
						title		= {title}
						value		= {value}
						onChange	= {this.onChange}
						onFocus		= {this.onFocus}
						onBlur		= {this.onBlur}
				/>
				<ScoreSign type="plus" handleClick={this.onClick.bind(null, 'plus')}/>
			</div>
		)
	}
});

module.exports = CricketPoint;