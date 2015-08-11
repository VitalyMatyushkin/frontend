/**
 * Created by bridark on 03/08/15.
 */
var HomeNews,
    DateTimeMixin = require('module/mixins/datetime');
HomeNews = React.createClass({
    mixins:[Morearty.Mixin,DateTimeMixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('activeSchoolId'); //console.log(activeSchoolId);
        window.Server.news.get({schoolId:activeSchoolId, filter:{order:'date DESC',limit:3}}).then(function(schoolNews){
            binding.set('schoolNews',Immutable.fromJS(schoolNews));
            //console.log(schoolNews);
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
            var tmpStr = newsBody.split('<p>')[2];
            return tmpStr.split('</p>')[0].slice(0,50)+'...';
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
                            <div className="eSchoolNewsItemDate">
                                {self.getNewsDate(newsItem)}
                            </div>
                            <div className="eSchoolNewsItemInfo">
                                <span className="inlineBlock newsItemTitle">{newsItem.title}</span>
                                <span className="inlineBlock newsItemExcerpt">{self.getNewsExcerpt(newsItem.body)}</span>
                            </div>
                        </div>
                    </div>
                )
            });
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            news = self.renderNewsItems();
        //console.log(binding.toJS());
        //self.renderNewsItems();
        return (
            <div className="eSchoolNewsContainer">
                <div className="eSchoolFixtureTab eNews_tab">
                    <i>News</i>
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