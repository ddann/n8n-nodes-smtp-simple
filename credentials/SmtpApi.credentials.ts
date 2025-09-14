import {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SmtpApi implements ICredentialType {
	name = 'smtpApi';
	displayName = 'SMTP';
	documentationUrl = 'https://nodemailer.com/smtp/';
	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: '',
			required: true,
			description: 'The SMTP server host (e.g., smtp.gmail.com)',
		},
		{
			displayName: 'Port',
			name: 'port',
			type: 'number',
			default: 587,
			required: true,
			description: 'The SMTP server port (587 for TLS, 465 for SSL, 25 for plain)',
		},
		{
			displayName: 'Secure Connection',
			name: 'secure',
			type: 'boolean',
			default: false,
			description: 'Whether to use SSL/TLS (true for port 465, false for 587/25)',
		},
		{
			displayName: 'Username',
			name: 'user',
			type: 'string',
			default: '',
			required: true,
			description: 'SMTP authentication username',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'SMTP authentication password',
		},
		{
			displayName: 'From Email',
			name: 'fromEmail',
			type: 'string',
			default: '',
			required: true,
			description: 'Default sender email address',
		},
		{
			displayName: 'From Name',
			name: 'fromName',
			type: 'string',
			default: '',
			description: 'Default sender name (optional)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialDataDecryptedObject = {
		request: {
			baseURL: '={{$credentials.host}}:{{$credentials.port}}',
		},
	};
}