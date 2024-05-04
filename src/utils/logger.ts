import chalk from "chalk";
import { prefix } from "..";

export default class Logger {
  private static timestamp() {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  }

  public static log(message: string) {
    console.log(`${prefix} ${chalk.gray(this.timestamp())} ${message}`);
  }

  public static info(message: string) {
    this.log(chalk.blue(message));
  }

  public static error(message: string) {
    this.log(chalk.red(message));
  }

  public static success(message: string) {
    this.log(chalk.green(message));
  }
}