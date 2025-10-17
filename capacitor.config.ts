import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0948a55c08a84bae87e87762dfad5532',
  appName: 'Comic Vault',
  webDir: 'dist',
  server: {
    url: 'https://0948a55c-08a8-4bae-87e8-7762dfad5532.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    BarcodeScanner: {
      cameraDirection: 'back'
    }
  }
};

export default config;
