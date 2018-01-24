import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

import { AccountData } from '../../providers/account-data';
import { ConstantsProvider } from '../../providers/constants/constants';
import { HomePage } from '../home/home';
import { NewAccountPage } from '../new-account/new-account';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private loginForm : FormGroup;
  password: string = '';
  hideCustom: boolean;
  disableLogin: boolean = false;
  node: string;
  nodeSelect: string;
  savePassword: boolean = false;
  fingerAvailable: boolean = false;
  cordovaAvailable: boolean = false;
  message: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public accountData: AccountData, private barcodeScanner: BarcodeScanner, private formBuilder: FormBuilder, private faio: FingerprintAIO, public modalCtrl: ModalController, public constantsProvider: ConstantsProvider, public platform: Platform) {
    this.loginForm = this.formBuilder.group({
      passwordForm: ['', Validators.required],
      nodeForm: ['', Validators.required],
      nodeSelectForm: [''],
      savePasswordForm: [''],
    });

    if (this.platform.is('cordova')) {
      this.cordovaAvailable = true;
      this.faio.isAvailable().then((available) => {
        if (available == 'OK' || available == 'Available') {
          this.fingerAvailable = true;
        } else {
          this.fingerAvailable = false;
        }
      });
    }

    this.accountData.getNode().then((node) => {
      if (node == null) {
        this.node = "mainnet";
        this.nodeSelect = "mainnet";
        this.hideCustom = true;
      } else {
        if (this.accountData.isMainNetNode(node)) {
          this.node = "mainnet";
          this.nodeSelect = "mainnet";
          this.hideCustom = true;
        } else if (this.accountData.isTestNetNode(node)) {
          this.node = "testnet";
          this.nodeSelect = "testnet";
          this.hideCustom = true;
        } else {
          this.node = node;
          this.nodeSelect = node;
          this.hideCustom = false;
        }
      }
    });
  }

  onLogin() {
    this.disableLogin = true;
    this.accountData.setNode(this.node).then(() => {
      this.constantsProvider.getConstants()
      .subscribe(
        nodeOnline => {
          if (nodeOnline['offline'] == null) {
            this.accountData.login(this.password, this.savePassword);
            this.navCtrl.setRoot(HomePage);
          } else {
            // Try the node one more time, before failing
            this.accountData.setNode(this.node).then(() => {
              this.constantsProvider.getConstants()
              .subscribe(
                nodeOnline2 => {
                  if (nodeOnline2['offline'] == null) {
                    this.accountData.login(this.password, this.savePassword);
                    this.navCtrl.setRoot(HomePage);
                  } else {
                    this.message = 'Node appears to be offline. Try again shortly.';
                    this.disableLogin = false;
                  }
                }
              );
            });
          }
        }
      );
    });
  }

  changeNode() {
    if (this.nodeSelect == "") {
      this.hideCustom = false;
    } else {
      this.hideCustom = true;
    }
    this.node = this.nodeSelect;
  }

  openBarcodeScanner() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.password = barcodeData['text'];
    }, (err) => {
        // An error occurred
    });
  }

  openModal() {
    let myModal = this.modalCtrl.create(NewAccountPage);
    myModal.present();
    myModal.onDidDismiss(data => {
      this.password = data;
    });
  }

  showFingerprint() {
    this.faio.show({
      clientId: 'Ardor-Lite',
      clientSecret: 'CHANGE', //Only necessary for Android
      disableBackup: false  //Only for Android(optional)
    })
    .then((result: any) => { console.log(result.withFingerprint); this.password = this.accountData.getSavedPassword(); } )
    .catch((error: any) => console.log(error));
  }

}
