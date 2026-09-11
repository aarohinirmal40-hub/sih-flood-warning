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
}

const en: UIText = {
  title: 'Aapda Seva: Fully Automated AI Flash Flood & Disaster Warning System',
  caption: 'SIH Problem Statement SIH26192 | Google Maps Style View + Audio Siren + Satellite Imagery + Safe Routing',
  sidebarLang: 'Language / भाषा / ভাষা',
  sidebarLocation: 'Location Mode',
  locationMode: 'Select Input Method',
  autoGPS: 'Auto Live GPS Location',
  smartSearch: 'Smart Location Search (If exact name unknown)',
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
  apiOffline: 'API Offline - Using Default Climate Data',
  fetchingWeather: 'Fetching live weather...',
  clickGPS: "Click below to fetch your current GPS coordinates:",
  orSwitch: "Click 'Get Location' above, or switch to Smart Search.",
  noMatch: 'No keyword match found. Showing default nearest hub.',
  showingDefault: 'Showing default location.',
  tabs: [
    'Live Risk Dashboard',
    '24h & 6h AI Forecast',
    'Aapda Mitra AI Assistant',
    'Citizen SOS & Report',
    'Offline Architecture',
    'Live Satellite Imagery',
  ],
  emergencySiren: 'Emergency Public Siren & Audio Broadcast Node Active: Panchayat speakers and automated sirens are currently sounding in the valley.',
  sirenMsg: 'Automated Audio Warning Simulation: "Attention villagers, water level is rising rapidly. Evacuate immediately via designated high-ground routes."',
  advisory: 'Automated Climate Action Advisory',
  sitrep: 'Professional Formatted Authority Report Export',
  downloadSitRep: 'Download Official NDMA SitRep Text File',
  reliefCamps: 'Designated Relief Camps & Routes',
  mapView: 'Google Maps Style View with Safe Evacuation Pathing',
  mapCaption: 'Interactive map showing risk zones, relief hubs, and calculated green safe escape pathways.',
  liveRain: 'Live Satellite Rain',
  waterElev: 'Est. Water Elevation',
  riskIndex: 'Automated Risk Index',
  helpline: 'Emergency Helpline',
  forecastTitle: 'AI-Driven Multi-Tier Early Warning Engine',
  forecastRadio: 'Select Prediction Horizon:',
  forecast24: '24-Hour Macro Regional Forecast',
  forecast6: '6-Hour High-Precision Nowcast',
  forecast24Info: 'Administrative Advantage: 24-hour lead time allows District Collectors to stage NDRF units and pre-position rations.',
  forecast6Alert: 'Immediate Forecast: Catchment saturation trend active.',
  chatbotTitle: 'Aapda Mitra: AI Emergency Query Assistant',
  chatbotDesc: 'Ask any question regarding flood safety, relief shelters, or evacuation guidelines.',
  chatbotPlaceholder: "Type your query here (e.g., 'Where is the nearest safe camp?')",
  sosTitle: 'Ground Citizen Incident Reporting (Crowdsourced Database)',
  reporterName: 'Reporter Name / Pradhan Contact',
  reporterLoc: 'Location / Village Name',
  observedHazard: 'Observed Hazard',
  additionalDetails: 'Additional Details',
  submitBtn: 'Submit Emergency Ground Report',
  submitSuccess: 'Ground Report Saved in Database & Forwarded to District Control Room!',
  submitWarn: 'Please fill in at least your Name and Location.',
  liveIncidents: 'Live Verified Ground Incidents (Database Feed)',
  noReports: 'No ground reports submitted yet.',
  offlineTitle: 'Zero-Internet Offline Alert System & IoT Node Health',
  loraTitle: 'LoRaWAN Mesh Topology & Audio Siren Nodes',
  loraDesc: 'Redundancy Assured: Operates smoothly with 0% internet connectivity during severe weather outages.',
  sensorHealth: 'Simulated Live IoT Sensor Node Health',
  satTitle: 'Real-Time Satellite Imagery & Aerial View',
  satDesc: 'Displaying the latest satellite telemetry and geographic surface observations matching your selected location.',
  satEsri: 'Esri Live Satellite Raster View',
  satSource: 'Source: Esri World Imagery & NASA GIBS Telemetry',
  satCloud: 'Regional Weather & Cloud Cover Snapshot',
  satOptical: 'Current Optical Satellite Surface Capture',
  satSynced: 'Satellite telemetry synchronized successfully.',
  broadcastLogs: 'Localized Multilingual SMS & WhatsApp Broadcast Logs (Gateway Active)',
}

