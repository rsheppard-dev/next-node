export type Invite = {
	id: string;
	inviterId: string;
	inviteDate: Date;
	joinDate: Date;
	role: 'member' | 'admin';
	email: string;
	groupId: string;
	group: {
		name: string;
	};
	inviteCode: string;
	message: string;
	status: 'sent' | 'viewed' | 'accepted' | 'rejected';
	createdAt: Date;
	updatedAt: Date;
	iat: number;
	exp: number;
};

export type InviteIssue = {
	email: string;
	issue: string;
};

export type CreateInviteResponse = {
	invites: Invite[];
	issues: InviteIssue[];
};

export type GetInvitesResponse = {
	invitesSent: Invite[];
	invitesReceived: Invite[];
};
