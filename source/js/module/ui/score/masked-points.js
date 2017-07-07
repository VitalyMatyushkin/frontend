/**
 * Created by Anatoly on 24.10.2016.
 */

const 	React 		= require('react'),
		MaskedInput	= require('module/ui/masked_input'),
		classNames 	= require('classnames'),

		ScoreConsts	= require('./score_consts');

const MaskedPoints = React.createClass({
	propTypes:{
		plainPoints:	React.PropTypes.number.isRequired,
		value:			React.PropTypes.string,
		mask:			React.PropTypes.string.isRequired,
		onChange: 		React.PropTypes.func.isRequired,
		/**
		 * Convert string value to points according to the mask.
		 * @param {string} value - string masked value
		 * @param {string} mask - points.inputMask
		 * @returns {number} - count of points
		 */
		stringToPoints: React.PropTypes.func.isRequired,
		/**
		 * Validation string value according to 'distance' or 'time' type
		 * @param {string} value - value to validation
		 * @param {string} mask - points.inputMask
		 * @returns {boolean/string} - false or error message
		 */
		validation:		React.PropTypes.func.isRequired,
		modeView:		React.PropTypes.string
	},
	getDefaultProps: function() {
		return {
			modeView: ScoreConsts.SCORE_MODES_VIEW.SMALL
		};
	},
	getInitialState:function(){
		return {
			error: 			false,
			stringValue: 	typeof this.props.value !== 'undefined' ? this.props.value : ''	//string value from component MaskedInput
		};
	},
	componentWillMount:function(){
		this.setMask(this.props.mask);
	},
	componentWillReceiveProps: function(nextProps){
		if(nextProps.mask !== this.props.mask)
			this.setMask(nextProps.mask);
	},
	setMask:function(mask){
		this.setState({
			mask: 			mask.replace(/[hkmsc]/g, '9'), 	// mask in format '999:999:999'
			emptyValue: 	mask.replace(/[hkmsc]/g, '_')	// empty value for current mask
		});
	},
	onChange:function(e){
		this.changeScore(e.target.value);

		e.stopPropagation();
	},
	onBlur:function(e){
		const 	value = e.target.value;

		this.setState({
			stringValue: value === this.state.emptyValue ? '' : value // if empty value for current mask, then 0, else value
		});

		e.stopPropagation();
	},
	onFocus:function(e){
		const 	value = this.state.stringValue;

		this.setState({
			stringValue: value === 0 ? this.state.emptyValue : value // if value===0, then empty value for current mask, else value
		});

		e.stopPropagation();
	},
	changeScore:function(strValue){
		const 	isEmpty = strValue === this.state.emptyValue,
				error = !isEmpty && this.props.validation(strValue, this.props.mask),
				points = error || isEmpty ? this.props.plainPoints : this.props.stringToPoints(strValue, this.props.mask);

		this.setState({
			stringValue: strValue,
			error: error
		});

		const result = {
			value: points,
			isValid:!error
		};
		// save changes to events
		this.props.onChange(result);
	},
	render:function(){
		const 	error 	= !!this.state.error,
				title 	= error ? this.state.error : null,
				mask 	= this.state.mask,
				classes = classNames({
					bScore: true,
					mError: error
				});

		return (
			<div className={classes}>
				<MaskedInput
					title		= {title}
					value		= {this.state.stringValue}
					className	= {`eScore_Points ${this.props.className}`}
					mask		= {mask}
					placeholder	= {this.props.mask}
					onChange	= {this.onChange}
					onBlur		= {this.onBlur}
					onFocus		= {this.onFocus} />
			</div>
		);

	}
});


module.exports = MaskedPoints;
