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
			type: 'options',
			options: [
				{
					name: '587 (STARTTLS - Recommended)',
					value: 587,
				},
				{
					name: '465 (SSL/TLS)',
					value: 465,
				},
				{
					name: '25 (Plain/STARTTLS)',
					value: 25,
				},
				{
					name: 'Custom',
					value: 'custom',
				},
			],
			default: 587,
			required: true,
			description: 'SMTP port - 587 (STARTTLS) is recommended for most providers',
		},
		{
			displayName: 'Custom Port',
			name: 'customPort',
			type: 'number',
			default: 587,
			displayOptions: {
				show: {
					port: ['custom'],
				},
			},
			description: 'Custom SMTP port number',
		},
		{
			displayName: 'Secure Connection',
			name: 'secure',
			type: 'boolean',
			default: false,
			description: 'SSL/TLS setting (auto-detected based on port: 465=true, 587/25=false)',
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
}