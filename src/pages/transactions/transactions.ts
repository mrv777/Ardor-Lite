import { Component } from '@angular/core';
import { NavController, ModalController, ToastController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SendModalPage } from '../send-modal/send-modal';
import { ReceiveModalPage } from '../receive-modal/receive-modal';
import { MessageModalPage } from '../message-modal/message-modal';

import { AccountData } from '../../providers/account-data';
import { AccountProvider } from '../../providers/account/account';

import { ConstantsProvider } from '../../providers/constants/constants';

@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage {
  accountID: string;
  unconfirmedTxs: object[] = [];
  transactions: object[];
  transactionTypes: object[];
  balance: number;
  currentDecimals: number = 100000000;
  decimals: object[] = [{ name:'ARDR', decimals:'100000000' },{ name:'IGNIS', decimals:'100000000' },{ name:'AEUR', decimals:'10000' },{ name:'BITSWIFT', decimals:'100000000' }];
  chain: string;
  contacts: string[];
  contactNames: string[];

  subscriptionBalance;
  subscriptionTxs;
  subscriptionUnconfirmedTxs;

  selectChainOptions = {
    title: 'Switch Chain',
    mode: 'md'
  };

  constructor(public navCtrl: NavController, private toastCtrl: ToastController, public accountData: AccountData, public accountProvider: AccountProvider, public modalCtrl: ModalController, public constantsProvider: ConstantsProvider) {

  }

  ngAfterViewInit() {
    if (this.accountData.hasLoggedIn()) {
      console.log("Logged in");
      this.accountID = this.accountData.getAccountID();
      this.chain = this.accountData.getChain();

      this.accountData.getContacts().then((currentContacts) => {
        if (currentContacts != null) {
          this.contacts = [];
          this.contactNames = [];
          for (let i=0;i < currentContacts.length; i++) {
            this.contacts.push(currentContacts[i]['account']);
            if (currentContacts[i]['name'] != '') {
              this.contactNames.push(currentContacts[i]['name']);
            } else {
              this.contactNames.push(currentContacts[i]['account']);
            }
          }
        } else {
          this.contacts = [''];
          this.contactNames = [''];
        }
      });
      
      this.constantsProvider.getConstants()
      .subscribe(
        transactionTypes => {
          this.transactionTypes = transactionTypes['transactionTypes'];
          this.loadChainData();
        }
      );
    } else {
      console.log("Not logged in");
      this.navCtrl.setRoot(LoginPage);
    }
  }

  loadChainData() {
    if (this.subscriptionTxs) {
      this.subscriptionTxs.unsubscribe();
    }
    if (this.subscriptionBalance) {
      this.subscriptionBalance.unsubscribe();
    }
    if (this.subscriptionUnconfirmedTxs) {
      this.subscriptionUnconfirmedTxs.unsubscribe();
    }
    
    
    this.accountData.setChain(this.chain);
    this.currentDecimals = this.decimals.find(x => x['name'] === this.chain)['decimals'];
    this.accountData.setDecimals(this.currentDecimals);

    this.subscriptionUnconfirmedTxs = this.accountProvider.getUnconfirmedAccountTransactions(this.chain, this.accountID)
      .subscribe(
        unconfirmedTxs => {
          for (let i=0;i < unconfirmedTxs.length; i++) {
            unconfirmedTxs[i]['unconfirmed'] = true;
          }
          this.unconfirmedTxs = unconfirmedTxs;
        }
      );
    this.subscriptionTxs = this.accountProvider.getAccountTransactions(this.chain, this.accountID)
      .subscribe(
        transactions => {
          this.transactions = this.unconfirmedTxs.concat(transactions);
          for (let i=0;i < this.transactions.length; i++) {
            this.transactions[i]['date'] = new Date((new Date("2018-01-01T00:00:00Z").getTime()/1000 + this.transactions[i]['timestamp'])*1000);
          }
        }
      );
    this.subscriptionBalance = this.accountProvider.getBalance(this.chain, this.accountID)
      .subscribe(
        balance => {
          this.balance = balance;
        }
      );
  }

  addContact(newAccount: string) {
    this.accountData.addContact('',newAccount).then(() => {
      let toast = this.toastCtrl.create({
        message: 'Contact Added',
        duration: 3000,
        position: 'bottom'
      });
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();
      this.accountData.getContacts().then((currentContacts) => {
        if (currentContacts != null) {
          this.contacts = [];
          this.contactNames = [];
          for (let i=0;i < currentContacts.length; i++) {
            this.contacts.push(currentContacts[i]['account']);
            if (currentContacts[i]['name'] != '') {
              this.contactNames.push(currentContacts[i]['name']);
            } else {
              this.contactNames.push(currentContacts[i]['account']);
            }
          }
        } else {
          this.contacts = [''];
          this.contactNames = [''];
        }
      });
    });  
  }

  openModal(modal:string, fullHash:string = null) {
    if (modal == 'send') {
      let myModal = this.modalCtrl.create(SendModalPage);
      myModal.present();
    } else if (modal == 'message') {
      let myModal = this.modalCtrl.create(MessageModalPage, { chain: this.chain, fullHash: fullHash });
      myModal.present();
    } else {
      let myModal = this.modalCtrl.create(ReceiveModalPage);
      myModal.present();
    }
  }

  logout() {
    this.accountData.logout();
    this.navCtrl.setRoot('LoginPage');
  }

  ngOnDestroy() {
    if (this.subscriptionTxs) {
      this.subscriptionTxs.unsubscribe();
    }
    if (this.subscriptionBalance) {
      this.subscriptionBalance.unsubscribe();
    }
    if (this.subscriptionUnconfirmedTxs) {
      this.subscriptionUnconfirmedTxs.unsubscribe();
    }
  }

}

