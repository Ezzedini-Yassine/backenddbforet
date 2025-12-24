import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { UsersRepository } from '../../repository/users.repository';
  
  
  
  @Injectable()
  export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private readonly usersRepository: UsersRepository) {}
  
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      console.log("in interceptor")
      const request = context.switchToHttp().getRequest();
            console.log("request.user:", request.user);

      const { userId } = request.user || {};
      if (userId) {
        const user = await this.usersRepository.repo.findOne({where:{ id: userId }});
        request.user = user;
      }
      return next.handle();
    }
  }
  