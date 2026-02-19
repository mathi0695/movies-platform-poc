import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

export const generateTicketCode = () => {
  return uuidv4().substring(0, 12).toUpperCase();
};

export const generateQRCode = async (data) => {
  try {
    const qrCode = await QRCode.toDataURL(JSON.stringify(data));
    return qrCode;
  } catch (error) {
    console.error('QR Code generation error:', error);
    return null;
  }
};
