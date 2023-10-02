import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUser } from 'src/types';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode'
import { Users } from '@prisma/client';

@Injectable()
export class AuthService {
  intra_base_url: string = "https://api.intra.42.fr"

  constructor(
    private config: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}


  async login(code: string): Promise<any> {
    try {
    const { access_token } = await this.getUserIntraToken(code);
      const user = await this.getUser(access_token);
      const payload: AuthenticatedUser = {
        username: user.username,
        sub: user.id,
        isOtpActivated: user.isOtpActivated,
        isOtpVirified: false
      }
      const token = await this.jwtService.signAsync(payload);
      return {
        access_token: token,
        virificationRequired: user.isOtpActivated
      };
    } catch(error) {
      console.log(error);
    }
  }

  async verifyOtp(user: AuthenticatedUser, code: string) {
    const auser = await this.prisma.users.findUnique({
      where: {
        id: user.sub
      }
    });

    const isValid = authenticator.verify({
      secret: auser.otpSecret,
      token: code
    });

    if(!isValid)
      throw new BadRequestException(['code is not valid']);

      const payload: AuthenticatedUser = {
        username: user.username,
        sub: auser.id,
        isOtpActivated: user.isOtpActivated,
        isOtpVirified: true
      }
      const token = await this.jwtService.signAsync(payload);
      return {
        access_token: token
      };

  }

  async getUser(token: string): Promise<Users> {
    const { data } = await this.getUserInfoFromIntra(token);
    const user = await this.userService.findUserById(data.id);

    if(user) {
      return user;
    }
    if (user) return user;
    else {
      const result = await this.userService.create({
        intra_id: data.id,
        username: data.login,
        email: data.email,
        avatar: data.image.versions.medium
      });
      return result;
    }
  }

  async getUserInfoFromIntra(token: string): Promise<any> {
    return await axios.get(`${this.intra_base_url}/v2/me`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  async getUserIntraToken(code: string) {
    const headers = {
      "Content-Type": "application/json",
    };

    const data = {
      grant_type: "authorization_code",
      code,
      client_id: this.config.get('INTRA_UID'),
      client_secret: this.config.get('INTRA_SECRET'),
      redirect_uri: this.config.get('AUTH_REDIRECTION_URL')
    }

    // const url = `${this.intra_base_url}/oauth/token`;
    const url = "https://api.intra.42.fr/oauth/token";

    try {
      const response = await axios({
        method: 'post',
        url,
        headers,
        data
      })
    return response.data;
    } catch(error) {
      console.error('error here')
      return error
    }
  }


  // for test only should be removed
  async getFakeToken(username: string) {
    const auth = await this.prisma.users.findUnique({
      where: {
        username
      }
    });
    const sub = auth.id
    const user = await this.userService.findUser({username}, {sub, username, isOtpVirified: false, isOtpActivated: false});
    if(!user)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      const payload = {
        username: user.username,
        sub: user.id
      }
      const token = await this.jwtService.signAsync(payload);
      return {
        access_token: token
      };
  }

  // get auth user info
  async getMe(user: AuthenticatedUser) {
    const me = await this.prisma.users.findUnique({
      where: {
        id: user.sub
      }
    });
    if(!me)
      throw new UnauthorizedException();
    const  { otpSecret, ...filtred} = me;
    return filtred;
  }

  // set otp secret for a user
  private async setOtpSecret(user: Users, secret: string) {
    await this.prisma.users.update({
      where: {
        id: user.id
      },
      data: {
        otpSecret: secret
      }
    });
  }

  // generate token
  private async generateOtpToken(user: Users) {
    let secret = '';
    if(user.isOtpActivated && user.otpSecret.length != 0)
      secret = user.otpSecret;
    else {
      secret = authenticator.generateSecret();
      await this.setOtpSecret(user, secret);
    }
    const keyuri = authenticator.keyuri(user.email, this.config.get('APP_NAME'), secret);
    return {
      secret,
      keyuri
    }
  }

  async getQrCode(user: AuthenticatedUser) {
    const auser = await this.prisma.users.findUnique({
      where: {
        id: user.sub
      }
    });

    const otpToken = await this.generateOtpToken(auser);
    const image = await toDataURL(otpToken.keyuri);
    return {
      image
    };
  }

  // check code and activate two factor auth
  private async setTwoFactor(user: AuthenticatedUser, code: string, value: boolean) {
    const auser = await this.prisma.users.findUnique({
      where: {
        id: user.sub
      },
      select: {
        id: true,
        otpSecret: true
      }
    });
    
    const result = authenticator.verify({token: code, secret: auser.otpSecret});
    if(!result)
      throw new BadRequestException(['code is invalid']);
    await this.prisma.users.update({
      where: {
        id: user.sub
      },
      data: {
        isOtpActivated: value
      }
    })

    return { message: `Two factor authentication ${value ? 'enabled' : 'disabled'} successfully`};
  }

  async activateTwoFacotr(user: AuthenticatedUser, code: string) {
    return await this.setTwoFactor(user, code, true);
  }

  async disactivateTwoFactor(user: AuthenticatedUser, code: string) {
    return await this.setTwoFactor(user, code, false);
  }
}
