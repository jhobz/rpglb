import { DonationService } from './donation.service'

export class SpeedrunEvent {
	name: string
	shortName: string
	cause: string
	causeLink: string
	donations: DonationData
	trackerId: number
}

export interface DonationData {
	goal: number
	total: number
}
