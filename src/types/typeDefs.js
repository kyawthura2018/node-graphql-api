const { gql } = require('apollo-server-express');

const typeDefs = gql`
	type Account {
		id: ID!
		address: String!
		balance: String!
	}

	type Query {
		getAccounts: [Account!]
		getAccount(address: String!): Account!
	}

	type Mutation {
		addAccount(address: String!): Account
		updateAccount: [Account]
	}

	type Subscription {
		accountCreated: [Account!]
	}
`;

module.exports = typeDefs;
