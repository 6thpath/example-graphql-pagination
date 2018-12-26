const data = [
  {
    completed: false,
    id: 'cjl0t6qt2000p3j10f6dd7jnk',
    title: 'index overriding Games'
  },
  {
    completed: false,
    id: 'cjl0t6qt4001d3j10pho0yqxy',
    title: 'target enhance asymmetric'
  },
  {
    completed: false,
    id: 'cjl0t6qt4001d3j10pho0yqxy',
    title: 'target enhance asymmetric'
  },
  {
    completed: false,
    id: 'cjl0t6qt4001d3j10pho0yqxy',
    title: 'target enhance asymmetric'
  },
  {
    completed: false,
    id: 'cjl0t6qt4001d3j10pho0yqxy',
    title: 'target enhance asymmetric'
  },
  {
    completed: false,
    id: 'cjl0t6qt4001d3j10pho0yqxy',
    title: 'target enhance asymmetric'
  }
]

export const allTodos = (_, { first, offset = 0}) => {
  const totalCount = data.length
  const todos = first === undefined
    ? data.slice(offset)
    : data.slice(offset, offset + first)

  const result = {
    todos,
    totalCount
  }

  return result
}

export const allTodosCursor = (_, { after, first }) => {
  if (first < 0) {
    throw new UserInputError('First must be positive')
  }
  const totalCount = data.length
  let todos = []
  let start = 0
  if (after !== undefined) {
    const buff = new Buffer(after, 'base64')
    const id = buff.toString('ascii')
    const index = data.findIndex((todo) => todo.id === id)
    if (index === -1) {
      throw new UserInputError('After does not exist')
    }
    start = index + 1
  }

  todos = first === undefined
    ? data
    : data.slice(start, start + first)

  let endCursor
  const edges = todos.map((todo) => {
    const buffer = new Buffer(todo.id)
    endCursor = buffer.toString('base64')
    return ({
      cursor: endCursor,
      node: todo
    })
  })

  const hasNextPage = start + first < totalCount
  const pageInfo = endCursor !== undefined ?
    {
      endCursor,
      hasNextPage
    } :
    {
      hasNextPage
    }

  const result = {
    edges,
    pageInfo,
    totalCount
  }

  return result
}
