import {DataPrototype} from "module/data/data_prototype";
import * as Helpers from 'module/helpers/storage';

const schoolStorageName = 'activeSchoolId';


export class UserRules extends DataPrototype {
	/**
	 * Получение начального состояния данных userRules
	 */
	getDefaultState(){
		// Востановлении информации об активной школе
		return {
			activeSchoolId: Helpers.SessionStorage.get(schoolStorageName) || null
		};
	}

	/**
	 * Привязка к изменению данных userRules
	 */
	initBind() {
		const bindObject = this.bindObject;

		// Автоматически сохраняем данные при смене активной школы
		bindObject.addListener('activeSchoolId', () => {
			const data = bindObject.get('activeSchoolId');

			Helpers.SessionStorage.set(schoolStorageName, data);
		});
	};
}

export const UserRulesInstance = new UserRules();
