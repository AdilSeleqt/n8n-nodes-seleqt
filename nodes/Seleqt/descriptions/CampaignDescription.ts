import type { INodeProperties } from 'n8n-workflow';

/**
 * Campaign resource — operations and fields.
 *
 * Backed by `/api/v1/public/campaigns/...` on the Seleqt API. Each
 * operation maps directly to a single endpoint via declarative-style
 * `routing`, so adding a new one is a single property tweak rather
 * than a programmatic execute() change.
 */
export const campaignOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a campaign',
				description: 'Create a new draft campaign in the active workspace',
				routing: {
					request: {
						method: 'POST',
						url: '/public/campaigns/',
						body: {
							name: '={{$parameter["name"]}}',
						},
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: { property: 'campaign' },
							},
						],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a campaign',
				description: 'Retrieve one campaign by ID with its full step tree',
				routing: {
					request: {
						method: 'GET',
						url: '=/public/campaigns/{{$parameter["campaignId"]}}/',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: { property: 'campaign' },
							},
						],
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'List campaigns',
				description: 'Retrieve every campaign visible to the API key',
				routing: {
					request: {
						method: 'GET',
						url: '/public/campaigns/',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: { property: 'campaigns' },
							},
						],
					},
				},
			},
			{
				name: 'Get Stats',
				value: 'getStats',
				action: 'Get campaign analytics',
				description: 'Retrieve aggregated stats (sent, opened, replied, ...) for a campaign',
				routing: {
					request: {
						method: 'GET',
						url: '=/public/campaigns/{{$parameter["campaignId"]}}/analytics/',
					},
				},
			},
			{
				name: 'Get Steps',
				value: 'getSteps',
				action: 'Get campaign steps',
				description: 'Retrieve the ordered list of steps for a campaign',
				routing: {
					request: {
						method: 'GET',
						url: '=/public/campaigns/{{$parameter["campaignId"]}}/steps/',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: { property: 'steps' },
							},
						],
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a campaign',
				description: 'Patch campaign settings (name, timezone, sending limits, …)',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/public/campaigns/{{$parameter["campaignId"]}}/',
						// Empty placeholder — `updateFields` collection below
						// merges its non-empty entries onto the request body
						// via the `request.body` property routing.
						body: {},
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: { property: 'campaign' },
							},
						],
					},
				},
			},
		],
		default: 'getMany',
	},
];

export const campaignFields: INodeProperties[] = [
	// ─── Create ───────────────────────────────────────────────
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'Q4 outbound — ICP A',
		description: 'Display name for the new campaign. Seleqt automatically appends "(N)" if the name is taken.',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
	},

	// ─── Get / Get Stats / Get Steps / Update — campaign ID ───
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		required: true,
		default: '',
		placeholder: '5339',
		description: 'Numeric ID of the campaign — visible in the Seleqt URL or returned by Get Many',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['get', 'getStats', 'getSteps', 'update'],
			},
		},
	},

	// ─── Update — patchable fields ────────────────────────────
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add field',
		default: {},
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Email Max Messages / Day',
				name: 'email_max_messages',
				type: 'number',
				default: 0,
				routing: {
					request: { body: { email_max_messages: '={{$value}}' } },
				},
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				placeholder: 'en',
				routing: {
					request: { body: { language: '={{$value}}' } },
				},
			},
			{
				displayName: 'LinkedIn Max Connections / Day',
				name: 'linkedin_max_connections',
				type: 'number',
				default: 0,
				routing: {
					request: { body: { linkedin_max_connections: '={{$value}}' } },
				},
			},
			{
				displayName: 'LinkedIn Max Messages / Day',
				name: 'linkedin_max_messages',
				type: 'number',
				default: 0,
				routing: {
					request: { body: { linkedin_max_messages: '={{$value}}' } },
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: {
					request: { body: { name: '={{$value}}' } },
				},
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: '',
				placeholder: 'Europe/Amsterdam',
				routing: {
					request: { body: { timezone: '={{$value}}' } },
				},
			},
		],
	},
];
