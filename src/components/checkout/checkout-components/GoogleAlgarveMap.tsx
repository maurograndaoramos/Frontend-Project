"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, MapPin, CheckCircle2, AlertCircle, Loader2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the container style
const containerStyle = {
  width: '100%',
  height: '400px'
};

interface GoogleAlgarveMapProps {
  address: string;
  city: string;
  municipality: string;
  postalCode: string;
  onLocationConfirmed: (coords: {lat: number, lng: number}) => void;
}

export default function GoogleAlgarveMap({
  address,
  city,
  municipality, 
  postalCode,
  onLocationConfirmed
}: GoogleAlgarveMapProps) {
  // Get API key from environment variables
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  // Manual retry mechanism state
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const [forceReload, setForceReload] = useState(0);
  
  // API key status state
  const [apiKeyStatus, setApiKeyStatus] = useState<'unknown' | 'valid' | 'invalid'>('unknown');
  
  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    id: `google-map-script-${forceReload}`,
    googleMapsApiKey: apiKey,
    libraries: ['geometry']
  });
  
  // Debug logging to help troubleshoot API key issues
  useEffect(() => {
    const debugInfo = {
      apiKeyAvailable: !!apiKey,
      apiKeyFirstChars: apiKey ? apiKey.substring(0, 5) + '...' : 'not available',
      environment: process.env.NODE_ENV
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Google Maps Debug Info:', debugInfo);
    }
    
    if (apiKey && typeof window !== 'undefined') {
      setApiKeyStatus('unknown');
    }
  }, [apiKey]);

  // Effect to update API key status based on map loading
  useEffect(() => {
    if (isLoaded) {
      setApiKeyStatus('valid');
      if (process.env.NODE_ENV === 'development') {
        console.log('✓ Google Maps loaded successfully - API key is working');
      }
    } else if (loadError) {
      setApiKeyStatus('invalid');
      if (process.env.NODE_ENV === 'development') {
        console.log('✗ Google Maps failed to load - API key may be invalid or have incorrect restrictions');
      }
    }
  }, [isLoaded, loadError]);

  // Effect to handle retries when there's a load error
  useEffect(() => {
    if (loadError && retryCount < maxRetries) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Retrying Google Maps API load (attempt ${retryCount + 1}/${maxRetries})...`);
      }
      const timer = setTimeout(() => {
        setRetryCount(prevCount => prevCount + 1);
        setForceReload(prev => prev + 1);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [loadError, retryCount, maxRetries]);

  // Default center of Algarve (Faro)
  const [center, setCenter] = useState({ lat: 37.0135, lng: -7.9347 });
  const [markerPosition, setMarkerPosition] = useState<{lat: number, lng: number} | null>(null);
  const [mapVisible, setMapVisible] = useState(false); // Start with map not visible
  const [isLoading, setIsLoading] = useState(false);
  const [addressComplete, setAddressComplete] = useState(false);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);
  const [geocodingResultSource, setGeocodingResultSource] = useState<string>("none");
  const [addressError, setAddressError] = useState<string | null>(null);
  
  // Ref to the map
  const mapRef = useRef<google.maps.Map | null>(null);

  // Add new state for map click enabled
  const [mapClickEnabled, setMapClickEnabled] = useState(false);

  // Check if address is complete
  useEffect(() => {
    setAddressComplete(Boolean(address && city && municipality && postalCode));
  }, [address, city, municipality, postalCode]);

  // Auto-geocode when address is complete and map is not visible
  useEffect(() => {
    if (addressComplete && isLoaded && !mapVisible && !isLoading) {
      geocodeAddress();
    }
  }, [addressComplete, isLoaded, mapVisible, isLoading]);

  // Handle map load
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Handle map unmount
  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Handle map click for placing the marker
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng && mapClickEnabled) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPosition(newPos);
    }
  }, [mapClickEnabled]);

  // Handle marker drag end
  const onMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPosition(newPos);
    }
  }, []);

  // Handle marker drag start
  const onMarkerDragStart = useCallback(() => {
    // Visual feedback can be added here if needed
  }, []);

  // Geocode the address to get coordinates
  const geocodeAddress = async () => {
    if (!isLoaded) return;
    
    setIsLoading(true);
    setGeocodingResultSource("none");
    setAddressError(null);
    
    try {
      // Get components from the form
      if (process.env.NODE_ENV === 'development') {
        console.log("Geocoding with address components:", { 
          address, city, municipality, postalCode 
        });
      }
      
      // Create the geocoder
      const geocoder = new google.maps.Geocoder();
      
      // First try: Address with postal code - for more precise location
      const addressWithPostal = `${address}, ${postalCode}, Portugal`;
      if (process.env.NODE_ENV === 'development') {
        console.log("Trying address with postal code:", addressWithPostal);
      }
      
      geocoder.geocode({ 
        address: addressWithPostal,
        componentRestrictions: {
          country: 'PT'
        }
      }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          if (process.env.NODE_ENV === 'development') {
            console.log("✓ Found address with postal code:", {
              lat: location.lat(),
              lng: location.lng(),
              formattedAddress: results[0].formatted_address
            });
          }
          processGeocodingResults(results, "address_with_postal");
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log("Address with postal code failed:", status);
          }
          tryPostalCodeOnly();
        }
      });
      
      // Second try: Postal code only
      const tryPostalCodeOnly = () => {
        const postalCodeQuery = `${postalCode}, Portugal`;
        if (process.env.NODE_ENV === 'development') {
          console.log("Trying postal code only:", postalCodeQuery);
        }
        
        geocoder.geocode({ 
          address: postalCodeQuery,
          componentRestrictions: {
            country: 'PT'
          }
        }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            if (process.env.NODE_ENV === 'development') {
              console.log("✓ Found postal code location:", {
                lat: location.lat(),
                lng: location.lng(),
                formattedAddress: results[0].formatted_address
              });
            }
            processGeocodingResults(results, "postal_code");
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.log("Postal code only failed:", status);
            }
            tryMunicipalityWithPostalCode();
          }
        });
      };
      
      // Third try: Municipality with postal code
      const tryMunicipalityWithPostalCode = () => {
        const municipalityWithPostal = `${postalCode}, ${municipality}, Portugal`;
        if (process.env.NODE_ENV === 'development') {
          console.log("Trying municipality with postal code:", municipalityWithPostal);
        }
        
        geocoder.geocode({ 
          address: municipalityWithPostal,
          componentRestrictions: {
            country: 'PT'
          }
        }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            if (process.env.NODE_ENV === 'development') {
              console.log("✓ Found municipality with postal code:", {
                lat: location.lat(),
                lng: location.lng(),
                formattedAddress: results[0].formatted_address
              });
            }
            processGeocodingResults(results, "municipality_with_postal");
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.log("Municipality with postal code failed:", status);
            }
            tryMunicipalityOnly();
          }
        });
      };
      
      // Fourth try: Municipality only (fallback)
      const tryMunicipalityOnly = () => {
        const municipalityQuery = `${municipality}, Algarve, Portugal`;
        if (process.env.NODE_ENV === 'development') {
          console.log("Trying municipality only:", municipalityQuery);
        }
        
        geocoder.geocode({ 
          address: municipalityQuery,
          componentRestrictions: {
            country: 'PT'
          }
        }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            if (process.env.NODE_ENV === 'development') {
              console.log("✓ Found municipality center (fallback):", {
                lat: location.lat(),
                lng: location.lng(),
                formattedAddress: results[0].formatted_address
              });
            }
            processGeocodingResults(results, "municipality");
          } else {
            // Final fallback to Faro
            if (process.env.NODE_ENV === 'development') {
              console.log("Municipality only failed:", status);
            }
            defaultToFaro();
          }
        });
      };
      
      // Default to Faro (Algarve center)
      const defaultToFaro = () => {
        if (process.env.NODE_ENV === 'development') {
          console.log("All geocoding attempts failed, defaulting to Faro");
        }
        setCenter({ lat: 37.0135, lng: -7.9347 });
        setMarkerPosition({ lat: 37.0135, lng: -7.9347 });
        setMapVisible(true);
        setGeocodingResultSource("algarve_default");
        setIsLoading(false);
      };
      
      // Process geocoding results
      const processGeocodingResults = (results: google.maps.GeocoderResult[], source: string = "exact_address") => {
        const location = results[0].geometry.location;
        const newPosition = { 
          lat: location.lat(), 
          lng: location.lng() 
        };
        
        if (process.env.NODE_ENV === 'development') {
          console.log("Successful geocoding result:", results[0]);
        }
        
        setCenter(newPosition);
        setMarkerPosition(newPosition);
        setMapVisible(true);
        setGeocodingResultSource(source);
        setIsLoading(false);
        
        // Set appropriate zoom based on source accuracy
        if (mapRef.current) {
          setTimeout(() => {
            let zoomLevel = 16; // Default (increased for better street visibility)
            
            if (source === "address_with_postal") {
              zoomLevel = 17; // Close zoom for precise address match
            } else if (source === "postal_code") {
              zoomLevel = 16; // Medium zoom for postal code only
            } else if (source === "municipality_with_postal") {
              zoomLevel = 15; // Medium-distant zoom
            } else if (source === "municipality") {
              zoomLevel = 14; // Further zoom for municipality only
            }
            
            mapRef.current?.setZoom(zoomLevel);
          }, 500);
        }
      };
      
    } catch (error) {
      console.error("Error geocoding address:", error);
      setAddressError("Error geocoding address. Please try again.");
      setCenter({ lat: 37.0135, lng: -7.9347 }); // Faro
      setMarkerPosition({ lat: 37.0135, lng: -7.9347 });
      setMapVisible(true);
      setGeocodingResultSource("error_default");
      setIsLoading(false);
    }
  };

  const handleConfirmLocation = () => {
    if (markerPosition) {
      onLocationConfirmed(markerPosition);
      setIsLocationConfirmed(true);
      
      // Reset after brief confirmation
      setTimeout(() => {
        setIsLocationConfirmed(false);
      }, 2000);
    }
  };
  
  const getGeocodingMessage = () => {
    switch (geocodingResultSource) {
      case "address_with_postal":
        return "✓ Located by address and postal code";
      case "postal_code":
        return "📍 Located by postal code - verify location";
      case "municipality_with_postal":
        return "📍 Located by municipality and postal code - verify location";
      case "municipality":
        return "⚠️ Only municipality center found - please drag pin to your exact location";
      case "algarve_default":
      case "error_default":
        return "⚠️ Exact address not found - please drag pin to your exact delivery location";
      default:
        return "";
    }
  };

  // Toggle pin placement mode
  const togglePinPlacementMode = () => {
    setMapClickEnabled(!mapClickEnabled);
  };

  // Enhanced error display with debug info
  if (loadError) {
    console.error("Google Maps API loading error:", loadError);
    console.log("Current retry count:", retryCount);
    
    // Check if error is likely related to domain restrictions
    const isDomainError = loadError.message.includes("RefererNotAllowedMapError") || 
                           loadError.message.includes("not allowed to use") ||
                           loadError.message.includes("api key");
    
    // Get current domain for error message
    const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'Unknown';
    
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <h3 className="text-lg font-semibold text-destructive">Map Error</h3>
              </div>
            </div>
            
            <div className="rounded-lg border border-red-200 p-4 bg-red-50">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="text-red-700 font-medium mb-2">Error loading Google Maps</h3>
                  <p className="text-sm text-red-600 mb-2">
                    {isDomainError
                      ? `API key error - Your key may be restricted to specific domains. Make sure '${currentDomain}' is allowed.`
                      : `There was a problem loading Google Maps: ${loadError.message}`}
                  </p>
                  {retryCount < maxRetries ? (
                    <div className="flex items-center text-xs text-amber-600">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Retrying ({retryCount + 1}/{maxRetries})...
                    </div>
                  ) : (
                    <p className="text-xs text-red-600">
                      Maximum retries reached. Using fallback mode.
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Manual coordinates fallback */}
            <div className="p-4">
              <h3 className="text-sm font-medium mb-2">Manual Location Input (Fallback)</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Since maps couldn't be loaded, you can manually enter your coordinates if you know them.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-xs">Latitude</Label>
                  <Input 
                    id="latitude"
                    type="text" 
                    placeholder="e.g., 37.0135" 
                    onChange={(e) => {
                      const lat = parseFloat(e.target.value);
                      if (!isNaN(lat)) {
                        setMarkerPosition(prev => ({
                          lat,
                          lng: prev?.lng || 0
                        }));
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-xs">Longitude</Label>
                  <Input 
                    id="longitude"
                    type="text" 
                    placeholder="e.g., -7.9347" 
                    onChange={(e) => {
                      const lng = parseFloat(e.target.value);
                      if (!isNaN(lng)) {
                        setMarkerPosition(prev => ({
                          lat: prev?.lat || 0,
                          lng
                        }));
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mb-4">
                <p>For reference, here are the approximate coordinates for Algarve municipalities:</p>
                <ul className="mt-2 space-y-1">
                  <li>Faro: 37.0135, -7.9347</li>
                  <li>Albufeira: 37.1006, -8.2711</li>
                  <li>Lagos: 37.1880, -8.5961</li>
                  <li>Silves: 37.3053, -8.5527</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleConfirmLocation}
                disabled={!markerPosition}
                size="sm"
                className="w-full"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Confirm Manual Location
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {!mapVisible ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Map className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Delivery Location</h3>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
            onClick={geocodeAddress}
            disabled={!addressComplete || isLoading || !isLoaded}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Map className="h-4 w-4 mr-2" />
            )}
            <span>
              {!isLoaded ? "Loading maps..." : 
                isLoading ? "Looking up address..." : 
                "Show delivery location on map"}
            </span>
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Map className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Delivery Location</h3>
            </div>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={togglePinPlacementMode}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Place pin manually
            </Button>
          </div>

          <div className="h-[400px] w-full relative overflow-hidden rounded-lg border">
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={16}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleMapClick}
                options={{
                  mapTypeControl: true,
                  mapTypeControlOptions: {
                    position: google.maps.ControlPosition.TOP_LEFT
                  },
                  streetViewControl: false,
                  fullscreenControl: true,
                  fullscreenControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                  },
                  zoomControl: true,
                  zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER
                  },
                  clickableIcons: false,
                  draggableCursor: mapClickEnabled ? 'crosshair' : 'grab'
                }}
              >
                {markerPosition && (
                  <Marker
                    position={markerPosition}
                    draggable={true}
                    onDragStart={onMarkerDragStart}
                    onDragEnd={onMarkerDragEnd}
                    animation={google.maps.Animation.DROP}
                    title="Drag me to adjust delivery location"
                  />
                )}
              </GoogleMap>
            )}
          </div>

          {getGeocodingMessage() && (
            <div className="text-sm text-gray-600 mt-2 ml-1">
              {getGeocodingMessage()}
            </div>
          )}
          
          {addressError && (
            <div className="flex items-center text-destructive text-sm mt-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {addressError}
            </div>
          )}
          
          <Button 
            onClick={handleConfirmLocation}
            className={`w-full mt-3 transition-all ${isLocationConfirmed ? 'bg-green-600 hover:bg-green-700' : ''}`}
            disabled={!markerPosition}
          >
            {isLocationConfirmed ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Location Confirmed
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Confirm Location
              </>
            )}
          </Button>
          
          {mapClickEnabled && (
            <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium z-50 shadow-lg">
              Click anywhere on map to place pin
            </div>
          )}
        </div>
      )}
    </div>
  );
}