import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const lang = searchParams.get("lang") || "en";

    if (!lat || !lng) {
      return NextResponse.json({ error: "Missing lat or lng parameter" }, { status: 400 });
    }

    const isHi = lang === "hi";

    // 1. In-memory fallback for offline, sandbox, or timeout scenarios.
    const getLocalHeuristic = (latitude: number, longitude: number) => {
      // Keep the fallback location-neutral; Nominatim supplies the actual city when available.
      return {
        area: isHi ? "भारत" : "India",
        lat: latitude,
        lng: longitude
      };
    };

    // 2. Fetch from Nominatim OpenStreetMap with strict error boundaries and Custom User Agent
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=${lang}`,
        {
          method: "GET",
          headers: {
            "User-Agent": "JanMitra-AI-Smart-Governance-App/1.0 (contact: theabhishek4u)",
            "Accept-Language": lang,
          },
          // 4-second timeout to ensure the app UI remains snappy
          signal: AbortSignal.timeout(4000)
        }
      );

      if (!response.ok) {
        throw new Error(`Nominatim returned status ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.address) {
        const addr = data.address;
        
        // Extract localized components
        const road = addr.road || addr.street;
        const suburb = addr.suburb || addr.neighbourhood || addr.city_district || addr.quarter || addr.subdivision;
        const city = addr.city || addr.town || addr.village || addr.municipality;
        const state = addr.state || addr.region;

        let area = "";

        // Build a concise localized area string from the reverse-geocoder response.
        if (suburb && city) {
          area = `${suburb}, ${city}`;
        } else if (road && city) {
          area = `${road}, ${city}`;
        } else if (suburb) {
          area = suburb;
        } else if (city) {
          area = city;
        } else if (state) {
          area = state;
        } else {
          // Splice standard display_name if no fine-grained details exist
          area = data.display_name 
            ? data.display_name.split(",").slice(0, 3).join(",").trim() 
            : `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
        }

        // Return successful geocoded result
        return NextResponse.json({
          area: area,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          addressDetails: data.address,
          displayName: data.display_name
        });
      }
      
      // Fallback if data is empty or malformed
      const fallback = getLocalHeuristic(parseFloat(lat), parseFloat(lng));
      return NextResponse.json(fallback);

    } catch (apiError) {
      console.warn("External Nominatim lookup failed or timed out. Falling back to local geocoding rules:", apiError);
      const fallback = getLocalHeuristic(parseFloat(lat), parseFloat(lng));
      return NextResponse.json(fallback);
    }

  } catch (error: any) {
    console.error("Geocoding Route Handler encountered a serious error:", error);
    return NextResponse.json(
      { error: "Internal Geocoding Failed", details: error.message },
      { status: 500 }
    );
  }
}
