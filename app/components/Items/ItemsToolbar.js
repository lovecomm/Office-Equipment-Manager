import React from 'react'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'

export default function ItemsToolbar (props) {
	return (
		<Toolbar>
      <ToolbarGroup firstChild={true}>
        <ToolbarTitle text='Items' style={{marginLeft: '24px'}}/>
      </ToolbarGroup>
    </Toolbar>
	)
}
