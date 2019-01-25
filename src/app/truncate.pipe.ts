import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
	name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

	transform(value: string, limit: number = 200, wholeWords: boolean = false, mark: string = '...'): string {
		if (!value || value.length <= limit) {
			return value
		}

		if (wholeWords) {
			limit = value.substr(0, limit).lastIndexOf(' ')
		}
		return `${value.substr(0, limit)}${mark}`
	}

}
