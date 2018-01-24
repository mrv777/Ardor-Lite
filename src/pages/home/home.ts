import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { ContactsPage } from '../contacts/contacts';
import { CexchangePage } from '../cexchange/cexchange';
import { TransactionsPage } from '../transactions/transactions';

import { SendModalPage } from '../send-modal/send-modal';
import { ReceiveModalPage } from '../receive-modal/receive-modal';

import { AccountData } from '../../providers/account-data';
import { AccountProvider } from '../../providers/account/account';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  accountID: string;
  balance: number = 0;
  balances: object;
  currentDecimals: number = 100000000;
  decimals: object[] = [{ name:'ARDR', decimals:'100000000' },{ name:'IGNIS', decimals:'100000000' },{ name:'AEUR', decimals:'10000' },{ name:'BITSWIFT', decimals:'100000000' }];
  chain: string;
  chainNum: number = 1;

  subscriptionBalance;

  selectChainOptions = {
    title: 'Switch Chain',
    mode: 'md'
  };

  constructor(public navCtrl: NavController, public accountData: AccountData, public accountProvider: AccountProvider, public modalCtrl: ModalController) {

  }

  ngAfterViewInit() {
    if (this.accountData.hasLoggedIn()) {
      console.log("Logged in");
      this.accountID = this.accountData.getAccountID();
      this.chain = this.accountData.getChain();
      this.loadChainData();
    } else {
      console.log("Not logged in");
      this.navCtrl.setRoot(LoginPage);
    }
  }

  loadChainData() {
    if (this.subscriptionBalance) {
      this.subscriptionBalance.unsubscribe();
    }

    this.accountData.setChain(this.chain);
    this.chainNum = this.decimals.findIndex(x => x['name'] === this.chain)+1;
    this.currentDecimals = this.decimals[this.chainNum-1]['decimals'];
    this.accountData.setDecimals(this.currentDecimals);
    
    // this.subscriptionBalance = this.accountProvider.getBalance(this.chain, this.accountID)
    //   .subscribe(
    //     balance => {
    //       this.balance = balance;
    //     }
    //   );

    this.subscriptionBalance = this.accountProvider.getBalances('&chain=1&chain=2&chain=3&chain=4', this.accountID)
    .subscribe(
      balances => {
        this.balances = balances;console.log(balances);
        this.balance =  this.balances[this.chainNum]['balanceNQT'];
      }
    );

  }

  openModal(modal:string) {
    if (modal == 'send') {
      let myModal = this.modalCtrl.create(SendModalPage);
      myModal.present();
    } else {
      let myModal = this.modalCtrl.create(ReceiveModalPage);
      myModal.present();
    }
  }

  switchPage(page:string){
    if (page == 'contacts') {
      this.navCtrl.setRoot(ContactsPage);
    } else if (page == 'exchange') {
      this.navCtrl.setRoot(CexchangePage);
    } else if (page == 'transactions') {
      this.navCtrl.setRoot(TransactionsPage);
    }
  }

  logout() {
    this.accountData.logout();
    this.navCtrl.setRoot('LoginPage');
  }
}
