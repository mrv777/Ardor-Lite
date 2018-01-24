import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

declare var require: any;
const ardorjs = require('ardorjs');
//import { nxtjs } from 'nxtjs';

@Injectable()
export class AccountData {
  SAVED_ACCOUNTS;
  ACCOUNT_ID;
  PASSWORD;
  PUBLIC_KEY;
  CHAIN;
  DECIMALS;
  API_URL = "https://ardor.jelurida.com/";
  SAVED_PASSWORD = "";
  MAINNET_NODES = ['https://ardor.tools/ardor/','http://52.54.198.224:27876/','http://217.182.72.43:27876/'];
  TESTNET_NODES = ['https://testardor.jelurida.com/',];

  constructor(
    public events: Events,
    public storage: Storage,
    private secureStorage: SecureStorage
  ) {
      this.secureStorage.create('ardor_lite_password')
      .then((storage: SecureStorageObject) => {
        storage.get('password')
        .then(
          data => { this.SAVED_PASSWORD = data; },
          error => console.log(error)
        );
      });

  }

  login(password: string, savePassword: boolean): void {
    this.PASSWORD = password;
    if (savePassword){ 
      this.secureStorage.create('ardor_lite_password')
      .then((storage: SecureStorageObject) => {
        storage.set('password', password)
        .then(
          data => { this.SAVED_PASSWORD = password; },
          error => console.log(error)
        );
      });
    }

    this.CHAIN = 'ARDR';
    this.DECIMALS = 100000000;
    this.PUBLIC_KEY = ardorjs.secretPhraseToPublicKey(password);
    
    let accountID = ardorjs.secretPhraseToAccountId(password);
    this.ACCOUNT_ID = accountID;
    this.storage.set(this.SAVED_ACCOUNTS, accountID);
    this.setAccountID(accountID);
    
    this.events.publish('user:login');
  };

  getSavedPassword(): string {
    return this.SAVED_PASSWORD;
  }

  logout(): void {
    this.PASSWORD = null;
    this.PUBLIC_KEY = null;
    this.ACCOUNT_ID = null;
    this.storage.remove('accountID');
    this.events.publish('user:logout');
  };

  setAccountID(accountID: string): void {
    this.ACCOUNT_ID = accountID;
  };

  getAccountID(): string {
    return this.ACCOUNT_ID;
  };

  setChain(chain: string): void {
    this.CHAIN = chain;
  };

  setDecimals(decimals: number): void {
    this.DECIMALS = decimals;
  };

  getDecimals(): number {
    return this.DECIMALS;
  };
  
  getChain(): string {
    return this.CHAIN;
  };
  
  getPublicKey(): string {
    return this.PUBLIC_KEY;
  };

  hasLoggedIn(): boolean {
    if (this.PASSWORD == null)
        return false;
    else
        return true;
  };

  addContact(name: string, account: string): Promise<void> {
    return this.getContacts().then((currentContacts) => {
      if (currentContacts != null) {
        currentContacts.push({ name: name, account: account});
      } else {
        currentContacts = [{ name: name, account: account}];
      }
      this.storage.set(`${this.ACCOUNT_ID}contacts`, currentContacts);
    });
  }

  editContact(name: string, account: string): Promise<void> {
    return this.getContacts().then((currentContacts) => {
      let index = currentContacts.findIndex(x => x['account']==account);
      if (index !== -1) {
          currentContacts[index]['name']=name;
      }
      this.storage.set(`${this.ACCOUNT_ID}contacts`, currentContacts);
    });
  }

  removeContact(account: string): Promise<void> {
    return this.getContacts().then((currentContacts) => {
      // let index = currentContacts.indexOf(account);
      let index = currentContacts.findIndex(x => x['account']==account);
      if (index !== -1) {
          currentContacts.splice(index,1);
      }
      this.storage.set(`${this.ACCOUNT_ID}contacts`, currentContacts);
    });
  }

  getContacts(): Promise<object[]> {
    return this.storage.get(`${this.ACCOUNT_ID}contacts`).then((value) => {
        return value;
    });
  }

  setNode(node: string): Promise<void> {
    if (node == 'mainnet'){
      this.API_URL = this.MAINNET_NODES[Math.floor(Math.random() * (this.MAINNET_NODES.length) )];
    } else if (node == 'testnet') {
      this.API_URL = this.TESTNET_NODES[Math.floor(Math.random() * (this.TESTNET_NODES.length) )];
    } else {
      this.API_URL = node.replace(/\/?$/, '/');
    }
    return this.storage.set(`node`, this.API_URL);
  };

  getNodeFromMemory(): string {
      return this.API_URL;
  }

  getNode(): Promise<string> {
    return this.storage.get(`node`).then((value) => {
        return value;
    });
  }

  isTestNetNode(node): boolean {
    const index = this.TESTNET_NODES.indexOf(node);
    if (index >= 0) {
      return true;
    } else {
      return false;
    }
  }

  isMainNetNode(node): boolean {
    const index = this.MAINNET_NODES.indexOf(node);
    if (index >= 0) {
      return true;
    } else {
      return false;
    }
  }

  convertPasswordToAccount(password): string {
    return ardorjs.secretPhraseToAccountId(password);
  }

  signTransaction(unsignedTransactionBytes: string): string  {
    return ardorjs.signTransactionBytes(unsignedTransactionBytes, this.PASSWORD);
  }
}