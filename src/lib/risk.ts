export type AlertLevel = 'red' | 'orange' | 'yellow' | 'green'

export interface AlertInfo {
  level: AlertLevel
  title: string
  bgColor: string
  actionMsg: string
  markerColor: 'red' | 'orange' | 'beige' | 'green'
  textColor: string
}

export function calculateRisk(rain: number, riverLevel: number, humidity: number): number {
  const rainScore = rain * 8.0
  const riverScore = Math.max(0, (riverLevel - 4) * 6.0)
  const humidityScore = humidity > 85 ? (humidity - 85) * 0.8 : 0
  const raw = rainScore + riverScore + humidityScore
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
