import 'dotenv/config'
import { ApolloServer, gql } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import { allTodos, allTodosCursor } from './data/todo'

const app = express()

app.use(cors())
app.use((_, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  return next()
})

const typeDefs = gql`
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
  }

  type TodosResult {
    todos: [Todo]
    totalCount: Int
  }

  type Edge {
    cursor: String!
    node: Todo!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
  }

  type TodosResultCursor {
    edges: [Edge]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type Query {
    allTodos(
      first: Int,
      offset: Int
    ): TodosResult

    allTodosCursor(
      after: String
      first: Int,
    ): TodosResultCursor
  }
`

const resolvers = {
  Query: {
    allTodos,
    allTodosCursor
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.applyMiddleware({ app })

app.listen({ port: process.env.PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
)
