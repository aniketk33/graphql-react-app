'use strict'

const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const graphql = require('graphql')
const { getDbConnection } = require('./db')

const StatsDataModel = new graphql.GraphQLObjectType({
    name: 'StatsObject',
    fields: {
        id: { type: graphql.GraphQLInt},
        state: { type: graphql.GraphQLString},
        total_cases: { type: graphql.GraphQLFloat},
        total_death: { type: graphql.GraphQLFloat},
        new_case: { type: graphql.GraphQLFloat},
        new_death: { type: graphql.GraphQLFloat},

    }
})

const getDBResults = async ()=>{
    try {
        const dbConnection = await getDbConnection()
        const query = 'SELECT state, sum(total_cases) as total_cases, sum(total_death) as total_death, sum(new_case) as new_case, sum(new_death) as new_death FROM stats GROUP BY state ORDER BY state;'
        const formatted_query = dbConnection.format(query);
        const [data] = await dbConnection.query(formatted_query)
        return data        
    } catch (error) {
        return error
    }
}

const QueryRoot = new graphql.GraphQLObjectType({
    name: 'Statistics',
    fields: () => ({
      statistics: {
        type: new graphql.GraphQLList(StatsDataModel),
        resolve: async() => {
            try {
                const res = await getDBResults()
                return res
                
            } catch (error) {
                return error
            }
        }
      }
    })
  })
      
  const schema = new graphql.GraphQLSchema({ query: QueryRoot });
      
  const app = express();
  app.use('/stats', graphqlHTTP({
    schema: schema,
    graphiql: true,
  }));
  app.listen(4000);  