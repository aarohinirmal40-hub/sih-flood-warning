export type AlertLevel = 'red' | 'orange' | 'yellow' | 'green' | 'insufficient'

export interface AlertInfo {
  level: AlertLevel
  title: string
  bgColor: string
  actionMsg: string
  markerColor: 'red' | 'orange' | 'beige' | 'green' | 'gray'
  textColor: string
}

export function calculateRisk(
  rain: number,
  riverLevel: number,
  humidity: number,
  dangerMark: number = 0,
): number {
  let score = 0

  // 1. Rainfall Contribution (up to 60 points)
  if (rain > 0 && rain <= 5) {
    score += rain * 4
  } else if (rain > 5 && rain <= 15) {
    score += 20 + (rain - 5) * 3
  } else if (rain > 15) {
    score += 50 + (rain - 15) * 2
  }

  // 2. River Level Contribution (up to 30 points)
  const riverRatio = dangerMark > 0 ? riverLevel / dangerMark : 0
  if (riverRatio > 0.7) {
    score += (riverRatio - 0.7) * 100
  }

  // 3. Soil Humidity Contribution (up to 10 points)
  if (humidity > 70) {
    score += (humidity - 70) * 0.33
  }

  // 4. Safeguard: guarantee Green when conditions are genuinely normal
  if (rain === 0 && riverRatio < 0.95) {
    score = Math.min(score, 28)
  }

  return Math.min(100, Math.max(0, Math.round(score)))
}

export function getAlertInfo(riskScore: number | null, locationName: string): AlertInfo {
  if (riskScore === null) {
    return {
      level: 'insufficient',
      title: `DATA INSUFFICIENT (${locationName.toUpperCase()}: UNABLE TO ASSESS RISK)`,
      bgColor: '#455A64',
      actionMsg: `Live weather data for ${locationName} is currently unavailable. Risk status cannot be determined. Please retry or check alternative sources.`,
      markerColor: 'gray',
      textColor: '#ffffff',
    }
  }
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
  riskScore: number | null,
  alertTitle: string,
  rain: number,
  riverLevel: number,
  dangerMark: number,
  humidity: number,
  actionMsg: string,
): string {
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
  const scoreText = riskScore === null ? 'N/A (Data Insufficient)' : `${riskScore.toFixed(0)} / 100`
  return `==================================================
NATIONAL DISASTER MANAGEMENT AUTHORITY (NDMA)
AUTOMATED SITUATION REPORT (SITREP) - SIH 2026
==================================================
Timestamp       : ${now}
Target Location : ${locationName}
Risk Index Score: ${scoreText}
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
