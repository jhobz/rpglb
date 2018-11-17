export class User {
	_id: string
	firstName: string
	lastName: string
	email: string
	username: string
	password: string

	constructor() {
		this.firstName = ''
		this.lastName = ''
		this.email = ''
		this.username = ''
		this.password = ''
	}
}

export default User
