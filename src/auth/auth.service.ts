import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "../entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LoginDTO, RegisterDTO } from "../users/user.dto";

@Injectable()
export class AuthService {

  private blacklistedTokens = new Set<string>();

  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {
    console.log('AuthService constructor called');
  }

  async register(credentials: RegisterDTO) {
    const existingUser = await this.userRepo.findOne({ where: { username: credentials.username } });

    if (!existingUser) {
      const user = this.userRepo.create(credentials);
      await this.userRepo.save(user);
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);
      console.log(token);
      return { ...user.toJSON(), token };
    } else {
      throw new ConflictException('Username has already been taken');
    }
  }

  async login({ email, password }: LoginDTO) {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { email: user.email };
      const token = this.jwtService.sign(payload, {
        expiresIn: '3h',
        secret: process.env.SECRET,
      });
      return { user: { ...user.toJSON(), token }, expiresIn: '10800' };
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async getProfile(email: string) {
    console.log('service ', email);
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user){
      throw new UnauthorizedException('User not found');
    }
    return user.toJSON();
  }

  async logout(token: string) {
    console.log('hey service logout ', token);
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }
    this.blacklistedTokens.add(token);
    return { message: 'Logout successful' };
  }
  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
