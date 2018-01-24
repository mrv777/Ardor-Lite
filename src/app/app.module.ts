import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { SecureStorage } from '@ionic-native/secure-storage';
import { Screenshot } from '@ionic-native/screenshot';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ContactsPage } from '../pages/contacts/contacts';
import { LoginPage } from '../pages/login/login';
import { SendModalPage } from '../pages/send-modal/send-modal';
import { ReceiveModalPage } from '../pages/receive-modal/receive-modal';
import { MessageModalPage } from '../pages/message-modal/message-modal';
import { EditContactModalPage } from '../pages/edit-contact-modal/edit-contact-modal'
import { CexchangeModalPage } from '../pages/cexchange-modal/cexchange-modal'
import { CexchangePage } from '../pages/cexchange/cexchange';
import { TransactionsPage } from '../pages/transactions/transactions';
import { NewAccountPage } from '../pages/new-account/new-account';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AccountData } from '../providers/account-data';
import { AccountProvider } from '../providers/account/account';
import { TransactionsProvider } from '../providers/transactions/transactions';
import { ConstantsProvider } from '../providers/constants/constants';
import { CapitalSpacesPipe } from '../pipes/capital-spaces/capital-spaces';
import { CexchangeProvider } from '../providers/cexchange/cexchange';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ListPage,
    ContactsPage,
    SendModalPage,
    ReceiveModalPage,
    MessageModalPage,
    EditContactModalPage,
    CexchangePage,
    CexchangeModalPage,
    TransactionsPage,
    NewAccountPage,
    CapitalSpacesPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: HomePage, name: 'HomePage', segment: 'home' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
      ]
    }),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ContactsPage,
    LoginPage,
    SendModalPage,
    ReceiveModalPage,
    MessageModalPage,
    EditContactModalPage,
    CexchangePage,
    CexchangeModalPage,
    NewAccountPage,
    TransactionsPage
  ],
  providers: [
    AccountData,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AccountProvider,
    TransactionsProvider,
    ConstantsProvider,
    BarcodeScanner,
    FingerprintAIO,
    SecureStorage,
    Screenshot,
    CexchangeProvider
  ]
})
export class AppModule {}
