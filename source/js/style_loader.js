/**
 * Created by wert on 15.11.16.
 */

/**
 * Actually styles should be `require`d in component where they are used. But we have a lot of components and
 * patching each is quite long task. So I made this file which preload all styles by `require`-ing them.
 * I believe some day we will drop that file.
 */

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


// ui styles
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

const lists = require('../styles/ui/lists/b_data_list.scss');

const 	managerGameField		= require('../styles/ui/mangers/b_game_filed.scss'),
		managerPlayerChooser	= require('../styles/ui/mangers/b_player_chooser.scss'),
		managerTeam				= require('../styles/ui/mangers/b_team.scss'),
		managerTeamAutocomplete	= require('../styles/ui/mangers/b_team_autocomplete.scss'),
		managerTeamChooser		= require('../styles/ui/mangers/b_team_chooser.scss'),
		managerTeamName			= require('../styles/ui/mangers/b_team_name.scss'),
		managerFootball			= require('../styles/ui/mangers/football.scss'),
		managerManager			= require('../styles/ui/mangers/manager.scss');

const multiselect = require('../styles/ui/multiselect/multiselect.scss');
const newPopup = require('../styles/ui/new_popup/new_popup.scss');

const	popupPopup	= require('../styles/ui/popup/b_popup.scss'),
		popupBack	= require('../styles/ui/popup/b_popup_back.scss');

const popupMessage	= require('../styles/ui/popup_message/b_popup_message.scss');
const trainingSlider	= require('../styles/ui/b_training_slider.scss');
const publicSchoolLogin = require('../styles/ui/publicSchoolLogin/public_school_login.scss');
const radioButton = require('../styles/ui/radio_button/radio_button.scss');
const savingPlayerChanges = require('../styles/ui/saving_player_changes_mode_panel/saving_player_changes_mode_panel.scss');
const score = require('../styles/ui/score/score.scss');

const 	starRatingStar	= require('../styles/ui/star_rating_bar/b_rating_star.scss'),
		starRatingBar	= require('../styles/ui/star_rating_bar/b_star_rating_bar.scss');


const 	adminButtons	= require('../styles/ui/admin_buttons.scss'),
		adminDroplist	= require('../styles/ui/admin_droplist.scss'),
		avatar			= require('../styles/ui/avatar.scss'),
		the404			= require('../styles/ui/b404.scss'),
		autocomplete	= require('../styles/ui/b_autocomplete.scss'),
		bigCalendar		= require('../styles/ui/b_big_calendar.scss'),
		button			= require('../styles/ui/b_button.scss'),
		colorSelect		= require('../styles/ui/b_colors_select.scss'),
		radioGroup		= require('../styles/ui/b_radio_group.scss'),
		stepDescription	= require('../styles/ui/b_step_description.scss'),
		stepProgress	= require('../styles/ui/b_step_progress.scss'),
		tabs			= require('../styles/ui/b_tabs.scss'),
		timepicker		= require('../styles/ui/b_timepicker.scss'),
		tooltip			= require('../styles/ui/b_tooltip.scss'),
		fulltimeInput	= require('../styles/ui/bFullTimeInput.scss'),
		smalltimeInput	= require('../styles/ui/bSmallTimeInput.scss'),
		colorPicker		= require('../styles/ui/color_picker.scss'),
		loader			= require('../styles/ui/loader.scss'),
		simpleAlert		= require('../styles/ui/simple_alert.scss');


// pages styles

const 	albumAlbum			= require('../styles/pages/album/b_album.scss'),
		albumFullscreenList	= require('../styles/pages/album/b_album_fullscreen_list.scss'),
		albumPhoto			= require('../styles/pages/album/b_album_photo.scss');

const 	eventEvent		= require('../styles/pages/event/b_event.scss'),
		eventAlbums		= require('../styles/pages/event/b_event_albums.scss'),
		eventButtons	= require('../styles/pages/event/b_event_buttons.scss'),
		eventDetails	= require('../styles/pages/event/b_event_details.scss'),
		eventHeader		= require('../styles/pages/event/b_event_header.scss'),
		eventInfo		= require('../styles/pages/event/b_event_info.scss'),
		eventMenu		= require('../styles/pages/event/b_event_menu.scss'),
		eventMiddleSide	= require('../styles/pages/event/b_event_middle_side_container.scss'),
		eventResult		= require('../styles/pages/event/b_event_result.scss'),
		eventRivals		= require('../styles/pages/event/b_event_rivals.scss'),
		eventSport		= require('../styles/pages/event/b_event_sport.scss'),
		eventTeam		= require('../styles/pages/event/b_team.scss');

