export type LanguageKey = 'en' | 'hi' | 'bn' | 'mr' | 'te' | 'ta' | 'gu' | 'kn'

export interface LanguageOption {
  label: string
  key: LanguageKey
}

export const languages: LanguageOption[] = [
  { label: 'English', key: 'en' },
  { label: 'हिन्दी (Hindi)', key: 'hi' },
  { label: 'বাংলা (Bengali)', key: 'bn' },
  { label: 'मराठी (Marathi)', key: 'mr' },
  { label: 'తెలుగు (Telugu)', key: 'te' },
  { label: 'தமிழ் (Tamil)', key: 'ta' },
  { label: 'ગુજરાતી (Gujarati)', key: 'gu' },
  { label: 'ಕನ್ನಡ (Kannada)', key: 'kn' },
]

export interface UIText {
  title: string
  caption: string
  sidebarLang: string
  sidebarLocation: string
  locationMode: string
  autoGPS: string
  smartSearch: string
  searchPlaceholder: string
  selectMatch: string
  liveClimate: string
  targetLocation: string
  liveRainfall: string
  soilHumidity: string
  liveTemp: string
  feelsLike: string
  windSpeed: string
  weatherCondition: string
  cloudCover: string
  apiSynced: string
  apiOffline: string
  fetchingWeather: string
  clickGPS: string
  orSwitch: string
  noMatch: string
  showingDefault: string
  tabs: string[]
  emergencySiren: string
  sirenMsg: string
  advisory: string
  sitrep: string
  downloadSitRep: string
  reliefCamps: string
  mapView: string
  mapCaption: string
  liveRain: string
  waterElev: string
  riskIndex: string
  helpline: string
  forecastTitle: string
  forecastRadio: string
  forecast24: string
  forecast6: string
  forecast24Info: string
  forecast6Alert: string
  chatbotTitle: string
  chatbotDesc: string
  chatbotPlaceholder: string
  sosTitle: string
  reporterName: string
  reporterLoc: string
  observedHazard: string
  additionalDetails: string
  submitBtn: string
  submitSuccess: string
  submitWarn: string
  liveIncidents: string
  noReports: string
  offlineTitle: string
  loraTitle: string
  loraDesc: string
  sensorHealth: string
  satTitle: string
  satDesc: string
  satEsri: string
  satSource: string
  satCloud: string
  satOptical: string
  satSynced: string
  broadcastLogs: string
  // New section labels
  riskWhy: string
  whatToDoNow: string
  lastUpdated: string
  dataSource: string
  dataSourceLive: string
  dataSourceDemo: string
  dataSourceUnavailable: string
  dataSourceOffline: string
  alertsTitle: string
  alertsDesc: string
  alertSeverity: string
  alertArea: string
  alertTime: string
  alertReason: string
  alertAction: string
  alertEvacuationUrgency: string
  noActiveAlerts: string
  findSafeRoute: string
  findShelter: string
  sosBtn: string
  routingTitle: string
  routingDesc: string
  currentLocation: string
  destination: string
  saferRoute: string
  dangerZones: string
  estimatedDistance: string
  estimatedTime: string
  routeWarning: string
  simulatedData: string
  sheltersTitle: string
  sheltersDesc: string
  shelterName: string
  shelterDistance: string
  shelterCapacity: string
  shelterStatus: string
  shelterAccessibility: string
  shelterFacilities: string
  shelterOpen: string
  shelterFull: string
  shelterStandby: string
  safeRouteBtn: string
  callBtn: string
  reportsTitle: string
  reportsDesc: string
  reportCategory: string
  reportSeverity: string
  reportLocation: string
  reportTimestamp: string
  reportPhoto: string
  reportStatus: string
  catWaterlogging: string
  catRisingWater: string
  catBlockedRoad: string
  catDamagedBridge: string
  catRescueRequired: string
  catOther: string
  sevLow: string
  sevModerate: string
  sevHigh: string
  sevCritical: string
  emergencyTitle: string
  emergencyDesc: string
  emergencyContacts: string
  rescueRequest: string
  shareLocation: string
  nearestShelter: string
  nearestHospital: string
  emergencyInstructions: string
  call1077: string
  call108: string
  call112: string
  familyTitle: string
  familyDesc: string
  addFamilyMember: string
  familyName: string
  familyPhone: string
  imSafe: string
  emergencyCheckin: string
  familyStatus: string
  statusSafe: string
  statusUnknown: string
  statusNeedHelp: string
  preparednessTitle: string
  preparednessDesc: string
  beforeFlood: string
  duringFlood: string
  afterFlood: string
  checklistDocuments: string
  checklistMedicines: string
  checklistWater: string
  checklistEmergencyKit: string
  checklistPowerBank: string
  checklistEvacuation: string
  offlineModeTitle: string
  offlineModeDesc: string
  lastSynced: string
  savedContacts: string
  savedShelters: string
  safetyChecklist: string
  sosInstructions: string
  dataStateLive: string
  dataStateSynced: string
  dataStateOffline: string
  dataStateUnavailable: string
}

