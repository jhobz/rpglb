import { Pipe, PipeTransform } from '@angular/core'

import { convertMinutesToTimeString } from './time-range.directive'

@Pipe({
	name: 'timeToString'
})
export class TimeToStringPipe implements PipeTransform {

	transform(value: number, args?: any): string|false {
		return convertMinutesToTimeString(value)
	}

}
