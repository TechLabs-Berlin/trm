import * as React from "react"

import {
  ListContextProvider,
  Datagrid,
  TextField,
  Pagination,
  Loading
} from 'react-admin'

import { ChangesListField } from './changesListField'

const List = ({ records, isReady }) => {
  const [page, setPage] = React.useState(1)
  const perPage = 25

  if(!isReady) {
    return <Loading />
  }

  return (
      <ListContextProvider value={{
              data: records,
              ids: Object.keys(records),
              total: Object.keys(records).length,
              page,
              perPage,
              setPage,
              currentSort: { field: 'id', order: 'ASC' },
              basePath: "/posts", // TODO remove, but throws an error
              resource: 'posts', // TODO remove, but throws an error
              selectedIds: []
      }}>
          <Datagrid>
              <TextField source="state" />
              <TextField source="id" />
              <ChangesListField source="changes" />
          </Datagrid>
          <Pagination />
      </ListContextProvider >
  )
}

export default List
