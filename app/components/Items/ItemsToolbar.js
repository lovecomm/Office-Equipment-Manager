import React from 'react'
import { IconMenu, IconButton, MenuItem } from 'material-ui'
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more'
import { Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator } from 'material-ui/Toolbar'
import { FormTogglesContainer } from 'containers'
import { menuMoreIcon } from './styles.css'

export default function ItemsToolbar (props) {
	return (
		<Toolbar>
      <ToolbarGroup firstChild={true}>
        <ToolbarTitle text='Items' style={{marginLeft: '24px'}}/>
      </ToolbarGroup>
			<ToolbarGroup>
				<ToolbarSeparator />
				<IconMenu
					iconButtonElement={<IconButton className={menuMoreIcon}><NavigationExpandMoreIcon /></IconButton>}
					targetOrigin={{horizontal: 'right', vertical: 'top'}}
					anchorOrigin={{horizontal: 'right', vertical: 'bottom'}} >
						<MenuItem className={menuMoreIcon} primaryText='Add Item' />
						<FormTogglesContainer />
				</IconMenu>
			</ToolbarGroup>
    </Toolbar>
	)
}
