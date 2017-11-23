/**
 * Created by Anatoly on 21.07.2016.
 */

import {GeneralType} from './general-type';
import {CustomType}	from './custom-type';
import {ColorsType} from './colors-type';
import {GenderType}	from './gender-type';
import {DateType} from './date-type';
import {ImageType} from	'./image-type';
import {ActionButtonsType} from	'./action-buttons-type';
import {ActionDropListType} from './action-drop-list-type';
import {EmailUrlType} from './email-url-type';

export const CellTypeList = {
	'general': 			GeneralType,
	'custom': 			CustomType,
	'colors': 			ColorsType,
	'gender': 			GenderType,
	'date': 			DateType,
	'image': 			ImageType,
	'action-buttons': 	ActionButtonsType,
	'action-list':		ActionDropListType,
	'email':			EmailUrlType,
	'url': 				EmailUrlType
};