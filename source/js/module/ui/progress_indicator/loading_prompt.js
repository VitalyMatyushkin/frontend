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
        reDraw: React.PropTypes.bool.isRequired
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
        var elProgress = React.findDOMNode(self.refs.progressIndicator),
            elText = React.findDOMNode(self.refs.progressText),
            eBar = React.findDOMNode(self.refs.progressBar);
        eBar.style.display = 'block';
        elProgress.value = 0;
        self.intervalId = setInterval(function(){
            elProgress.value += 20;
            if(elProgress.value >= 100){
                elText.innerText = 'Complete';
                setTimeout(function(){eBar.style.display="none";clearInterval(self.intervalId);},800);
            }
        },100);
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        if(self.props.reDraw === true){
            self._animateBar();
        }
        return(
            <div ref="progressBar" className="eUserFullInfo_block">
                <span ref="progressText" className="bProgressSpan">Loading...</span>
                <progress ref="progressIndicator" value={0} max="100"></progress>
            </div>
        )
    }
});
module.exports = IndicatorView;