// Mock SMS service for browser environment
export const sendOTPSMS = async (to: string, code: string): Promise<void> => {
  console.log(`[DEV] Sending OTP SMS to ${to} with code: ${code}`);
  
  // In development, show the code in a notification
  if (import.meta.env.DEV) {
    const message = `[DEVELOPMENT MODE]\nSMS sent to: ${to}\nOTP Code: ${code}`;
    alert(message);
  }
};