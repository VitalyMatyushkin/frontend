/**
 * Created by Anatoly on 19.10.2016.
 */

const 	React 		= require('react'),
		ScoreSign	= require('./score_sign'),
		TeamHelper  = require('module/ui/managers/helpers/team_helper'),
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
	onChange:function(e){
		this.changeScore(e.target.value);

		e.stopPropagation();
	},
	changeScore:function(value){
		if(!isNaN(parseFloat(value)) && isFinite(value)){
			value = value * 1;
			const validationResult = TeamHelper.pointsPlainValidation(value, this.props.step);

			this.setState({
				value: value,
				error: validationResult
			});

			if(!validationResult)
				this.props.onChange(value);
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
					   onBlur={this.onBlur} />
				<ScoreSign type="plus" handleClick={this.onClick.bind(null, 'plus')}/>
			</div>
		);

	}
});


module.exports = PlainPoints;