const hi: UIText = {
  ...en,
  title: 'आपदा सेवा: स्वचालित एआई बाढ़ और आपदा चेतावनी प्रणाली',
  caption: 'SIH समस्या समाधान SIH26192 | गूगल मैप्स व्यू + ऑडियो सायरन + सैटेलाइट इमेजरी + सेफ रूट',
  sidebarLang: 'भाषा / Language',
  sidebarLocation: 'स्थान मोड',
  locationMode: 'इनपुट विधि चुनें',
  autoGPS: 'ऑटो लाइव GPS स्थान',
  smartSearch: 'स्मार्ट स्थान खोज (यदि सटीक नाम अज्ञात है)',
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
  apiOffline: 'API ऑफ़लाइन - डिफ़ॉल्ट जलवायु डेटा का उपयोग',
  fetchingWeather: 'लाइव मौसम लाया जा रहा है...',
  clickGPS: 'अपने वर्तमान GPS निर्देशांक प्राप्त करने के लिए नीचे क्लिक करें:',
  orSwitch: "ऊपर 'स्थान प्राप्त करें' पर क्लिक करें, या स्मार्ट खोज पर स्विच करें।",
  noMatch: 'कोई कीवर्ड मैच नहीं मिला। डिफ़ॉल्ट निकटतम हब दिखाया जा रहा है।',
  showingDefault: 'डिफ़ॉल्ट स्थान दिखाया जा रहा है।',
  tabs: [
    'लाइव रिस्क डैशबोर्ड',
    '24घंटे और 6घंटे का एआई पूर्वानुमान',
    'आपदा मित्र एआई सहायक',
    'नागरिक SOS रिपोर्ट',
    'ऑफ़लाइन आर्किटेक्चर',
    'लाइव सैटेलाइट इमेजरी',
  ],
  emergencySiren: 'आपातकालीन सार्वजनिक सायरन और ऑडियो प्रसारण सक्रिय: पंचायत स्पीकर और स्वचालित सायरन वर्तमान में बज रहे हैं।',
  sirenMsg: 'स्वचालित ऑडियो चेतावनी: "ग्रामीणों का ध्यान, जल स्तर तेजी से बढ़ रहा है। तुरंत निर्धारित उच्च भूमि मार्गों से खाली करें।"',
  advisory: 'स्वचालित जलवायु कार्रवाई सलाह',
  sitrep: 'प्रोफेशनल फॉर्मेटेड अथॉरिटी रिपोर्ट निर्यात',
  downloadSitRep: 'आधिकारिक NDMA SitRep टेक्स्ट फ़ाइल डाउनलोड करें',
  reliefCamps: 'निर्धारित राहत शिविर और मार्ग',
  mapView: 'गूगल मैप्स स्टाइल व्यू और सुरक्षित निकासी पाथिंग',
  mapCaption: 'इंटरैक्टिव मानचित्र जो जोखिम क्षेत्र, राहत हब और हरे सुरक्षित भागने के रास्ते दिखाता है।',
  liveRain: 'लाइव उपग्रह वर्षा',
  waterElev: 'अनुमानित जल ऊंचाई',
  riskIndex: 'स्वचालित जोखिम सूचकांक',
  helpline: 'आपातकालीन हेल्पलाइन',
  forecastTitle: 'एआई-चालित मल्टी-टियर अर्ली वॉर्निंग इंजन',
  forecastRadio: 'पूर्वानुमान क्षितिज चुनें:',
  forecast24: '24-घंटे मैक्रो क्षेत्रीय पूर्वानुमान',
  forecast6: '6-घंटे उच्च-सटीकता नाउकास्ट',
  forecast24Info: 'प्रशासनिक लाभ: 24-घंटे का लीड समय ज़िला कलेक्टर्स को NDRF इकाइयों को तैनात करने की अनुमति देता है।',
  forecast6Alert: 'तत्काल पूर्वानुमान: कैचमेंट संतृप्ति प्रवृत्ति सक्रिय।',
  chatbotTitle: 'आपदा मित्र: एआई आपातकालीन क्वेरी सहायक',
  chatbotDesc: 'बाढ़ सुरक्षा, राहत शिविर, या निकासी दिशानिर्देशों के बारे में कोई भी प्रश्न पूछें।',
  chatbotPlaceholder: 'अपना प्रश्न यहाँ टाइप करें',
  sosTitle: 'ग्राउंड नागरिक घटना रिपोर्टिंग (क्राउडसोर्स्ड डेटाबेस)',
  reporterName: 'रिपोर्टर नाम / प्रधान संपर्क',
  reporterLoc: 'स्थान / गांव का नाम',
  observedHazard: 'देखा गया खतरा',
  additionalDetails: 'अतिरिक्त विवरण',
  submitBtn: 'आपातकालीन ग्राउंड रिपोर्ट जमा करें',
  submitSuccess: 'ग्राउंड रिपोर्ट डेटाबेस में सहेजी गई और ज़िला नियंत्रण कक्ष को भेजी गई!',
  submitWarn: 'कृपया कम से कम अपना नाम और स्थान भरें।',
  liveIncidents: 'लाइव सत्यापित ग्राउंड घटनाएँ (डेटाबेस फ़ीड)',
  noReports: 'अभी तक कोई ग्राउंड रिपोर्ट जमा नहीं की गई।',
  offlineTitle: 'ज़ीरो-इंटरनेट ऑफ़लाइन अलर्ट सिस्टम और IoT नोड हेल्थ',
  loraTitle: 'LoRaWAN मेश टोपोलॉजी और ऑडियो सायरन नोड्स',
  loraDesc: 'रिडंडेंसी आश्वासित: गंभीर मौसम आउटेज के दौरान 0% इंटरनेट कनेक्टिविटी के साथ सुचारू रूप से संचालित।',
  sensorHealth: 'सिमुलेटेड लाइव IoT सेंसर नोड हेल्थ',
  satTitle: 'रियल-टाइम उपग्रह इमेजरी और एरियल व्यू',
  satDesc: 'आपके चयनित स्थान से मेल खाती नवीनतम उपग्रह टेलीमेट्री और भौगोलिक सतह अवलोकन।',
  satEsri: 'Esri लाइव उपग्रह रास्टर व्यू',
  satSource: 'स्रोत: Esri World Imagery और NASA GIBS टेलीमेट्री',
  satCloud: 'क्षेत्रीय मौसम और बादल आवरण स्नैपशॉट',
  satOptical: 'वर्तमान ऑप्टिकल उपग्रह सतह कैप्चर',
  satSynced: 'उपग्रह टेलीमेट्री सफलतापूर्वक सिंक्रनाइज़्ड।',
  broadcastLogs: 'स्थानीयकृत बहुभाषी SMS और WhatsApp प्रसारण लॉग (गेटवे सक्रिय)',
}

