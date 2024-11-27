import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HealthPolicyComponent } from "./health-policy.component";

describe("CovidPolicyComponent", () => {
	let component: HealthPolicyComponent;
	let fixture: ComponentFixture<HealthPolicyComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [HealthPolicyComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HealthPolicyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
