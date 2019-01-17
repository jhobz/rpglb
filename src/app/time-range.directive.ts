import { Directive, Input } from '@angular/core'
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms'

@Directive({
	selector: '[appTimeRange]',
	providers: [{
		provide: NG_VALIDATORS,
		useExisting: TimeRangeValidatorDirective,
		multi: true
	}]
})
export class TimeRangeValidatorDirective implements Validator {
	@Input('appTimeRange') range: number[]
	private configurationError: SyntaxError =
		new SyntaxError('Incorrectly configured validator: timeRange. Must be in the form of [min, max].')

	validate(control: AbstractControl): {[key: string]: any} {
		// Do nothing if range isn't specified
		if (!this.range) {
			return null
		}

		if (typeof(this.range) === 'string') {
			try {
				this.range = JSON.parse(this.range)
			} catch (e) {
				throw this.configurationError
			}
		}

		if (!this.range.length || this.range.length > 2) {
			throw this.configurationError
		}

		if (this.range.length === 2) {
			const [min, max] = this.range
			return timeRangeValidator(min, max)(control)
		}

		// Length of range must be 1
		return timeRangeValidator(this.range[0])(control)
	}

}

function timeRangeValidator(...args: number[]): ValidatorFn {
	const minMinutes = args.length === 2 ? args[0] : 0
	const maxMinutes = args.length === 2 ? args[1] : args[0]
	return (control: AbstractControl): {[key: string]: any} => {
		const time = control.value
		const mins = convertTimeStringToMinutes(time)

		if (mins || mins === 0) {
			if (mins < minMinutes) {
				return {
					timeRange: { value: time, bound: 'min' }
				}
			} else if (mins > maxMinutes) {
				return {
					timeRange: { value: time, bound: 'max' }
				}
			}
		}

		return null
	}
}

export function convertMinutesToTimeString(mins: number): string|false {
	const nf = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 })
	return `${nf.format(Math.floor(mins / 60))}:${nf.format(mins % 60)}`
}

export function convertTimeStringToMinutes(time: string): number|false {
	const matches = time && time.match(/^([0-9]?[0-9]?[0-9]):([0-5][0-9])$/)
	const [hours, mins] =
		matches && matches.length ?
		matches.slice(-2).map((x: string) => parseInt(x, 10)) :
		[null, null]

	return (hours || hours === 0) && (mins || mins === 0) && hours * 60 + mins
}
