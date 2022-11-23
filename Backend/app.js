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
      
  const filteredQueryRoot = new graphql.GraphQLObjectType({
    name: 'filteredStats',
    fields: ()=>({
        filteredStats: {
            type: new graphql.GraphQLList(StatsDataModel),
            args: {
                inputDate: { type: graphql.GraphQLString }
              },        
            resolve: async(_, {inputDate}) => {
                try {
                    const res = await getDBResults()
                    const filteredResponse = res.filter((x)=> {
                        const date = new Date(x.submission_date)
                        var day = ''
                        if (date.getDate() <= 9) {
                            day = `0${date.getDate()}`
                        } else {
                            day = date.getDate()
                        }
                        var month = ''
                        if (date.getMonth() <= 8) {
                            month = `0${date.getMonth()+1}`
                        } else {
                            month = date.getMonth()+1
                        }
                        const year = date.getFullYear();
                        const dateString = `${year}-${month}-${day}`;
                        return dateString == inputDate
                    })
                    return filteredResponse
                    
                } catch (error) {
                    return error
                }
            }
        }
    })
  })

  const schema = new graphql.GraphQLSchema({ query: QueryRoot });
  const filteredSchema = new graphql.GraphQLSchema({ query: filteredQueryRoot });
      
  const app = express();
  app.use('/stats', graphqlHTTP({
    schema: schema,
    graphiql: true,
  }));

  app.use('/filtered-stats', graphqlHTTP({
    schema: filteredSchema,
    graphiql: true
  }))

  app.get('/test', (req, res)=>{
      res.json({
          message: "Testing message from docker: Update 3"
      })
  })
  
  app.all('*', (req, res) => {
    res.json({
        error: "Page not found"
    })
})


  app.listen(PORT);  