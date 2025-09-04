const fs = require('fs');
const path = require('path');

class SimpleHtmlReporter {
  constructor(options = {}) {
    this.outputFile = options.outputFile || 'simple-test-report.html';
    this.results = [];
  }

  onBegin(config, suite) {
    this.config = config;
    this.suite = suite;
  }

  onTestEnd(test, result) {
    this.results.push({
      title: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error,
      attachments: result.attachments || []
    });
  }

  onEnd(result) {
    this.generateHtmlReport(result);
  }

  generateHtmlReport(result) {
    const html = this.createHtmlTemplate(result);
    const outputPath = path.resolve(this.outputFile);
    
    fs.writeFileSync(outputPath, html);
    console.log(`\n📊 Simple HTML Report generated: ${outputPath}`);
  }

  createHtmlTemplate(result) {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'passed').length;
    const failedTests = this.results.filter(r => r.status === 'failed').length;
    const skippedTests = this.results.filter(r => r.status === 'skipped').length;
    
    const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WordPress Site Health Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .summary-card {
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-left: 5px solid;
        }
        
        .summary-card.total { border-left-color: #007bff; }
        .summary-card.passed { border-left-color: #28a745; }
        .summary-card.failed { border-left-color: #dc3545; }
        .summary-card.skipped { border-left-color: #ffc107; }
        
        .summary-card h3 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .summary-card.total h3 { color: #007bff; }
        .summary-card.passed h3 { color: #28a745; }
        .summary-card.failed h3 { color: #dc3545; }
        .summary-card.skipped h3 { color: #ffc107; }
        
        .summary-card p {
            color: #666;
            font-size: 1.1em;
        }
        
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-badge.passed {
            background: #d4edda;
            color: #155724;
        }
        
        .status-badge.failed {
            background: #f8d7da;
            color: #721c24;
        }
        
        .status-badge.skipped {
            background: #fff3cd;
            color: #856404;
        }
        
        .test-results {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .test-results h2 {
            margin-bottom: 20px;
            color: #333;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        
        .test-item {
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 8px;
            margin-bottom: 15px;
            transition: all 0.3s ease;
        }
        
        .test-item:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .test-item.passed {
            border-left: 5px solid #28a745;
            background: #f8fff9;
        }
        
        .test-item.failed {
            border-left: 5px solid #dc3545;
            background: #fff8f8;
        }
        
        .test-item.skipped {
            border-left: 5px solid #ffc107;
            background: #fffef8;
        }
        
        .test-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .test-title {
            font-weight: 600;
            font-size: 1.1em;
            color: #333;
        }
        
        .test-duration {
            color: #666;
            font-size: 0.9em;
        }
        
        .test-description {
            color: #666;
            margin-bottom: 10px;
        }
        
        .error-details {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 15px;
            margin-top: 10px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: #721c24;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #666;
            border-top: 1px solid #eee;
        }
        
        .recommendations {
            background: #e3f2fd;
            border: 1px solid #bbdefb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .recommendations h3 {
            color: #1976d2;
            margin-bottom: 15px;
        }
        
        .recommendations ul {
            margin-left: 20px;
        }
        
        .recommendations li {
            margin-bottom: 8px;
            color: #333;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .summary {
                grid-template-columns: 1fr;
            }
            
            .test-header {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌐 WordPress Site Health Report</h1>
            <p>Automated Quality Assurance Test Results</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card total">
                <h3>${totalTests}</h3>
                <p>Total Tests</p>
            </div>
            <div class="summary-card passed">
                <h3>${passedTests}</h3>
                <p>Passed</p>
            </div>
            <div class="summary-card failed">
                <h3>${failedTests}</h3>
                <p>Failed</p>
            </div>
            <div class="summary-card skipped">
                <h3>${skippedTests}</h3>
                <p>Skipped</p>
            </div>
        </div>
        
        ${this.generateRecommendations(passRate, failedTests)}
        
        <div class="test-results">
            <h2>📋 Test Results</h2>
            ${this.results.map(test => this.generateTestItem(test)).join('')}
        </div>
        
        <div class="footer">
            <p>This report was generated automatically by the WordPress QA Test Suite</p>
            <p>For technical support, please contact your development team</p>
        </div>
    </div>
</body>
</html>`;
  }

  generateRecommendations(passRate, failedTests) {
    if (passRate === 100) {
      return `
        <div class="recommendations">
          <h3>🎉 Excellent! Your WordPress site is working perfectly!</h3>
          <ul>
            <li>All tests passed successfully</li>
            <li>Your site is functioning as expected</li>
            <li>No immediate action required</li>
          </ul>
        </div>
      `;
    } else if (passRate >= 80) {
      return `
        <div class="recommendations">
          <h3>✅ Good! Your WordPress site is mostly working well</h3>
          <ul>
            <li>Most tests passed (${passRate}% success rate)</li>
            <li>Some minor issues detected</li>
            <li>Review failed tests below for details</li>
            <li>Consider addressing issues when convenient</li>
          </ul>
        </div>
      `;
    } else if (passRate >= 60) {
      return `
        <div class="recommendations">
          <h3>⚠️ Attention needed! Some important issues detected</h3>
          <ul>
            <li>${failedTests} tests failed (${passRate}% success rate)</li>
            <li>Some functionality may not be working properly</li>
            <li>Review failed tests and consider fixing them soon</li>
            <li>Contact your development team if needed</li>
          </ul>
        </div>
      `;
    } else {
      return `
        <div class="recommendations">
          <h3>🚨 Critical issues detected! Immediate attention required</h3>
          <ul>
            <li>${failedTests} tests failed (${passRate}% success rate)</li>
            <li>Your WordPress site has significant issues</li>
            <li>Some core functionality may be broken</li>
            <li>Contact your development team immediately</li>
            <li>Consider rolling back recent changes</li>
          </ul>
        </div>
      `;
    }
  }

  generateTestItem(test) {
    const statusClass = test.status;
    const duration = Math.round(test.duration / 1000 * 100) / 100;
    
    let errorHtml = '';
    if (test.error) {
      errorHtml = `
        <div class="error-details">
          <strong>Error Details:</strong><br>
          ${test.error.message || 'Unknown error occurred'}
        </div>
      `;
    }
    
    return `
      <div class="test-item ${statusClass}">
        <div class="test-header">
          <div class="test-title">${this.formatTestTitle(test.title)}</div>
          <div>
            <span class="status-badge ${statusClass}">${test.status}</span>
            <span class="test-duration">${duration}s</span>
          </div>
        </div>
        <div class="test-description">${this.getTestDescription(test.title)}</div>
        ${errorHtml}
      </div>
    `;
  }

  formatTestTitle(title) {
    // Convert technical test names to user-friendly titles
    return title
      .replace(/should\s+/g, '')
      .replace(/WordPress\s+/g, '')
      .replace(/Tests?\s*/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  getTestDescription(title) {
    // Provide user-friendly descriptions for test categories
    if (title.includes('login') || title.includes('authentication')) {
      return 'Verifies that users can log into the WordPress admin area securely.';
    } else if (title.includes('dashboard')) {
      return 'Checks that the WordPress admin dashboard loads and displays correctly.';
    } else if (title.includes('content') || title.includes('post') || title.includes('page')) {
      return 'Tests content management functionality including creating and editing posts and pages.';
    } else if (title.includes('theme')) {
      return 'Verifies that the website theme is working properly and displays correctly.';
    } else if (title.includes('plugin')) {
      return 'Checks that WordPress plugins are functioning correctly.';
    } else if (title.includes('api') || title.includes('REST')) {
      return 'Tests the WordPress REST API and backend functionality.';
    } else if (title.includes('performance')) {
      return 'Measures website loading speed and performance.';
    } else if (title.includes('security')) {
      return 'Verifies security features and access controls.';
    } else {
      return 'Tests WordPress functionality and features.';
    }
  }
}

module.exports = SimpleHtmlReporter;
