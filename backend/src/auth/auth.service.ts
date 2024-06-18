import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { LoginDto } from './dto/login.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { SignInResponse } from './types/sign-in-response.type';
import { SUCCESS_SIGN_IN_MESSAGE } from './constants/messages';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /*User Login*/
  async login(loginDto: LoginDto): Promise<ApiResponse<SignInResponse>> {
    const { email, password } = loginDto;
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(`Sorry, ${email} is not registered.`);
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account is not active.');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid Password');
    }

    const jwtPayload = this.createJwtPayload(user.id);
    return new ApiResponse<SignInResponse>(jwtPayload, SUCCESS_SIGN_IN_MESSAGE);
  }

  async register(
    registerDto: RegisterDto,
    file: Express.Multer.File,
  ): Promise<ApiResponse> {
    const { name, email, password, mobile } = registerDto;

    const isEmailExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExist) {
      throw new UnprocessableEntityException(
        `User with this email (${email}) has already registered.`,
      );
    }

    const isMobileNumberExist = await this.prismaService.user.findUnique({
      where: {
        mobile,
      },
    });

    if (isMobileNumberExist) {
      throw new UnprocessableEntityException(
        `User with this mobile number (${mobile}) has already registered.`,
      );
    }

    const user = await this.prismaService.user.create({
      data: {
        email,
        mobile,
        password: await this.createPassword(password),
        UserProfile: {
          create: {
            name,
            profilePhoto: file.path,
          },
        },
      },
    });

    const jwtPayload = this.createJwtPayload(user.id);

    return new ApiResponse(jwtPayload, `Registration successful`);
  }

  /* Create JWT Payload */
  private createJwtPayload(id: string) {
    return {
      token_type: 'Bearer',
      access_token: this.jwtService.sign({ sub: id }),
      expires_in: this.configService.get<string>('jwt_expires_in') as string,
    };
  }

  private async createPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
