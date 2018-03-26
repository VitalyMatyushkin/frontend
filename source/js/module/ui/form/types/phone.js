const   TypeMixin   = require('module/ui/form/types/type_mixin'),
	    React       = require('react'),
        Immutable 	= require('immutable'),
		Morearty    = require('morearty'),
		helper		= require('module/helpers/loader_utils'),
		{Dropdown}	= require('module/ui/dropdown/dropdown'),
		{SVG}       = require('module/ui/svg');

const CountryCodeStyle = require('styles/ui/b_country_code.scss');

/**
 * Note:
 * seems like this input is completely broken. It seems like works, but during selenium tests it loses symbols.
 * I think this is because of cursor position manipulations.
 * Anyway I fix selenium-side with `slowTyper` function (yes, it performs input very very gently).
 * But this component should be used with care.
 */

const TypePhone =  React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
    propTypes: {
        id: React.PropTypes.string
    },
    getDefaultState: function() {
        return Immutable.fromJS({
            phone:'',       //input value
            cc:'+44',       //country code
            value:'',       //final value
            defaultValue:'' //initial value
        });
    },
    componentWillMount: function() {
        const self = this,
            binding = self.getDefaultBinding();

        self._forceNewValue(binding.get('defaultValue'));
        self.addBindingListener(binding, 'defaultValue', changes => self._forceNewValue(changes.getCurrentValue()));
        self.addBindingListener(binding, 'value', changes => self.setValue(self.clearPhone(changes.getCurrentValue())));
    },
	componentDidUpdate: function () {
		if(this.cursor >= 0){
			this.refs.input.setSelectionRange(this.cursor,this.cursor);
		}
	},
	_forceNewValue: function(value) {
        const self = this,
            binding = self.getDefaultBinding();
        let cc = '+44',
            phone;

        if(!value)
            return;

        if(value.indexOf('+7') === 0)
            cc = '+7';
        if(value.indexOf('+1') === 0)
			cc = '+1';

        phone = value.replace(cc, '');
        binding.atomically()
            .set('cc', cc)
            .set('phone', phone)
            .commit();

        self.saveValue();
	},
    saveValue:function(){
        const self = this,
            binding = self.getDefaultBinding(),
            cc = binding.get('cc'),
            phone = self.clearPhone(binding.get('phone'));

        self.setValue(cc + phone);
    },
    clearPhone:function(phone) {
		// TODO Do we need remove 0 in US (+1) phone numbers?
		/** remove 0 before phone number */
		if(phone && phone.indexOf('+440') === 0)
			phone = phone.replace('+440', '+44');

		//Stops error being thrown when phone is null and replace method is being invoked
        return phone ? phone.replace(/[^+#\d]/g, ''):'';
    },
    phoneChange: function(e) {
        const self = this,
            binding = self.getDefaultBinding(),
            inputValue = e.target.value;

		this.cursor = e.target.selectionStart;
        binding.set('phone', inputValue);
        self.saveValue();
    },
	handleBlur: function(e) {
		this.cursor = -1;
	},
	getAvailableCodes:function(){
		const codes = ["+44", "+1"];

		if(helper.isDeveloperEnvironment(window.location.hostname)){
			codes.push("+7");
		}

		return codes;
	},
	getCCDropdownElement(code) {
		let flagModifier = '';
		switch (code) {
			case '+7': {
				flagModifier = 'mRus';
				break;
			}
			case '+1': {
				flagModifier = 'mUSA';
				break;
			}
			case '+44': {
				flagModifier = 'mBritish';
				break;
			}
			default: {
				flagModifier = 'mUSA';
				break;
			}
		}

		return (
			<div className='bCountryCode'>
				<div className={'eCountryCode_flag ' + flagModifier}>
				</div>
				<div
					className='eCountryCode_text'
				>
					{code}
				</div>
			</div>
		);
	},
	getExtraStyleForCC() {
		const   self = this,
				binding = self.getDefaultBinding();

		if(binding.toJS('showError')) {
			return 'mBorderRed';
		} else {
			return '';
		}
	},
	getCCDropdownArray() {
		return this.getAvailableCodes().map(code => {
			return {
				id: code,
				element: this.getCCDropdownElement(code)
			}
		});
	},
	handleClickCC(cc) {
		this.getDefaultBinding().set('cc', cc);
		this.saveValue();
	},
	render: function () {
		const   self = this,
                binding = self.getDefaultBinding(),
                cc = binding.get('cc'),
                phone = binding.get('phone');

		return (
			<div className="eForm_fieldInput mPhone">
				<div className='eForm_selectWrapper'>
					<Dropdown
						extraStyle={this.getExtraStyleForCC()}
						selectedItemId={cc}
						items={this.getCCDropdownArray()}
						handleClickItem={cc => this.handleClickCC(cc)}
					/>
				</div>
                <input
	                className={`${cc === '+1' ? 'mUS' : ''}`}
	                ref="input"
	                type="text"
	                id={self.props.id}
	                value={phone}
	                onChange={self.phoneChange}
	                onBlur={self.handleBlur}
	                disabled={!!this.props.isDisabled}
                />
			</div>
		)
	}
});


module.exports = TypePhone;