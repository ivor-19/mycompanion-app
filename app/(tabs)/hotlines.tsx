import InfoBottomSheet from "@/components/custom/hotlines/InfoBottomSheet";
import ListBottomSheet from "@/components/custom/hotlines/ListBottomSheet";
import PageLayout from "@/components/custom/layout/PageLayout";
import { calculateDistance } from "@/helper/calculateDistance";
import { markers } from "@/helper/locationMarkers";
import { FONT } from "@/lib/scale";
import polyline from "@mapbox/polyline";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

type LatLng = {
  latitude: number;
  longitude: number;
};

export default function Hotlines() {
  const [loading, setLoading] = useState(true);
  const [viewLocationOpen, setViewLocationOpen] = useState(false);
  const [locationDetails, setLocationDetails] = useState<any>({});
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const mapRef = useRef<MapView>(null);

  const isFocused = useIsFocused();

  // Get user's current location
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("Error getting location:", error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentLocation();
  }, []);

  // ✅ Fetch route using Google Routes API
  const getRoute = async (destinationLat: number, destinationLng: number) => {
    if (!userLocation) {
      console.error("User location not available");
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

      const encodedPolyline: string =
        res.data.routes[0].polyline.encodedPolyline;
      const points: [number, number][] = polyline.decode(encodedPolyline);

      const route: LatLng[] = points.map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng,
      }));

      setRouteCoords(route);

      let distance = 0;
      // 🔹 Calculate total distance
      for (let i = 0; i < route.length - 1; i++) {
        distance += calculateDistance(
          route[i].latitude,
          route[i].longitude,
          route[i + 1].latitude,
          route[i + 1].longitude
        );
      }

      setTotalDistance(distance);
    } catch (err) {
      console.error("Error fetching route:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationPress = async (latitude: number, longitude: number) => {
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
    await getRoute(latitude, longitude);
  };

  if (loading) {
    return (
      <PageLayout headerTitle="Clinic Locations">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ff0066" />
          <Text
            className="mt-2 text-gray-600 font-funnel_semi"
            style={{ fontSize: FONT.sm }}
          >
            Loading map...
          </Text>
        </View>
        <ListBottomSheet onLocationPress={handleLocationPress} />
      </PageLayout>
    );
  }

  return (
    <PageLayout headerTitle="Clinic Locations">
      <View className="flex-1 w-full relative items-center">
        {totalDistance > 0 && (
          <View className="flex-col items-center justify-between absolute top-2 bg-white/80 w-[40%] rounded-full border-2 border-gray-400 z-10 py-2 px-6 ">
            <Text
              className="font-funnel_semi text-center"
              style={{ fontSize: FONT.xs }}
            >
              Distance
            </Text>
            <Text
              className="font-funnel_semi text-center"
              style={{ fontSize: FONT.xs }}
            >
              {totalDistance.toFixed(2)} km
            </Text>
          </View>
        )}

        <View className="min-h-screen w-full">
          {isFocused && (
            <MapView
              ref={mapRef}
              style={{ width: "100%", height: "100%" }}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: userLocation?.latitude || 14.5995,
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
                  strokeWidth={4}
                  strokeColor="red"
                  lineDashPattern={[10, 5]}
                  geodesic={true}
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
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                    });
                  }}
                >
                  <Image
                    source={marker.image}
                    style={{ height: 24, width: 24 }}
                  />
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>

      {/* Bottom Sheets always mounted */}
      <ListBottomSheet onLocationPress={handleLocationPress} />
      <InfoBottomSheet
        details={locationDetails}
        open={viewLocationOpen}
        onClose={() => setViewLocationOpen(false)}
        onLocationPress={handleLocationPress}
      />
    </PageLayout>
  );
}
