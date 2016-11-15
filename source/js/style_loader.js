/**
 * Created by wert on 15.11.16.
 */

/* Preloading styles here as migration for every component is quite slow - will do it step by step */

const 	resetStyle		= require('../styles/reset.scss'),
		veryBasicStyle	= require('../styles/style.scss');

// main styles
const 	bIcon		= require('../styles/main/b_icon.scss'),
		bLink		= require('../styles/main/b_link.scss'),
		bMainLayout	= require('../styles/main/b_main_layout.scss'),
		bPageIn		= require('../styles/main/b_page_in.scss'),
		bPanel		= require('../styles/main/b_panel.scss'),
		bRoles		= require('../styles/main/b_roles.scss'),
		bSiteWrap 	= require('../styles/main/b_site_wrap.scss'),
		bSubMenu	= require('../styles/main/b_sub_menu.scss'),
		bTopLogo	= require('../styles/main/b_top_logo.scss'),
		bTopMenu	= require('../styles/main/b_top_menu.scss'),
		bTopPanel	= require('../styles/main/b_top_panel.scss');


const 	bsEventResultView	= require('../styles/ui/bid_screen_fixtures/bBigEventResultView.scss'),
		bsBigScreen			= require('../styles/ui/bid_screen_fixtures/bBigScreen.scss'),
		bsFixtures			= require('../styles/ui/bid_screen_fixtures/bBigScreenFixtures.scss'),
		bsTitle				= require('../styles/ui/bid_screen_fixtures/bBigScreenTitle.scss'),
		bsEventHighlight	= require('../styles/ui/bid_screen_fixtures/bEventHighlight.scss'),
		bsResultFooter		= require('../styles/ui/bid_screen_fixtures/bEventResultFooter.scss'),
		bsResultView		= require('../styles/ui/bid_screen_fixtures/bEventResultView.scss'),
		bsFixtureItem		= require('../styles/ui/bid_screen_fixtures/bFixtureItem.scss'),
		bsFooter			= require('../styles/ui/bid_screen_fixtures/bFooter.scss'),
		bsHighlightPhotos	= require('../styles/ui/bid_screen_fixtures/bHighlightsPhoto.scss'),
		bsRecentEvents		= require('../styles/ui/bid_screen_fixtures/bRecentEvents.scss'),
		bsUpcomingEvents	= require('../styles/ui/bid_screen_fixtures/bUpcomingEvents.scss'),
		bsUpcomingEventView	= require('../styles/ui/bid_screen_fixtures/bUpcomingEventView.scss');

const bigButton = require('../styles/ui/big_button/big_button.scss');
const calendar = require('../styles/ui/calendar/calendar.scss');
const confirmPopup = require('../styles/ui/confirm_popup/confirm_popup.scss');

const 	form			= require('../styles/ui/forms/b_form.scss'),
		formPageMessage	= require('../styles/ui/forms/b_page_message.scss'),
		formPanel		= require('../styles/ui/forms/b_panel.scss');

const	galleryAddPhotoButton	= require('../styles/ui/gallery/b_add_photo_button.scss'),
		galleryFullscreenPhoto	= require('../styles/ui/gallery/b_fullscreen_photo.scss'),
		galleryGallery			= require('../styles/ui/gallery/b_gallery.scss'),
		galleryPhotoAccess		= require('../styles/ui/gallery/b_photo_access_preset_panel.scss'),
		galleryPhotos			= require('../styles/ui/gallery/b_photos.scss'),
		galleryPreviewPhoto		= require('../styles/ui/gallery/b_preview_photo.scss');

const	gridActionPanel	= require('../styles/ui/grid/action-panel.scss'),
		gridFilterPanel	= require('../styles/ui/grid/filter-panel.scss'),
		gridGrid		= require('../styles/ui/grid/grid.scss'),
		grigPagination	= require('../styles/ui/grid/pagination.scss');