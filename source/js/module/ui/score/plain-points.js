/**
 * Created by Anatoly on 19.10.2016.
 */

const 	React 		= require('react'),
		ScoreSign	= require('./score_sign'),
		TeamHelper  = require('module/ui/managers/helpers/team_helper'),
		ScoreHelper = require('./score_helper'),
		classNames 	= require('classnames');

const PlainPoints = React.createClass({
	propTypes:{
		plainPoints:	React.PropTypes.number.isRequired,
		step:			React.PropTypes.number.isRequired,
		onChange: 		React.PropTypes.func.isRequired
	},
	getInitialState:function(){
		return {
			error:false,
			value:this.props.plainPoints
		};
	},
	onClick:function(operation){
		const result = TeamHelper.operationByType(operation, this.props.plainPoints*1, 'plain', this.props.step);

		this.changeScore(result);
	},
	onFocus:function(e){
		const 	value = e.target.value*1;

		this.setState({
			value: value === 0 ? '' : value // if value===0, then empty value for current mask, else value
		});

		e.stopPropagation();
	},
	onChange:function(e){
		this.changeScore(e.target.value);

		e.stopPropagation();
	},
	onBlur:function(e){
		const 	value = e.target.value || 0,
				error = this.state.error;

		this.setState({
			value: error ? value : value*1
		});

		e.stopPropagation();
	},
	changeScore:function(value){
		if(/^[0-9.]+$/.test(value)){
			const validationResult = ScoreHelper.pointsPlainValidation(value, this.props.step);

			this.setState({
				value: value,
				error: validationResult
			});

			this.props.onChange({
									value: validationResult ? this.state.value*1 : value*1,
									isValid:!validationResult
								});
		}
	},
	render:function(){
		const 	error 	= !!this.state.error,
				title 	= error ? this.state.error : null,
				value 	= this.state.value,
				classes = classNames({
										bScore: true,
										mError: error
									});

		return (
			<div className={classes}>
				<ScoreSign type="minus" handleClick={this.onClick.bind(null, 'minus')}/>
				<input type="text"
					   className="eScore_Points"
					   title={title}
					   value={value}
					   onChange={this.onChange}
					   onFocus={this.onFocus}
					   onBlur={this.onBlur} />
				<ScoreSign type="plus" handleClick={this.onClick.bind(null, 'plus')}/>
			</div>
		);

	}
});


module.exports = PlainPoints;
