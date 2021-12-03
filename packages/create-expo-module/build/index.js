#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const prompts_1 = __importDefault(require("prompts"));
const ejs_1 = __importDefault(require("ejs"));
const spawn_async_1 = __importDefault(require("@expo/spawn-async"));
const download_tarball_1 = __importDefault(require("download-tarball"));
// `yarn run` may change the current working dir, then we should use `INIT_CWD` env.
const cwd = process.env.INIT_CWD || process.cwd();
const [templatePath] = process.argv.slice(2);
// Ignore some paths. Especially `package.json` as it is rendered
// from `$package.json` file instead of the original one.
const ignoredPaths = ['.DS_Store', 'build', 'node_modules', 'package.json'];
async function main() {
    const packagePath = templatePath ? path_1.default.join(cwd, templatePath) : await downloadPackageAsync();
    const files = await getFilesAsync(packagePath);
    const data = await askForSubstitutionDataAsync();
    console.log(files, data);
    for (const file of files) {
        const renderedRelativePath = ejs_1.default.render(file.replace(/^\$/, ''), data, {
            openDelimiter: '{',
            closeDelimiter: '}',
            escape: (value) => value.replace('.', path_1.default.sep),
        });
        const fromPath = path_1.default.join(packagePath, file);
        const toPath = path_1.default.join(cwd, renderedRelativePath);
        const template = await fs_extra_1.default.readFile(fromPath, { encoding: 'utf8' });
        const renderedContent = ejs_1.default.render(template, data);
        await fs_extra_1.default.outputFile(toPath, renderedContent, { encoding: 'utf8' });
    }
    if (!templatePath) {
        // Remove the `package` dir after unpacking the tarball.
        await fs_extra_1.default.remove(packagePath);
    }
    // Build TypeScript files.
    await (0, spawn_async_1.default)('npm', ['run', 'build'], {
        cwd,
    });
}
async function getFilesAsync(root, dir = null) {
    const files = [];
    const baseDir = dir ? path_1.default.join(root, dir) : root;
    for (const file of await fs_extra_1.default.readdir(baseDir)) {
        const relativePath = dir ? path_1.default.join(dir, file) : file;
        if (ignoredPaths.includes(relativePath) || ignoredPaths.includes(file)) {
            continue;
        }
        const fullPath = path_1.default.join(baseDir, file);
        const stat = await fs_extra_1.default.lstat(fullPath);
        if (stat.isDirectory()) {
            files.push(...(await getFilesAsync(root, relativePath)));
        }
        else {
            files.push(relativePath);
        }
    }
    return files;
}
async function getNpmTarballUrl(packageName, version = 'latest') {
    const { stdout } = await (0, spawn_async_1.default)('npm', ['view', `${packageName}@${version}`, 'dist.tarball']);
    return stdout.trim();
}
async function npmWhoamiAsync() {
    try {
        const { stdout } = await (0, spawn_async_1.default)('npm', ['whoami'], { cwd });
        return stdout.trim();
    }
    catch (e) {
        return;
    }
}
async function downloadPackageAsync() {
    const tarballUrl = await getNpmTarballUrl('expo-module-template');
    await (0, download_tarball_1.default)({
        url: tarballUrl,
        dir: cwd,
    });
    return path_1.default.join(cwd, 'package');
}
async function askForSubstitutionDataAsync() {
    const defaultPackageSlug = path_1.default.basename(cwd);
    const defaultProjectName = defaultPackageSlug
        .replace(/^./, (match) => match.toUpperCase())
        .replace(/\W+(\w)/g, (_, p1) => p1.toUpperCase());
    const project = await (0, prompts_1.default)([
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
    const { author, license } = await (0, prompts_1.default)([
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
//# sourceMappingURL=index.js.map