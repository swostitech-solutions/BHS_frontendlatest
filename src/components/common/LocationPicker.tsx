import { useState, useRef, useEffect } from "react";
import { Navigation, MapPin, X, Loader2, Search } from "lucide-react";

// Get API key from environment or use empty string
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

interface LocationPickerProps {
  value: string;
  onChange: (address: string, coords?: { lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
}

interface Suggestion {
  place_id: string;
  description: string;
}

const LocationPicker = ({
  value,
  onChange,
  placeholder = "Enter your address...",
  className = "",
}: LocationPickerProps) => {
  const [isLocating, setIsLocating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Check if Google Maps API is available
  const isGoogleMapsAvailable = GOOGLE_MAPS_API_KEY && typeof google !== "undefined";

  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    if (!GOOGLE_MAPS_API_KEY) {
      // Fallback: return formatted coordinates
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results[0]) {
        return data.results[0].formatted_address;
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error("Reverse geocode error:", error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  // Get current location
  const handleGetCurrentLocation = async () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        // Get readable address
        const address = await reverseGeocode(latitude, longitude);
        onChange(address, { lat: latitude, lng: longitude });
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        alert("Unable to get your location. Please enter address manually.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Search for address suggestions (Places Autocomplete)
  const searchAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      // No API key - skip autocomplete
      return;
    }

    setSearchLoading(true);

    try {
      // Using Places Autocomplete API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&components=country:in&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        setSuggestions(
          data.predictions.map((p: any) => ({
            place_id: p.place_id,
            description: p.description,
          }))
        );
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Autocomplete error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Get coordinates for selected place
  const selectPlace = async (placeId: string, description: string) => {
    if (!GOOGLE_MAPS_API_KEY) {
      onChange(description);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.result?.geometry?.location) {
        const { lat, lng } = data.result.geometry.location;
        setCoords({ lat, lng });
        onChange(description, { lat, lng });
      } else {
        onChange(description);
      }
    } catch (error) {
      onChange(description);
    }

    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounced search
    debounceRef.current = setTimeout(() => {
      searchAddress(newValue);
    }, 300);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <MapPin size={20} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full bg-gray-50 rounded-2xl pl-12 pr-24 py-4 font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchLoading && (
            <div className="p-2">
              <Loader2 size={18} className="animate-spin text-gray-400" />
            </div>
          )}

          {value && (
            <button
              onClick={() => {
                onChange("");
                setCoords(null);
                setSuggestions([]);
              }}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X size={18} className="text-gray-400" />
            </button>
          )}

          <button
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
            title="Use current location"
          >
            {isLocating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Navigation size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-64 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => selectPlace(suggestion.place_id, suggestion.description)}
              className="w-full px-4 py-3 text-left hover:bg-indigo-50 flex items-start gap-3 border-b border-gray-50 last:border-0 transition-colors"
            >
              <MapPin size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{suggestion.description}</span>
            </button>
          ))}
        </div>
      )}

      {/* Coordinates Badge */}
      {coords && (
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <MapPin size={12} />
          <span>
            {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </span>
        </div>
      )}

      {/* No API Key Warning (dev only) */}
      {!GOOGLE_MAPS_API_KEY && import.meta.env.DEV && (
        <p className="mt-1 text-xs text-amber-600">
          Add VITE_GOOGLE_MAPS_API_KEY to .env for address autocomplete
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
