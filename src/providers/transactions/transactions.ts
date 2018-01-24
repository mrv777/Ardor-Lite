import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AccountData } from '../account-data';

/*
  Generated class for the TransactionsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class TransactionsProvider {
  API_URL = "https://ardor.jelurida.com";
  API_CORS_URL = "http://localhost:8100/api";

  constructor(public http: Http, public accountData: AccountData) {
    console.log('Hello TransactionsProvider Provider');
    this.accountData.getNode().then((node) => {
      this.API_URL = node;
    });
  }

  sendMoney(chain: string, recipient:string, amount:number, message:string): Observable<object[]> {
    let publicKey = this.accountData.getPublicKey();
    let headers = new Headers(
    {
      'Content-Type' : 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({ headers: headers });

    let data;
    if (message != null && message != '') {
      data = "chain=" + chain + "&recipient=" + recipient + "&amountNQT=" + amount + "&publicKey=" + publicKey + "&message=" + message;
    } else {
      data = "chain=" + chain + "&recipient=" + recipient + "&amountNQT=" + amount + "&publicKey=" + publicKey;
    }
    return this.http.post(this.API_URL + '/nxt?requestType=sendMoney', data, options)
          .map((res:Response) => res.json())
          .catch((error:any) => Observable.throw(error.json().error|| 'Server Error'));
  }

  exchangeCoins(chain: string, exchangeChain:string, priceNQTPerCoin:number, quantityQNT:number): Observable<object[]> {
    let publicKey = this.accountData.getPublicKey();
    let headers = new Headers(
    {
      'Content-Type' : 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({ headers: headers });

    let data = "chain=" + chain + "&exchange=" + exchangeChain + "&quantityQNT=" + quantityQNT + "&priceNQTPerCoin=" + priceNQTPerCoin + "&publicKey=" + publicKey;
    return this.http.post(this.API_URL + '/nxt?requestType=exchangeCoins', data, options)
          .map((res:Response) => res.json())
          .catch((error:any) => Observable.throw(error.json().error|| 'Server Error'));
  }

  broadcastTransaction(transactionBytes: string): Observable<object[]> {
    let headers = new Headers(
    {
      'Content-Type' : 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({ headers: headers });

    let data = "transactionBytes=" + transactionBytes;
    return this.http.post(this.API_URL + '/nxt?requestType=broadcastTransaction', data, options)
          .map((res:Response) => res.json())
          .catch((error:any) => Observable.throw(error.json().error|| 'Server Error'));
  }

  getTransaction(chain: string, fullHash: string): Observable<object[]> {
    return this.http.get(`${this.accountData.getNodeFromMemory()}nxt?requestType=getTransaction&chain=${chain}&fullHash=${fullHash}`)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error|| 'Server Error'));
  }

}
