/**
 * Created by Anatoly on 24.10.2016.
 */

const 	React 		= require('react'),
		ScoreHelper = require('./score_helper'),
		MaskedInput = require('module/ui/masked_input'),
		classNames 	= require('classnames');

const DistancePoints = React.createClass({
	propTypes:{
		value:		React.PropTypes.number.isRequired,
		mask:		React.PropTypes.string.isRequired,
		onChange: 	React.PropTypes.func.isRequired
	},
	getInitialState:function(){
		return {
			error:false,
			stringValue:this.props.value === 0 ? 0 : ScoreHelper.pointsToStringDistance(this.props.value, this.props.mask)
		};
	},
	handleChange:function(e){
		this.changeScore(e.target.value);

		e.stopPropagation();
	},
	handleBlur:function(e){
		const 	value = e.target.value,
				error = this.state.error;

		this.setState({
			stringValue: value === this.emptyMask ? 0 : value,
			error: error
		});

		e.stopPropagation();
	},
	handleFocus:function(e){
		const 	value = this.state.stringValue,
				error = this.state.error;

		this.setState({
			stringValue: value === 0 ? this.emptyMask : value,
			error: error
		});

		e.stopPropagation();
	},
	changeScore:function(strValue){
		const validationResult = ScoreHelper.stringDistanceValidation(strValue, this.props.mask),
			points = validationResult ? this.props.value : ScoreHelper.stringDistanceToPoints(strValue, this.props.mask);

		this.setState({
			stringValue: strValue,
			error: validationResult
		});

		this.props.onChange({
								value: points,
								isValid:!validationResult
							});
	},
	getMask:function(mask){
		if(this.mask !== mask){
			this.mask = mask;
			this.defaultMask = mask.replace(/[kmc]/g, '9');
			this.emptyMask = mask.replace(/[kmc]/g, '_');
		}
		return this.defaultMask;
	},
	render:function(){
		const 	error 	= !!this.state.error,
				title 	= error ? this.state.error : null,
				value 	= this.state.stringValue,
				mask = this.getMask(this.props.mask),
				classes = classNames({
										bScore: true,
										mError: error
									});

		return (
			<div className={classes}>
				<MaskedInput title={title} value={value} className="eScore_Points mDistance" mask={mask}
							 onChange={this.handleChange}
							 onBlur={this.handleBlur}
							 onFocus={this.handleFocus} />
			</div>
		);

	}
});


module.exports = DistancePoints;
