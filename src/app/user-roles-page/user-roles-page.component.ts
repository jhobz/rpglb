import { Component, OnInit, ViewChild } from "@angular/core"
import { AuthenticationService, TokenUserInfo } from "../authentication.service"
import { MatPaginator, MatSnackBar } from "@angular/material"
import { User } from "../user"
import { UserService } from "../user.service"
import { Router } from "@angular/router"
import { startWith, switchMap, catchError, map } from "rxjs/operators"
import { merge } from "rxjs/observable/merge"
import { of as observableOf } from 'rxjs/observable/of'
import { FormControl } from "@angular/forms"

@Component({
    selector: "app-user-roles-page",
    templateUrl: "./user-roles-page.component.html",
    styleUrls: ["./user-roles-page.component.css"],
    providers: [UserService]
})
export class UserRolesPageComponent implements OnInit {
    user: TokenUserInfo
    displayedColumns = ['username','email','roles','id']
    dataSource: User[] = []

    resultsLength = 0
    isLoadingResults = true

    @ViewChild(MatPaginator) paginator: MatPaginator
    filter: FormControl

    constructor(
        private auth: AuthenticationService,
        private snackBar: MatSnackBar,
        private userService: UserService,
        private router: Router
    ) {}

    ngOnInit() {
        this.user = this.auth.getUserInfo();
        if (!this.user || !this.user.roles || !this.user.roles.includes("admin")) {
            this.router.navigate(["login"])
        }

        this.filter = new FormControl('')

        this.setupTable()
    }

    setupTable() {
        this.filter.valueChanges.subscribe(() => this.paginator.pageIndex = 0)

        merge(this.filter.valueChanges, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true
                    return this.userService.getPaginatedUsers({
                        page: this.paginator.pageIndex + 1,
                        limit: 30,
                        filter: this.filter.value.trim().toLowerCase()
                    })
                }),
                map(data => {
                    this.isLoadingResults = false
                    this.resultsLength = data.total

                    return data.docs
                }),
                catchError((err) => {
                    if (err.status === 401) {
                        this.router.navigate(['login'])
                    }

                    console.error(err.message)
                    this.isLoadingResults = false
                    return observableOf([])
                })
            ).subscribe((data) => {
                this.dataSource = data
            })
    }

    onRowClick(user) {
        console.log('row clicked', user)
    }
}
