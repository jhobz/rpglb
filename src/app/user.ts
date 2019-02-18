export interface User {
	_id: string
	firstName: string
	lastName: string
	email: string
	username: string
	password: string
	attendanceDates?: {
		startDate: Date
		endDate: Date
	}
	twitch?: string,
	twitter?: string,
	discord?: string,
	phone?: string,
	emergencyContact?: {
		name: string,
		relationship: string,
		phone: string
	},
	onSite?: boolean,
	miscComments?: string
}

export default User
