import { Pipe, PipeTransform } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { UserService } from './user.service'

@Pipe({
	name: 'idToUsername'
})
export class IdToUsernamePipe implements PipeTransform {
	constructor(private userService: UserService) {}

	transform(value: string, args?: any): Observable<any> {
		return this.userService.getUsername(value)
			.map((res: any) => {
				return res.username
			})
	}

}
