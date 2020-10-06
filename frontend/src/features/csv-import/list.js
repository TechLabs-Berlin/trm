import * as React from "react"

import {
  ListContextProvider,
  Datagrid,
  TextField,
  Loading
} from 'react-admin'

import { ChangesListField } from './changesListField'

const List = ({ records, isReady }) => {
  if(!isReady) {
    return <Loading />
  }

  return (
      <ListContextProvider value={{
              data: records,
              ids: Object.keys(records),
              total: Object.keys(records).length,
              currentSort: { field: 'id', order: 'ASC' },
              basePath: "/posts", // TODO remove, but throws an error
              resource: 'posts', // TODO remove, but throws an error
              selectedIds: []
      }}>
          <Datagrid>
              <TextField source="state" sortable={false} />
              <TextField source="id" sortable={false} />
              <ChangesListField source="changes" sortable={false} />
          </Datagrid>
      </ListContextProvider >
  )
}

export default List
