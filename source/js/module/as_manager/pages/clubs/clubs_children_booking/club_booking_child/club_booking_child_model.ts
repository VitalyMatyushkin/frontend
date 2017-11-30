export interface ClubBookingChildModelInterface {
	childName:  string,
	formName:   string,
	parentName: string,
	status:     string
}

export class ClubBookingChildModel implements ClubBookingChildModelInterface{
	childName:  string;
	formName:   string;
	parentName: string;
	status:     string;

	constructor(options: ClubBookingChildModelInterface) {
		Object.assign(this, options);
	}
}