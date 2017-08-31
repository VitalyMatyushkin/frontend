/**
 * Created by Vitaly on 15.06.17.
 */

const   {By, until}         = require('selenium-webdriver'),
        OftenUsed           = require('../../OftenUsed'),
        Constants           = require('../../Constants.js'),
        SchoolPage          = require('./SchoolPage.js');

class EditSchoolSummaryTools{
    constructor(driver){
        this.driver = driver;
        this.urlGallery = Constants.domain + '/#school_admin/gallery';
        this.albumLocator = By.className('eAlbum');
        this.toolsButtonLocator = By.className('bTooltip');
        this.editFormLocator = By.className('bForm');
        this.albumNameLocator = By.css('div.eForm_fieldSet input');
        this.photoDecriptionLocator = By.css('div.eForm_fieldSet textarea');
        this.savePanelLocator = By.className('eForm_savePanel');
        this.buttonLocator = By.className('bButton');
        this.galleryViewLocator = By.className('bAlbum');
        this.submenuItemLocator = By.className('eSubMenu_item ');
        this.addPhotoFormLocator = By.className('bPhotoAdd');
        this.inputFileLocator = By.css('div.eInputFileImage input');
        this.cropLocator = By.className('ReactCrop__crop-wrapper');
        this.buttonPanelLocator = By.className('bButtonsPhotoAdd');
        this.popupLocator = By.className('bSimpleAlert');
        this.photoLocator = By.className('bAlbumPhoto');
    }

    async visitGallery(){
        await this.driver.navigate().to(this.urlGallery);
        return Promise.resolve(true);
    }

    async editClick(){
        await this.waitLoadBackground();
        const album = await this.driver.findElement(this.albumLocator);
        await this.driver.actions().mouseMove(album).perform();
        await this.driver.sleep(4000);
        const edit = (await album.findElements(this.toolsButtonLocator))[0];
        await edit.click();
        return Promise.resolve(true);
    }

    async deleteClick(){
        await this.waitLoadBackground();
        const album = await this.driver.findElement(this.albumLocator);
        await this.driver.actions().mouseMove(album).perform();
        await this.driver.sleep(1000);
        const deleteAlbum = (await album.findElements(this.toolsButtonLocator))[1];
        await deleteAlbum.click();
        await this.driver.wait(until.elementLocated(this.popupLocator), 20000);
        const alert = await this.driver.findElement(this.popupLocator);
        const okButton = (await alert.findElements(this.buttonLocator))[1];
        // await okButton.click();
        return Promise.resolve(true);
    }

    async checkEditPage(){
        await this.driver.wait(until.elementLocated(this.editFormLocator), 20000);
        await this.driver.sleep(1000);
        return Promise.resolve(true);
    }


    async editAlbumName(albumName){
        const albumNameInput = await this.driver.findElement(this.albumNameLocator);
        await albumNameInput.clear();
        await OftenUsed.characterByCharacter(this.driver,  albumNameInput, albumName);
        return Promise.resolve(true);
    }

    async submit(){
        const savePanel = await this.driver.findElement(this.savePanelLocator);
        const submitButton = (await savePanel.findElements(this.buttonLocator))[1];
        await submitButton.click();
        return Promise.resolve(true);
    }

    async waitLoadBackground(){
        await this.driver.wait(until.elementLocated(this.albumLocator), 20000);
        await this.driver.wait( async () => {
            const background = await this.driver.findElement(this.albumLocator).getAttribute('style');
            if (background !== 'background-image: url("/images/no-image.jpg");') {
                return background;
            }
        },20000);
        return Promise.resolve(true);
    }

    async clickAlbumViewAndCheck(){
        await this.waitLoadBackground();
        const album = await this.driver.findElement(this.albumLocator);
        await album.click();
        await this.driver.wait(until.elementLocated(this.galleryViewLocator), 20000);
        return Promise.resolve(true);
    }

    async addNewPhoto(filePath){
        const addPhotoLink = (await this.driver.findElements(this.submenuItemLocator))[1];
        await addPhotoLink.click();
        await this.driver.wait(until.elementLocated(this.addPhotoFormLocator), 20000);
        const inputFile = await this.driver.findElement(this.inputFileLocator);
        await inputFile.sendKeys(filePath);
        await this.driver.wait(until.elementLocated(this.cropLocator), 20000);
        const buttonPanel = await this.driver.findElement(this.buttonPanelLocator);
        const unload = (await buttonPanel.findElements(this.buttonLocator))[1];
        await unload.click();
        await this.driver.wait(until.elementLocated(this.popupLocator), 20000);
        const alert = await this.driver.findElement(this.popupLocator);
        await alert.findElement(this.buttonLocator).click();

        return Promise.resolve(true);
    }

    async deletePhoto(){
        const firstPhoto = (await this.driver.findElements(this.photoLocator))[0];
        await this.driver.actions().mouseMove(firstPhoto).perform();
        await this.driver.sleep(1000);
        const deleteButton = (await firstPhoto.findElements(this.toolsButtonLocator))[2];
        await deleteButton.click();
        await this.driver.wait(until.elementLocated(this.popupLocator), 20000);
        const alert = await this.driver.findElement(this.popupLocator);
        const okButton = (await alert.findElements(this.buttonLocator))[1];
        await okButton.click();
        return Promise.resolve(true);
    }

    async setAlbumCover(){
        const firstPhoto = (await this.driver.findElements(this.photoLocator))[0];
        await this.driver.actions().mouseMove(firstPhoto).perform();
        await this.driver.sleep(1000);
        const coverButton = (await firstPhoto.findElements(this.toolsButtonLocator))[0];
        await coverButton.click();
        await this.driver.wait(until.elementLocated(this.popupLocator), 20000);
        const alert = await this.driver.findElement(this.popupLocator);
        await alert.findElement(this.buttonLocator).click();
        return Promise.resolve(true);
    }

    async editPhoto(photoDescription){
        const firstPhoto = (await this.driver.findElements(this.photoLocator))[0];
        await this.driver.actions().mouseMove(firstPhoto).perform();
        await this.driver.sleep(1000);
        const editButton = (await firstPhoto.findElements(this.toolsButtonLocator))[1];
        await editButton.click();
        await this.driver.wait(until.elementLocated(this.editFormLocator), 20000);
        await this.driver.sleep(1000);
        const photoTextarea = await this.driver.findElement(this.photoDecriptionLocator);
        await photoTextarea.clear();
        await OftenUsed.characterByCharacter(this.driver,  photoTextarea, photoDescription);
        return Promise.resolve(true);
    }
}

module.exports = EditSchoolSummaryTools;
