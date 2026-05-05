import type { INodeProperties } from 'n8n-workflow';

/**
 * Campaign resource — operations and fields.
 *
 * v0.1 only ships `Get Many` so we can prove the credential + routing
 * stack against the live Seleqt API. Future PRs add Create, Get,
 * Add Leads, Pause, Resume, Get Stats per the SQ26-226 plan.
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
				name: 'Get Many',
				value: 'getMany',
				action: 'List campaigns',
				description: 'Retrieve campaigns visible to the API key',
				routing: {
					request: {
						method: 'GET',
						url: '/public/campaigns/',
					},
					// The API returns { campaigns: [...] }; n8n will deliver one
					// item per element so downstream nodes get a clean list.
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'campaigns',
								},
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
	// No per-operation fields yet; reserved for filters/limit/sort
	// once the backend exposes them on the public list endpoint.
];
