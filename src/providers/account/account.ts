import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AccountData } from '../account-data';

/*
  Generated class for the AccountProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AccountProvider {

  constructor(public http: Http, public accountData: AccountData) {
    console.log('Hello AccountProvider Provider');
  }


  getAccountLedger(accountID: string): Observable<object[]> {
    return this.http.get(`${this.accountData.getNodeFromMemory()}nxt?requestType=getAccountLedger&account=${accountID}`)
      .map((res:Response) => res.json().entries)
      .catch((error:any) => Observable.throw(error.json().error|| 'Server Error'));
  }

  getAccountTransactions(chain: string, accountID: string): Observable<object[]> {
    return Observable.interval(7000).startWith(0).flatMap(() => {
      return this.http.get(`${this.accountData.getNodeFromMemory()}nxt?requestType=getBlockchainTransactions&chain=${chain}&account=${accountID}`)
        .map((res:Response) => res.json().transactions)
        .catch((error:any) => Observable.throw(error.json().error|| 'Server Error'));
    });
  }
  getUnconfirmedAccountTransactions(chain: string, accountID: string): Observable<object[]> {
    return Observable.interval(4000).startWith(0).flatMap(() => {
      return this.http.get(`${this.accountData.getNodeFromMemory()}nxt?requestType=getUnconfirmedTransactions&chain=${chain}&account=${accountID}`)
        .map((res:Response) => res.json().unconfirmedTransactions)
        .catch((error:any) => Observable.throw(error.json().error|| 'Server Error'));
    });
  }

  getBalance(chain: string, accountID: string): Observable<number> {
    return Observable.interval(4000).startWith(0).flatMap(() => {
      return this.http.get(`${this.accountData.getNodeFromMemory()}nxt?requestType=getBalance&chain=${chain}&account=${accountID}`)
        .map((res:Response) => res.json().balanceNQT)
        .catch((error:any) => Observable.throw(error.json().error|| 'Server Error'));
    });
  }

  getBalances(chains: string, accountID: string): Observable<object> {
    return Observable.interval(5000).startWith(0).flatMap(() => {
      return this.http.get(`${this.accountData.getNodeFromMemory()}nxt?requestType=getBalances${chains}&account=${accountID}`)
        .map((res:Response) => res.json().balances)
        .catch((error:any) => Observable.throw(error.json().error|| 'Server Error'));
    });
  }

  encodeQRCode(accountID: string): Observable<string> {
    let headers = new Headers(
    {
      'Content-Type' : 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({ headers: headers });

    let data = "qrCodeData=" + accountID + "&width=300&height=300";
    return this.http.post(`${this.accountData.getNodeFromMemory()}/nxt?requestType=encodeQRCode`, data, options)
          .map((res:Response) => res.json().qrCodeBase64)
          .catch((error:any) => Observable.throw(error.json().error|| 'Server Error'));
  }

}
