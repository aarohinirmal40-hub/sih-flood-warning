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
  return rain * 0.5 + riverLevel * 5.0 + humidity * 0.3
}

export function getAlertInfo(riskScore: number, locationName: string): AlertInfo {
  if (riskScore >= 75) {
    return {
      level: 'red',
      title: `RED ALERT (${locationName.toUpperCase()}: EMERGENCY EVACUATION)`,
      bgColor: '#D32F2F',
      actionMsg: `IMMEDIATE EVACUATION ORDER for ${locationName}! Real-time climate sensors indicate severe flood threat. Move to designated Relief Camps.`,
      markerColor: 'red',
      textColor: '#ffffff',
    }
  } else if (riskScore >= 50) {
    return {
      level: 'orange',
      title: `ORANGE ALERT (${locationName.toUpperCase()}: PREPARE TO EVACUATE)`,
      bgColor: '#EF6C00',
      actionMsg: `HIGH ALERT in ${locationName}! Live weather monitoring shows rising water levels. Keep emergency kits ready.`,
      markerColor: 'orange',
      textColor: '#ffffff',
    }
  } else if (riskScore >= 30) {
    return {
      level: 'yellow',
      title: `YELLOW ALERT (${locationName.toUpperCase()}: WATCH & MONITOR)`,
      bgColor: '#FBC02D',
      actionMsg: `Weather conditions in ${locationName} are being tracked via automated climate feeds. Stay alert.`,
      markerColor: 'beige',
      textColor: '#1a1a1a',
    }
  }
  return {
    level: 'green',
    title: `GREEN ALERT (${locationName.toUpperCase()}: SAFE CONDITIONS)`,
    bgColor: '#388E3C',
    actionMsg: `Climate parameters in ${locationName} are normal. No immediate threat detected from live satellite feeds.`,
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
