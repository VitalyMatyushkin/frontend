/**
 * Created by bridark on 31/07/15.
 */
const   Immutable 	= require('immutable'),
        React       = require('react'),
        Superuser   = require('module/helpers/superuser'),
        Lazy        = require('lazyjs');

/** Array of default photos to show when there is no photos got from server side for any possible reason */
const defaultPhotos = [
    'http://www.isparis.edu/uploaded/images/home/sports/slideshow_cover.JPG',
    'http://mattjwaller.com/wp-content/uploads/2011/06/Prep-Sport-Football-4.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/3/34/Powder_puff_football.jpg'
];

const HomeHeader = React.createClass({

    mixins:[Morearty.Mixin],

    componentWillMount:function() {
        const   self            = this,
                binding         = self.getDefaultBinding(),
                rootBinding     = self.getMoreartyContext().getBinding(),
                activeSchoolId  = rootBinding.get('activeSchoolId');

        /** pulling photos from school default album */
        window.Server.getThisSchool.get({filter: {
            where: {
                id: activeSchoolId
            }
        }}).then(function(schools){
            const   school          = schools[0], // TODO: remove that SHIT
                    defaultAlbumId  = school.defaultAlbumId;

            binding.set('school',Immutable.fromJS(school));

            if(defaultAlbumId) {
                return Superuser.runAsSuperUser(rootBinding, () => {
                    return window.Server.photos.get(defaultAlbumId, {})
                        .then( photos => {
                            const photosToShow = Lazy(photos).map(photo => window.Server.images.getResizedToHeightUrl(photo.pic, 600)).toArray();
                            if(photosToShow.length != 0) {
                                binding.set('___photosToShow', Immutable.fromJS(photosToShow));
                            } else {
                                binding.set('___photosToShow', Immutable.fromJS(defaultPhotos));
                            }
                        });
                })
            } else {
                binding.set('___photosToShow', Immutable.fromJS(defaultPhotos));    // will show default images if there is no default album found
            }

        });
    },

    componentDidMount:function(){
        const   self            = this,
                headerSection   = self.refs.schoolMainBanner;

        self.intervalId = setInterval(() => {
            const   photos          = this.getDefaultBinding().get('___photosToShow').toArray() || [],  // there is possibility that on first call binding will be empty
                    randIndexPos    = Math.floor(Math.random() * photos.length);

            if(photos.length !== 0) {
                /* maybe this is not really so bad as it looks like because otherwise React Animation should be used */
                headerSection.src = photos[randIndexPos];
                console.log('src: ' + headerSection.src);
            }
        },5000);
    },

    componentWillUnmount:function(){
        clearInterval(this.intervalId);
        this.getDefaultBinding().remove('___photosToShow'); // wiping out that shit
    },

    render:function(){
        const   self                = this,
                binding             = self.getDefaultBinding(),
                schoolName          = binding.get('school.name') !== undefined ? binding.get('school.name'):'The peoples School',
                schoolMotto         = binding.get('school.description') !== undefined ? binding.get('school.description') :'Mens Sana in corpore sano - Healthy mind in a healthy body',
                schoolBlazon        = binding.get('school.pic') !== undefined ? binding.get('school.pic'):'http://placehold.it/400x400',
                backgroundImageUrl  = binding.get('school.home') !== undefined ? binding.get('school.home') :'http://www.isparis.edu/uploaded/images/home/sports/slideshow_cover.JPG';
        return(
            <div className="eSchoolHeader">
                <div className="eSchoolMainSlideOutBanner">
                    <img ref="schoolMainBanner" className="transitionImage" src="http://www.isparis.edu/uploaded/images/home/sports/slideshow_cover.JPG" />
                </div>
                <div className="eSchoolMastHead">
                    <div className="eSchoolMotto">
                        <div className="mottoWrapper">
                            <div className="eSchoolBlazon">
                                <img src={schoolBlazon}/>
                            </div>
                            <div className="eSchoolMottoText">
                                {schoolMotto}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = HomeHeader;