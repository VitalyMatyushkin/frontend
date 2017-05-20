var MASK_REGEX = {
		'9': /\d/,
		'A': /[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,
		'*': /[\dA-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/
	},
	MASK_CHARS = Object.keys(MASK_REGEX),
	PTRN_REGEX = new RegExp('[' + MASK_CHARS.join(',') + ']', 'g');

const 	React 		= require('react'),
		Morearty	= require('morearty'),
		ReactDOM 	= require('react-dom');

const MaskedInput = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.init(this.props);
	},
	init:function(props){
		this.mask = {
			props: {
				value: props.value,
				onChange: this._onChange,
				onKeyDown: this._onKeyDown,
				onFocus: this._onFocus,
				onBlur: this._onBlur
			},
			empty: true,
			cursorPrev: 0,
			cursor: 0
		};

		if (props.value && props.mask) {
			this.processValue(props.value)
		}
	},
	componentDidUpdate: function () {
		ReactDOM.findDOMNode(this).setSelectionRange(
			this.mask.cursor,
			this.mask.cursor
		)
	},
	componentWillReceiveProps:function(nextProps){
		this.init(nextProps);
	},

	processValue: function (value) {
		var mask = this.props.mask;
		var pattern = mask.replace(PTRN_REGEX, '_');
		var rexps = {};

		mask.split('').forEach(function (c, i) {
			if (~MASK_CHARS.indexOf(c)) {
				rexps[i + 1] = MASK_REGEX[c]
			}
		});

		var cursorMax = 0;
		var cursorMin = 0;
		var newValue = '';
		var nextChar;
        var tmpCur;

		for (i = 0; i < mask.length; i++) {
			if (~MASK_CHARS.indexOf(mask[i])) {
				cursorMin = i;
				break
			}
		}

		for (var i = 0, j = 0; i < mask.length;) {
			if (!~MASK_CHARS.indexOf(mask[i])) {
				newValue += mask[i];
				if (mask[i] == value[j]) {
					j++
				}
				i++
			} else {
				/* eslint-disable no-cond-assign */
				if ((nextChar = value.substr(j++, 1))) {
				/* eslint-enable no-cond-assign */
					if (rexps[newValue.length + 1].test(nextChar)) {
						newValue += nextChar;
						cursorMax = newValue.length;
                        tmpCur = cursorMax;
						i++
					}
				} else {
					newValue = newValue.substr(0, cursorMax);
					newValue += pattern.slice(cursorMax);
					break
				}
			}
		}

		var cursorPrev = this.mask.cursor;
		var cursorCurr = this.isMounted() ? ReactDOM.findDOMNode(this).selectionStart : 0;
		var removing = this.mask.cursor > cursorCurr;
		cursorMax = Math.max(cursorMax, cursorMin);
		if (cursorCurr <= cursorMin) {
            if(tmpCur === 2){
                cursorCurr = tmpCur
            }else{
                cursorCurr = cursorMin
            }
		} else if (cursorCurr >= cursorMax) {
			cursorCurr = cursorMax
		} else if (removing) {
			for (var i = cursorCurr; i >= 0; i--) {
				cursorCurr = i;
				if (rexps[i] && !rexps[i + 1]) {
					break
				}
				if (rexps[i] && rexps[i + 1] && rexps[i + 1].test(newValue[i])) {
					break
				}
			}
		} else {
			for (var i = cursorCurr; i <= cursorMax; i++) {
				cursorCurr = i;
				if (!rexps[i + 1] && rexps[i]) {
					break
				}
				if (rexps[i + 1] && rexps[i + 1].test(newValue[i])) {
					if (!rexps[i]) {
						cursorCurr++;
					}
					break
				}
			}
		}
		this.mask.empty = cursorMax == cursorMin;
		this.mask.props.value = newValue;
		this.mask.cursor = cursorCurr;
	},

	_onBlur: function (e) {
		if (this.props.mask) {
			var cursor = this.mask.cursor;
			var value = this.mask.props.value;

			if (!this.mask.empty) {
				//this.mask.props.value = value.substr(0, cursor); //wtf?
			} else {
				this.mask.props.value = ''
			}

			this.forceUpdate()
		}
		if (this.props.onBlur) {
			this.props.onBlur(e)
		}
	},

	_onChange: function (e) {
		if (this.props.mask) {
			this.processValue(e.target.value);
			this.forceUpdate()
		}
		if (this.props.onChange) {
            e.target.value = this.mask.props.value;
			this.props.onChange(e)
		}
	},

	_onKeyDown: function (e) {
		if (this.props.mask) {
			this.mask.cursor = ReactDOM.findDOMNode(this).selectionStart
		}
		if (this.props.onKeyDown) {
			this.props.onKeyDown(e)
		}
	},

	_onFocus: function (e) {
		this._onChange(e);
		if (this.props.onFocus) {
			this.props.onFocus(e)
		}
	},
	render: function () {
		//Use placeholder to display old information we already have
		//Easier this way to use the mask to edit or add new data
		return <input type="text" {...this.props} {...this.mask.props} />
	}
});


module.exports = MaskedInput;