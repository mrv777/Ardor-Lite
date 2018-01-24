import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ViewController, Select, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import * as Big from 'big.js';

import { AccountData } from '../../providers/account-data';
import { TransactionsProvider } from '../../providers/transactions/transactions';

/**
 * Generated class for the SendModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-send-modal',
  templateUrl: 'send-modal.html',
})
export class SendModalPage {
  @ViewChild(Select) select: Select;

  private sendForm : FormGroup;
  recipient: string = '';
  amount: number = 0;
  chain: string;
  message: string;
  status: number;
  disableSend: boolean = false;
  resultTxt: string = '';
  currentDecimals: number = 100000000;
  cordovaAvailable: boolean = false;
  contacts: object[];

  constructor(public navCtrl: NavController, public accountData: AccountData, public navParams: NavParams, public viewCtrl: ViewController, public transactionsProvider: TransactionsProvider, private barcodeScanner: BarcodeScanner, private formBuilder: FormBuilder, public platform: Platform) {
    this.sendForm = this.formBuilder.group({
      recipientForm: ['', Validators.required],
      amountForm: ['', Validators.required],
      messageForm: []
    });
    if (navParams.get('address')) {
      this.recipient = navParams.get('address');
    }

    if (this.platform.is('cordova')) {
      this.cordovaAvailable = true;
    }
  }

  ionViewDidLoad() {
    this.chain = this.accountData.getChain();
    this.currentDecimals = this.accountData.getDecimals();
    this.loadContacts();
    console.log('ionViewDidLoad SendModalPage');
  }

  onSend() {
    this.disableSend = true;
    let amountBig = new Big(this.amount);
    let convertedAmount = new Big(amountBig.times(this.currentDecimals));
    this.resultTxt = `Attempting to send ${this.recipient} ${amountBig} ${this.chain}`;
    this.status = 0;
    this.transactionsProvider.sendMoney(this.chain, this.recipient, convertedAmount, this.message)
      .subscribe(
        unsignedBytes => {
          // console.log(unsignedBytes['unsignedTransactionBytes']);
          // console.log(this.accountData.signTransaction(unsignedBytes['unsignedTransactionBytes']));
          if (unsignedBytes['errorDescription']) {
              this.resultTxt = unsignedBytes['errorDescription'];
              this.disableSend = false;
              this.status = -1;
          } else {
            this.transactionsProvider.broadcastTransaction(this.accountData.signTransaction(unsignedBytes['unsignedTransactionBytes']))
            .subscribe(
              broadcastResults => {
                console.log(broadcastResults);
                if (broadcastResults['fullHash'] != null) {
                  this.resultTxt = `Successfully sent! Transaction fullHash: ${broadcastResults['fullHash']}`;
                  this.status = 1;
                } else {
                  this.resultTxt = 'Send Failed';
                  this.status = -1;
                  this.disableSend = false;
                }
              }
            );
          }
        }
      );
  }

  openBarcodeScanner() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.recipient = barcodeData['text'];
    }, (err) => {
        // An error occurred
    });
  }

  openContacts() {
    this.select.open();
  }

  loadContacts() {
    this.accountData.getContacts().then((currentContacts) => {
      if (currentContacts != null) {
        this.contacts = currentContacts;
      } else {
        this.contacts = [{ name:'No Saved Contacts',account:'' }];
      }
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
