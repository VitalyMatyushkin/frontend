import * as React from 'react';
import * as Morearty from 'morearty';
import * as TypeMixin from 'module/ui/form/types/type_mixin';

import 'styles/ui/b_switch.scss';

interface TypeSwitchProps {
    id: string,
    options: [string, string, string],
    defaultValue: string
}

export const TypeSwitch = (React as any).createClass({
    mixins: [Morearty.Mixin, TypeMixin],
    componentWillMount: function () {
        const binding = this.getDefaultBinding();
        if (typeof this.props.defaultValue !== 'undefined') {
            binding.set('value', this.props.defaultValue);
        }
    },
    handleOptionChange: function (changeEvent) {
        const value = changeEvent.target.value;

        this.setValue(value);
        changeEvent.stopPropagation();
    },
    render: function () {
        const   options         = this.props.options,
                binding	        = this.getDefaultBinding(),
                selectedOption	= binding.get('value');

        /*
            Switch with 3 states
         */
        return (
            <div id={this.props.id} className="bSwitcher">
                {
                    options.map(option => {
                        return (
                            <input
                                type      = "radio"
                                id        = {option+'_'+this.props.id}
                                name      = {option+'_'+this.props.id}
                                value     = {option}
                                checked   = {selectedOption === option}
                                onChange  = {this.handleOptionChange}
                            />
                        );
                    })
                }

                <i></i>
                {
                    options.map(option => {
                        return (
                            <label htmlFor={option}>{option}</label>
                        );
                    })
                }
            </div>
        )
    }
});