/**
 * Created by Bright on 17/02/2016.
 */
const   TypeMixin = require('module/ui/form/types/type_mixin'),
        className = require('classnames'),
        Immutable = require('immutable'),
        React = require('react');

const TermsCheckbox = React.createClass({
    mixins:[Morearty.Mixin, TypeMixin],
    getDefaultState:function(){
        //Setting up data structure to store all possible checkboxes, supposing all boxes are relevant
        return Immutable.fromJS({
            termsState:{
                Terms:false,
                newsletter:false,
                promotionalOffers:false
            }
        });
    },
    _checkBoxClicked:function(event){
        var self = this,
            binding = self.getDefaultBinding();
        //Sets the boolean value of one of the keys to the current checkbox's checked attribute
        binding.sub('termsState')
            .atomically()
            .set(event.currentTarget.value,event.currentTarget.checked)
            .commit();
        self.setValue(binding.sub('termsState').toJS());//Set value for validation
    },
    render:function(){
        var self = this;
        return (
            <div>
                <div>
                    <input name="Terms" type="checkbox" value="Terms" onClick={self._checkBoxClicked}/>
                    <label style={{fontSize:12+'px'}} htmlFor="Terms">I have read and agree to the <a href="/#register">Privacy Policy and Terms and Conditions</a></label>
                </div>
                <div>
                    <input name="newsletter" type="checkbox" value="newsletter" onClick={self._checkBoxClicked}/>
                    <label style={{fontSize:12+'px'}} htmlFor="newsletter">I agree to receive emails such as relevant news, updates and offers from SquadInTouch Limited (trading as SquadInTouch.com)</label>
                </div>
                <div>
                    <input name="promotionalOffers" type="checkbox" value="promotionalOffers" onClick={self._checkBoxClicked}/>
                    <label style={{fontSize:12+'px'}} htmlFor="promotionalOffers">I agree to receive emails such as promotional offers from carefully selected third parties companies</label>
                </div>
            </div>
        )
    }
});
module.exports = TermsCheckbox;