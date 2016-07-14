/**
 * Created by bridark on 31/07/15.
 */
const   Immutable 	= require('immutable'),
        React       = require('react'),
        Superuser   = require('module/helpers/superuser'),
        Helpers		= require('module/helpers/storage'),
        Morearty    = require('morearty'),
        Lazy        = require('lazy.js');

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
                currentSchool   = Helpers.LocalStorage.get('activeSchoolData'),
                defaultAlbumId  = currentSchool.defaultAlbumId,
                activeSchoolId  = Helpers.LocalStorage.get('activeSchoolData').id;
       
        rootBinding.set('activeSchoolId',Immutable.fromJS(activeSchoolId));
        //we already have current school data so lets use it - at least for the school details
        binding.set('school', Immutable.fromJS(currentSchool));
		// setting empty photos to show. Will use them in render
		binding.set('___photosToShow', Immutable.fromJS([]));

        if(defaultAlbumId){
            //if we have album id we do some logic here - TBC
            //TODO: Reuse code below when photos method and view has been implemented on server
             window.Server.publicSchoolAlbumPhotos.get({
                 schoolId:  activeSchoolId,
                 albumId:   defaultAlbumId
             })
             .then(photos => {
                 if(photos.length != 0) {
                     binding.set('___photosToShow', Immutable.fromJS(photos.map(photo => photo.picUrl)));
                 } else {
                     binding.set('___photosToShow', Immutable.fromJS(defaultPhotos));
                 }
             });
        } else {
            binding.set('___photosToShow', Immutable.fromJS(defaultPhotos));
        }
    },

    componentDidMount: function(){
        const   self            = this,
                headerSection   = self.refs.schoolMainBanner;

        /** running timer which will switch images in header */
        self.intervalId = setInterval(() => {
            const   photos          = this.getDefaultBinding().get('___photosToShow').toArray() || [],  // there is possibility that on first call binding will be empty
                    randIndexPos    = Math.floor(Math.random() * photos.length);

            if(photos.length !== 0) {
                /* maybe this is not really so bad as it looks like because otherwise React Animation should be used */
                headerSection.src = photos[randIndexPos];
                //console.log('src: ' + headerSection.src);
            }
        },5000);
    },

    componentWillUnmount: function(){
        clearInterval(this.intervalId);
        this.getDefaultBinding().remove('___photosToShow'); // wiping out that shit
    },

    render: function(){
        const   self                = this,
                binding             = self.getDefaultBinding(),
                schoolName          = binding.get('school.name') !== undefined ? binding.get('school.name'):'The peoples School',
                schoolMotto         = binding.get('school.description') !== undefined ? binding.get('school.description') :'Mens Sana in corpore sano - Healthy mind in a healthy body',
                schoolBlazon        = binding.get('school.pic') !== undefined ? binding.get('school.pic'):'http://placehold.it/400x400',
                backgroundImageUrl  = binding.get('school.home') !== undefined ? binding.get('school.home') :'http://www.isparis.edu/uploaded/images/home/sports/slideshow_cover.JPG';
        return(
            <div className="eSchoolHeader">
                <div className="eSchoolMainSlideOutBanner">
                    <img ref="schoolMainBanner" className="transitionImage" src="" />
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