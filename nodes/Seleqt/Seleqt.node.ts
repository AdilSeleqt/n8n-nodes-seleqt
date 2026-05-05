import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

import { campaignFields, campaignOperations } from './descriptions/CampaignDescription';

/**
 * Seleqt action node — declarative-style.
 *
 * v0.1 ships a single resource (`Campaign`) with one operation
 * (`Get Many`) so we can validate the auth + base URL plumbing
 * end-to-end before fanning out into the rest of the API surface
 * planned for SQ26-226.
 *
 * Each new resource (Lead, Inbox, Enrichment, Workspace) lives in
 * its own description file and is appended to the property tree
 * here — the node class itself stays declarative-only.
 */
export class Seleqt implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Seleqt',
		name: 'seleqt',
		icon: 'file:seleqt.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Seleqt lead generation, enrichment, and campaign API',
		defaults: {
			name: 'Seleqt',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'seleqtApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Campaign',
						value: 'campaign',
					},
				],
				default: 'campaign',
			},
			...campaignOperations,
			...campaignFields,
		],
	};
}
