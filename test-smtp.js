const nodemailer = require('nodemailer');

// Test the actual node logic for SMTP configuration
function createTransportConfig(credentials) {
  // Mirror the node's logic exactly
  let port = credentials.port;
  
  // Handle custom port selection
  if (credentials.port === 'custom') {
    port = credentials.customPort;
  }
  
  let secure = credentials.secure;
  
  // Auto-detect secure setting based on port
  if (port === 465) {
    secure = true;
  } else if (port === 587 || port === 25) {
    secure = false;
  }
  
  // Build transport configuration
  const transportConfig = {
    host: credentials.host,
    port: port,
    secure: secure,
    auth: {
      user: credentials.user,
      pass: credentials.password,
    },
  };
  
  // For non-secure connections, enable STARTTLS and add TLS options
  if (!secure) {
    transportConfig.requireTLS = true;
    transportConfig.tls = {
      rejectUnauthorized: false, // Allow self-signed certificates for testing
      minVersion: 'TLSv1.2' // Ensure modern TLS version
    };
  }
  
  return transportConfig;
}

// Test different credential configurations
async function testConfigurations() {
  console.log('Testing SMTP configurations with node logic...\n');
  
  const testCredentials = [
    {
      name: 'Gmail with port 587 (auto-detect STARTTLS)',
      credentials: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: true, // Should be overridden to false
        user: 'test@gmail.com',
        password: 'password'
      }
    },
    {
      name: 'Gmail with port 465 (auto-detect SSL)',
      credentials: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: false, // Should be overridden to true
        user: 'test@gmail.com',
        password: 'password'
      }
    },
    {
      name: 'Custom port configuration',
      credentials: {
        host: 'smtp.example.com',
        port: 'custom',
        customPort: 2525,
        secure: false,
        user: 'test@example.com',
        password: 'password'
      }
    },
    {
      name: 'Outlook/Hotmail standard config',
      credentials: {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        user: 'test@outlook.com',
        password: 'password'
      }
    }
  ];
  
  for (const { name, credentials } of testCredentials) {
    console.log(`Testing ${name}:`);
    console.log(`  Input - Port: ${credentials.port}, Secure: ${credentials.secure}`);
    
    const config = createTransportConfig(credentials);
    
    console.log(`  Output - Host: ${config.host}`);
    console.log(`  Output - Port: ${config.port}`);
    console.log(`  Output - Secure: ${config.secure}`);
    console.log(`  Output - RequireTLS: ${config.requireTLS || 'not set'}`);
    console.log(`  Output - TLS Options: ${config.tls ? 'configured' : 'not set'}`);
    
    try {
      const transporter = nodemailer.createTransport(config);
      console.log(`  ✅ Transporter created successfully`);
      
      // Test connection (will fail without real credentials, but we can see if config is valid)
      // await transporter.verify();
      // console.log(`  ✅ Connection verified!`);
    } catch (error) {
      console.log(`  ❌ Error creating transporter: ${error.message}`);
    }
    
    console.log('');
  }
}

// Test with a real SMTP service (for actual testing with real credentials)
async function testRealConnection() {
  console.log('\n=== REAL CONNECTION TEST ===');
  console.log('To test with real credentials, set environment variables:');
  console.log('SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS');
  
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const credentials = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // Will be auto-detected
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASS
    };
    
    console.log('\nTesting with real credentials...');
    const config = createTransportConfig(credentials);
    
    try {
      const transporter = nodemailer.createTransport(config);
      await transporter.verify();
      console.log('✅ Real connection successful!');
      
      // Test sending actual email
      const info = await transporter.sendMail({
        from: credentials.user,
        to: credentials.user, // Send to self
        subject: 'n8n SMTP Node Test',
        text: 'This is a test email from the n8n SMTP Simple node!'
      });
      
      console.log('✅ Test email sent successfully!');
      console.log('Message ID:', info.messageId);
      
    } catch (error) {
      console.log('❌ Real connection failed:', error.message);
    }
  } else {
    console.log('Skipping real connection test (no credentials provided)');
  }
}

// Run tests
testConfigurations()
  .then(() => testRealConnection())
  .catch(console.error);
