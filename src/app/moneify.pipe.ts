import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'moneify'
})
export class MoneifyPipe implements PipeTransform {

	transform(value: number, args?: any): string {
		if (!isFinite(value)) {
			return value.toString();
		}
		if (value === null) {
			value = 0;
		}

		const val = value.toFixed(2).split('.');
		val[0] = val[0].replace(/\d(?=(\d{3})+$)/g, '$&,');
		return `$${val.join('.')}`;
	}

}
