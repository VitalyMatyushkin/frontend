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
    propTypes:{
        reDraw: React.PropTypes.bool
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
    },
    componentDidMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        self._animateBar();
    },
    _animateBar:function(){
        var self = this,
            binding = self.getDefaultBinding();
        var elProgress = ReactDOM.findDOMNode(self.refs.progressIndicator),
            elText = ReactDOM.findDOMNode(self.refs.progressText),
            eBar = ReactDOM.findDOMNode(self.refs.progressBar);
        if(eBar !== null){
            eBar.style.display = 'block';
            elProgress.value = 0;
            self.intervalId = setInterval(function(){
                elProgress.value += 20;
                if(elProgress.value >= 100){
                    elText.innerText = 'Complete';
                    setTimeout(function(){eBar.style.display="none";clearInterval(self.intervalId);},800);
                }
            },100);
        }
    },
    componentDidUpdate:function(){
        var self = this;
        if(self.props.reDraw === true){
            self._animateBar();
        }
    },
    render:function(){
        return(
            <div ref="progressBar" className="eUserFullInfo_block">
                <span ref="progressText" className="bProgressSpan">Loading...</span>
                <progress ref="progressIndicator" value={0} max="100"/>
            </div>
        )
    }
});
module.exports = IndicatorView;