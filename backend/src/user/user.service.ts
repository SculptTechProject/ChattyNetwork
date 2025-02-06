import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  // eslint-disable-next-line @typescript-eslint/require-await
  async register(createUserDto: CreateUserDto) {
    try {
      //TODO Add save the user to the database
      return { email: createUserDto.email, password: createUserDto.password };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
