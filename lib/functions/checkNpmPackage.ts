import npmGetPackageInfo from 'npm-get-package-info';

export const checkNpmPackage = async (name: string) => {
  try {
    return await npmGetPackageInfo({ name, info: ['deprecated'] });
  } catch (err) {
    return { error: err };
  }
};
