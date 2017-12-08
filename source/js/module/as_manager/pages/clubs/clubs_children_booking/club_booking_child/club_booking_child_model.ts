export interface ClubBookingChildModelInterface {
	childName:      string,
	formName:       string,
	houseName:      string,
	parentName:     string,
	messageStatus:  string
}

export class ClubBookingChildModel implements ClubBookingChildModelInterface{
	childName:      string;
	formName:       string;
	houseName:      string;
	parentName:     string;
	messageStatus:  string;

	constructor(options: ClubBookingChildModelInterface) {
		Object.assign(this, options);
	}
}