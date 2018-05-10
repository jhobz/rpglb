import { inject, TestBed } from '@angular/core/testing';

import { DonationService } from './donation.service';

describe('DonationService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DonationService]
		});
	});

	it('should be created', inject([DonationService], (service: DonationService) => {
		expect(service).toBeTruthy();
	}));
});
