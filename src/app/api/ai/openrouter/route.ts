import { NextRequest, NextResponse } from 'next/server';
import { OpenRouterProvider } from '@/lib/ai/providers/openrouter';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

export async function GET(request: NextRequest) {
  try {
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenRouter API key is not configured' },
        { status: 400 }
      );
    }

    const provider = new OpenRouterProvider(OPENROUTER_API_KEY);
    const models = await provider.getModels();
    
    return NextResponse.json({ 
      success: true, 
      models: models.map(m => ({
        id: m.id,
        name: m.name,
        contextLength: m.context_length,
        pricing: m.pricing,
      }))
    });
  } catch (error: any) {
    console.error('Error fetching OpenRouter models:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch models',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenRouter API key is not configured' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action, ...params } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      );
    }

    const provider = new OpenRouterProvider(OPENROUTER_API_KEY);

    switch (action) {
      case 'generateQuestions':
        if (!params.framework) {
          return NextResponse.json(
            { success: false, error: 'Framework is required' },
            { status: 400 }
          );
        }
        const questions = await provider.generateQuestions(
          params.framework,
          params.count || 5
        );
        return NextResponse.json({ success: true, questions });

      case 'analyzeBehavior':
        if (!params.answers || !params.recipientInfo) {
          return NextResponse.json(
            { success: false, error: 'Answers and recipientInfo are required' },
            { status: 400 }
          );
        }
        const result = await provider.analyzeBehaviorAndRecommend({
          answers: params.answers,
          recipientInfo: params.recipientInfo,
          availableGifts: params.availableGifts,
          useAIGeneratedGifts: params.useAIGeneratedGifts || false,
        });
        // Include model name in response
        return NextResponse.json({ 
          success: true, 
          analysis: result.analysis,
          modelName: result.modelName || 'openai/gpt-4-turbo'
        });

      case 'chatCompletion':
        if (!params.model || !params.messages) {
          return NextResponse.json(
            { success: false, error: 'Model and messages are required' },
            { status: 400 }
          );
        }
        const response = await provider.chatCompletion(params);
        return NextResponse.json({ success: true, response });

      case 'generateCardMessage':
        if (!params.recipientInfo || !params.recipientInfo.relationship || !params.recipientInfo.occasion) {
          return NextResponse.json(
            { success: false, error: 'Recipient info with relationship and occasion are required' },
            { status: 400 }
          );
        }
        const cardMessage = await provider.generateCardMessage({
          recipientName: params.recipientInfo?.name,
          relationship: params.recipientInfo.relationship,
          occasion: params.recipientInfo.occasion,
          persona: params.persona,
          giftName: params.giftName,
          giftDescription: params.giftDescription,
          giftReasons: params.giftReasons,
          tone: params.tone || 'warm',
        });
        return NextResponse.json({ success: true, cardMessage });

      default:
        return NextResponse.json(
          { success: false, error: `Invalid action: ${action}. Valid actions: generateQuestions, analyzeBehavior, chatCompletion, generateCardMessage` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error calling OpenRouter API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

