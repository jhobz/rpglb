export interface TrackerJson {
	count: Count;
	agg: Aggregate;
}

export interface Count {
	donors: number;
	runs: number;
	bids: number;
	prizes: number;
}

export interface Aggregate {
	count: number;
	max?: string;
	amount?: string;
	avg?: number;
	target: string;
}
