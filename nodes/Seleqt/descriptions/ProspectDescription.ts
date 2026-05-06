import type { INodeProperties } from 'n8n-workflow';

/**
 * Prospect resource — operations and fields.
 *
 * Currently exposes the public filter/search endpoint at
 * `POST /api/v1/public/prospects/search/`. The full
 * `filters` object is intentionally a JSON parameter rather than a
 * pre-modelled form: the search-filter shape grows often (RocketReach
 * fields, custom field overrides, etc.), and locking it into a
 * declarative `collection` would force a node release on every new
 * filter the customer wants to drive from a workflow.
 */
export const prospectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['prospect'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search prospects or companies',
				description:
					'Filter Seleqt prospects (or companies) by job title, location, industry, etc. Results are paginated.',
				routing: {
					request: {
						method: 'POST',
						url: '/public/prospects/search/',
						body: {
							filters: '={{JSON.parse($parameter.filters || "{}")}}',
							search_type: '={{$parameter.searchType}}',
							page: '={{$parameter.page}}',
							page_size: '={{$parameter.pageSize}}',
						},
					},
				},
			},
		],
		default: 'search',
	},
];

export const prospectFields: INodeProperties[] = [
	{
		displayName: 'Search Type',
		name: 'searchType',
		type: 'options',
		default: 'PEOPLE',
		options: [
			{ name: 'People', value: 'PEOPLE' },
			{ name: 'Company', value: 'COMPANY' },
		],
		displayOptions: {
			show: {
				resource: ['prospect'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Filters (JSON)',
		name: 'filters',
		type: 'json',
		default: '{}',
		typeOptions: { rows: 6 },
		description:
			'Filter object as JSON. Mirror the same shape Seleqt UI uses, e.g. {"current_title":{"must":["CTO"]},"company_size":["51-200"]}. Empty {} returns the default broad set.',
		displayOptions: {
			show: {
				resource: ['prospect'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: {
				resource: ['prospect'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Page Size',
		name: 'pageSize',
		type: 'number',
		default: 25,
		typeOptions: { minValue: 1, maxValue: 100 },
		description: 'Number of results per page. Max 100.',
		displayOptions: {
			show: {
				resource: ['prospect'],
				operation: ['search'],
			},
		},
	},
];
