/**
 * Created by Vitaly on 02.06.17.
 */
const   {By, until}     = require('selenium-webdriver'),
        Constants       = require('../Constants.js'),
        OftenUsed       = require('../OftenUsed.js');

class CalendarPage{
    constructor(driver){
        this.driver = driver;
        this.url = Constants.domain + '/#events/calendar';
        this.urlStudentParent = Constants.domain + '/#events/calendar/all';
        this.urlAdmin = Constants.domain + '/#school_union_admin/summary';
        this.roleLocator = By.css('span.eRole_name');
        this.schoolLocator = By.css('span.eRole_schoolName');
        this.schoolStudentLocator = By.className('eSubMenu_item');
        this.sectorRolesLocator = By.className('bRoleSelector');
        this.calendarPageLocator = By.className('eCalendar_eMonth');
        this.openDropdownLocator = By.css('div.bRoles');
        this.dropdownItemLocator = By.css('div.eScrollList div.eRole');
        this.buttonLocator = By.tagName('button');
    }

    async checkCalendarPage(){
        return await this.driver.wait(until.elementLocated(this.calendarPageLocator), 20000);
    }

    async checkSelectRolePage(){
        return await this.driver.wait(until.elementLocated(this.sectorRolesLocator), 20000);
    }

    async checkUrl() {
        const currentUrl = await this.driver.getCurrentUrl();
        return new Promise(
            (resolve, reject) => {
                if (currentUrl === this.url || currentUrl === this.urlStudentParent){
                    resolve(true);
                } else {
                    reject(new Error('url was not found'));
                }
            }
        );
    }

    async checkUrlForRole(roleName) {
        const currentUrl = await this.driver.getCurrentUrl();
        roleName = roleName.toLowerCase();
        return new Promise(
            (resolve, reject) => {
                if (((roleName === 'parent' || roleName === 'student') && currentUrl === this.urlStudentParent)
                || ((roleName === 'admin' || roleName === 'manager' || roleName === 'coach')
                    && (currentUrl === this.url || currentUrl === this.urlAdmin))){
                    resolve(true);
                } else {
                    reject(new Error('url was not found'));
                }
            }
        );
    }

    async switchRole(roleName){
        const selectorRole = await this.driver.findElement(this.sectorRolesLocator);
        await OftenUsed.clickSelectOption(selectorRole, this.buttonLocator, roleName);
        return Promise.resolve(true);
    }

    async findRole(userRole) {
        await this.checkUrl();
        await this.checkRole(userRole.roleName);
        if (userRole.roleName === 'STUDENT'){
            for (let school of userRole.school){
                this.driver.wait(until.elementLocated(this.schoolStudentLocator), 20000);
                await this.checkSchoolStudent(school);
            }
        } else {
            await this.checkSchool(userRole.school);
        }
        return Promise.resolve(true);
    }

    async checkRole(role, driver = this.driver) {
        const roleName = await driver.findElement(this.roleLocator).getText();
        return new Promise(
            (resolve, reject) => {
                if (roleName === role.toLowerCase()){
                    // console.log('Role was checked');
                    resolve(roleName);
                } else {
                    reject(new Error('Role was not found'));
                }
            }
        );
    }

    async checkSchool(school, driver = this.driver) {
        const schoolName = await driver.findElement(this.schoolLocator).getText();
        return new Promise(
            (resolve, reject) => {
                if (schoolName === school){
                    // console.log('School was checked');
                    resolve(schoolName);
                } else {
                    reject(new Error('School was not found'));
                }
            }
        );
    }

    async checkSchoolStudent(school) {
        const schoolName = await this.driver.findElement(By.partialLinkText(school)).getText();
        return new Promise(
            (resolve, reject) => {
                if (schoolName === school){
                    resolve(schoolName);
                } else {
                    reject(new Error('School was not found'));
                }
            }
        );
    }

    async getDropdownItems(){
        return await this.driver.findElements(this.dropdownItemLocator);
    }

    async openDropdown(){
        await this.driver.findElement(this.openDropdownLocator).click();
        return Promise.resolve(true);
    }

    async checkItem(webElem, item) {
        await Promise.all([this.checkRole(item.roleName, webElem), this.checkSchool(item.school, webElem)]);
        await webElem.click();
        this.driver.sleep(7000);
        await this.checkUrlForRole(item.roleName);
        return Promise.resolve(true);
    }

    /**
     * Navigate and check all pages in the submenu
     * @param driver
     * @returns {Promise.<boolean>}
     */
    static async checkAllPage(driver){
        await OftenUsed.checkPage(this.calendarPageLocator, driver);
        await driver.sleep(2000);
        await driver.findElement(By.className('eSubMenu_item ')).click();
        await OftenUsed.checkPage(this.calendarPageLocator, driver);
        return Promise.resolve(true);
    }
}

module.exports = CalendarPage;