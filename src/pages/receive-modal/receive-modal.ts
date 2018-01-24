import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { AccountData } from '../../providers/account-data';
import { AccountProvider } from '../../providers/account/account';

/**
 * Generated class for the ReceiveModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-receive-modal',
  templateUrl: 'receive-modal.html',
})
export class ReceiveModalPage {
  qrCode: string;
  accountID: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountData: AccountData, public accountProvider: AccountProvider, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.accountID = this.accountData.getAccountID();
    this.generateQRCode();
  }

  generateQRCode() {
    this.accountProvider.encodeQRCode(this.accountID)
      .subscribe(
        qrCode => {
           this.qrCode = `data:image/png;base64,${qrCode}`;
        }
      );
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
