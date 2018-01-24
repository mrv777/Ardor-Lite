import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { TransactionsProvider } from '../../providers/transactions/transactions';

/**
 * Generated class for the MessageModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-message-modal',
  templateUrl: 'message-modal.html',
})
export class MessageModalPage {
  chain: string;
  fullHash: string;
  sender: string;
  message: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public transactionsProvider: TransactionsProvider, public viewCtrl: ViewController) {
    this.chain = navParams.get('chain');
    this.fullHash = navParams.get('fullHash');
  }

  ionViewDidLoad() {
    this.transactionsProvider.getTransaction(this.chain, this.fullHash)
    .subscribe(
      transaction => {
        this.sender = transaction['senderRS'];
        this.message = transaction['attachment']['message'];
      }
    );
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
