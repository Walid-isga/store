# IPTV Europe - Premium Streaming Service

A complete IPTV sales website built with React, TypeScript, and Tailwind CSS. Features multilingual support, WhatsApp payment integration, and a comprehensive admin dashboard.

## 🚀 Features

### Core Functionality
- **Multilingual Support**: 7 languages (EN, FR, ES, DE, IT, PT, NL) with react-i18next
- **Multi-Currency**: Support for European currencies with automatic conversion
- **WhatsApp Payment**: Integrated payment flow with pre-filled messages
- **Admin Dashboard**: Order management with Google Sheets integration
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Optimized**: Proper meta tags, hreflang, and structured data

### Payment System
- WhatsApp integration with pre-filled order details
- Support for PayPal.me, Stripe Payment Links, or custom payment URLs
- Order tracking and status management
- Automatic order ID generation

### Admin Features
- Dashboard with statistics (orders, revenue, weekly trends)
- Order management with status updates
- Google Sheets integration for data synchronization
- CSV export functionality
- Real-time search and filtering

## 📦 Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Configure the application:**
Edit `src/config.ts` with your settings:

```typescript
export const WHATSAPP_PHONE = "+2126XXXXXXXX"; // Your WhatsApp number
export const PAYMENT_LINK_BASE = "https://paypal.me/yourname"; // Your payment link
export const ADMIN_KEY = "your-secure-admin-key"; // Admin access key
```

3. **Start development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
```

## ⚙️ Configuration

### WhatsApp Setup
1. Replace `WHATSAPP_PHONE` with your business WhatsApp number (E.164 format)
2. Test the integration by placing a test order

### Payment Integration
Set `PAYMENT_LINK_BASE` to your preferred payment method:
- PayPal: `https://paypal.me/yourname`
- Stripe Payment Link: `https://buy.stripe.com/your-link`
- Custom payment page: `https://yoursite.com/payment`

### Google Sheets Integration (Optional)

1. **Create a Google Form:**
   - Go to Google Forms and create a new form
   - Add fields for: name, email, phone, country, plan, note, orderId, currency, price
   - Link the form to a Google Sheet

2. **Get Form Configuration:**
   - Inspect the form's HTML to find `entry.xxx` values for each field
   - Update `GOOGLE_FORM_FIELDS` in `config.ts`
   - Set `GOOGLE_FORM_ACTION_URL` to the form's action URL

3. **Publish the Sheet:**
   - In Google Sheets, go to "File" > "Publish to the web"
   - Choose "Entire Document" and "CSV"
   - Copy the sheet ID from the URL
   - Update `GOOGLE_SHEET_ID` in `config.ts`

4. **Google Apps Script (Optional):**
   For status updates, create a Google Apps Script Web App:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
    
    // Find row with matching orderId and update status
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (values[i][1] === data.orderId) { // Assuming orderId is in column B
        sheet.getRange(i + 1, 13).setValue(data.status); // Update status column
        break;
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

Deploy as a Web App and set `ADMIN_UPDATE_ENDPOINT` to the script URL.

## 🌐 Deployment

### Netlify (Recommended)
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Other Platforms
The app generates static files and can be deployed to:
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## 🔧 Customization

### Adding Languages
1. Create new translation file in `src/i18n/locales/`
2. Add language to the resources object in `src/i18n/index.ts`
3. Update language switcher in `src/components/LanguageSwitcher.tsx`

### Adding Currencies
1. Update `SUPPORTED_CURRENCIES` in `src/config.ts`
2. Add conversion rates in `src/utils/currency.ts`
3. Update `COUNTRY_TO_CURRENCY` mapping

### Styling
- Edit Tailwind classes throughout components
- Modify `src/index.css` for global styles
- Update color scheme in component files

## 📱 Usage

### Customer Flow
1. Customer visits the site (auto-redirects to their language)
2. Selects a plan and clicks "Choose Plan"
3. Fills out the checkout form with their details
4. Clicks "Continue on WhatsApp"
5. WhatsApp opens with pre-filled message and payment link
6. Customer completes payment and receives service access

### Admin Flow
1. Visit `/[lang]/admin?key=your-admin-key`
2. View dashboard statistics
3. Manage orders (search, filter, update status)
4. Export data as CSV

## 🔒 Security

- Admin access protected by secure key
- No sensitive data stored in localStorage
- WhatsApp integration doesn't expose customer data
- Payment processing handled by external secure services

## 📊 Analytics

The app is ready for analytics integration:
- Add Google Analytics 4
- Track conversion events
- Monitor user flow through the checkout process

## 🐛 Troubleshooting

### Common Issues

1. **WhatsApp link not working:**
   - Check phone number format (must be E.164)
   - Ensure WhatsApp is installed on mobile devices

2. **Admin dashboard not loading:**
   - Verify admin key is correct
   - Check browser console for errors

3. **Language not changing:**
   - Clear browser cache
   - Check localStorage for saved language preference

4. **Orders not saving:**
   - Verify localStorage permissions
   - Check for JavaScript errors in console

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🤝 Support

For support, please contact:
- Email: support@iptveurope.com
- WhatsApp: [Your WhatsApp Number]

---

Built with ❤️ using React, TypeScript, and Tailwind CSS.