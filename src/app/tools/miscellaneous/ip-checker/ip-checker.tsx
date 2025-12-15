'use client';

import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, RefreshCw, MapPin, Globe, Server } from 'lucide-react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import DataDisclaimer from '@/components/disclaimers/dataDisclaimer';

interface IPInfo {
  ip: string;
  hostname?: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
}

interface CopyState {
  [key: string]: boolean;
}

const IPChecker: React.FC = () => {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [copyStates, setCopyStates] = useState<CopyState>({});

  // Auto-fetch IP info on component mount
  useEffect(() => {
    fetchIPInfo();
  }, []);

  const fetchIPInfo = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://ipinfo.io/json');
      if (!response.ok) {
        throw new Error('Failed to fetch IP information');
      }
      
      const data: IPInfo = await response.json();
      setIpInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch IP information');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopyStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getCountryName = (countryCode: string): string => {
    const countries: { [key: string]: string } = {
      'US': 'United States',
      'CA': 'Canada',
      'GB': 'United Kingdom',
      'AU': 'Australia',
      'DE': 'Germany',
      'FR': 'France',
      'JP': 'Japan',
      'CN': 'China',
      'IN': 'India',
      'BR': 'Brazil',
      // Add more as needed
    };
    return countries[countryCode] || countryCode;
  };

  const formatOrganization = (org: string): string => {
    // Remove AS number prefix if present
    return org.replace(/^AS\d+\s*/, '');
  };

  const getIPVersion = (ip: string): string => {
    return ip.includes(':') ? 'IPv6' : 'IPv4';
  };

  return (
    <ToolLayout
      toolCategory={ToolNameLists.IPChecker}
      educationContent={educationContent}
      disclaimer={<DataDisclaimer />}
    >
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-sky-500 animate-spin" />
          <span className="ml-3 text-gray-600">Fetching your IP information...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={fetchIPInfo}
            className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* IP Information Display */}
      {ipInfo && !loading && (
        <div className="space-y-6">
          {/* Main IP Address Card */}

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Col */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-md">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Your Public IP Address
              </h2>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                {ipInfo.ip}
              </div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-sky-600">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">{getIPVersion(ipInfo.ip)}</span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <Server className="w-4 h-4" />
                  <span className="text-sm">Public</span>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(ipInfo.ip, 'ip')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                {copyStates.ip ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                Copy IP Address
              </button>
            </div>

            {/* Right Col */}
            <div className="space-y-6">
              {/* Location Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900" style={{ margin: 0 }}>Location Information</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium text-gray-900">{getCountryName(ipInfo.country)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Region:</span>
                    <span className="font-medium text-gray-900">{ipInfo.region}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">City:</span>
                    <span className="font-medium text-gray-900">{ipInfo.city}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Timezone:</span>
                    <span className="font-medium text-gray-900">{ipInfo.timezone}</span>
                  </div>
                </div>
              </div>

              {/* Network Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Server className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900" style={{ margin: 0 }}>Network Information</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">ISP:</span>
                    <span className="font-medium text-gray-900 text-right max-w-xs">
                      {formatOrganization(ipInfo.org)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Organization:</span>
                    <span className="font-medium text-gray-900">Unknown</span>
                  </div>
                  {ipInfo.hostname && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Hostname:</span>
                      <span className="font-medium text-gray-900 text-right max-w-xs break-all">
                        {ipInfo.hostname}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={fetchIPInfo}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => window.open(`https://www.google.com/maps/search/${ipInfo.loc}`, '_blank')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              View on Map
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};

export default IPChecker;

const educationContent = (
  <div>
    <h3>What Is an IP Address?</h3>

    <p>
      An IP address is a unique number that helps the internet find your device. Your Internet Service Provider gives it to you when you go online. It guides traffic to the right place so websites and apps can load on your screen. It also shows your rough location, such as your country or city.
    </p>

    <h3>What Information Do You See?</h3>

    <p>
      You will see your public IP address in IPv4 or IPv6 format. You will also see location details, including your country, region, and city. The page shows your Internet Service Provider, your timezone, and basic network information. This data helps you understand how your device appears on the internet.
    </p>

    <h3>Common Use Cases</h3>

    <p>
      People check their IP address when they fix network issues or talk with support teams. It helps confirm if a VPN works or if location privacy is set up right. It is also useful when you set up remote access, gaming features, or home server settings.
    </p>
  </div>
);