const en: UIText = {
  title: 'Aapda Seva: AI Flash Flood Warning & Emergency Response Platform',
  caption: 'SIH 2026 (SIH26192) | Monitor · Predict · Warn · Guide · Evacuate · Rescue',
  sidebarLang: 'Language / भाषा / ভাষা',
  sidebarLocation: 'Location Mode',
  locationMode: 'Select Input Method',
  autoGPS: 'Auto Live GPS Location',
  smartSearch: 'Smart Location Search',
  searchPlaceholder: 'Search Location or Region',
  selectMatch: 'Select Nearest Match Found:',
  liveClimate: 'Live Climate Feed',
  targetLocation: 'Target Location',
  liveRainfall: 'Actual Live Rainfall',
  soilHumidity: 'Actual Soil Humidity',
  liveTemp: 'Current Temperature',
  feelsLike: 'Feels Like',
  windSpeed: 'Wind Speed',
  weatherCondition: 'Weather Condition',
  cloudCover: 'Cloud Cover',
  apiSynced: 'API Synced successfully!',
  apiOffline: 'API Offline - Data Unavailable',
  fetchingWeather: 'Fetching live weather...',
  clickGPS: "Click below to fetch your current GPS coordinates:",
  orSwitch: "Click 'Get Location' above, or switch to Smart Search.",
  noMatch: 'No keyword match found. Showing default nearest hub.',
  showingDefault: 'Showing default location.',
  tabs: [
    'Live Risk',
    'Smart Alerts',
    'Safe Routing',
    'Shelters',
    'Community Reports',
    'Emergency Center',
    'Family Safety',
    'Preparedness',
    'AI Assistant',
    'Forecast',
    'Offline Mode',
    'Satellite View',
  ],
  emergencySiren: 'Emergency Public Siren & Audio Broadcast Node Active: Panchayat speakers and automated sirens are currently sounding in the valley.',
  sirenMsg: 'Automated Audio Warning Simulation: "Attention villagers, water level is rising rapidly. Evacuate immediately via designated high-ground routes."',
  advisory: 'Automated Climate Action Advisory',
  sitrep: 'Professional Formatted Authority Report Export',
  downloadSitRep: 'Download Official NDMA SitRep Text File',
  reliefCamps: 'Designated Relief Camps & Routes',
  mapView: 'Map View with Safe Evacuation Pathing',
  mapCaption: 'Interactive map showing risk zones, relief hubs, and calculated safe escape pathways.',
  liveRain: 'Live Rain',
  waterElev: 'Est. Water Elevation',
  riskIndex: 'Risk Index',
  helpline: 'Emergency Helpline',
  forecastTitle: 'AI-Driven Multi-Tier Early Warning Engine',
  forecastRadio: 'Select Prediction Horizon:',
  forecast24: '24-Hour Macro Regional Forecast',
  forecast6: '6-Hour High-Precision Nowcast',
  forecast24Info: 'Administrative Advantage: 24-hour lead time allows District Collectors to stage NDRF units and pre-position rations.',
  forecast6Alert: 'Immediate Forecast: Catchment saturation trend active.',
  chatbotTitle: 'Aapda Mitra: AI Flood Safety Assistant',
  chatbotDesc: 'Ask about flood safety, shelters, evacuation, or rescue guidance.',
  chatbotPlaceholder: "Type your query (e.g., 'Is my area at risk?')",
  sosTitle: 'Community Flood Report',
  reporterName: 'Reporter Name',
  reporterLoc: 'Location / Village Name',
  observedHazard: 'Category',
  additionalDetails: 'Additional Details',
  submitBtn: 'Submit Report',
  submitSuccess: 'Report saved and forwarded to District Control Room!',
  submitWarn: 'Please fill in at least your Name and Location.',
  liveIncidents: 'Community Report Feed',
  noReports: 'No reports submitted yet.',
  offlineTitle: 'Offline Safety Mode & IoT Node Health',
  loraTitle: 'LoRaWAN Mesh Topology & Audio Siren Nodes',
  loraDesc: 'Redundancy Assured: Operates smoothly with 0% internet connectivity during severe weather outages.',
  sensorHealth: 'Simulated IoT Sensor Node Health',
  satTitle: 'Real-Time Satellite Imagery & Aerial View',
  satDesc: 'Displaying the latest satellite telemetry matching your selected location.',
  satEsri: 'Esri Live Satellite Raster View',
  satSource: 'Source: Esri World Imagery & NASA GIBS Telemetry',
  satCloud: 'Regional Weather & Cloud Cover Snapshot',
  satOptical: 'Current Optical Satellite Surface Capture',
  satSynced: 'Satellite telemetry synchronized successfully.',
  broadcastLogs: 'Localized Multilingual SMS & WhatsApp Broadcast Logs',
  // New section labels
  riskWhy: 'Why this risk level?',
  whatToDoNow: 'What should I do now?',
  lastUpdated: 'Last Updated',
  dataSource: 'Data Source',
  dataSourceLive: 'LIVE',
  dataSourceDemo: 'DEMO',
  dataSourceUnavailable: 'UNAVAILABLE',
  dataSourceOffline: 'OFFLINE',
  alertsTitle: 'Smart Alert Center',
  alertsDesc: 'Active flood warnings and advisories for your area',
  alertSeverity: 'Severity',
  alertArea: 'Affected Area',
  alertTime: 'Time',
  alertReason: 'Reason',
  alertAction: 'Recommended Action',
  alertEvacuationUrgency: 'Evacuation Urgency',
  noActiveAlerts: 'No active alerts for this location. Conditions are normal.',
  findSafeRoute: 'Find Safe Route',
  findShelter: 'Find Shelter',
  sosBtn: 'SOS',
  routingTitle: 'Safe Evacuation Routing',
  routingDesc: 'Emergency route guidance to nearest shelter',
  currentLocation: 'Current Location',
  destination: 'Destination Shelter',
  saferRoute: 'Safer Route',
  dangerZones: 'Danger / Blocked Areas',
  estimatedDistance: 'Distance',
  estimatedTime: 'Est. Travel Time',
  routeWarning: 'Warning: Route passes through a risk zone',
  simulatedData: 'SIMULATED',
  sheltersTitle: 'Relief & Shelter Directory',
  sheltersDesc: 'Available shelters near your location',
  shelterName: 'Shelter Name',
  shelterDistance: 'Distance',
  shelterCapacity: 'Capacity',
  shelterStatus: 'Status',
  shelterAccessibility: 'Accessibility',
  shelterFacilities: 'Facilities',
  shelterOpen: 'OPEN',
  shelterFull: 'FULL',
  shelterStandby: 'STANDBY',
  safeRouteBtn: 'Safe Route',
  callBtn: 'Call',
  reportsTitle: 'Community Flood Reports',
  reportsDesc: 'Crowdsourced ground-level flood reporting',
  reportCategory: 'Category',
  reportSeverity: 'Severity',
  reportLocation: 'Location',
  reportTimestamp: 'Time',
  reportPhoto: 'Photo',
  reportStatus: 'Status',
  catWaterlogging: 'Waterlogging',
  catRisingWater: 'Rising Water Level',
  catBlockedRoad: 'Blocked Road',
  catDamagedBridge: 'Damaged Bridge',
  catRescueRequired: 'Rescue Required',
  catOther: 'Other Emergency',
  sevLow: 'Low',
  sevModerate: 'Moderate',
  sevHigh: 'High',
  sevCritical: 'Critical',
  emergencyTitle: 'Emergency Center',
  emergencyDesc: 'One-tap emergency actions and rescue request',
  emergencyContacts: 'Emergency Contacts',
  rescueRequest: 'Request Rescue',
  shareLocation: 'Share My Location',
  nearestShelter: 'Nearest Shelter',
  nearestHospital: 'Nearest Hospital',
  emergencyInstructions: 'Emergency Instructions',
  call1077: 'Call 1077 (Control Room)',
  call108: 'Call 108 (Ambulance)',
  call112: 'Call 112 (Emergency)',
  familyTitle: 'Family Safety',
  familyDesc: 'Track your family members and send safety check-ins',
  addFamilyMember: 'Add Family Member',
  familyName: 'Name',
  familyPhone: 'Phone Number',
  imSafe: "I'm Safe",
  emergencyCheckin: 'Emergency Check-in',
  familyStatus: 'Family Status',
  statusSafe: 'Safe',
  statusUnknown: 'Unknown',
  statusNeedHelp: 'Needs Help',
  preparednessTitle: 'Flood Preparedness Guide',
  preparednessDesc: 'Essential checklists for before, during, and after a flood',
  beforeFlood: 'Before Flood',
  duringFlood: 'During Flood',
  afterFlood: 'After Flood',
  checklistDocuments: 'Important documents in waterproof bag',
  checklistMedicines: 'Essential medicines (7-day supply)',
  checklistWater: 'Drinking water (3 liters per person)',
  checklistEmergencyKit: 'Emergency kit (first aid, torch, whistle)',
  checklistPowerBank: 'Phone & power bank charged',
  checklistEvacuation: 'Evacuation plan and route known',
  offlineModeTitle: 'Offline Safety Mode',
  offlineModeDesc: 'Access saved emergency info without internet',
  lastSynced: 'Last Synced',
  savedContacts: 'Saved Emergency Contacts',
  savedShelters: 'Saved Shelters',
  safetyChecklist: 'Safety Checklist',
  sosInstructions: 'SOS Instructions',
  dataStateLive: 'LIVE',
  dataStateSynced: 'LAST SYNCED',
  dataStateOffline: 'OFFLINE',
  dataStateUnavailable: 'UNAVAILABLE',
}

