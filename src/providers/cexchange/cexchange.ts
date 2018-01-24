import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AccountData } from '../account-data';

/*
  Generated class for the CexchangeProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CexchangeProvider {

  constructor(public http: Http, public accountData: AccountData) {
    console.log('Hello CexchangeProvider Provider');
  }

  getCoinExchangeOrders(chain: string, exchangeChain:string): Observable<object[]> {
    return this.http.get(`${this.accountData.getNodeFromMemory()}nxt?requestType=getCoinExchangeOrders&chain=${chain}&exchange=${exchangeChain}`)
      .map((res:Response) => res.json().orders)
      .catch((error:any) => Observable.throw(error.json().error|| 'Server Error'));
  }

  getBundlerRates(): Observable<object[]> {
    return this.http.get(`${this.accountData.getNodeFromMemory()}nxt?requestType=getBundlerRates`)
      .map((res:Response) => res.json().rates)
      .catch((error:any) => Observable.throw(error.json().error|| 'Server Error'));
  }

}
