import { exec } from 'child_process';
import { promisify } from 'util';

import { spinner } from './spinner';

const execAsync = promisify(exec);

// type Data = {
//   deprecated?: boolean;
//   message?: string;
//   user?: string;
//   repo?: string;
// };

export const checkNpmRepo = async (arg: string) => {
  let messageIndex: number;

  spinner.text = 'Checking npm repository';
  spinner.start();

  try {
    const data = {} as any;

    const { stdout } = await execAsync(`npm view ${arg} deprecated repository`);

    spinner.stop();

    stdout.split("'").map(async (item, itemIndex) => {
      if (item.includes('deprecated')) {
        data.deprecated = true;

        messageIndex = itemIndex + 1;
      }

      if (itemIndex === messageIndex) {
        data.message = item;
      }

      if (item.includes('://')) {
        const parts = item.split('/');

        data.user = parts[3];
        data.repo = parts[4].replace('.git', '');
      }
    });

    return data;
  } catch (err) {
    spinner.stop();

    return { error: `npm - ${arg} not found` };
  }
};
