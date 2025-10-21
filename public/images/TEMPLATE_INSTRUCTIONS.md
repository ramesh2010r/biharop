# Template Image Setup Instructions

## 📋 Steps to Add Your Template Image

1. **Save your template image** (the one you uploaded in the chat) as:
   ```
   vote-template.png
   ```

2. **Place it in this directory**:
   ```
   public/images/vote-template.png
   ```

3. **Template Requirements**:
   - Format: PNG (with transparency if needed)
   - Recommended size: 1080x1080 pixels
   - The template should have:
     - Header text: "मैंने अपनी राय दर्ज की !"
     - Blue box area for candidate information (around y=180-360)
     - Bihar Opinion Poll 2025 branding
     - Hand/voting icon
     - Bottom call-to-action bar

4. **Text Overlay Positions**:
   The code will overlay the following dynamic text:
   - **Candidate Name**: Center, Y position ~205px (white text)
   - **Party Name**: Center, Y position ~245px (white text)
   - **Constituency & District**: Center, Y position ~290px (yellow text)

5. **Adjusting Text Positions**:
   If you need to adjust where the text appears, edit these values in:
   ```
   src/components/ConfirmationPage.tsx
   ```
   Look for these lines:
   ```javascript
   ctx.fillText(voteData.candidate_name, canvas.width / 2, 205)  // <- Y position
   ctx.fillText(`(${voteData.party_name})`, canvas.width / 2, 245)  // <- Y position
   ctx.fillText(`${constituency}, ${district}`, canvas.width / 2, 290)  // <- Y position
   ```

## 🎨 Template Design Guidelines

Your template image should include:
- ✅ Tricolor background (Orange/White/Green)
- ✅ "मैंने अपनी राय दर्ज की !" header
- ✅ Blue rounded rectangle box (for candidate info overlay)
- ✅ "बिहार ओपिनियन पोल 2025" logo
- ✅ Hand/voting icon (☝️)
- ✅ Website URL section
- ✅ Bottom blue bar with call to action

## 📁 File Structure

```
public/
  images/
    vote-template.png          <- Your template goes here
    TEMPLATE_INSTRUCTIONS.md   <- This file
```

## 🚀 After Adding Template

1. Restart the development server:
   ```bash
   npm run dev
   ```

2. Test the image download:
   - Vote for a candidate
   - Go to confirmation page
   - Click "इमेज डाउनलोड करें"
   - Check if candidate info appears correctly on template

3. Deploy to production:
   ```bash
   git add public/images/vote-template.png
   git commit -m "Add vote confirmation template image"
   git push origin main
   ```

## 🔧 Troubleshooting

**Issue**: Template not loading
- Check file name is exactly: `vote-template.png`
- Check file is in correct directory: `public/images/`
- Clear browser cache and reload

**Issue**: Text not positioned correctly
- Adjust Y-axis values in `ConfirmationPage.tsx`
- Ensure template has enough space in blue box area

**Issue**: Text not readable
- Check template blue box has enough contrast
- Adjust font size if needed
- Consider adding text shadow for better visibility
