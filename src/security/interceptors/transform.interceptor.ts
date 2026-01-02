/**
 * --- GLOBAL RESPONSE TRANSFORMER ---
 * * PURPOSE: 
 * Automatically filters and formats outgoing JSON data before it leaves the API.
 * * HOW IT WORKS:
 * It uses 'class-transformer' logic. It will:
 * 1. Remove properties marked with @Exclude() (e.g., password, hashedRefreshToken).
 * 2. Rename properties marked with @Expose({ name: 'new_name' }).
 * 3. Handle complex nested object transformations.
 * * IMPORTANT: 
 * This interceptor ONLY triggers transformation if the Controller returns 
 * a CLASS INSTANCE (e.g., return new UserEntity(data)). 
 * It will ignore plain JavaScript objects { ... }.
 * 
 *  Your interceptor uses a library called class-transformer. When it receives data, it checks: "Is this object a member of a class?"

    If it's a Plain Object: The library says, "I don't see a class, so I don't know which decorators to look for." Result: It does nothing.

    If it's a Class Instance: The library says, "Aha! This is a User class. Let me check the User blueprint... Oh, look! The password field is marked with @Exclude. I'll remove it."
 */
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { map } from 'rxjs';
export class TransformInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>){
        return next.handle().pipe(map(data => instanceToPlain(data)));
    }
}