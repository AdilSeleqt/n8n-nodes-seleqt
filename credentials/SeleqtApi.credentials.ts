import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

/**
 * Credentials for the Seleqt public API.
 *
 * The key is generated in Seleqt → Settings → API Keys and is sent on
 * every request via the `X-API-Key` header. The base URL is exposed
 * so customers on a self-hosted or staging Seleqt can point the node
 * at their own deployment without forking the package.
 *
 * The credential test hits `GET {baseUrl}/api-keys/` because that
 * endpoint is allow-listed by the API-key middleware and returns the
 * caller's own keys — a 200 confirms the key is live, active, and
 * scoped to a real user.
 */
export class SeleqtApi implements ICredentialType {
	name = 'seleqtApi';

	displayName = 'Seleqt API';

	documentationUrl = 'https://docs.seleqt.ai/api/authentication';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'API key from Seleqt → Settings → API Keys. Format: <prefix>.<random>.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.seleqt.ai/api/v1',
			required: true,
			description:
				'Production API host. Override only for staging or self-hosted Seleqt — `app.seleqt.ai` is the SPA frontend, not the API.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api-keys/',
			method: 'GET',
		},
	};
}
