const { Account } = require('../model/Account');
const { PubSub } = require('apollo-server');
const EVENTS_CREATED = require('../subscription/SubAccount');

const Web3 = require('web3');
const web3 = new Web3('wss://parity-ws.immin.io:443');

const pubsub = new PubSub();

const resolvers = {
	Query: {
		getAccounts: async () => await Account.find().exec(),
		getAccount: async (_, args) => await Account.find({ address: args.address })
	},
	Mutation: {
		addAccount: async (_, args) => {
			try {
				let result = await web3.eth.getBalance(args.address);
				args.balance = web3.utils.fromWei(result, 'ether');
				let response = await Account.create(args);
				let accounts = await Account.find({}).exec();
				pubsub.publish(EVENTS_CREATED, {
					updatedAccounts: accounts
				});
				return response;
			} catch (e) {
				return e.message;
			}
		},
		updateAccount: async () => {
			try {
				let prevAccounts = await Account.find({}).exec();
				prevAccounts.forEach(async (account) => {
					await getBalance(account.address);
				});
				//console.log('after update');
				let updateAccounts = await Account.find({}).exec();
				//console.log(prevAccounts[1].address + ' accounts');
				pubsub.publish(EVENTS_CREATED, { updatedAccounts: updateAccounts });
				return updateAccounts;
			} catch (error) {
				return error.message;
			}
		}
	},
	Subscription: {
		accountCreated: {
			resolve: (account) => {
				const { updatedAccounts } = account;
				return updatedAccounts;
			},
			subscribe: () => pubsub.asyncIterator(EVENTS_CREATED)
		}
	}
};

var getBalance = async (ethAccountAddress) => {
	await web3.eth.getBalance(ethAccountAddress, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			let balance = web3.utils.fromWei(result, 'ether');
			Account.updateOne(
				{ address: ethAccountAddress },
				{ $set: { balance: balance } }
			);
			//console.log(`${balance} ETH`);
		}
	});
};

setInterval(resolvers.Mutation.updateAccount, 10000);

module.exports = resolvers;
