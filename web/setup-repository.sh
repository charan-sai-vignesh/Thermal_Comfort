#!/bin/bash
# Thermal Comfort Survey - Repository Setup Script

echo "🚀 Setting up Thermal Comfort Survey Repository..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git branch -M main
fi

# Add all files to git
echo "📝 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Thermal Comfort Survey with Netlify database integration

- Complete survey form with PMV/PPD calculations
- Gender-specific clothing selection
- Real-time analytics dashboard
- Netlify serverless functions
- Neon PostgreSQL database integration
- Responsive design for all devices
- Comprehensive documentation"

# Add remote origin (if not already added)
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 Adding remote origin..."
    git remote add origin https://github.com/charan-sai-vignesh/Thermal_Comfort.git
fi

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main

echo "✅ Repository setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Go to https://github.com/charan-sai-vignesh/Thermal_Comfort"
echo "2. Enable GitHub Pages in Settings → Pages"
echo "3. Connect to Netlify for database integration"
echo "4. Add Neon database addon in Netlify"
echo "5. Set up environment variables"
echo ""
echo "📚 Documentation:"
echo "- README.md - Project overview and setup"
echo "- DEPLOYMENT.md - Deployment options"
echo "- NETLIFY_SETUP.md - Netlify database setup"
echo ""
echo "🌐 Your survey will be available at:"
echo "- GitHub Pages: https://charan-sai-vignesh.github.io/Thermal_Comfort/web.html"
echo "- Netlify: https://your-site-name.netlify.app/web.html"
