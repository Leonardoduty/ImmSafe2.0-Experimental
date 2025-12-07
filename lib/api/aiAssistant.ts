export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface ChatResponse {
  message: string
  success: boolean
}

const CANNED_RESPONSES: Record<string, string> = {
  help: "I'm here to help you navigate safely. You can ask me about:\n- Safe routes and destinations\n- Emergency contacts\n- Finding shelter, food, and water\n- Legal assistance and documentation\n- Medical help\n- Border crossing information",
  
  emergency: "For emergencies:\n1. Contact local emergency services\n2. Find the nearest UNHCR office\n3. Reach out to local NGOs\n4. Use the app's emergency protocols section\n5. If possible, stay with a group",
  
  shelter: "To find shelter:\n1. Check our Aid Services section for nearby shelters\n2. Contact UNHCR for refugee camps\n3. Look for Red Cross/Red Crescent centers\n4. Many mosques, churches, and community centers offer temporary shelter\n5. NGOs like IRC and NRC provide housing assistance",
  
  water: "For clean water:\n1. Check our map for water points\n2. UNICEF and WFP distribute water in camps\n3. Always boil or purify water if unsure\n4. Carry water purification tablets\n5. Avoid stagnant water sources",
  
  food: "For food assistance:\n1. WFP provides food in refugee camps\n2. Check local food banks and distribution centers\n3. NGOs like CARE and Mercy Corps provide food aid\n4. Community kitchens often serve free meals\n5. Register with UNHCR for regular food assistance",
  
  medical: "For medical help:\n1. Look for MSF (Doctors Without Borders) clinics\n2. UNHCR camps have medical facilities\n3. Red Cross provides emergency medical care\n4. Check our map for hospital locations\n5. Many NGOs offer free healthcare",
  
  legal: "For legal assistance:\n1. UNHCR provides legal counseling\n2. IRC has legal aid programs\n3. Norwegian Refugee Council offers legal help\n4. Contact local bar associations for pro-bono lawyers\n5. Keep all documents safe and make copies",
  
  documents: "To protect documents:\n1. Use our Secure Document Vault feature\n2. Take photos of all important documents\n3. Register with UNHCR to get official documentation\n4. Store copies in multiple locations\n5. Never give originals unless absolutely required",
  
  border: "For border crossing:\n1. Check our visa requirements section\n2. Research official border crossings\n3. Have all documents ready\n4. Know your rights as an asylum seeker\n5. Contact UNHCR if denied entry",
  
  default: "I understand you're looking for help. Could you be more specific about what you need? I can assist with:\n- Finding safe routes\n- Locating shelters, food, and water\n- Medical and legal assistance\n- Document protection\n- Emergency contacts\n\nType 'help' for a full list of topics."
}

function findBestResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes("help") || lowerMessage.includes("assist")) {
    return CANNED_RESPONSES.help
  }
  if (lowerMessage.includes("emergency") || lowerMessage.includes("urgent") || lowerMessage.includes("danger")) {
    return CANNED_RESPONSES.emergency
  }
  if (lowerMessage.includes("shelter") || lowerMessage.includes("housing") || lowerMessage.includes("sleep") || lowerMessage.includes("stay")) {
    return CANNED_RESPONSES.shelter
  }
  if (lowerMessage.includes("water") || lowerMessage.includes("drink") || lowerMessage.includes("thirst")) {
    return CANNED_RESPONSES.water
  }
  if (lowerMessage.includes("food") || lowerMessage.includes("hungry") || lowerMessage.includes("eat") || lowerMessage.includes("meal")) {
    return CANNED_RESPONSES.food
  }
  if (lowerMessage.includes("medical") || lowerMessage.includes("doctor") || lowerMessage.includes("hospital") || lowerMessage.includes("sick") || lowerMessage.includes("health")) {
    return CANNED_RESPONSES.medical
  }
  if (lowerMessage.includes("legal") || lowerMessage.includes("lawyer") || lowerMessage.includes("asylum") || lowerMessage.includes("rights")) {
    return CANNED_RESPONSES.legal
  }
  if (lowerMessage.includes("document") || lowerMessage.includes("passport") || lowerMessage.includes("id") || lowerMessage.includes("papers")) {
    return CANNED_RESPONSES.documents
  }
  if (lowerMessage.includes("border") || lowerMessage.includes("crossing") || lowerMessage.includes("visa") || lowerMessage.includes("entry")) {
    return CANNED_RESPONSES.border
  }
  
  return CANNED_RESPONSES.default
}

export async function sendMessage(message: string, apiKey?: string): Promise<ChatResponse> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (apiKey) {
    console.log("[AI Assistant] API key provided - would connect to AI service")
  }
  
  const response = findBestResponse(message)
  
  return {
    message: response,
    success: true
  }
}

export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function createMessage(role: "user" | "assistant", content: string): ChatMessage {
  return {
    id: generateMessageId(),
    role,
    content,
    timestamp: new Date().toISOString()
  }
}
