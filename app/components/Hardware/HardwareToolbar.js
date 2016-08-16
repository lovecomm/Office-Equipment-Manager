import React from 'react'
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'
import { ModalHardwareContainer } from 'containers'

export default function HardwareToolbar (props) {
	return (
		<Toolbar>
      <ToolbarGroup firstChild={true}>
        <ToolbarTitle text='Hardware' style={{marginLeft: '24px'}}/>
      </ToolbarGroup>
			<ToolbarGroup>
				<ModalHardwareContainer />
			</ToolbarGroup>
    </Toolbar>
	)
}
