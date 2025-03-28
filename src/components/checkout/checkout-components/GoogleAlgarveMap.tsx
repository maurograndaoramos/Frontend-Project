"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, MapPin, CheckCircle2, AlertCircle, Loader2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";

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
  
  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    id: `google-map-script-${forceReload}`,
    googleMapsApiKey: apiKey,
    libraries: ['geometry']
  });

  // Effect to handle retries when there's a load error
  useEffect(() => {
    if (loadError && retryCount < maxRetries) {
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
  const [mapVisible, setMapVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addressComplete, setAddressComplete] = useState(false);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  
  // Ref to the map
  const mapRef = useRef<google.maps.Map | null>(null);

  // Add new state for map click enabled
  const [mapClickEnabled, setMapClickEnabled] = useState(false);

  // Check if address is complete
  useEffect(() => {
    setAddressComplete(Boolean(address && city && municipality && postalCode));
  }, [address, city, municipality, postalCode]);

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
    setAddressError(null);
    
    try {
      const geocoder = new google.maps.Geocoder();
      
      // First try: Postal code only - most accurate for Portuguese locations
      const postalCodeQuery = `${postalCode}, Portugal`;
      
      geocoder.geocode({ 
        address: postalCodeQuery,
        componentRestrictions: {
          country: 'PT'
        }
      }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          processGeocodingResults(results, "postal_code");
        } else {
          tryAddressWithPostalCode();
        }
      });
      
      // Second try: Address with postal code
      const tryAddressWithPostalCode = () => {
        const addressWithPostal = `${address}, ${postalCode}, Portugal`;
        
        geocoder.geocode({ 
          address: addressWithPostal,
          componentRestrictions: {
            country: 'PT'
          }
        }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            processGeocodingResults(results, "address_with_postal");
          } else {
            tryMunicipalityWithPostalCode();
          }
        });
      };
      
      // Third try: Municipality with postal code
      const tryMunicipalityWithPostalCode = () => {
        const municipalityWithPostal = `${municipality}, ${postalCode}, Portugal`;
        
        geocoder.geocode({ 
          address: municipalityWithPostal,
          componentRestrictions: {
            country: 'PT'
          }
        }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            processGeocodingResults(results, "municipality_with_postal");
          } else {
            tryMunicipalityOnly();
          }
        });
      };
      
      // Fourth try: Municipality only
      const tryMunicipalityOnly = () => {
        const municipalityQuery = `${municipality}, Algarve, Portugal`;
        
        geocoder.geocode({ 
          address: municipalityQuery,
          componentRestrictions: {
            country: 'PT'
          }
        }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            processGeocodingResults(results, "municipality_only");
          } else {
            defaultToFaro();
          }
        });
      };
      
      // Default to Faro if all else fails
      const defaultToFaro = () => {
        const faroLocation = { lat: 37.0135, lng: -7.9347 };
        setCenter(faroLocation);
        setMarkerPosition(faroLocation);
        setIsLocationConfirmed(true);
        onLocationConfirmed(faroLocation);
        setIsLoading(false);
      };
      
      // Process geocoding results
      const processGeocodingResults = (results: google.maps.GeocoderResult[], source: string = "exact_address") => {
        if (results && results[0]) {
          const location = results[0].geometry.location;
          setCenter({ lat: location.lat(), lng: location.lng() });
          setMarkerPosition({ lat: location.lat(), lng: location.lng() });
          setIsLocationConfirmed(true);
          onLocationConfirmed({ lat: location.lat(), lng: location.lng() });
        }
        setIsLoading(false);
      };
      
    } catch (error) {
      setAddressError('Failed to geocode address. Please try again.');
      setIsLoading(false);
    }
  };

  // Handle location confirmation
  const handleConfirmLocation = () => {
    if (markerPosition) {
      setIsLocationConfirmed(true);
      onLocationConfirmed(markerPosition);
    }
  };

  // Toggle pin placement mode
  const togglePinPlacementMode = () => {
    setMapClickEnabled(!mapClickEnabled);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Map className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Delivery Location</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={togglePinPlacementMode}
              className={mapClickEnabled ? "bg-primary text-primary-foreground" : ""}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {mapClickEnabled ? "Click to place pin" : "Place pin manually"}
            </Button>
          </div>

          {!isLoaded ? (
            <div className="flex items-center justify-center h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : loadError ? (
            <div className="flex items-center justify-center h-[400px] text-destructive">
              <AlertCircle className="h-8 w-8 mr-2" />
              <span>Failed to load map</span>
            </div>
          ) : (
            <>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleMapClick}
              >
                {markerPosition && (
                  <Marker
                    position={markerPosition}
                    draggable={true}
                    onDragEnd={onMarkerDragEnd}
                    onDragStart={onMarkerDragStart}
                  />
                )}
              </GoogleMap>

              {addressError && (
                <div className="flex items-center text-destructive text-sm">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {addressError}
                </div>
              )}

              {!isLocationConfirmed && (
                <Button
                  className="w-full"
                  onClick={handleConfirmLocation}
                  disabled={!markerPosition}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm Location
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 