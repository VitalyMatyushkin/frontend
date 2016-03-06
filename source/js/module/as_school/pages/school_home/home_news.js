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
        const   self            = this,
                binding         = self.getDefaultBinding(),
                rootBinding     = self.getMoreartyContext().getBinding(),
                activeSchoolId  = rootBinding.get('activeSchoolId');

        Superuser.runAsSuperUser(rootBinding, () => {
            window.Server.news.get({schoolId:activeSchoolId, filter:{order:'date DESC',limit:3}}).then((schoolNews) => {
                binding
                    .atomically()
                    .set('schoolNews',Immutable.fromJS(schoolNews))
                    .set('selectedNewsItem',Immutable.fromJS(''))
                    .commit();
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
            return (
                <p>
                    {newsBody.slice(0,100)}
                </p>
            );
        }
    },
    getFullNewsText: function(newsBody) {
        if(newsBody !== undefined){
            return (
                <p>{newsBody}</p>
            );
        }
    },
    _newsItemMoreInfo: function(id) {
        const self = this,
            binding = self.getDefaultBinding(),
            currentNewsId = binding.toJS('selectedNewsItem');

        if(currentNewsId == id) {
            binding.set('selectedNewsItem', Immutable.fromJS(''));
        } else {
            binding.set('selectedNewsItem', Immutable.fromJS(id));
        }
    },
    renderNewsItems:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            news = binding.toJS('schoolNews');
        if(news !== undefined){
            return news.map(function(newsItem, i){
                var classes ="",
                    imgSrc = newsItem.picUrl;

                if(i === 0) {
                    classes = "eSchoolNewsItemLatest";
                }else if(i === 1) {
                    classes ="eSchoolNewsItemLeft";
                }
                else {
                    classes = "eSchoolNewsItemRight";
                }

                let text;

                if(binding.toJS('selectedNewsItem') == newsItem.id) {
                    text = self.getFullNewsText(newsItem.body);
                } else {
                    text = self.getNewsExcerpt(newsItem.body);
                }

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
                                <span className="inlineBlock newsItemExcerpt">{text}</span>
                            </div>
                            <span className="eSchoolNewsMoreInfo" onClick={self._newsItemMoreInfo.bind(self, newsItem.id)}>More Info</span>
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