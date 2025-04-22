# Allergy Aid Companion

A comprehensive web application designed to help users manage allergies, scan food products for allergens, and maintain their personal allergen profiles.

**Note:** A screenshot of the application would normally be displayed here. For a description of what it would contain, see [public/app-screenshot.txt](public/app-screenshot.txt).

## 🌟 Features

### 1. Allergen Profile Management
- Create and maintain a personalized allergen profile
- Track allergen severity levels and classification
- View cross-reactive allergens based on scientific research
- Monitor test history and results

### 2. Food Scanner
- Scan food products by name to check for allergens
- Save food items to your personal cache
- View allergen information and severity assessment
- Access history of previously scanned foods

### 3. Barcode Scanner
- Scan product barcodes using your device's camera
- Manual barcode entry option
- Real-time product lookup via the OpenFoodFacts API
- View detailed product allergen information and ingredients

### 4. Test Result Analysis
- Upload and analyze allergy test results
- Support for PDF and image uploads
- Manual entry options for test results
- Automatic severity assessment and allergen profile updates

### 5. Cross-Reactive Allergen Analysis
- View potential allergens you might react to based on your existing allergies
- Analysis powered by OpenFoodFacts data and clinical research
- Detailed information about cross-reactive allergen relationships

## 🚀 Technology Stack

- **Frontend**: React with TypeScript
- **Routing**: React Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Storage**: Local storage for data persistence
- **Barcode Scanning**: HTML5-QRCode for camera-based scanning
- **API Integration**: OpenFoodFacts for product data

## 📋 Pages and Components

1. **Index Page**: Main dashboard with navigation to core features
2. **Allergen Profile Page**: Manage your known allergens and view test history
3. **Food Scan Page**: Search food products and check for allergens
4. **Barcode Scanner Page**: Scan physical products to check for allergens
5. **Test Result Page**: Upload and analyze allergy test results

## 🛠️ Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/allergy-aid-companion.git
cd allergy-aid-companion
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the displayed URL (usually http://localhost:8080)

## 📱 Using the App

### Setting Up Your Allergen Profile
1. Navigate to the Profile page from the main dashboard
2. Click "Add New Allergen" and enter allergen details
3. Set the severity level using the slider
4. Click common allergens to quickly add them to your profile

### Scanning Food Products
1. Navigate to the Food Scan page
2. Enter a food product name or use the barcode scanner
3. View the allergen information in the results
4. Save products to your history for future reference

### Using the Barcode Scanner
1. Go to the Food Scan page and click "Real Barcode Scanner (API)"
2. Allow camera access when prompted
3. Point your camera at a product barcode
4. View detailed product information and allergen data
5. Alternatively, use manual entry if camera scanning isn't available

### Analyzing Test Results
1. Go to the Test Result page
2. Upload a PDF or image of your test results
3. Or use manual entry mode to input results directly
4. Review the analysis and update your allergen profile

## 🔄 Data Management

Allergy Aid Companion uses local storage for data persistence, including:
- Allergen profiles and severity levels
- Test results and history
- Saved food products and scan history

Your data remains on your device and is not transmitted to any external servers (except when using the OpenFoodFacts API for barcode scanning).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [OpenFoodFacts](https://world.openfoodfacts.org/) for providing the product database API
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [HTML5-QRCode](https://github.com/mebjas/html5-qrcode) for the barcode scanning functionality
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the development framework
