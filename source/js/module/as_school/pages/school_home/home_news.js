/**
 * Created by bridark on 03/08/15.
 */
const   React           = require('react'),
        Immutable 	    = require('immutable'),
        DateTimeMixin   = require('module/mixins/datetime'),
        Superuser       = require('module/helpers/superuser');

const HomeNews = React.createClass({
    mixins:[Morearty.Mixin,DateTimeMixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('activeSchoolId');

        Superuser.runAsSuperUser(rootBinding, function(logout) {
            window.Server.news.get({schoolId:activeSchoolId, filter:{order:'date DESC',limit:3}}).then(function(schoolNews){
                binding.set('schoolNews',Immutable.fromJS(schoolNews));
                logout();
            });
        });
    },
    //Temporarily remove img from news body
    getNewsDate:function(news){
        var self = this;
        if(news !== undefined){
            return (
                <div>
                    <span className="eSchoolNewsDateText">{self.getDateFromIso(news.date)}</span>
                    <span className="eSchoolNewsDateText">{self.getTimeFromIso(news.date)}</span>
                </div>
            )
        }
    },
    getNewsExcerpt:function(newsBody){
        if(newsBody !== undefined){
            return `<p>${newsBody.slice(0,50)}</p>`;
        }
    },
    renderNewsItems:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            news = binding.toJS('schoolNews');
        if(news !== undefined){
            return news.map(function(newsItem, i){
                var classes ="",
                    imgSrc = "";
                if( i === 0){
                    classes = "eSchoolNewsItemLatest";
                    imgSrc = "http://i2.cdn.turner.com/cnnnext/dam/assets/130418171917-indian-football-1-horizontal-large-gallery.jpg";

                }else if(i===1){
                    classes ="eSchoolNewsItemLeft";
                    imgSrc = "http://i.telegraph.co.uk/multimedia/archive/02828/mf-rugbyschools0_2828544b.jpg";
                }
                else{classes = "eSchoolNewsItemRight";imgSrc = "http://www.education.vic.gov.au/PublishingImages/about/awards/schoolsport.jpg";}
                return(
                    <div key={newsItem.id} className={classes}>
                        <span className="eSchoolNewsImage">
                                <img src={imgSrc}/>
                        </span>
                        <div className="eSchoolNewsItemDescription">
                            <div className="eSchoolNewsItemInfo">
                                <h1 className="inlineBlock newsItemTitle">{newsItem.title}</h1>
                                <div className="eSchoolNewsItemDate">
                                    {self.getNewsDate(newsItem)}
                                </div><hr/>
                                <span className="inlineBlock newsItemExcerpt">{self.getNewsExcerpt(newsItem.body)}</span>
                            </div>
                            <span className="eSchoolNewsMoreInfo">More Info</span>
                        </div>
                    </div>
                )
            });
        }
    },
    render:function(){
        var self = this,
            news = self.renderNewsItems();

        //self.renderNewsItems();

        return (
            <div className="eSchoolNewsContainer">
                <div className="eSchoolFixtureTab eNews_tab">
                    <h1>News</h1><hr/>
                    <span></span>
                </div>
                <div className="eSchoolNewsItems">
                    {news}
                </div>
            </div>
        );
    }
});
module.exports = HomeNews;