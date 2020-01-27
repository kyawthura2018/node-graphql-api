const Web3 = require('web3');
const { PubSub } = require('apollo-server');

const pubsub = new PubSub();
//const API_URL = 'https://mainnet.infura.io/v3/6552a079b883464084aac4064feae737';
const EVENTS = require('../subscription/SubAccount');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';

const web3 = new Web3('wss://parity-ws.immin.io:443');

class account {
  constructor() {
    setInterval(() => {
      this.getAccounts();
    }, 10000);
  }
}

account.prototype.getAccounts = () => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db('test');
    dbo
      .collection('accounts')
      .find()
      .toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);
        db.close();
        result.forEach((element) => {
          getBalance(element.address);
          //console.log(element.address);
        });
        console.log(`${result.length} accounts are updated!!!!`);
      });
  });
};

var getBalance = (ethAccountAddress) => {
  web3.eth.getBalance(ethAccountAddress, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let ethbalance = web3.utils.fromWei(result, 'ether');
      //console.log(ethbalance + ' ETH');
      this.updateBalance(ethAccountAddress, ethbalance);
    }
  });
};

this.updateBalance = (ethAccountAddress, balance) => {
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    var dbo = db.db('test');
    var query = { address: ethAccountAddress };
    var newvalues = { $set: { balance: balance } };
    dbo.collection('accounts').updateOne(query, newvalues, (err, res) => {
      if (err) throw err;
      //console.log(ethAccountAddress + ' account is updated');
      pubsub.publish(EVENTS, {
        address: ethAccountAddress,
        balance: balance
      });
      db.close();
    });
  });
};

module.exports = account;
