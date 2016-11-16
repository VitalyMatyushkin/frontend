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

const 	popupDetail	= require('../styles/ui/popup/b_details.scss'),
		popupPopup	= require('../styles/ui/popup/b_popup.scss'),
		popupBack	= require('../styles/ui/popup/b_popup_back.scss');

const popupMessage	= require('../styles/ui/popup_message/b_popup_message.scss');
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
		switchCheckbox	= require('../styles/ui/e_switch_checkbox.scss'),
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

const 	eventsChallenge		= require('../styles/pages/events/b_challenge.scss'),
		eventsChallengeDate	= require('../styles/pages/events/b_challenge_date.scss'),
		eventsChooser		= require('../styles/pages/events/b_chooser.scss'),
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
