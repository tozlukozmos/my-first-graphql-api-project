const { ApolloServer, gql } = require('apollo-server');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const data = require('./data.json');

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        events: [Event!]!
    }
    type Event {
        id: ID!
        title: String!
        desc: String!
        date: String!
        from: String!
        to: String!
        location_id: ID!
        location: Location!
        user_id: ID!
        user: User!
        participants: [Participant!]!
    }
    type Location {
        id: ID!
        name: String!
        desc: String!
        lat: Int!
        lng: Int!
    }
    type Participant {
        id: ID!
        user_id: ID!
        user: User!
        event_id: ID!
        event: Event!
    }
    type Query {
        users: [User!]!
        user(id: Int!): User!
        events: [Event!]!
        event(id: Int!): Event!
        locations: [Location!]!
        location(id: Int!): Location!
        participants: [Participant!]!
        participant(id: Int!): Participant!
    }
`;
const resolvers = {
    Query: {
        users: () => data.users,
        user: (parent, args) => data.users.find(user => user.id === args.id),
        events: () => data.events,
        event: (parent, args) => data.events.find(event => event.id === args.id),
        locations: () => data.locations,
        location: (parent, args) => data.locations.find(location => location.id === args.id),
        participants: () => data.participants,
        participant: (parent, args) => data.participants.find(participant => participant.id === args.id),
    },
    User: {
        events: (parent) => data.events.filter(event => event.user_id === parent.id),
    },
    Event: {
        user: (parent) => data.users.find(user => user.id === parent.user_id),
        location: (parent) => data.locations.find(location => location.id === parent.location_id),
        participants: (parent) => data.participants.filter(participant => participant.event_id === parent.id),
    },
    Participant: {
        user: (parent) => data.users.find(user => user.id === parent.user_id),
        event: (parent) => data.events.find(event => event.id === parent.event_id),
    },
};

const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})] 
});
server.listen().then(({ url }) => {console.log(`🚀  Server ready at ${url}`);});

