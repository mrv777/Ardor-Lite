import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import * as Big from 'big.js';

import { AccountData } from '../../providers/account-data';
import { AccountProvider } from '../../providers/account/account';
import { TransactionsProvider } from '../../providers/transactions/transactions';
import { CexchangeProvider } from '../../providers/cexchange/cexchange';

/**
 * Generated class for the CexchangeModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-cexchange-modal',
  templateUrl: 'cexchange-modal.html',
})
export class CexchangeModalPage {
  accountID: string;
  balance: Big;
  chain: string;
  exchangeChain: string;
  feeChain: string;
  status: number;
  rate: Big;
  max: Big;
  quantity: Big;
  fee: Big;
  exchangeQuantity: Big;
  resultTxt: string = '';
  disableExchange: boolean = false;
  decimals: object[] = [{ name:'ARDR', decimals:'100000000' },{ name:'IGNIS', decimals:'100000000' },{ name:'AEUR', decimals:'10000' },{ name:'BITSWIFT', decimals:'100000000' }];
  exchangeDecimals: number;
  chainDecimals: number;

  subscriptionBalance;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public accountData: AccountData, public transactionsProvider: TransactionsProvider, public accountProvider: AccountProvider, public cexchangeProvider: CexchangeProvider) {
    this.exchangeChain = navParams.get('chain');
    this.chain = navParams.get('exchangeChain');
    this.rate = navParams.get('rate');
    this.max = navParams.get('max');
  }

  ionViewDidLoad() {
    this.accountID = this.accountData.getAccountID();
    this.cexchangeProvider.getBundlerRates()
      .subscribe(
        rates => {
          let exchangeIndex = this.decimals.findIndex(x => x['name']==this.exchangeChain);
          let chainIndex = this.decimals.findIndex(x => x['name']==this.chain);

          /* Calculate fee for exchange */
          if (exchangeIndex > 0 && chainIndex > 0) {
            let ratesIndex = rates.findIndex(x => x['chain']==(chainIndex+1));
            this.fee = new Big(rates[ratesIndex]['minRateNQTPerFXT']/this.decimals[chainIndex]['decimals']);
            this.fee = this.fee.times(0.1).toFixed(8);
            this.feeChain = this.decimals[chainIndex]['name'];
          } else {
            this.fee = 5;
            this.feeChain = 'ARDR';
          }

          this.exchangeDecimals = this.decimals[exchangeIndex]['decimals'];
          this.chainDecimals = this.decimals[chainIndex]['decimals'];

          this.subscriptionBalance = this.accountProvider.getBalance(this.feeChain, this.accountID)
          .subscribe(
            balance => {
              this.balance = balance/this.decimals[chainIndex]['decimals'];

              if (this.balance < this.fee) {
                this.disableExchange = true;
                this.resultTxt = `Not enough ${this.feeChain} to cover the fee`;
              }
            }
          );
        }
      );
    
  }

  exchange() {
    this.disableExchange = true;
    this.status = 0;
    this.transactionsProvider.exchangeCoins(this.chain, this.exchangeChain, this.rate*this.chainDecimals, this.quantity*this.exchangeDecimals)
      .subscribe(
        unsignedBytes => {
           console.log(unsignedBytes['unsignedTransactionBytes']);
           if (unsignedBytes['errorDescription']) {
              this.resultTxt = unsignedBytes['errorDescription'];
              this.disableExchange = false;
           } else {
             this.transactionsProvider.broadcastTransaction(this.accountData.signTransaction(unsignedBytes['unsignedTransactionBytes']))
              .subscribe(
                broadcastResults => {
                  console.log(broadcastResults);
                  if (broadcastResults['fullHash'] != null) {
                    this.resultTxt = `Exchange successful with fullHash: ${broadcastResults['fullHash']}`;
                    this.status = 1;
                  } else {
                    this.resultTxt = broadcastResults['errorDescription'];
                    this.disableExchange = false;
                    this.status = -1;
                  }
                }
              );
           }
        }
      );
  }

  updateExchangeQuantity(ev) {
    if (ev.target.value !='' && !isNaN(ev.target.value)) {
      this.rate = new Big(this.rate);
      this.exchangeQuantity = new Big(this.rate.times(ev.target.value));
      if (this.balance < this.exchangeQuantity.plus(this.fee)) {
        this.disableExchange = true;
        this.resultTxt = `Not enough ${this.chain} to exchange`;
      } else {
        this.disableExchange = false;
        this.resultTxt = '';
      }
    }
  }

  closeModal() {
    if (this.subscriptionBalance) {
      this.subscriptionBalance.unsubscribe();
    }
    this.viewCtrl.dismiss();
  }
  

}
