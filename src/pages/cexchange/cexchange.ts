import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { AccountData } from '../../providers/account-data';
import { CexchangeProvider } from '../../providers/cexchange/cexchange';
import { CexchangeModalPage } from '../cexchange-modal/cexchange-modal';

/**
 * Generated class for the CexchangePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-cexchange',
  templateUrl: 'cexchange.html',
})
export class CexchangePage {
  chain: string;
  exchangeChain: string;
  exchanges: object[];
  bestExchange: number[];
  decimals: object[] = [{ name:'ARDR', decimals:'100000000' },{ name:'IGNIS', decimals:'100000000' },{ name:'AEUR', decimals:'10000' },{ name:'BITSWIFT', decimals:'100000000' }];

  selectChainOptions = {
    title: 'Switch Chain',
    mode: 'md'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountData: AccountData, public cexchangeProvider: CexchangeProvider, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CexchangePage');
    this.exchangeChain = this.accountData.getChain();
    this.chain = 'IGNIS';
    this.loadChainData();
  }

  loadChainData(){
    this.cexchangeProvider.getCoinExchangeOrders(this.chain,this.exchangeChain)
      .subscribe(
        exchanges => {
          this.exchanges = exchanges;
          // for (let i=0;i < exchanges.length; i++) {
          //   if (this.bestExchange[exchanges[i]['chain']] == null)
          //     this.bestExchange[exchanges[i]['chain']] = exchanges[i]['askNQTPerCoin'];
          //   else if (this.bestExchange[exchanges[i]['chain']] > exchanges[i]['askNQTPerCoin']){
          //     this.bestExchange[exchanges[i]['chain']] = exchanges[i]['askNQTPerCoin'];
          //   }
          // }
        }
      );
  }

  showExchange(rate:number, max:number) {
    let myModal = this.modalCtrl.create(CexchangeModalPage, { exchangeChain: this.exchangeChain, chain: this.chain, rate: rate, max: max });
    myModal.present();
  }

  logout() {
    this.accountData.logout();
    this.navCtrl.setRoot('LoginPage');
  }

}
