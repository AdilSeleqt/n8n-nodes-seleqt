import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

import { campaignFields, campaignOperations } from './descriptions/CampaignDescription';
import { leadListFields, leadListOperations } from './descriptions/LeadListDescription';
import { prospectFields, prospectOperations } from './descriptions/ProspectDescription';
import { inboxFields, inboxOperations } from './descriptions/InboxDescription';

/**
 * Seleqt action node — declarative-style.
 *
 * v0.2 surface (this file):
 *  • Campaign — Get Many, Get, Create, Get Stats, Get Steps, Update
 *  • Lead List — Get Many, Get Leads, Create, Add Leads, Move to
 *    Campaign, Enrich
 *  • Prospect — Search
 *  • Inbox — Send Message
 *
 * Each resource lives in its own description file under
 * `descriptions/` so adding a new one (Workspace, Webhook, …) is a
 * matter of importing two arrays here. The node class itself stays
 * declarative-only — no programmatic execute() yet.
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
					{
						name: 'Lead List',
						value: 'leadList',
					},
					{
						name: 'Prospect',
						value: 'prospect',
					},
					{
						name: 'Inbox',
						value: 'inbox',
					},
				],
				default: 'campaign',
			},
			...campaignOperations,
			...campaignFields,
			...leadListOperations,
			...leadListFields,
			...prospectOperations,
			...prospectFields,
			...inboxOperations,
			...inboxFields,
		],
	};
}