const bn: UIText = {
  ...en,
  title: 'আপদ সেবা: স্বয়ংক্রিয় এআই বন্যা এবং দুর্যোগ সতর্কবার্তা ব্যবস্থা',
  caption: 'SIH সমস্যা সমাধান SIH26192 | গুগল ম্যাপ ভিউ + অডিও সাইরেন + স্যাটেলাইট ইমেজারি + নিরাপদ রুট',
  tabs: [
    'লাইভ রিস্ক ড্যাশবোর্ড',
    '২৪ ঘণ্টা ও ৬ ঘণ্টা এআই পূর্বাভাস',
    'আপদ মিত্র এআই সহায়ক',
    'নাগরিক SOS রিপোর্ট',
    'অফলাইন আর্কিটেকচার',
    'লাইভ স্যাটেলাইট ইমেজারি',
  ],
}

const mr: UIText = {
  ...en,
  title: 'आपद सेवा: स्वयंचलित AI पूर आणि आपत्ती इशारा प्रणाली',
  caption: 'SIH समस्या निवारण SIH26192 | गुगल मॅप्स व्ह्यू + ऑडिओ सायरन + उपग्रह प्रतिमा + सुरक्षित मार्ग',
  tabs: [
    'थेट धोका डॅशबोर्ड',
    '२४ तास आणि ६ तास AI अंदाज',
    'आपद मित्र AI सहाय्यक',
    'नागरिक SOS अहवाल',
    'ऑफलाइन आर्किटेक्चर',
    'थेट उपग्रह प्रतिमा',
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
