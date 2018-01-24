import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AccountData } from '../account-data';

/*
  Generated class for the ConstantsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ConstantsProvider {

  constructor(public http: Http, public accountData: AccountData) {
    console.log('Hello ConstantsProvider Provider');
  }

  getConstants(): Observable<object[]> {
    return this.http.get(`${this.accountData.getNodeFromMemory()}nxt?requestType=getConstants`)
      .map((res:Response) => res.json())
      .catch((error:any) => [{'offline':'offline'}]);
      // .catch((error:any) => Observable.throw(error.json().error|| 'Server Error'));
  }

}