const	eventsChallenge		= require('../styles/pages/events/b_challenge.scss'),
		eventsChallengeDate	= require('../styles/pages/events/b_challenge_date.scss'),
		eventsEvent			= require('../styles/pages/events/b_event.scss'),
		eventsEvents		= require('../styles/pages/events/b_events.scss'),
		eventsCalendar		= require('../styles/pages/events/b_events_calendar.scss'),
		eventsManager		= require('../styles/pages/events/b_events_manager.scss'),
		eventsInvite		= require('../styles/pages/events/b_invite.scss'),
		eventsInvites		= require('../styles/pages/events/b_invites.scss'),
		eventsPlayer		= require('../styles/pages/events/b_player.scss'),
		eventsTextBox		= require('../styles/pages/events/b_saving_changes_text_block.scss'),
		eventsTeamViewer	= require('../styles/pages/events/b_team_viewer.scss'),
		eventsTeamWrapper	= require('../styles/pages/events/b_team_wrapper.scss'),
		eventsTeams			= require('../styles/pages/events/b_teams.scss'),
		eventsTeamsTable	= require('../styles/pages/events/b_teams_table.scss'),
		eventsVenue			= require('../styles/pages/events/b_venue.scss');

const galleryPage = require('../styles/pages/gallery/b_gallery_page.scss');

const 	inviteAccept	= require('../styles/pages/invite/b_InviteAccept.scss'),
		inviteAnswer	= require('../styles/pages/invite/b_invites_answer.scss');

const news = require('../styles/pages/news/news.scss');

const 	opponentsMaps	= require('../styles/pages/opponents/b_opponents_maps.scss'),
		opponentsPage	= require('../styles/pages/opponents/b_opponents_page.scss');

const 	publicEventGallery	= require('../styles/pages/public_event/b_public_gallery.scss'),
		publicEventEvent	= require('../styles/pages/public_event/public_event.scss');

const 	registerFinish		= require('../styles/pages/register/b_register_finish.scss'),
		registerForm		= require('../styles/pages/register/b_register_form.scss'),
		registerVerify		= require('../styles/pages/register/b_verify_register.scss');

const 	schoolFixturesList		= require('../styles/pages/school_fixtures/b_fixtures_list.scss'),
		schoolFixturesStats		= require('../styles/pages/school_fixtures/b_fixtures_statistics.scss'),
		schoolFixturesEvent		= require('../styles/pages/school_fixtures/b_one_event.scss');

const 	schoolsListPage			= require('../styles/pages/schools/b_list_page.scss'),
		schoolsContacts			= require('../styles/pages/schools/b_school_contacts.scss'),
		schoolsList				= require('../styles/pages/schools/b_school_list.scss'),
		schoolsMaster			= require('../styles/pages/schools/b_school_master.scss'),
		schoolsNews				= require('../styles/pages/schools/b_school_news.scss'),
		schoolsAbout			= require('../styles/pages/schools/school_about.scss');

const 	userAboutList			= require('../styles/pages/user/b_about_list.scss'),
		userPermissionLink		= require('../styles/pages/user/b_permission_link.scss'),
		userRegistration		= require('../styles/pages/user/b_registration.scss'),
		userSettings			= require('../styles/pages/user/b_settings.scss'),
		userSettingsForm		= require('../styles/pages/user/b_settings_form.scss'),
		userButtons				= require('../styles/pages/user/b_user_buttons.scss'),
		userInfo				= require('../styles/pages/user/b_user_info.scss'),
		userName				= require('../styles/pages/user/b_user_name.scss'),
		userPage				= require('../styles/pages/user/b_user_page.scss'),
		userPhoto				= require('../styles/pages/user/b_user_photo.scss'),
		testApi					= require('../styles/pages/test-api.scss');

const	roleSelector	= require('../styles/pages/b_role_selector.scss'),
		userActivity	= require('../styles/pages/b_user_activity.scss');

const	clubsChildrenBookingActionsAreaStyle	= require('styles/ui/b_clubs_children_booking_actions_area/b_clubs_children_booking_actions_area.scss');
const	supportedBrowsersStyle					= require('styles/ui/b_supported_browsers.scss');
const	ieAlertContentStyle						= require('styles/ui/b_ie_alert_content.scss');
const	playerChooserTabsStyle					= require('styles/ui/b_player_chooser_tabs.scss');
const	playerChooserTabStyle					= require('styles/ui/b_player_chooser_tab.scss');
const	bookedChildrenPlayer					= require('styles/ui/b_booked_children_player.scss');

const	cancelEvent								= require('styles/ui/b_cancel_event.scss');

const	playerChooserStyle	= require('styles/ui/b_player_choosers/b_player_choosers.scss');

// custom font styles
const	materialDesignIconicFont = require('../styles/material_design_iconic_font/material-design-iconic-font.scss');
const	materialDesignIcons = require('../styles/mdi/materialdesignicons.scss');
const	fontAwesome	= require('../styles/font-awesome/font-awesome.scss');
const	customFont	= require('../styles/custom-font.scss');

const BootstrapcustomStyle = require('../styles/bootstrap-custom.scss');

const Style = require('../styles/react-resizable/react-resizable.scss');