import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-show-class',
  templateUrl: './show-class.page.html',
  styleUrls: ['./show-class.page.scss'],
})
export class ShowClassPage implements OnInit {

  image: string;
  result: string;
  results: string[];
  feature: string;

  constructor(
    private route: ActivatedRoute,
    public alertController : AlertController) { }

    showImage(){
      return this.image;
    }

    /*
      ngOnInit is backend preprocessing that is executed before the html file it
      corresponds to is loaded, therefore we can extract and format the data we need
      before telling our html file how to display it.
    */
    ngOnInit() {
      //queryParams is sent from home page, it is an Observable<Params>
      //therefore we must subscribe to the result in order to extract the data
      this.route.queryParams.subscribe(params => {
        //sent as strings, store locally
        this.image = params.special;
        this.result = params.result;
        this.feature = params.feature;
      });
      //remove line breaks and format each line as a string in an array,
      //this may change in the future when I figure out how to better
      //format line breaks in Angular
      this.results = this.result.split("\\n");
    }

    //generic displayError method
    async displayError(message: string){
      const alert = await this.alertController.create({
        header: 'Error',
        message: message,
        buttons: ['OK']
      });
      await alert.present();
    }

  }
