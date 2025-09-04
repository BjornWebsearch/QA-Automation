# 🌐 WordPress Site Health Check

A simple, easy-to-use tool to check if your WordPress website is working correctly. Perfect for non-technical users!

## 🎯 What This Does

This tool automatically checks your WordPress website to make sure:
- ✅ Your website loads properly
- ✅ You can log into the admin area
- ✅ All main sections work (posts, pages, themes, plugins, settings)
- ✅ Your website is mobile-friendly
- ✅ Everything loads quickly

## 🚀 Quick Start

### Step 1: Run the Health Check
```bash
./run-simple-tests.sh
```

That's it! The tool will:
1. Check if everything is installed
2. Run all the health checks
3. Create an easy-to-read report

### Step 2: View Your Report
After running the health check, you'll get:
- **simple-test-report.html** - Easy to read report (open in any web browser)
- **playwright-report/** - Technical details (for developers)

## 📊 Understanding Your Report

### 🎉 All Tests Passed (100%)
Your website is working perfectly! No action needed.

### ✅ Most Tests Passed (80-99%)
Your website is working well with minor issues. Review the failed tests and fix them when convenient.

### ⚠️ Some Tests Failed (60-79%)
Your website has some issues that should be addressed soon. Contact your developer if needed.

### 🚨 Many Tests Failed (Below 60%)
Your website has serious issues that need immediate attention. Contact your developer right away.

## 🔧 What Each Test Checks

| Test | What It Checks | Why It Matters |
|------|----------------|----------------|
| 🌐 Website loads | Your homepage opens correctly | Users can visit your site |
| 🔐 Admin login page | Login form is accessible | You can manage your site |
| 👤 Admin login works | You can log in with your password | You can access admin features |
| 📊 Dashboard loads | Admin dashboard works | You can manage your content |
| 📝 Posts section | You can manage blog posts | Content management works |
| 📄 Pages section | You can manage pages | Page management works |
| 🎨 Themes section | Theme settings are accessible | You can customize appearance |
| 🔌 Plugins section | Plugin management works | You can manage functionality |
| ⚙️ Settings section | Site settings are accessible | You can configure your site |
| 🔗 REST API | Backend functionality works | Advanced features work |
| 📱 Mobile-friendly | Site works on phones | Mobile users can use your site |
| ⚡ Loads quickly | Site loads within 30 seconds | Good user experience |

## 🛠️ Troubleshooting

### "Node.js is not installed"
**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

### "Some health checks failed"
**What to do:**
1. Open `simple-test-report.html` in your web browser
2. Look at the failed tests
3. Contact your developer if you need help

### "Website loads slowly"
**What to do:**
1. Check if your website is accessible in a regular browser
2. Contact your hosting provider
3. Consider optimizing images or plugins

## 📁 Files Created

After running the health check, you'll find:

- **simple-test-report.html** - Main report (open in browser)
- **playwright-report/** - Technical details
- **test-results/** - Screenshots and error logs

## 🔄 Running Tests Regularly

We recommend running this health check:
- **Weekly** - To catch issues early
- **After updates** - To make sure nothing broke
- **Before important events** - To ensure everything works

## 💡 Tips for Non-Technical Users

1. **Bookmark the report** - Save `simple-test-report.html` to easily check your site health
2. **Share with your developer** - Send them the report if you need help
3. **Run before updates** - Always test before making changes
4. **Keep it simple** - Focus on the main report, ignore technical details unless needed

## 🆘 Getting Help

If you need help:
1. **Check the report first** - It often explains what's wrong
2. **Contact your developer** - Share the report with them
3. **Check your website** - Try visiting it in a regular browser
4. **Contact your hosting provider** - If the site won't load at all

## 🎯 Success Metrics

A healthy WordPress site should have:
- ✅ 100% test pass rate (ideal)
- ✅ 80%+ test pass rate (acceptable)
- ⚠️ 60-79% test pass rate (needs attention)
- 🚨 Below 60% test pass rate (urgent action needed)

---

## 📞 Support

This tool is designed to be simple and user-friendly. If you have questions:
1. Check this README first
2. Look at the generated report
3. Contact your development team

**Happy testing! 🎉**
