import InfoBottomSheet from "@/components/custom/hotlines/InfoBottomSheet";
import ListBottomSheet from "@/components/custom/hotlines/ListBottomSheet";
import PageLayout from "@/components/custom/layout/PageLayout";
import { markers } from "@/helper/locationMarkers";
import polyline from "@mapbox/polyline";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

export default function Hotlines() {
  const [listOpen, setListOpen] = useState(false);
  const [viewLocationOpen, setViewLocationOpen] = useState(false);
  const [locationDetails, setLocationDetails] = useState({});
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const mapRef = useRef<MapView>(null);

  const isFocused = useIsFocused();

  // Get user's current location
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    getCurrentLocation();
  }, []);

  // ✅ Fetch route using Google Routes API
  const getRoute = async (destinationLat: number, destinationLng: number) => {
    if (!userLocation) {
      console.error('User location not available');
      return;
    }

    try {
      const res = await axios.post(
        "https://routes.googleapis.com/directions/v2:computeRoutes",
        {
          origin: {
            location: {
              latLng: {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              },
            },
          },
          destination: {
            location: {
              latLng: {
                latitude: destinationLat,
                longitude: destinationLng,
              },
            },
          },
          travelMode: "DRIVE",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": "AIzaSyBz6m86m7Ngavzh9vbeMM2uIvIssd6zd7c",
            "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
          },
        }
      );

      const encodedPolyline = res.data.routes[0].polyline.encodedPolyline;
      const points = polyline.decode(encodedPolyline);

      const route = points.map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng,
      }));

      setRouteCoords(route);
    } catch (err) {
      console.error("Error fetching route:", err);
    }
  };

  if (!isFocused) {
    return null; // unmount map completely when not focused
  }

  const handleLocationPress = async (latitude: number, longitude: number) => {
    // Animate to the selected location
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01, // Zoom in closer
        longitudeDelta: 0.01,
      },
      1000 // Animation duration in ms
    );

    // Get route to the selected location
    await getRoute(latitude, longitude);
  };

  return (
    <PageLayout headerTitle="Clinic Locations">
      {/* Map Screen */}
      <View className="flex-1 w-full relative items-center">
        <View className="min-h-screen w-full bg-gray-300">
          <MapView
            ref={mapRef}
            style={{ width: "100%", height: "100%" }}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: userLocation?.latitude || 14.5995, // Use user location or fallback
              longitude: userLocation?.longitude || 120.9842,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }}
          >
            {/* User location marker */}
            {userLocation && (
              <Marker
                coordinate={userLocation}
                title="Your Location"
                pinColor="blue"
              />
            )}

            {/* ✅ Route polyline */}
            {routeCoords.length > 0 && (
              <Polyline
                coordinates={routeCoords}
                strokeWidth={3}
                strokeColor="red"
              />
            )}

            {/* Clinic markers */}
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.title}
                description={marker.address}
                onPress={() => {
                  setViewLocationOpen(true);
                  setLocationDetails({
                    title: marker.title,
                    address: marker.address,
                    hours: marker.hours,
                    contact: marker.contact,
                  });
                }}
              >
                <Image source={marker.image} style={{ height: 30, width: 30 }} />
              </Marker>
            ))}
          </MapView>
        </View>
      </View>

      <ListBottomSheet onLocationPress={handleLocationPress} />
      <InfoBottomSheet
        details={locationDetails}
        open={viewLocationOpen}
        onClose={() => setViewLocationOpen(false)}
      />
    </PageLayout>
  );
}