type Invite = {
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

type InviteIssue = {
	email: string;
	issue: string;
};

type CreateInviteResponse = {
	invites: Invite[];
	issues: InviteIssue[];
};

type GetInvitesResponse = {
	invitesSent: Invite[];
	invitesReceived: Invite[];
};
