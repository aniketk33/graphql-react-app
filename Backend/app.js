'use strict'

const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const graphql = require('graphql')
const { getDbConnection } = require('./db')

const PORT = 4000

const StatsDataModel = new graphql.GraphQLObjectType({
    name: 'StatsObject',
    fields: {
        id: { type: graphql.GraphQLInt},
        state: { type: graphql.GraphQLString},
        total_cases: { type: graphql.GraphQLFloat},
        total_death: { type: graphql.GraphQLFloat},
        new_case: { type: graphql.GraphQLFloat},
        new_death: { type: graphql.GraphQLFloat},
        submission_date: { type: new graphql.GraphQLScalarType({
            name: 'Date',
            serialize(value) {
              return value.toISOString();
            },
          })}
    }
})

const getDBResults = async ()=>{
    try {
        const dbConnection = await getDbConnection()
        const query = 'select submission_date, state, tot_cases as total_cases, tot_death as total_death, new_case, new_death from stats_new order by state, submission_date;'
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
  
  app.all('*', (req, res) => {
    res.json({
        error: "Page not found"
    })
})


  app.listen(PORT);  