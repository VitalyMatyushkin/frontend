/**
 * Created by Bright on 22/02/2016.
 */
/**
 * Represents or mimicks a confirm dialog box
 * @Path{bool} confirmed - The returned value of the dialog box true or false
 * @Path{bool} dialogShow - Visibility state of dialog box
 * @Path{Function} callbackFunc - A method to be called after confirm dialog returns true (optional) needs to be implemented and set by dialog owner
 * */
const   React       = require('react'),
        Morearty    = require('morearty');


const ConfirmDialog = React.createClass({
    mixins:[Morearty.Mixin],
    propType:{
        stringContent:React.PropTypes.string.isRequired
    },
    //Handles Yes button - toggles the confirm box to disappear and calls callback function if available.
    _confirmedYes:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('confirmed',true).set('dialogShow',false);
        if(binding.get('callbackFunc')!== undefined && typeof binding.get('callbackFunc')=== 'function'){
            binding.get('callbackFunc').call();
        }
    },
    //Handles No button - toggles the confirm box to disappear
    _exitDialog:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('confirmed',false).set('dialogShow',false);
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            dialogClasses = binding.get('dialogShow')?'bPopup bDialog mAcitve':'bPopup bDialog';
        return (
            <div className={dialogClasses}>
                <div className="bDialog_header"><img src="images/logo.png"/></div>
                <div className="bDialog_content">{self.props.stringContent}</div>
                <div className="bDialog_actions">
                    <div className="bDialog_button button_L">
                        <input className="bButton" type="button" onClick={self._confirmedYes} value="Yes"/>
                    </div>
                    <div className="bDialog_button button_R">
                        <input className="bButton" type="button" onClick={self._exitDialog} value="No"/>
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = ConfirmDialog;