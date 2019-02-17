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
}

export default User
