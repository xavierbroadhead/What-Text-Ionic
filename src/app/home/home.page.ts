import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { GoogleCloudVisionService } from '../google-cloud-vision-service.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //change this for different Google Vision functions, minor backend changes required
  selectedFeature: string = "DOCUMENT_TEXT_DETECTION";

  constructor(
    private camera : Camera,
    private vision : GoogleCloudVisionService,
    private route : Router,
    public loadingController : LoadingController,
    public alertController : AlertController
  ) {}

  /*
    Allows user to take a picture using their native phone camera
  */

  async takePhoto(){
    //photo options
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    //asynchronously take a picture - getPicture returns a promise, therefore we must use .then()
    //so we can bind callbacks to the promise
    this.camera.getPicture(options).then(async (imageData) => {
      //display loading alert while we wait for the backend to finish its tasks
      const loading = await this.loadingController.create({
        message: 'Analysing image',
        translucent: true
      });
      //create() returns a promise, therefore we must await the loading alert to be present
      //before backend can begin processing the image
      await loading.present();
      //send the image to our getText() method which returns a JSON file received from the
      //Google Vision server, we must subscribe to this result as it is an Observable<Response>
      this.vision.getText(imageData, this.selectedFeature).subscribe(async (result) => {
        //navigate to the show-class page and send the query params to it
        //special: sends the image
        //result: sends the parsed text
        //feature: sends the selected feature (DOCUMENT_TEXT_DETECTION in this case)
        this.route.navigate(["show-class"], { queryParams: {
          special: 'data:image/jpeg;base64,' + imageData,
          result: JSON.stringify(result.json().responses[0].textAnnotations[0].description),
          feature: this.selectedFeature
        }});
        //we get back here once show-class has finished its backend processing,
        //therefore we can dismiss the loading alert
        await loading.dismiss();
      }, err => {
        this.displayError(err);
      });
    }, err => {
      this.displayError(err);
    });
  }

  /*
    Allows user to select a picture using their native phone photo gallery
  */

  async selectPhoto(){
    //photo options
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    };
    //asynchronously get a picture - getPicture returns a promise, therefore we must use .then()
    //so we can bind callbacks to the promise
    this.camera.getPicture(options).then(async (imageData) => {
      const loading = await this.loadingController.create({
        message: "Analysing image",
        translucent: true
      });
      //create() returns a promise, therefore we must await the loading alert to be operation
      //before backend can begin processing the image
      await loading.present();
      //send the image to our getText() method which returns a JSON file received from the
      //Google Vision server, we must subscribe to this result as it is an Observable<Response>
      this.vision.getText(imageData, this.selectedFeature).subscribe(async (result) => {
        //navigate to the show-class page and send the query params to it
        //special: sends the image
        //result: sends the parsed text
        //feature: sends the selected feature (DOCUMENT_TEXT_DETECTION in this case)
        this.route.navigate(["show-class"], { queryParams: {
          special: 'data:image/jpeg;base64,' + imageData,
          result: JSON.stringify(result.json().responses[0].textAnnotations[0].description),
          feature: this.selectedFeature
        }});
        //we get back here once show-class has finished its backend processing,
        //therefore we can dismiss the loading alert
        await loading.dismiss();
      }, err => {
        this.displayError(err);
      });
    }, err => {
      this.displayError(err);
    });
  }

  /*
    Displays an alert with an error message if takePhoto() or selectPhoto() throw an error
  */

  async displayError(message: string){
    //display error alert with error message - mainly used for bugfixing
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    //await the alert to be present - AKA await the promise from create() to be resolved
    await alert.present();
  }

  /*
    Allows user to choose if they would like to take a picture,
    or select a picture from their photo gallery for analysis
  */

  async presentAlertConfirm(){
    const alert = await this.alertController.create({
      header: 'Select an input method',
      message: 'Take a photo, or select a photo from your gallery.',
      buttons: [{
        text: 'Camera',
        role: 'camera',
        //when this button is selected, takePhoto() is called
        handler: () => {
          this.takePhoto();
        }
      }, {
        text: 'Gallery',
        role: 'gallery',
        //when this button is selected, selectPhoto() is called
        handler: () => {
          this.selectPhoto();
        }
      }]
    });
    //await promise resolution
    await alert.present();
  }
}
