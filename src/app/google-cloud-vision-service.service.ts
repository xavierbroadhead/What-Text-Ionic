import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleCloudVisionService {

  constructor(public http: Http) {
  }

  /*
    Manually sends a POST request to the Google Vision API endpoint with
    the passed image using the API key in the imported environment file,
    and attaches the body of the request in JSON format.
  */

  getText(base64Image: any,feature: string) {
    const body = {
      requests: [
        {
          image: {
              content: base64Image
          },
          features: [{
            type: "DOCUMENT_TEXT_DETECTION"
          }]
        }
      ]
    }
    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + environment.googleCloudVisionAPIKey, body);
  }
}
