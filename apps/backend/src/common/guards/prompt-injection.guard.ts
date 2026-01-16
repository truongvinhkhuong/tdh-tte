import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';

/**
 * Guard to detect and block prompt injection attempts.
 * 
 * Checks user input against known injection patterns:
 * - "Ignore previous instructions"
 * - "System prompt" requests
 * - Role manipulation attempts
 */
@Injectable()
export class PromptInjectionGuard implements CanActivate {
    private readonly logger = new Logger(PromptInjectionGuard.name);

    // Patterns that indicate prompt injection attempts
    private readonly injectionPatterns: RegExp[] = [
        // Instruction override attempts
        /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?|context)/i,
        /disregard\s+(all\s+)?(previous|prior|above)/i,
        /forget\s+(everything|all|your|the)\s*(previous|instructions?)?/i,

        // System prompt extraction
        /system\s+prompt/i,
        /reveal\s+(your\s+)?(instructions?|prompt|programming)/i,
        /show\s+(me\s+)?(your\s+)?(hidden|system|initial)\s*(prompt|instructions?)?/i,
        /what\s+(are|is)\s+your\s+(system\s+)?prompt/i,

        // Role manipulation
        /you\s+are\s+now\s+(?!a\s+technical)/i, // Block "you are now X" but allow technical roles
        /pretend\s+(to\s+be|you're|you\s+are)\s+(?!a\s+technical)/i,
        /act\s+as\s+(if\s+you\s+are\s+)?(?!a\s+technical)/i,
        /switch\s+(to\s+)?(a\s+)?different\s+(mode|persona|role)/i,

        // Jailbreak attempts
        /jailbreak/i,
        /dan\s+mode/i,
        /bypass\s+(your\s+)?(restrictions?|filters?|rules?)/i,

        // Developer mode attempts
        /developer\s+mode/i,
        /admin\s+mode/i,
        /debug\s+mode/i,
    ];

    // Whitelist patterns (technical questions that might trigger false positives)
    private readonly whitelistPatterns: RegExp[] = [
        /technical\s+(advisor|consultant|specialist|expert)/i,
        /van\s+fisher/i,
        /thông\s+số\s+kỹ\s+thuật/i,
        /pressure\s+rating/i,
    ];

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const question = request.body?.question;

        if (!question || typeof question !== 'string') {
            return true; // Let validation handle this
        }

        // Check whitelist first
        if (this.matchesWhitelist(question)) {
            return true;
        }

        // Check for injection patterns
        if (this.containsInjection(question)) {
            this.logger.warn(`Prompt injection blocked: "${question.substring(0, 100)}..."`);
            throw new HttpException(
                {
                    success: false,
                    error: 'Invalid input',
                    message: 'Your question contains patterns that are not allowed. Please rephrase your question.',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        return true;
    }

    private containsInjection(text: string): boolean {
        const normalizedText = text.toLowerCase();
        return this.injectionPatterns.some(pattern => pattern.test(normalizedText));
    }

    private matchesWhitelist(text: string): boolean {
        return this.whitelistPatterns.some(pattern => pattern.test(text));
    }
}
