import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import * as nodemailer from 'nodemailer';

export class SmtpSimple implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SMTP Simple',
		name: 'smtpSimple',
		icon: 'fa:envelope',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["subject"]}}',
		description: 'Send emails via SMTP',
		defaults: {
			name: 'SMTP Simple',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'smtpApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'To Email',
				name: 'toEmail',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'recipient@example.com',
				description: 'Email address of the recipient. You can also use expressions like {{$json["email"]}} to get data from previous nodes.',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'Email subject',
				description: 'Subject line of the email. You can use expressions like {{$json["title"]}} to get data from previous nodes.',
			},
			{
				displayName: 'Email Type',
				name: 'emailType',
				type: 'options',
				options: [
					{
						name: 'Text',
						value: 'text',
					},
					{
						name: 'HTML',
						value: 'html',
					},
				],
				default: 'text',
				description: 'Whether to send the email as plain text or HTML',
			},
			{
				displayName: 'Message',
				name: 'text',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						emailType: ['text'],
					},
				},
				placeholder: 'Your email message here',
				description: 'Plain text content of the email. You can use expressions like {{$json["message"]}} to get data from previous nodes.',
			},
			{
				displayName: 'Message',
				name: 'html',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						emailType: ['html'],
					},
				},
				placeholder: '<p>Your HTML email message here</p>',
				description: 'HTML content of the email. You can use expressions like {{$json["htmlContent"]}} to get data from previous nodes.',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'CC',
						name: 'cc',
						type: 'string',
						default: '',
						placeholder: 'cc@example.com',
						description: 'Carbon copy recipients (comma-separated)',
					},
					{
						displayName: 'BCC',
						name: 'bcc',
						type: 'string',
						default: '',
						placeholder: 'bcc@example.com',
						description: 'Blind carbon copy recipients (comma-separated)',
					},
					{
						displayName: 'Reply To',
						name: 'replyTo',
						type: 'string',
						default: '',
						placeholder: 'noreply@example.com',
						description: 'Reply-to email address',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('smtpApi');

		// Create SMTP transporter
		const transporter = nodemailer.createTransport({
			host: credentials.host as string,
			port: credentials.port as number,
			secure: credentials.secure as boolean,
			auth: {
				user: credentials.user as string,
				pass: credentials.password as string,
			},
		});

		for (let i = 0; i < items.length; i++) {
			try {
				const toEmail = this.getNodeParameter('toEmail', i) as string;
				const subject = this.getNodeParameter('subject', i) as string;
				const emailType = this.getNodeParameter('emailType', i) as string;
				const options = this.getNodeParameter('options', i) as any;

				// Get message content based on email type
				let messageContent: any = {};
				if (emailType === 'html') {
					messageContent.html = this.getNodeParameter('html', i) as string;
				} else {
					messageContent.text = this.getNodeParameter('text', i) as string;
				}

				// Build email options
				const mailOptions: any = {
					from: credentials.fromName 
						? `"${credentials.fromName}" <${credentials.fromEmail}>` 
						: credentials.fromEmail,
					to: toEmail,
					subject: subject,
					...messageContent,
				};

				// Add optional fields
				if (options.cc) {
					mailOptions.cc = options.cc;
				}
				if (options.bcc) {
					mailOptions.bcc = options.bcc;
				}
				if (options.replyTo) {
					mailOptions.replyTo = options.replyTo;
				}

				// Send email
				const info = await transporter.sendMail(mailOptions);

				returnData.push({
					json: {
						success: true,
						messageId: info.messageId,
						response: info.response,
						to: toEmail,
						subject: subject,
					},
					pairedItem: {
						item: i,
					},
				});

			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							success: false,
							error: errorMessage,
						},
						pairedItem: {
							item: i,
						},
					});
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`Failed to send email: ${errorMessage}`,
						{ itemIndex: i }
					);
				}
			}
		}

		return [returnData];
	}
}