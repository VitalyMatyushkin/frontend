/**
 * Created by bright boahen on 03/06/15.
 */
    //TODO: refactor this component
var IndicatorView,
    oldActiveChild,
    selfEl,
    timeoutId;
IndicatorView = React.createClass({
    mixins:[Morearty.Mixin],
    _hasChanged:function(activeId){
        var self = this,
            binding = self.getDefaultBinding();
        if(typeof oldActiveChild === 'undefined'){
            oldActiveChild = activeId; self.progressValue = 0; self.progText = "Loading...";
            selfEl = document.getElementById('progressBarDiv');
            if(selfEl){
                selfEl.style.display = "block";
                self.progText = "Loading...";
            }
            self.timerId = setInterval(function(){
                self.progressValue += 50;
            },800);
        }
        else if(oldActiveChild != activeId){
            clearTimeout(timeoutId);
            self.progressValue = 0;
            selfEl = document.getElementById('progressBarDiv');
            if(selfEl){
                selfEl.style.display = "block";
                self.progText = "Loading...";
            }
            self.timerId = setInterval(function(){
                self.progressValue += 50;
            },800);
            oldActiveChild = activeId;
        }else{
            if(oldActiveChild === activeId && typeof self.progressValue === 'undefined'){
                self.progressValue = 0; self.progText = "Loading...";
                self.timerId = setInterval(function(){
                    self.progressValue += 50;
                },800);
            }
        }
    },
    _removeSelf:function(){

    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        self._hasChanged(self.props.currentChildId);
        if(self.progressValue >=100){
            clearInterval(self.timerId); self.progText = "Complete";
            selfEl = document.getElementById('progressBarDiv');
            timeoutId = setTimeout(function(){
                if(selfEl && self.progressValue >= 100){
                    selfEl.style.display = "none";
                }
            },1000);
        }
        return(
            <div id="progressBar" className="eUserFullInfo_block">
                <span className="bProgressSpan">{self.progText}</span>
                <progress value={self.progressValue} max="100"></progress>
            </div>
        )
    }
});
module.exports = IndicatorView;