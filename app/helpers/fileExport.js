import { getItemsBound, getPeopleBound, getHardwaresBound } from 'helpers/api'


export default function fileExport () {
	getItemsBound(({items, sortedItemIds}) => {
		getPeopleBound((people) => {
			getHardwaresBound((hardwares) => {
				console.log('items', items, 'sortedItemIds', sortedItemIds, 'people', people, 'hardwares', hardwares)
			})
		})
	})
}
