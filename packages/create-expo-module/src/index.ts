#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import ejs from 'ejs';
import spawnAsync from '@expo/spawn-async';
import downloadTarball from 'download-tarball';

// `yarn run` may change the current working dir, then we should use `INIT_CWD` env.
const cwd = process.env.INIT_CWD || process.cwd();
const [templatePath] = process.argv.slice(2);

// Ignore some paths. Especially `package.json` as it is rendered
// from `$package.json` file instead of the original one.
const ignoredPaths = ['.DS_Store', 'build', 'node_modules', 'package.json'];

type SubstitutionData = {
  project: {
    slug: string;
    name: string;
    version: string;
    description: string;
    package: string;
  };
  author: string;
  license: string;
};

async function main() {
  const packagePath = templatePath ? path.join(cwd, templatePath) : await downloadPackageAsync();
  const files = await getFilesAsync(packagePath);
  const data = await askForSubstitutionDataAsync();

  console.log(files, data);

  for (const file of files) {
    const renderedRelativePath = ejs.render(file.replace(/^\$/, ''), data, {
      openDelimiter: '{',
      closeDelimiter: '}',
      escape: (value: string) => value.replace('.', path.sep),
    });
    const fromPath = path.join(packagePath, file);
    const toPath = path.join(cwd, renderedRelativePath);
    const template = await fs.readFile(fromPath, { encoding: 'utf8' });
    const renderedContent = ejs.render(template, data);

    await fs.outputFile(toPath, renderedContent, { encoding: 'utf8' });
  }

  if (!templatePath) {
    // Remove the `package` dir after unpacking the tarball.
    await fs.remove(packagePath);
  }

  // Build TypeScript files.
  await spawnAsync('npm', ['run', 'build'], {
    cwd,
  });
}

async function getFilesAsync(root: string, dir: string | null = null): Promise<string[]> {
  const files: string[] = [];
  const baseDir = dir ? path.join(root, dir) : root;

  for (const file of await fs.readdir(baseDir)) {
    const relativePath = dir ? path.join(dir, file) : file;

    if (ignoredPaths.includes(relativePath) || ignoredPaths.includes(file)) {
      continue;
    }

    const fullPath = path.join(baseDir, file);
    const stat = await fs.lstat(fullPath);

    if (stat.isDirectory()) {
      files.push(...(await getFilesAsync(root, relativePath)));
    } else {
      files.push(relativePath);
    }
  }
  return files;
}

async function getNpmTarballUrl(packageName: string, version: string = 'latest'): Promise<string> {
  const { stdout } = await spawnAsync('npm', ['view', `${packageName}@${version}`, 'dist.tarball']);
  return stdout.trim();
}

async function npmWhoamiAsync(): Promise<string | undefined> {
  try {
    const { stdout } = await spawnAsync('npm', ['whoami'], { cwd });
    return stdout.trim();
  } catch (e) {
    return;
  }
}

async function downloadPackageAsync(): Promise<string> {
  const tarballUrl = await getNpmTarballUrl('expo-module-template');

  await downloadTarball({
    url: tarballUrl,
    dir: cwd,
  });
  return path.join(cwd, 'package');
}

async function askForSubstitutionDataAsync(): Promise<SubstitutionData> {
  const defaultPackageSlug = path.basename(cwd);
  const defaultProjectName = defaultPackageSlug
    .replace(/^./, (match) => match.toUpperCase())
    .replace(/\W+(\w)/g, (_, p1) => p1.toUpperCase());

  const project = await prompts([
    {
      type: 'text',
      name: 'slug',
      message: 'What is the package slug?',
      initial: defaultPackageSlug,
    },
    {
      type: 'text',
      name: 'name',
      message: 'What is the project name?',
      initial: defaultProjectName,
    },
    {
      type: 'text',
      name: 'version',
      message: 'What is the initial version?',
      initial: '0.1.0',
    },
    {
      type: 'text',
      name: 'description',
      message: 'How would you describe the module?',
    },
    {
      type: 'text',
      name: 'package',
      message: 'What is the Android package name?',
      initial: `expo.modules.${defaultPackageSlug.replace(/\W/g, '').toLowerCase()}`,
    },
  ]);

  const { author, license } = await prompts([
    {
      type: 'text',
      name: 'author',
      message: 'Who is the author?',
      initial: await npmWhoamiAsync(),
    },
    {
      type: 'text',
      name: 'license',
      message: 'What is the license?',
      initial: 'MIT',
    },
  ]);

  return {
    project,
    author,
    license,
  };
}

main();
