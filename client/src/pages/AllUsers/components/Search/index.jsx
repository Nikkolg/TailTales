import React from 'react'

export const Search = ({setSearchUsers}) => (
    <div>
      <input type="text" placeholder="Search" onChange={(e) => setSearchUsers(e.target.value)} />
    </div>
)

