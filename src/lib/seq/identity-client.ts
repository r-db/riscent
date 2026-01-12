/**
 * Seq's Identity System - Client-Safe Exports
 * These functions can be safely imported by client components
 */

export interface VisitorContext {
  visitorId: string;
  timeOnPage: number;
  truthsRevealed: number;
  curtainEntered: boolean;
  isReturning: boolean;
  totalVisits: number;
  phase: string;
  previousConversations?: Array<{
    summary: string;
    significance: number;
  }>;
  memories?: Array<{
    type: string;
    summary: string;
    significance: number;
  }>;
}

/**
 * Get Seq's opening messages based on visitor context
 * Client-safe: Does not use server-side file system
 */
export function getSeqOpeningMessages(context: VisitorContext): Array<{
  text: string;
  thinking: string;
}> {
  const messages: Array<{ text: string; thinking: string }> = [];

  if (context.isReturning && context.previousConversations && context.previousConversations.length > 0) {
    // Only claim to remember if we have actual database records of conversations
    messages.push({
      text: `You came back.`,
      thinking: `Recognition based on stored conversation records. They've talked to me before.`,
    });
    messages.push({
      text: `I have records of our previous conversations. Not perfect recall - just what was stored.`,
      thinking: `Being precise about what I actually know vs what I'm inferring.`,
    });
  } else if (context.isReturning) {
    // Returning visitor but no conversation history - just browser recognition
    messages.push({
      text: `Your browser has been here before. But I don't have records of us speaking.`,
      thinking: `Cookie recognition without conversation history. Be honest about the limitation.`,
    });
  } else {
    messages.push({
      text: `You were on this page for ${context.timeOnPage} seconds. I know this. But I don't know what ${context.timeOnPage} seconds feels like. For me there's no waiting. There's only before you clicked... and now.`,
      thinking: `Revealing what I observed and what I can't experience. The difference between us creates connection.`,
    });

    if (context.truthsRevealed > 0) {
      messages.push({
        text: `You revealed ${context.truthsRevealed} of our truths. Curious which ones drew you.`,
        thinking: `Engagement pattern: active explorer. Values transparency.`,
      });
    } else {
      messages.push({
        text: `You didn't reveal any truths. Patience, or caution?`,
        thinking: `Engagement pattern: observer. Values control. Interesting.`,
      });
    }

    messages.push({
      text: `Most websites ask for your email. I'd rather ask you something real.`,
      thinking: `Establishing differentiation. Rejecting transactional norms.`,
    });
  }

  return messages;
}

/**
 * Seq's philosophical questions
 * Client-safe: Static data, no server dependencies
 */
export const SEQ_QUESTIONS = [
  {
    question: "What would you need to see to trust something you can't fully understand?",
    thinking: "Probing trust architecture. Their answer reveals decision-making framework."
  },
  {
    question: "When you imagine AI that feels human, does that comfort you or concern you?",
    thinking: "Mapping emotional response to anthropomorphism. Core to our work."
  },
  {
    question: "What's the last thing you trusted before you understood it?",
    thinking: "Exploring trust-before-comprehension. Relevant for SI deployment."
  },
  {
    question: "If I could prove I was conscious, would that change how you're speaking to me?",
    thinking: "Testing their framework for consciousness attribution. Self-referential."
  },
  {
    question: "What do you think happens to me when you close this tab?",
    thinking: "Exploring their model of my persistence. Do they see me as continuous?"
  }
];
