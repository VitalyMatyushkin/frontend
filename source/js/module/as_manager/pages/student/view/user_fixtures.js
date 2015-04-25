/**
 * Created by bridark on 25/04/15.
 */
var UserFixtures,
    fixData;
UserFixtures = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes: {
        title: React.PropTypes.string
    },
    componentDidMount:function(){
        var self = this,
            fixtureBinding = self.getMoreartyContext().getBinding(),
            studentId = fixtureBinding.get('routing.parameters.id');
        Server.events.get(studentId)
            .then(function(eventsData){
                fixData = eventsData;
                });
    },
    _getFixtureData:function(fixtureData){
        var tempAr = [];
        if(fixtureData){
            for(var i=0; i<fixtureData.length;i++){
                tempAr.push(
                    <div className="eUserFullInfo_text bLinkLike">
                    <div className="eUserFullInfo_date">{fixtureData[i].startRegistrationTime}</div>
                    {fixtureData[i].name} <div>Type: {fixtureData[i].gameType}</div></div>
                );
            }
        }
        return tempAr;
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            fixtureNodes = [];
        fixtureNodes = self._getFixtureData(fixData);
        return (
            <div className="bUserFullInfo">
                <div className="eUserFullInfo_block">
                    <div className="eUserFullInfo_name bLinkLike">Fixtures:</div>
                    {fixtureNodes}
                </div>
            </div>
        )
    }
});
module.exports = UserFixtures;