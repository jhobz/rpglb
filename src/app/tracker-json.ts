export interface PaginationInfo<T> {
    count: number
    next: null | string
    previous: null | string
    results: T[]
}

type ModelType =
    | "ad"
    | "bid"
    | "country"
    | "countryregion"
    | "donation"
    | "donationbid"
    | "donor"
    | "event"
    | "interview"
    | "milestone"
    | "prize"
    | "run"
    | "speedrun"
    | "talent"

interface ModelBase {
    readonly type: ModelType
    readonly id: number
}

export type EventScreeningMode = "host_only" | "one_pass" | "two_pass"

export interface TrackerEvent extends ModelBase {
    readonly type: "event"
    short: string
    name: string
    hashtag: string
    datetime: Date
    timezone: string
    minimumdonation: number
    maximum_paypal_donation: number | null // null means to use the global setting
    receivername: string
    receiver_short: string
    receiver_solicitation_text: string
    receiver_logo: string
    receiver_privacy_policy: string
    paypalcurrency: string
    /**
     * @deprecated pseudo-alias for `screening_mode`
     */
    use_one_step_screening: boolean
    screening_mode: EventScreeningMode
    allow_donations: boolean
    /**
     * @deprecated alias for `archived`
     */
    readonly locked: boolean
    archived: boolean
    draft: boolean
    // returned with '?totals'
    /**
     * @deprecated alias for donation_total
     */
    amount?: number
    donation_total?: number
    donation_count?: number
    donation_max?: number
    donation_avg?: number
    donation_med?: number
}

export interface APIEvent extends Omit<TrackerEvent, "datetime"> {
    datetime: string
}

export interface Milestone extends ModelBase {
    readonly type: "milestone"
    event: number
    name: string
    run: null | number
    start: number
    amount: number
    visible: boolean
    description: string
    short_description: string
}

export interface APIMilestone extends Omit<Milestone, "event"> {
    event?: APIEvent
}

export interface Count {
    donors: number
    runs: number
    bids: number
    prizes: number
}

export interface Aggregate {
    count: number
    max?: string
    amount?: string
    avg?: number
    target: string
}
