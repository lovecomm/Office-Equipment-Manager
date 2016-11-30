const TOGGLE_IMPORTDATA_FORM_IS_SHOWING = 'TOGGLE_IMPORTDATA_FORM_IS_SHOWING'

export function toggleImportdataFormIsShowing () {
  console.log('in toggleImportdataFormIsShowing')
	return {
		type: TOGGLE_IMPORTDATA_FORM_IS_SHOWING,
	}
}

const initialState = {
  formIsShowing: false
}
export default function importData (state = initialState, action) {
	switch (action.type) {
	case TOGGLE_IMPORTDATA_FORM_IS_SHOWING:
		return {
			...state,
      formIsShowing: !state.formIsShowing
		}
	default:
		return state
	}
}
