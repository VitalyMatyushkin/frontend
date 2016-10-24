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
		value:		React.PropTypes.number.isRequired,
		step:		React.PropTypes.number.isRequired,
		onChange: 	React.PropTypes.func.isRequired
	},
	getInitialState:function(){
		return {
			error:false,
			value:this.props.value
		};
	},
	onClick:function(operation){
		const result = TeamHelper.operationByType(operation, this.props.value*1, 'plain', this.props.step);

		this.changeScore(result);
	},
	handleChange:function(e){
		this.changeScore(e.target.value);

		e.stopPropagation();
	},
	handleBlur:function(e){
		const 	value = e.target.value,
				error = this.state.error;

		this.setState({
			value: error ? value : value*1,
			error: error
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
					   onChange={this.handleChange}
					   onBlur={this.handleBlur} />
				<ScoreSign type="plus" handleClick={this.onClick.bind(null, 'plus')}/>
			</div>
		);

	}
});


module.exports = PlainPoints;