const hi: UIText = {
  ...en,
  title: 'आपदा सेवा: एआई बाढ़ चेतावनी और आपातकालीन प्रतिक्रिया प्लेटफ़ॉर्म',
  caption: 'SIH 2026 (SIH26192) | निगरानी · भविष्यवाणी · चेतावनी · मार्गदर्शन · निकासी · बचाव',
  sidebarLang: 'भाषा / Language',
  sidebarLocation: 'स्थान मोड',
  locationMode: 'इनपुट विधि चुनें',
  autoGPS: 'ऑटो लाइव GPS स्थान',
  smartSearch: 'स्मार्ट स्थान खोज',
  searchPlaceholder: 'स्थान या क्षेत्र खोजें',
  selectMatch: 'निकटतम मिलान चुनें:',
  liveClimate: 'लाइव जलवायु फ़ीड',
  targetLocation: 'लक्ष्य स्थान',
  liveRainfall: 'वास्तविक लाइव वर्षा',
  soilHumidity: 'वास्तविक मिट्टी नमी',
  liveTemp: 'वर्तमान तापमान',
  feelsLike: 'महसूस होता',
  windSpeed: 'हवा की गति',
  weatherCondition: 'मौसम स्थिति',
  cloudCover: 'बादल आवरण',
  apiSynced: 'API सफलतापूर्वक सिंक हो गया!',
  apiOffline: 'API ऑफ़लाइन - डेटा अनुपलब्ध',
  fetchingWeather: 'लाइव मौसम लाया जा रहा है...',
  clickGPS: 'अपने वर्तमान GPS निर्देशांक प्राप्त करने के लिए नीचे क्लिक करें:',
  orSwitch: "ऊपर 'स्थान प्राप्त करें' पर क्लिक करें, या स्मार्ट खोज पर स्विच करें।",
  noMatch: 'कोई कीवर्ड मैच नहीं मिला। डिफ़ॉल्ट निकटतम हब दिखाया जा रहा है।',
  showingDefault: 'डिफ़ॉल्ट स्थान दिखाया जा रहा है।',
  tabs: [
    'लाइव रिस्क',
    'स्मार्ट अलर्ट',
    'सुरक्षित मार्ग',
    'शेल्टर',
    'सामुदायिक रिपोर्ट',
    'आपातकालीन केंद्र',
    'परिवार सुरक्षा',
    'तैयारी',
    'एआई सहायक',
    'पूर्वानुमान',
    'ऑफ़लाइन मोड',
    'उपग्रह दृश्य',
  ],
  emergencySiren: 'आपातकालीन सार्वजनिक सायरन और ऑडियो प्रसारण सक्रिय: पंचायत स्पीकर और स्वचालित सायरन बज रहे हैं।',
  sirenMsg: 'स्वचालित ऑडियो चेतावनी: "ग्रामीणों का ध्यान, जल स्तर तेजी से बढ़ रहा है। तुरंत उच्च भूमि मार्गों से खाली करें।"',
  advisory: 'स्वचालित जलवायु कार्रवाई सलाह',
  sitrep: 'प्रोफेशनल अथॉरिटी रिपोर्ट निर्यात',
  downloadSitRep: 'आधिकारिक NDMA SitRep फ़ाइल डाउनलोड करें',
  reliefCamps: 'निर्धारित राहत शिविर और मार्ग',
  mapView: 'मानचित्र दृश्य और सुरक्षित निकासी मार्ग',
  mapCaption: 'इंटरैक्टिव मानचित्र जो जोखिम क्षेत्र, राहत हब और सुरक्षित रास्ते दिखाता है।',
  liveRain: 'लाइव वर्षा',
  waterElev: 'अनुमानित जल ऊंचाई',
  riskIndex: 'जोखिम सूचकांक',
  helpline: 'आपातकालीन हेल्पलाइन',
  forecastTitle: 'एआई-चालित मल्टी-टियर अर्ली वॉर्निंग इंजन',
  forecastRadio: 'पूर्वानुमान क्षितिज चुनें:',
  forecast24: '24-घंटे मैक्रो क्षेत्रीय पूर्वानुमान',
  forecast6: '6-घंटे उच्च-सटीकता नाउकास्ट',
  forecast24Info: 'प्रशासनिक लाभ: 24-घंटे का लीड समय NDRF इकाइयों को तैनात करने की अनुमति देता है।',
  forecast6Alert: 'तत्काल पूर्वानुमान: कैचमेंट संतृप्ति प्रवृत्ति सक्रिय।',
  chatbotTitle: 'आपदा मित्र: एआई बाढ़ सुरक्षा सहायक',
  chatbotDesc: 'बाढ़ सुरक्षा, राहत शिविर, या निकासी के बारे में पूछें।',
  chatbotPlaceholder: 'अपना प्रश्न यहाँ टाइप करें',
  sosTitle: 'सामुदायिक बाढ़ रिपोर्ट',
  reporterName: 'रिपोर्टर नाम',
  reporterLoc: 'स्थान / गांव का नाम',
  observedHazard: 'श्रेणी',
  additionalDetails: 'अतिरिक्त विवरण',
  submitBtn: 'रिपोर्ट जमा करें',
  submitSuccess: 'रिपोर्ट डेटाबेस में सहेजी गई और ज़िला नियंत्रण कक्ष को भेजी गई!',
  submitWarn: 'कृपया कम से कम अपना नाम और स्थान भरें।',
  liveIncidents: 'सामुदायिक रिपोर्ट फ़ीड',
  noReports: 'अभी तक कोई रिपोर्ट जमा नहीं की गई।',
  offlineTitle: 'ऑफ़लाइन सुरक्षा मोड और IoT नोड हेल्थ',
  loraTitle: 'LoRaWAN मेश टोपोलॉजी और ऑडियो सायरन नोड्स',
  loraDesc: 'रिडंडेंसी आश्वासित: गंभीर मौसम आउटेज के दौरान 0% इंटरनेट के साथ संचालित।',
  sensorHealth: 'सिमुलेटेड IoT सेंसर नोड हेल्थ',
  satTitle: 'रियल-टाइम उपग्रह इमेजरी और एरियल व्यू',
  satDesc: 'आपके चयनित स्थान से मेल खाती नवीनतम उपग्रह टेलीमेट्री।',
  satEsri: 'Esri लाइव उपग्रह रास्टर व्यू',
  satSource: 'स्रोत: Esri World Imagery और NASA GIBS टेलीमेट्री',
  satCloud: 'क्षेत्रीय मौसम और बादल आवरण स्नैपशॉट',
  satOptical: 'वर्तमान ऑप्टिकल उपग्रह सतह कैप्चर',
  satSynced: 'उपग्रह टेलीमेट्री सफलतापूर्वक सिंक्रनाइज़्ड।',
  broadcastLogs: 'स्थानीयकृत बहुभाषी SMS और WhatsApp प्रसारण लॉग',
  riskWhy: 'यह जोखिम स्तर क्यों?',
  whatToDoNow: 'मुझे अभी क्या करना चाहिए?',
  lastUpdated: 'अंतिम अपडेट',
  dataSource: 'डेटा स्रोत',
  dataSourceLive: 'लाइव',
  dataSourceDemo: 'डेमो',
  dataSourceUnavailable: 'अनुपलब्ध',
  dataSourceOffline: 'ऑफ़लाइन',
  alertsTitle: 'स्मार्ट अलर्ट केंद्र',
  alertsDesc: 'आपके क्षेत्र के लिए सक्रिय बाढ़ चेतावनी',
  alertSeverity: 'गंभीरता',
  alertArea: 'प्रभावित क्षेत्र',
  alertTime: 'समय',
  alertReason: 'कारण',
  alertAction: 'अनुशंसित कार्रवाई',
  alertEvacuationUrgency: 'निकासी तात्कालिकता',
  noActiveAlerts: 'इस स्थान के लिए कोई सक्रिय अलर्ट नहीं। स्थितियां सामान्य हैं।',
  findSafeRoute: 'सुरक्षित मार्ग खोजें',
  findShelter: 'शेल्टर खोजें',
  sosBtn: 'SOS',
  routingTitle: 'सुरक्षित निकासी मार्ग',
  routingDesc: 'निकटतम शेल्टर तक आपातकालीन मार्ग मार्गदर्शन',
  currentLocation: 'वर्तमान स्थान',
  destination: 'गंतव्य शेल्टर',
  saferRoute: 'सुरक्षित मार्ग',
  dangerZones: 'खतरनाक / अवरोधित क्षेत्र',
  estimatedDistance: 'दूरी',
  estimatedTime: 'अनुमानित समय',
  routeWarning: 'चेतावनी: मार्ग जोखिम क्षेत्र से गुजरता है',
  simulatedData: 'सिमुलेटेड',
  sheltersTitle: 'राहत और शेल्टर निर्देशिका',
  sheltersDesc: 'आपके स्थान के पास उपलब्ध शेल्टर',
  shelterName: 'शेल्टर नाम',
  shelterDistance: 'दूरी',
  shelterCapacity: 'क्षमता',
  shelterStatus: 'स्थिति',
  shelterAccessibility: 'पहुंच',
  shelterFacilities: 'सुविधाएं',
  shelterOpen: 'खुला',
  shelterFull: 'भरा हुआ',
  shelterStandby: 'स्टैंडबाय',
  safeRouteBtn: 'सुरक्षित मार्ग',
  callBtn: 'कॉल',
  reportsTitle: 'सामुदायिक बाढ़ रिपोर्ट',
  reportsDesc: 'ज़मीनी स्तर पर बाढ़ रिपोर्टिंग',
  reportCategory: 'श्रेणी',
  reportSeverity: 'गंभीरता',
  reportLocation: 'स्थान',
  reportTimestamp: 'समय',
  reportPhoto: 'फ़ोटो',
  reportStatus: 'स्थिति',
  catWaterlogging: 'जलभराव',
  catRisingWater: 'जल स्तर बढ़ता',
  catBlockedRoad: 'अवरोधित सड़क',
  catDamagedBridge: 'क्षतिग्रस्त पुल',
  catRescueRequired: 'बचाव आवश्यक',
  catOther: 'अन्य आपातकाल',
  sevLow: 'कम',
  sevModerate: 'मध्यम',
  sevHigh: 'उच्च',
  sevCritical: 'गंभीर',
  emergencyTitle: 'आपातकालीन केंद्र',
  emergencyDesc: 'एक टैप में आपातकालीन कार्रवाई और बचाव अनुरोध',
  emergencyContacts: 'आपातकालीन संपर्क',
  rescueRequest: 'बचाव अनुरोध',
  shareLocation: 'मेरा स्थान साझा करें',
  nearestShelter: 'निकटतम शेल्टर',
  nearestHospital: 'निकटतम अस्पताल',
  emergencyInstructions: 'आपातकालीन निर्देश',
  call1077: '1077 पर कॉल (नियंत्रण कक्ष)',
  call108: '108 पर कॉल (एम्बुलेंस)',
  call112: '112 पर कॉल (आपातकाल)',
  familyTitle: 'परिवार सुरक्षा',
  familyDesc: 'अपने परिवार के सदस्यों को ट्रैक करें और सुरक्षा चेक-इन भेजें',
  addFamilyMember: 'परिवार सदस्य जोड़ें',
  familyName: 'नाम',
  familyPhone: 'फ़ोन नंबर',
  imSafe: 'मैं सुरक्षित हूं',
  emergencyCheckin: 'आपातकालीन चेक-इन',
  familyStatus: 'परिवार स्थिति',
  statusSafe: 'सुरक्षित',
  statusUnknown: 'अज्ञात',
  statusNeedHelp: 'सहायता चाहिए',
  preparednessTitle: 'बाढ़ तैयारी गाइड',
  preparednessDesc: 'बाढ़ से पहले, दौरान और बाद के लिए चेकलिस्ट',
  beforeFlood: 'बाढ़ से पहले',
  duringFlood: 'बाढ़ के दौरान',
  afterFlood: 'बाढ़ के बाद',
  checklistDocuments: 'महत्वपूर्ण दस्तावेज़ जलरोधी बैग में',
  checklistMedicines: 'आवश्यक दवाएं (7-दिन की आपूर्ति)',
  checklistWater: 'पीने का पानी (प्रति व्यक्ति 3 लीटर)',
  checklistEmergencyKit: 'आपातकालीन किट (प्राथमिक चिकित्सा, टॉर्च, सीटी)',
  checklistPowerBank: 'फ़ोन और पावर बैंक चार्ज',
  checklistEvacuation: 'निकासी योजना और मार्ग ज्ञात',
  offlineModeTitle: 'ऑफ़लाइन सुरक्षा मोड',
  offlineModeDesc: 'बिना इंटरनेट सहेजी गई आपातकालीन जानकारी',
  lastSynced: 'अंतिम सिंक',
  savedContacts: 'सहेजे गए आपातकालीन संपर्क',
  savedShelters: 'सहेजे गए शेल्टर',
  safetyChecklist: 'सुरक्षा चेकलिस्ट',
  sosInstructions: 'SOS निर्देश',
  dataStateLive: 'लाइव',
  dataStateSynced: 'अंतिम सिंक',
  dataStateOffline: 'ऑफ़लाइन',
  dataStateUnavailable: 'अनुपलब्ध',
}

