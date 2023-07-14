import { HttpException, HttpStatus, Injectable, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './jwt.guard';

@Injectable()
export class AuthService {
  intra_base_url: string = "https://api.intra.42.fr"

  constructor(private config: ConfigService, private userService: UserService, private jwtService: JwtService) {}


  async login(code: string): Promise<any> {
    try {
    const { access_token } = await this.getUserIntraToken(code);
      const user = await this.getUser(access_token);
      const payload = {
        username: user.username,
        sub: user.id
      }
      const token = await this.jwtService.signAsync(payload);
      return {
        access_token: token
      };
    } catch(error) {
      console.log(error);
    }
  }

  async getUser(token: string): Promise<any> {
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
      console.log("succed")
    return response.data;
    } catch(error) {
      console.error('error here')
      return error
    }
  }


  // for test only should be removed
  async getFakeToken(auth) {
    const user = await this.userService.findUser({username: 'tester'}, auth);
    console.log(user)
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
}
