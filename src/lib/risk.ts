export type AlertLevel = 'red' | 'orange' | 'yellow' | 'green'

export interface AlertInfo {
  level: AlertLevel
  title: string
  bgColor: string
  actionMsg: string
  markerColor: 'red' | 'orange' | 'beige' | 'green'
  textColor: string
}

export function calculateRisk(
  rain: number,
  riverLevel: number,
  humidity: number,
  dangerMark: number = 0,
): number {
  // Soil Humidity: up to 35 points. Saturated ground (>85%) is flood-prone.
  let humidityScore: number
  if (humidity <= 40) {
    humidityScore = (humidity / 40) * 5
  } else if (humidity <= 70) {
    humidityScore = 5 + ((humidity - 40) / 30) * 10
  } else if (humidity <= 85) {
    humidityScore = 15 + ((humidity - 70) / 15) * 10
  } else {
    humidityScore = 25 + ((humidity - 85) / 15) * 10
  }
  humidityScore = Math.min(35, humidityScore)

  // Live Rainfall: up to 45 points. 0mm=0, 5mm=20, >15mm=45 (exponential curve).
  let rainScore: number
  if (rain <= 0) {
    rainScore = 0
  } else if (rain <= 5) {
    rainScore = (rain / 5) * 20
  } else if (rain <= 15) {
    rainScore = 20 + ((rain - 5) / 10) * 20
  } else {
    rainScore = 40 + Math.min(5, (rain - 15) * 0.5)
  }
  rainScore = Math.min(45, rainScore)

  // River Level vs Danger Mark: up to 20 points.
  let riverScore: number
  if (dangerMark > 0) {
    const ratio = riverLevel / dangerMark
    if (ratio <= 0.5) {
      riverScore = ratio * 4
    } else if (ratio <= 0.8) {
      riverScore = 2 + ((ratio - 0.5) / 0.3) * 8
    } else if (ratio <= 1.0) {
      riverScore = 10 + ((ratio - 0.8) / 0.2) * 8
    } else {
      riverScore = 18 + Math.min(2, (ratio - 1.0) * 2)
    }
  } else {
    riverScore = Math.max(0, (riverLevel - 4) * 3)
  }
  riverScore = Math.min(20, riverScore)

  const raw = humidityScore + rainScore + riverScore
  return Math.max(0, Math.min(100, Math.round(raw * 10) / 10))
}

export function getAlertInfo(riskScore: number, locationName: string): AlertInfo {
  if (riskScore >= 81) {
    return {
      level: 'red',
      title: `RED ALERT (${locationName.toUpperCase()}: EMERGENCY EVACUATION)`,
      bgColor: '#D32F2F',
      actionMsg: `Extreme flood risk in ${locationName}! Evacuate immediately to designated relief camps.`,
      markerColor: 'red',
      textColor: '#ffffff',
    }
  } else if (riskScore >= 61) {
    return {
      level: 'orange',
      title: `ORANGE ALERT (${locationName.toUpperCase()}: PREPARE TO EVACUATE)`,
      bgColor: '#EF6C00',
      actionMsg: `High risk in ${locationName}. Live weather shows heavy rainfall. Prepare to evacuate.`,
      markerColor: 'orange',
      textColor: '#ffffff',
    }
  } else if (riskScore >= 31) {
    return {
      level: 'yellow',
      title: `YELLOW ALERT (${locationName.toUpperCase()}: WATCH & MONITOR)`,
      bgColor: '#FBC02D',
      actionMsg: `Moderate risk in ${locationName}. Stay updated on weather conditions.`,
      markerColor: 'beige',
      textColor: '#1a1a1a',
    }
  }
  return {
    level: 'green',
    title: `GREEN ALERT (${locationName.toUpperCase()}: SAFE CONDITIONS)`,
    bgColor: '#388E3C',
    actionMsg: `Normal conditions in ${locationName}. No immediate threat detected from live weather feeds.`,
    markerColor: 'green',
    textColor: '#ffffff',
  }
}

export function generateSitRep(
  locationName: string,
  riskScore: number,
  alertTitle: string,
  rain: number,
  riverLevel: number,
  dangerMark: number,
  humidity: number,
  actionMsg: string,
): string {
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
  return `==================================================
NATIONAL DISASTER MANAGEMENT AUTHORITY (NDMA)
AUTOMATED SITUATION REPORT (SITREP) - SIH 2026
==================================================
Timestamp       : ${now}
Target Location : ${locationName}
Risk Index Score: ${riskScore.toFixed(0)} / 100
Current Status  : ${alertTitle}
--------------------------------------------------
METEOROLOGICAL TELEMETRY DATA:
- Live Rainfall          : ${rain} mm/hr
- Estimated Water Level  : ${riverLevel} m (Danger Mark: ${dangerMark}m)
- Soil Humidity          : ${humidity}%
--------------------------------------------------
RECOMMENDED ACTION DIRECTIVE:
${actionMsg}
--------------------------------------------------
DESIGNATED RELIEF HUBS & ROUTES:
1. Govt Primary School (1.2 km) - Status: OPEN (Safe Corridor Active)
2. Panchayat Bhawan (2.5 km)   - Status: OPEN
3. Community Centre (3.8 km)   - Status: STANDBY
==================================================`
}