const bn: UIText = {
  ...en,
  title: 'আপদ সেবা: এআই বন্যা সতর্কবার্তা ও জরুরি প্রতিক্রিয়া প্ল্যাটফর্ম',
  caption: 'SIH 2026 (SIH26192) | পর্যবেক্ষণ · পূর্বাভাস · সতর্কবার্তা · নির্দেশনা · সরিয়ে নেওয়া · উদ্ধার',
  tabs: [
    'লাইভ ঝুঁকি',
    'স্মার্ট সতর্কতা',
    'নিরাপদ রুট',
    'আশ্রয়',
    'সামুদায়িক রিপোর্ট',
    'জরুরি কেন্দ্র',
    'পরিবার সুরক্ষা',
    'প্রস্তুতি',
    'এআই সহায়ক',
    'পূর্বাভাস',
    'অফলাইন মোড',
    'স্যাটেলাইট ভিউ',
  ],
}

const mr: UIText = {
  ...en,
  title: 'आपद सेवा: AI पूर चेतावणी आणि आपत्ती प्रतिसाद प्लॅटफॉर्म',
  caption: 'SIH 2026 (SIH26192) | निरीक्षण · अंदाज · इशारा · मार्गदर्शन · रिक्त · बचाव',
  tabs: [
    'थेट धोका',
    'स्मार्ट इशारे',
    'सुरक्षित मार्ग',
    'निवारा',
    'सामुदायिक अहवाल',
    'आपत्ती केंद्र',
    'कुटुंब सुरक्षा',
    'तयारी',
    'AI सहाय्यक',
    'अंदाज',
    'ऑफलाइन मोड',
    'उपग्रह दृश्य',
  ],
}

