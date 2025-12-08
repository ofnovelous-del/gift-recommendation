interface OpenRouterModel {
  id: string;
  name: string;
  context_length: number;
  pricing?: {
    prompt: string;
    completion: string;
  };
}

interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterProvider {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get list of available models from OpenRouter
   */
  async getModels(): Promise<OpenRouterModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching OpenRouter models:', error);
      throw error;
    }
  }

  /**
   * Generate chat completion using OpenRouter
   */
  async chatCompletion(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
  }): Promise<OpenRouterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Gift Recommendation System',
        },
        body: JSON.stringify({
          model: params.model,
          messages: params.messages,
          temperature: params.temperature ?? 0.7,
          max_tokens: params.max_tokens ?? 2000,
          top_p: params.top_p,
          frequency_penalty: params.frequency_penalty,
          presence_penalty: params.presence_penalty,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenRouter API error: ${response.statusText} - ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      throw error;
    }
  }

  /**
   * Generate questions using AI
   */
  async generateQuestions(framework: string, count: number = 5): Promise<string[]> {
    const prompt = this.getQuestionGenerationPrompt(framework, count);
    
    const response = await this.chatCompletion({
      model: 'openai/gpt-4-turbo', // Default model, can be changed
      messages: [
        {
          role: 'system',
          content: 'You are an expert psychologist creating assessment questions for a gift recommendation system. Generate clear, concise questions in Thai language.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || '';
    return this.parseQuestions(content);
  }

  /**
   * Analyze behavior and generate gift recommendations (AI creates suggestions without preset list)
   */
  async analyzeBehaviorAndRecommend(params: {
    answers: Record<string, any>;
    recipientInfo: {
      relationship?: string;
      gender?: string;
      ageRange?: string;
      occasion?: string;
      budget?: string;
      name?: string;
    };
    availableGifts?: Array<{
      name: string;
      description: string;
      category: string;
      price: number;
    }>;
    useAIGeneratedGifts?: boolean; // New parameter to enable AI-generated gift suggestions
  }): Promise<{
    analysis: {
      persona: {
        type: string;
        name: string;
        description: string;
        traits: string[];
      };
      recommendations: Array<{
        giftName: string;
        description?: string;
        category?: string;
        priceRange?: string;
        matchScore: number;
        reasons: string[];
      }>;
      reasoning: string;
    };
    modelName: string;
  }> {
    const prompt = params.useAIGeneratedGifts 
      ? this.getAIGeneratedGiftsPrompt(params)
      : this.getAnalysisPrompt(params);
    
    const modelName = 'openai/gpt-4-turbo';
    const response = await this.chatCompletion({
      model: modelName,
      messages: [
        {
          role: 'system',
          content: 'You are an expert gift consultant. Analyze customer behavior and recommend suitable gifts. Respond in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content || '';
    const analysis = this.parseAnalysisResponse(content);
    
    return {
      analysis,
      modelName: response.model || modelName,
    };
  }

  private getQuestionGenerationPrompt(framework: string, count: number): string {
    const frameworks: Record<string, string> = {
      big5: `Generate ${count} questions for Big Five Personality assessment. Questions should assess:
- Openness to experience
- Conscientiousness
- Extraversion
- Agreeableness
- Neuroticism

Format: One question per line, in Thai language.`,
      mbti: `Generate ${count} questions for MBTI-style personality assessment. Questions should assess:
- Introversion vs Extraversion
- Sensing vs Intuition
- Thinking vs Feeling
- Judging vs Perceiving

Format: One question per line, in Thai language.`,
      values: `Generate ${count} questions for Value-Based assessment. Questions should assess:
- What values are important (achievement, relationships, experiences, etc.)
- Lifestyle priorities
- Gift preferences

Format: One question per line, in Thai language.`,
      lifestyle: `Generate ${count} questions for Lifestyle Mapping. Questions should assess:
- Daily activities and hobbies
- Social preferences
- Spending habits
- Interests and passions

Format: One question per line, in Thai language.`,
    };

    return frameworks[framework] || frameworks.big5;
  }

  private getAnalysisPrompt(params: {
    answers: Record<string, any>;
    recipientInfo: any;
    availableGifts?: any[];
  }): string {
    return `Analyze the following customer data and provide gift recommendations:

Customer Information:
- Relationship: ${params.recipientInfo.relationship || 'N/A'}
- Gender: ${params.recipientInfo.gender || 'N/A'}
- Age Range: ${params.recipientInfo.ageRange || 'N/A'}
- Occasion: ${params.recipientInfo.occasion || 'N/A'}
- Budget: ${params.recipientInfo.budget || 'N/A'}

Questionnaire Answers:
${JSON.stringify(params.answers, null, 2)}

${params.availableGifts ? `Available Gifts:\n${JSON.stringify(params.availableGifts, null, 2)}` : ''}

Please provide:
1. Gift Persona (type, name, description, traits)
2. Top 3-5 gift recommendations with match scores (0-100) and reasons
3. Overall reasoning

Respond in JSON format:
{
  "persona": {
    "type": "experiencer|practical|luxury|sentimental",
    "name": "ชื่อภาษาไทย",
    "description": "คำอธิบาย",
    "traits": ["trait1", "trait2"]
  },
  "recommendations": [
    {
      "giftName": "ชื่อของขวัญ",
      "matchScore": 95,
      "reasons": ["reason1", "reason2"]
    }
  ],
  "reasoning": "คำอธิบายโดยรวม"
}`;
  }

  private getAIGeneratedGiftsPrompt(params: {
    answers: Record<string, any>;
    recipientInfo: any;
  }): string {
    const budgetRanges: Record<string, string> = {
      'under_500': 'ไม่เกิน 500 บาท',
      '500_1000': '500 - 1,000 บาท',
      '1000_3000': '1,000 - 3,000 บาท',
      '3000_5000': '3,000 - 5,000 บาท',
      '5000_10000': '5,000 - 10,000 บาท',
      'over_10000': 'มากกว่า 10,000 บาท',
    };

    return `คุณเป็นผู้เชี่ยวชาญในการแนะนำของขวัญ วิเคราะห์ข้อมูลลูกค้าด้านล่างและสร้างคำแนะนำของขวัญที่หลากหลายและเหมาะสม

ข้อมูลผู้รับของขวัญ:
- ชื่อ: ${params.recipientInfo.name || 'ไม่ระบุ'}
- ความสัมพันธ์: ${params.recipientInfo.relationship || 'N/A'}
- เพศ: ${params.recipientInfo.gender || 'N/A'}
- ช่วงอายุ: ${params.recipientInfo.ageRange || 'N/A'}
- โอกาส: ${params.recipientInfo.occasion || 'N/A'}
- งบประมาณ: ${budgetRanges[params.recipientInfo.budget as string] || params.recipientInfo.budget || 'N/A'}

คำตอบจากแบบสอบถาม:
${JSON.stringify(params.answers, null, 2)}

กรุณาให้คำแนะนำ:
1. Gift Persona (type, name, description, traits) - บุคลิกภาพของผู้รับของขวัญ
2. คำแนะนำของขวัญ 5-8 รายการ ที่หลากหลายและเหมาะสม โดยแต่ละรายการต้องมี:
   - ชื่อของขวัญ (เป็นภาษาไทย)
   - คำอธิบายสั้นๆ
   - หมวดหมู่ (เช่น ELECTRONICS, FASHION, EXPERIENCE, SENTIMENTAL, FOOD_BEVERAGE, etc.)
   - ช่วงราคา (เช่น "1,000-3,000 บาท")
   - คะแนนความเหมาะสม (0-100)
   - เหตุผลที่แนะนำ (3-5 ข้อ)
3. เหตุผลโดยรวม

**สำคัญ:** สร้างคำแนะนำของขวัญที่หลากหลาย ไม่จำกัดเฉพาะรายการที่มีในระบบ ให้คิดสร้างสรรค์และเหมาะสมกับผู้รับ

ตอบในรูปแบบ JSON:
{
  "persona": {
    "type": "experiencer|practical|luxury|sentimental",
    "name": "ชื่อภาษาไทย",
    "description": "คำอธิบาย",
    "traits": ["trait1", "trait2", "trait3"]
  },
  "recommendations": [
    {
      "giftName": "ชื่อของขวัญ",
      "description": "คำอธิบายสั้นๆ",
      "category": "ELECTRONICS",
      "priceRange": "1,000-3,000 บาท",
      "matchScore": 95,
      "reasons": ["reason1", "reason2", "reason3"]
    }
  ],
  "reasoning": "คำอธิบายโดยรวม"
}`;
  }

  private parseQuestions(content: string): string[] {
    // Extract questions from response
    const lines = content.split('\n').filter(line => line.trim());
    return lines
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(line => line.length > 10 && line.includes('?'))
      .slice(0, 10);
  }

  private parseAnalysisResponse(content: string): any {
    try {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Ensure recommendations have all required fields
        if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
          parsed.recommendations = parsed.recommendations.map((rec: any) => ({
            giftName: rec.giftName || 'ของขวัญที่แนะนำ',
            description: rec.description || '',
            category: rec.category || 'OTHER',
            priceRange: rec.priceRange || '',
            matchScore: rec.matchScore || 85,
            reasons: rec.reasons || [],
          }));
        }
        return parsed;
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      // Return default structure
      return {
        persona: {
          type: 'practical',
          name: 'สาย Practical',
          description: 'ชอบของขวัญที่ใช้งานได้จริง',
          traits: ['practical', 'quality-focused'],
        },
        recommendations: [],
        reasoning: 'Unable to parse AI response',
      };
    }
  }

  /**
   * Generate personalized card message based on occasion and customer characteristics
   */
  async generateCardMessage(params: {
    recipientName?: string;
    relationship: string;
    occasion: string;
    persona?: {
      type: string;
      name: string;
      description?: string;
      traits: string[];
    };
    giftName?: string;
    giftDescription?: string;
    giftReasons?: string[];
    tone?: 'formal' | 'casual' | 'warm' | 'playful';
  }): Promise<string> {
    const prompt = this.getCardMessagePrompt(params);
    
    const response = await this.chatCompletion({
      model: 'openai/gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in writing heartfelt, personalized card messages in Thai language. Create messages that are appropriate for the occasion and match the recipient\'s personality.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'ขอให้มีความสุขในโอกาสพิเศษนี้';
  }

  private getCardMessagePrompt(params: {
    recipientName?: string;
    relationship: string;
    occasion: string;
    persona?: {
      type: string;
      name: string;
      description?: string;
      traits: string[];
    };
    giftName?: string;
    giftDescription?: string;
    giftReasons?: string[];
    tone?: 'formal' | 'casual' | 'warm' | 'playful';
  }): string {
    const toneDescriptions = {
      formal: 'เป็นทางการ ใช้คำสุภาพ',
      casual: 'สบายๆ เป็นกันเอง',
      warm: 'อบอุ่น ซาบซึ้ง',
      playful: 'สนุกสนาน เบาสบาย',
    };

    return `เขียนข้อความในบัตรของขวัญภาษาไทย โดยมีรายละเอียดดังนี้:

ความสัมพันธ์: ${params.relationship}
โอกาส: ${params.occasion}
${params.recipientName ? `ชื่อผู้รับ: ${params.recipientName}` : ''}
${params.persona ? `บุคลิกภาพ: ${params.persona.name}${params.persona.description ? ` (${params.persona.description})` : ''} - ลักษณะเด่น: ${params.persona.traits.join(', ')}` : ''}
${params.giftName ? `ของขวัญที่เลือก: ${params.giftName}` : ''}
${params.giftDescription ? `รายละเอียดของขวัญ: ${params.giftDescription}` : ''}
${params.giftReasons && params.giftReasons.length > 0 ? `เหตุผลที่เลือกของขวัญนี้: ${params.giftReasons.join(', ')}` : ''}
โทน: ${toneDescriptions[params.tone || 'warm']}

ข้อความควร:
- เหมาะสมกับโอกาสและความสัมพันธ์
- สอดคล้องกับบุคลิกภาพและความชอบของผู้รับ
${params.giftName ? '- กล่าวถึงของขวัญที่เลือกอย่างเป็นธรรมชาติ' : ''}
${params.giftReasons && params.giftReasons.length > 0 ? '- สะท้อนเหตุผลที่เลือกของขวัญนี้' : ''}
- มีความหมายและแสดงความตั้งใจ
- ความยาวประมาณ 3-5 ประโยค
- ใช้ภาษาไทยที่สวยงามและเป็นธรรมชาติ

เขียนเฉพาะข้อความในบัตรเท่านั้น ไม่ต้องมีคำนำหน้าหรือคำลงท้าย`;
  }
}

