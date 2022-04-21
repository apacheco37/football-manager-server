import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

import { BaseService } from "../core/baseService";

export class AuthService extends BaseService {
  async login(username: string, password: string) {
    const user = await this.prismaClient.user.findUnique({
      where: {
        username,
      },
    });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign(
          { userID: user.id },
          process.env.JWT_SECRET || "TODO"
        );
        this.res.cookie("Authentication", token, {
          secure: true,
          sameSite: "none",
        });
        return user;
      }
    }
    return null;
  }

  async signup(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prismaClient.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
    return user;
  }
}
