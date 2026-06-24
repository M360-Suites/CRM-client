export interface Deal {
	id: string;
	title: string;
	value: number;
	source: string;
	industry: string;
	stage_id: string;
	company: null;
	stage_changed_at: string;
	created_at: string;
	updated_at: string;
}

export interface PipelineStage {
	id: string;
	name: string;
	position: number;
	is_won: boolean;
	is_lost: boolean;
}

export interface PipelineTeamMembers {
	id: string;
	display_name: string;
	email: string;
}

export interface PipelineBoard {
	stages: {
		id: string;
		name: string;
		total_deals: number;
		total_value: number;
		position: number;
		is_won: boolean;
		is_lost: boolean;
		assignees: {
			id: string;
			display_name: string;
			email: string;
		}[];
		deals: Deal[];
	}[];
	team_members: PipelineTeamMembers[];
}
