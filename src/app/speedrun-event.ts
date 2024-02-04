import { DonationService } from './donation.service'

// TODO: Move DonationData into DonationService and get rid of duplicate SpeedrunEvent object (delete this page)

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
