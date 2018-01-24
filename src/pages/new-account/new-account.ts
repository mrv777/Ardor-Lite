import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Screenshot } from '@ionic-native/screenshot';

import * as bip39 from 'bip39';

import { AccountData } from '../../providers/account-data';
import { AccountProvider } from '../../providers/account/account';

/**
 * Generated class for the NewAccountPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-new-account',
  templateUrl: 'new-account.html',
})
export class NewAccountPage {
  passphrase: string;
  accountID: string;
  qrCode: string;
  saved: boolean = false;
  cordovaAvailable: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public accountData: AccountData, public accountProvider: AccountProvider, private screenshot: Screenshot, public platform: Platform) {
    if (this.platform.is('cordova')) {
      this.cordovaAvailable = true;
    }
  }

  ionViewDidLoad() {
    this.passphrase = bip39.generateMnemonic();
    this.accountID = this.accountData.convertPasswordToAccount(this.passphrase);
    this.generateQRCode();
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateQRCode() {
    this.accountProvider.encodeQRCode(this.accountID)
      .subscribe(
        qrCode => { 
           this.qrCode = `data:image/png;base64,${qrCode}`;
        }
      );
  }

  save() {
    this.screenshot.save('jpg', 80).then(res => { 
      console.log(res.filePath);
    })
    .catch(() => console.error("screenshot error"));
    this.saved = true;
  }

  closeModal() {
    this.viewCtrl.dismiss(this.passphrase);
  }

}
