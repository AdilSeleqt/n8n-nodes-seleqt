import type { INodeProperties } from 'n8n-workflow';

/**
 * Lead List resource — operations and fields.
 *
 * Maps to `/api/v1/public/lead-lists/...`. In Seleqt's domain model
 * a "lead list" is the saved-search container that holds the
 * prospects/companies the user has filtered into one place; it's the
 * stepping stone between Prospect Search and Campaign.
 *
 * Typical n8n workflow shape:
 *   Prospect Search → Lead List Add Leads → Lead List Move to Campaign
 */
export const leadListOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['leadList'],
			},
		},
		options: [
			{
				name: 'Add Leads',
				value: 'addLeads',
				action: 'Add leads to a list',
				description:
					'Attach existing prospect IDs (or company IDs for COMPANY lists) to a lead list',
				routing: {
					request: {
						method: 'POST',
						url: '=/public/lead-lists/{{$parameter["leadListId"]}}/add-leads/',
						body: {
							prospect_ids: '={{$parameter["addProspectIds"]}}',
							company_ids: '={{$parameter["addCompanyIds"]}}',
						},
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a lead list',
				description: 'Create a new draft lead list (PEOPLE or COMPANY)',
				routing: {
					request: {
						method: 'POST',
						url: '/public/lead-lists/',
						body: {
							name: '={{$parameter["name"]}}',
							search_type: '={{$parameter["searchType"]}}',
						},
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: { property: 'lead_list' },
							},
						],
					},
				},
			},
			{
				name: 'Enrich',
				value: 'enrich',
				action: 'Enrich a lead list',
				description: 'Trigger contact-info enrichment (email/phone) for prospects in a lead list',
				routing: {
					request: {
						method: 'POST',
						url: '=/public/lead-lists/{{$parameter["leadListId"]}}/enrichment/',
					},
				},
			},
			{
				name: 'Get Leads',
				value: 'getLeads',
				action: 'Get leads from a list',
				description: 'Retrieve the prospects/companies currently in a lead list',
				routing: {
					request: {
						method: 'GET',
						url: '=/public/lead-lists/{{$parameter["leadListId"]}}/leads/',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'List lead lists',
				description: 'Retrieve every lead list in the active workspace',
				routing: {
					request: {
						method: 'GET',
						url: '/public/lead-lists/',
					},
				},
			},
			{
				name: 'Move to Campaign',
				value: 'moveToCampaign',
				action: 'Move list to a campaign',
				description: 'Move prospects from a PEOPLE lead list into a campaign without re-importing them',
				routing: {
					request: {
						method: 'POST',
						url: '=/public/lead-lists/{{$parameter["leadListId"]}}/move-to-campaign/',
						body: {
							campaign_id: '={{$parameter["targetCampaignId"]}}',
							prospect_ids: '={{$parameter["moveProspectIds"]}}',
						},
					},
				},
			},
		],
		default: 'getMany',
	},
];

export const leadListFields: INodeProperties[] = [
	// ─── Create ───────────────────────────────────────────────
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'EU SaaS founders — Q4',
		displayOptions: {
			show: {
				resource: ['leadList'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'List Type',
		name: 'searchType',
		type: 'options',
		default: 'PEOPLE',
		options: [
			{ name: 'People', value: 'PEOPLE' },
			{ name: 'Company', value: 'COMPANY' },
		],
		description: 'PEOPLE lists hold prospects; COMPANY lists hold companies. Cannot be changed after creation.',
		displayOptions: {
			show: {
				resource: ['leadList'],
				operation: ['create'],
			},
		},
	},

	// ─── Operations that target a specific list ──────────────
	{
		displayName: 'Lead List ID',
		name: 'leadListId',
		type: 'string',
		required: true,
		default: '',
		placeholder: '742',
		description: 'Numeric ID of the lead list, returned by Get Many or Create',
		displayOptions: {
			show: {
				resource: ['leadList'],
				operation: ['getLeads', 'addLeads', 'moveToCampaign', 'enrich'],
			},
		},
	},

	// ─── Add Leads ────────────────────────────────────────────
	// Names are scoped (`addProspectIds` / `addCompanyIds`) rather than
	// the natural `prospectIds` so they don't collide with the same
	// concept in `moveToCampaign` below. n8n's parameter validator
	// doesn't fully respect `displayOptions` when two properties share
	// a name + `required`, which surfaces as a phantom "X is required"
	// error on whichever variant the user sees first.
	{
		displayName: 'Prospect IDs',
		name: 'addProspectIds',
		type: 'string',
		default: '',
		placeholder: '12345,12346,12347',
		description:
			'Comma-separated prospect IDs to add. Required for PEOPLE lists. Leave empty for COMPANY lists.',
		displayOptions: {
			show: {
				resource: ['leadList'],
				operation: ['addLeads'],
			},
		},
	},
	{
		displayName: 'Company IDs',
		name: 'addCompanyIds',
		type: 'string',
		default: '',
		placeholder: '8901,8902',
		description:
			'Comma-separated company IDs. Required for COMPANY lists. Leave empty for PEOPLE lists.',
		displayOptions: {
			show: {
				resource: ['leadList'],
				operation: ['addLeads'],
			},
		},
	},

	// ─── Move to Campaign ─────────────────────────────────────
	// `targetCampaignId` instead of `campaignId` to avoid the same
	// validator collision that the Campaign resource's `campaignId`
	// (Get / Get Stats / Get Steps / Update) would otherwise create.
	{
		displayName: 'Campaign ID',
		name: 'targetCampaignId',
		type: 'string',
		required: true,
		default: '',
		placeholder: '5339',
		description: 'Destination campaign — prospects keep their data, just become campaign-scoped',
		displayOptions: {
			show: {
				resource: ['leadList'],
				operation: ['moveToCampaign'],
			},
		},
	},
	{
		displayName: 'Prospect IDs',
		name: 'moveProspectIds',
		type: 'string',
		default: '',
		placeholder: '12345,12346 (leave empty to move all in list)',
		description:
			'Optional. Comma-separated prospect IDs to move. Empty moves every prospect currently in the list.',
		displayOptions: {
			show: {
				resource: ['leadList'],
				operation: ['moveToCampaign'],
			},
		},
	},
];
