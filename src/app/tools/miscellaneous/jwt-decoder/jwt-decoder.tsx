'use client';
import React, { useState, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';
import DataDisclaimer from '@/components/disclaimers/dataDisclaimer';

interface DecodedJWT {
  header: any;
  payload: any;
  signature: string;
  raw: {
    header: string;
    payload: string;
    signature: string;
  };
}

export function JWTDecoder() {
  const [jwtToken, setJwtToken] = useState('');
  const [decodedJWT, setDecodedJWT] = useState<DecodedJWT | null>(null);
  const [error, setError] = useState('');

  const base64UrlDecode = (str: string): string => {
    try {
      // Add padding if needed
      const padding = '='.repeat((4 - (str.length % 4)) % 4);
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + padding;
      return atob(base64);
    } catch (e) {
      console.log('Base64URL decode error:', e);
      throw new Error('Invalid base64url encoding');
    }
  };

  const decodeJWT = useCallback(() => {
    setError('');
    setDecodedJWT(null);

    if (!jwtToken.trim()) {
      setError('Please enter a JWT token');
      return;
    }

    try {
      const parts = jwtToken.trim().split('.');
      
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. JWT should have 3 parts separated by dots.');
      }

      const [headerPart, payloadPart, signaturePart] = parts;

      // Decode header
      const headerDecoded = base64UrlDecode(headerPart);
      const header = JSON.parse(headerDecoded);

      // Decode payload
      const payloadDecoded = base64UrlDecode(payloadPart);
      const payload = JSON.parse(payloadDecoded);

      setDecodedJWT({
        header,
        payload,
        signature: signaturePart,
        raw: {
          header: headerDecoded,
          payload: payloadDecoded,
          signature: signaturePart
        }
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to decode JWT token');
    }
  }, [jwtToken]);

  const clearAll = () => {
    setJwtToken('');
    setDecodedJWT(null);
    setError('');
  };

  const handleCopySection = async (content: string) => {
    await copyToClipboard(content);
  };

  const formatTimestamp = (timestamp: number): string => {
    try {
      return new Date(timestamp * 1000).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const renderJsonWithHighlight = (obj: any, section: 'header' | 'payload'): JSX.Element => {
    const jsonString = JSON.stringify(obj, null, 2);
    
    return (
      <div className="relative">
        <pre className="bg-gray-50 border border-gray-300 rounded-md p-4 text-sm overflow-x-auto">
          <code className="text-gray-800">{jsonString}</code>
        </pre>
        <button
          onClick={() => handleCopySection(jsonString)}
          className="absolute top-2 right-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title={`Copy ${section}`}
        >
          Copy
        </button>
      </div>
    );
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.JWTDecoder}
      secondaryToolDescription="Decode JWT (JSON Web Tokens) instantly to view header, payload, and signature components. Analyze token structure, claims, and expiration dates with this secure, client-side JWT decoder tool."
      educationContent={educationContent}
      disclaimer={<DataDisclaimer />}
    >
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">JWT Token Decoder</h2>
          <div className="space-y-4">
            {/* Input Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                JWT Token
              </label>
              <div className="relative">
                <textarea
                  value={jwtToken}
                  onChange={(e) => setJwtToken(e.target.value)}
                  placeholder="Paste your JWT token here..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={decodeJWT}
                className="px-6 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors"
              >
                Decode JWT
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Decoded JWT Display */}
        {decodedJWT && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Decoded JWT Token:</h3>
            
            {/* Token Structure Visualization */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Token Structure</h4>
              <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
                <div className="font-mono text-sm break-all">
                  <span className="text-red-600 bg-red-50 px-1 rounded">{decodedJWT.raw.header}</span>
                  <span className="text-gray-400">.</span>
                  <span className="text-blue-600 bg-blue-50 px-1 rounded">{decodedJWT.raw.payload}</span>
                  <span className="text-gray-400">.</span>
                  <span className="text-orange-600 bg-orange-50 px-1 rounded">{decodedJWT.signature}</span>
                </div>
                <div className="flex gap-4 text-xs mt-2">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-600 rounded"></div>
                    Header
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    Payload
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-600 rounded"></div>
                    Signature
                  </span>
                </div>
              </div>
            </div>

            {/* Header Section */}
            <div className="mb-6 group">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <h4 className="text-lg font-medium text-gray-900">Header</h4>
              </div>
              {renderJsonWithHighlight(decodedJWT.header, 'header')}
            </div>

            {/* Payload Section */}
            <div className="mb-6 group">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <h4 className="text-lg font-medium text-gray-900">Payload</h4>
              </div>
              {renderJsonWithHighlight(decodedJWT.payload, 'payload')}
              
              {/* Common Claims Info */}
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <h3>Common Claims</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-800">
                  {decodedJWT.payload.iss && (
                    <div><strong>Issuer (iss):</strong> {decodedJWT.payload.iss}</div>
                  )}
                  {decodedJWT.payload.sub && (
                    <div><strong>Subject (sub):</strong> {decodedJWT.payload.sub}</div>
                  )}
                  {decodedJWT.payload.aud && (
                    <div><strong>Audience (aud):</strong> {Array.isArray(decodedJWT.payload.aud) ? decodedJWT.payload.aud.join(', ') : decodedJWT.payload.aud}</div>
                  )}
                  {decodedJWT.payload.exp && (
                    <div><strong>Expires (exp):</strong> {formatTimestamp(decodedJWT.payload.exp)}</div>
                  )}
                  {decodedJWT.payload.iat && (
                    <div><strong>Issued At (iat):</strong> {formatTimestamp(decodedJWT.payload.iat)}</div>
                  )}
                  {decodedJWT.payload.nbf && (
                    <div><strong>Not Before (nbf):</strong> {formatTimestamp(decodedJWT.payload.nbf)}</div>
                  )}
                  {decodedJWT.payload.jti && (
                    <div><strong>JWT ID (jti):</strong> {decodedJWT.payload.jti}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-orange-600 rounded"></div>
                <h4 className="text-lg font-medium text-gray-900">Signature</h4>
              </div>
              <div className="relative">
                <pre className="bg-gray-50 border border-gray-300 rounded-md p-4 text-sm overflow-x-auto">
                  <code className="text-gray-800 break-all">{decodedJWT.signature}</code>
                </pre>
                <button
                  onClick={() => handleCopySection(decodedJWT.signature)}
                  className="absolute top-2 right-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy signature"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                The signature is used to verify that the token hasn&apos;t been tampered with. 
                It requires the secret key to validate.
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

const educationContent = (
  <div>
    <h3>About JWT Tokens</h3>
    <p>A JWT is a JSON Web Token used to send data in a secure way. It holds everything inside the token, so it works without a database check. Many apps use it for login and access control. It follows the RFC 7519 standard. You can send it between servers, browsers, and APIs.</p>
    
    <h3>How a JWT Is Built</h3>
    <p>A JWT has three parts called the header, the payload, and the signature. The header shows the token type and the signing method. The payload holds claims and user data. The signature proves the token is real and keeps the contents safe. All three parts use Base64URL encoding and sit in one string separated by dots. Anyone can decode a JWT, but no one can change it without the secret key.</p>
    
    <h3>Where JWTs Are Used and How to Keep Them Safe</h3>
    <p>JWTs help with user login, API access, Single Sign On, mobile app sessions, and service communication. These tokens carry sensitive information, so servers should always check the signature. You should also check the expiration time and the claims. Use HTTPS during every request. Store tokens in a safe place on the client.</p>
  </div>
);