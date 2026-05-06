import type { INodeProperties } from 'n8n-workflow';

/**
 * Inbox resource — operations and fields.
 *
 * Wraps the chat send-message endpoint at
 * `POST /api/v1/public/chats/:prospect_id/send-message/`. Listing
 * messages and updating message status are pending Ticket B (the
 * public Inbox endpoints aren't shipped yet) — when those land, this
 * file gets two more entries.
 */
export const inboxOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['inbox'],
			},
		},
		options: [
			{
				name: 'Send Message',
				value: 'sendMessage',
				action: 'Send a message to a prospect',
				description:
					"Reply to a prospect's existing conversation (LinkedIn or email — Seleqt picks the channel based on the prospect's last message)",
				routing: {
					request: {
						method: 'POST',
						url: '=/public/chats/{{$parameter["prospectId"]}}/send-message/',
						body: {
							message: '={{$parameter["message"]}}',
						},
					},
				},
			},
		],
		default: 'sendMessage',
	},
];

export const inboxFields: INodeProperties[] = [
	{
		displayName: 'Prospect ID',
		name: 'prospectId',
		type: 'string',
		required: true,
		default: '',
		placeholder: '12345',
		description: 'Numeric ID of the prospect to message',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['sendMessage'],
			},
		},
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		required: true,
		default: '',
		typeOptions: { rows: 4 },
		description: 'Body of the message. Plain text or HTML — Seleqt strips HTML for LinkedIn channels automatically.',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['sendMessage'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add field',
		default: {},
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['sendMessage'],
			},
		},
		options: [
			{
				displayName: 'Subject Line',
				name: 'subject_line',
				type: 'string',
				default: '',
				description: 'Email subject. Ignored for LinkedIn replies.',
				routing: { request: { body: { subject_line: '={{$value}}' } } },
			},
			{
				displayName: 'Sender Account ID',
				name: 'sender_account_id',
				type: 'number',
				default: 0,
				description: 'Force a specific sender account. Otherwise Seleqt picks based on the conversation history.',
				routing: { request: { body: { sender_account_id: '={{$value}}' } } },
			},
		],
	},
];
