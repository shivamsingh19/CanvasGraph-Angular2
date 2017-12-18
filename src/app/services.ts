import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/do';
import {IData} from './data.model';


@Injectable()
export class DataService {
  private url = 'http://localhost:3000/api/daterange/get/dateRanges';
  private mock: boolean = false;


  constructor(private http: HttpClient) {
  }

  getdata(dates): Observable<any> {
    console.log(dates);

    /*const dates = {'startDate': startDate, 'endDate': endDate};*/
    // let headers = new Headers({'Content-Type': 'application/json'});
    // let options = new RequestOptions({headers: headers});
    return this.http.post(this.url, dates)
      .map((response: Response) => {
        return response;
      });
  }


}

/*
import {Injectable} from '@angular/core';
import {data} from './mock-data';
import {IData} from './data.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  private mock: boolean = true;
  private _productUrl = 'src/app/responseData.json';

  constructor(private _http:HttpClient){}
  getdata(): Observable<IData[]> {
    return this._http.get<IData[]>(this._productUrl)
      .do(data => console.log('All: ' + JSON.stringify(data)));
  }

}*/