const translations: Record<LanguageKey, UIText> = {
  en, hi, bn, mr, te: en, ta: en, gu: en, kn: en,
}

export function getUIText(key: LanguageKey): UIText {
  return translations[key] ?? en
}

export function translateAlert(locationName: string, key: LanguageKey): string {
  const messages: Record<LanguageKey, string> = {
    en: `Alert: Severe flood risk in ${locationName}! Proceed immediately to safe relief camps.`,
    hi: `🚨 [हिन्दी अलर्ट]: ${locationName} में गंभीर बाढ़ का खतरा! कृपया तुरंत सुरक्षित राहत शिविरों की ओर प्रस्थान करें।`,
    bn: `🚨 [বাংলা সতর্কতা]: ${locationName}-এ মারাত্মক বন্যার ঝুঁকি! অবিলম্বে নিরাপদ ত্রাণ শিবিরে সরে যান।`,
    mr: `🚨 [मराठी इशारा]: ${locationName} मध्ये पुराचा गंभीर धोका! लवकरात लवकर सुरक्षित छावण्यांकडे जा.`,
    te: `🚨 [తెలుగు హెచ్చరిక]: ${locationName}లో తీవ్ర ముంపు ప్రమాదం! సురక్షిత శిబిరాలకు వెళ్లండి.`,
    ta: `🚨 [தமிழ் எச்சரிக்கை]: ${locationName}-ல் கடுமையான வெள்ள அபாயம்! நிவாரண முகாம்களுக்குச் செல்லவும்.`,
    gu: `🚨 [ગુજરાતી ચેતવણી]: ${locationName} માં પૂરનું ગંભીર જોખમ! સુરક્ષિત સ્થળે જાઓ.`,
    kn: `🚨 [ಕನ್ನಡ ಎಚ್ಚರಿಕೆ]: ${locationName} ನಲ್ಲಿ ಭಾರಿ ಪ್ರವಾಹ ಅಪಾಯ! ಸುರಕ್ಷಿತ ಶಿಬಿರಕ್ಕೆ ತೆರಳಿ.`,
  }
  return messages[key] ?? messages.en
}
