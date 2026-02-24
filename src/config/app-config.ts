import { config } from '@dotenvx/dotenvx';
import { validateSync } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { AppConfig } from './app-config-variables';

type EnvObjRaw = Record<string, unknown>;

const envInput = config();

function validateConfig(
  env: EnvObjRaw,
  envDto: ClassConstructor<AppConfig>,
): AppConfig {
  const validatedConfig = plainToInstance(envDto, env, {
    exposeDefaultValues: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    // todo: simplified for now
    throw new Error(`Config validation error: ${errors.toString()}`);
  }

  return validatedConfig;
}

const envValidated = validateConfig(envInput.parsed, AppConfig);

export { envValidated as appConfig };
