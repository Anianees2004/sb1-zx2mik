// Mock email service for browser environment
export const sendOTPEmail = async (to: string, code: string): Promise<void> => {
  console.log(`[DEV] Sending OTP email to ${to} with code: ${code}`);
  
  // In development, show the code in a notification
  if (import.meta.env.DEV) {
    const message = `[DEVELOPMENT MODE]\nEmail sent to: ${to}\nOTP Code: ${code}`;
    alert(message);
  }
};