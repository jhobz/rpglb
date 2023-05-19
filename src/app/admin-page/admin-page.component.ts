import { Component, OnInit, ViewChild } from '@angular/core'
import { MatSnackBar } from '@angular/material'
import { Router } from '@angular/router'

import { AuthenticationService, TokenUserInfo } from '../authentication.service'
import { User } from '../user'
import { UserService } from '../user.service'
import { SpeedrunEvent, SpeedrunEventService } from '../speedrun-event.service'

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
    providers: [UserService]
})
export class AdminPageComponent implements OnInit {
    userList: User[] = []
    attendees: User[] = []
    user: TokenUserInfo
    speedrunEvent: SpeedrunEvent = {
        name: '',
        shortname: '',
        cause: {
            name: '',
            url: ''
        }
    } as SpeedrunEvent
    adminControlsEnabled: boolean
    stateOptions = ['pre', 'live', 'post']
    @ViewChild('form') form: any

    constructor(
        private auth: AuthenticationService,
		private snackBar: MatSnackBar,
		private speedrunEventService: SpeedrunEventService,
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit() {
		this.user = this.auth.getUserInfo()
		if (!this.user || !this.user.roles || (!this.user.roles.includes('safety') && !this.user.roles.includes('admin'))) {
            this.router.navigate(['login'])
        }

        this.getUsers()

		this.speedrunEventService.getCurrentSpeedrunEvent()
			.subscribe((srEvent: SpeedrunEvent) => {
				this.speedrunEvent = srEvent
			})
    }

    getUsers() {
        this.userService.getUsers({limit: 100000})
            .subscribe(
                (users: User[]) => {
                    this.userList = users
                    this.attendees = this.userList.filter(u => u.roles.includes('attendee'))
                },
                (err: any) => {
                    if (err.status === 401) {
                        this.router.navigate(['login'])
                    } else {
                        console.error(err.message)
                    }
                })
    }

	enableAdminControls() {
		this.adminControlsEnabled = true
	}

    updateSpeedrunEvent(propertyName: string, propertyValue: any, readableName: string, readableValue: string) {
		this.speedrunEvent[propertyName] = propertyValue
		this.speedrunEventService.editSpeedrunEvent(this.speedrunEvent)
			.subscribe(
				(srEvent: SpeedrunEvent) => {
					this.snackBar.open(`${readableName} set to "${readableValue}" successfully!`, '', {
						duration: 5000,
						panelClass: ['snack-success', 'no-action']
					})
                    this.speedrunEvent = srEvent
				},
				(err: any) => {
					this.snackBar.open(`Failed to update ${readableName}!`, '', {
						duration: 5000,
						panelClass: ['snack-warn', 'no-action']
					})
					console.error('FAILED TO UPDATE SPEEDRUN EVENT')
                    this.speedrunEvent[propertyName] = !propertyValue
				})
    }

    updateState(property: string, value: any) {
        switch (property) {
            case 'gameSubmissions':
                this.updateSpeedrunEvent('areGameSubmissionsOpen', value, 'Game submissions', value ? 'open' : 'closed')
                break
            case 'gamesList':
                this.updateSpeedrunEvent('isGamesListPublic', value, 'Games list & schedule', value ? 'public': 'private')
                break
            case 'registration':
                this.updateSpeedrunEvent('isRegistrationOpen', value, 'Registration', value ? 'open' : 'closed')
                break
            case 'volunteerSubmissions':
                this.updateSpeedrunEvent('areVolunteerSubmissionsOpen', value, 'Volunteer submissions', value ? 'open' : 'closed')
                break
            case 'prizeSubmissions':
                this.updateSpeedrunEvent('arePrizeSubmissionsOpen', value, 'Prize submissions', value ? 'open' : 'closed')
                break
            case 'eventState':
                this.updateSpeedrunEvent('state', value, 'Event state', value)
                break
            default:
                console.error('unrecognized state change!')
        }
    }

    submitForm() {
		this.speedrunEventService.editSpeedrunEvent(this.speedrunEvent)
			.subscribe(
				(srEvent: SpeedrunEvent) => {
					this.snackBar.open(`Event info updated successfully!`, '', {
						duration: 5000,
						panelClass: ['snack-success', 'no-action']
					})
                    this.speedrunEvent = srEvent
				},
				(err: any) => {
					this.snackBar.open(`Failed to update event info!`, '', {
						duration: 5000,
						panelClass: ['snack-warn', 'no-action']
					})
					console.error('FAILED TO UPDATE SPEEDRUN EVENT')
				})
    }
}
