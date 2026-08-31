import math
from typing import Optional


def distance_meters(
    lat1: Optional[float], lng1: Optional[float], lat2: Optional[float], lng2: Optional[float]
) -> Optional[float]:
    """Great-circle distance between two lat/lng points, in meters."""
    if lat1 is None or lng1 is None or lat2 is None or lng2 is None:
        return None

    earth_radius_m = 6_371_000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lng2 - lng1)

    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return earth_radius_m * c
